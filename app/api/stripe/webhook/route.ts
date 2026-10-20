import Stripe from 'stripe';
import { sbInsert, sbUpsertIgnore, sbUpdate, sbRpc, sbSelect, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Le webhook lit le corps BRUT (vérification de signature) : runtime Node, jamais caché.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stripe a retiré `shipping_details` du type dans les API récentes au profit de
// `collected_information.shipping_details` ; on tolère les deux.
type SessionLike = Stripe.Checkout.Session & {
  shipping_details?: { name?: string | null; address?: Record<string, unknown> | null } | null;
  collected_information?: { shipping_details?: { name?: string | null; address?: Record<string, unknown> | null } | null } | null;
};

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secretKey || !webhookSecret) {
    return Response.json({ error: 'config', message: 'STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET manquant.' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return Response.json({ error: 'signature manquante' }, { status: 400 });

  const raw = await req.text();
  const stripe = new Stripe(secretKey);

  // 1) Vérification de signature (anti-falsification). Échec => 400, pas de relance utile.
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (e) {
    return Response.json({ error: 'signature invalide', message: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }

  // 2) Sans Supabase configuré, rien à persister : on acquitte (évite les relances Stripe).
  if (!isSupabaseConfigured()) {
    return Response.json({ received: true, persisted: false });
  }

  // 3) Traitement idempotent. Toute erreur => 500 pour que Stripe relance ;
  //    l'upsert sur stripe_session_id empêche toute commande en double.
  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleCompleted(stripe, event.data.object as SessionLike);
        break;

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const token = (event.data.object as Stripe.Checkout.Session).metadata?.reservation_token;
        if (token) await sbRpc('release_reservation', { p_token: token });
        break;
      }

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        break; // événement non géré : acquitté sans action
    }
  } catch (e) {
    console.error('[webhook] échec de traitement', event.type, e instanceof Error ? e.message : String(e));
    return Response.json({ error: 'processing', type: event.type }, { status: 500 });
  }

  // 4) Journal d'idempotence (traçabilité ; non bloquant).
  try {
    await sbUpsertIgnore('stripe_events', [{ id: event.id, type: event.type }], 'id');
  } catch {
    /* la garde principale reste l'upsert sur orders */
  }

  return Response.json({ received: true });
}

// ─────────────────────────── paiement confirmé ─────────────────────────────
async function handleCompleted(stripe: Stripe, session: SessionLike) {
  // Ne traiter que les sessions réellement payées. Une méthode à notification
  // différée (virement/SEPA…) arrive en « completed » avec payment_status
  // != 'paid' ; on ne crée la commande ni ne décrémente le stock qu'au paiement.
  if (session.payment_status !== 'paid') return;

  const cd = session.customer_details;
  const shipping = session.shipping_details || session.collected_information?.shipping_details || null;
  const address = shipping?.address || cd?.address || null;
  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;

  // Upsert idempotent sur stripe_session_id : jamais de commande en double.
  const inserted = await sbUpsertIgnore(
    'orders',
    [
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        email: cd?.email ?? null,
        phone: cd?.phone ?? null,
        customer_name: shipping?.name || cd?.name || null,
        shipping_address: address,
        amount_total_cents: session.amount_total ?? null,
        currency: (session.currency || 'chf').toUpperCase(),
        payment_status: 'paid',
        fulfillment_status: 'to_prepare',
        paid_at: new Date().toISOString(),
      },
    ],
    'stripe_session_id',
  );

  // Résoudre l'id de commande, qu'elle vienne d'être créée OU qu'elle existe
  // déjà (relance Stripe). On NE sort PAS si elle existe : les effets de bord
  // ci-dessous sont idempotents et doivent être rejoués si une livraison
  // précédente a créé la commande mais échoué avant de les terminer.
  let orderId: string;
  if (inserted.length > 0) {
    orderId = inserted[0].id as string;
  } else {
    const existing = await sbSelect(
      'orders',
      `select=id&stripe_session_id=eq.${encodeURIComponent(session.id)}&limit=1`,
    );
    if (existing.length === 0) return;
    orderId = existing[0].id as string;
  }

  // Articles figés depuis les lignes Stripe (ce qui a réellement été facturé).
  // Insérés une seule fois : garde d'idempotence au niveau des lignes.
  const existingItems = await sbSelect('order_items', `select=id&order_id=eq.${orderId}&limit=1`);
  if (existingItems.length === 0) {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const items = lineItems.data
      .filter((li) => (li.description || '') !== 'Frais de livraison')
      .map((li) => ({
        order_id: orderId,
        sku: 'N/A',
        product_name: li.description || 'Article',
        option_label: null,
        quantity: li.quantity ?? 1,
        unit_price_cents: li.quantity ? Math.round((li.amount_total ?? 0) / li.quantity) : li.amount_total ?? 0,
      }));
    if (items.length) await sbInsert('order_items', items);
  }

  // Consomme les réservations liées (décrément du stock une seule fois).
  // consume_reservation ne touche que les réservations 'active' => idempotent.
  const token = session.metadata?.reservation_token;
  if (token) await sbRpc('consume_reservation', { p_token: token, p_order_id: orderId });
}

// ─────────────────────────── remboursement ─────────────────────────────────
async function handleRefund(charge: Stripe.Charge) {
  const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!pi) return;
  const status = charge.amount_refunded >= charge.amount ? 'refunded' : 'partially_refunded';
  await sbUpdate('orders', `stripe_payment_intent_id=eq.${encodeURIComponent(pi)}`, { payment_status: status });
}
