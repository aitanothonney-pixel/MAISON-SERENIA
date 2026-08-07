import { products } from '@/lib/products';

// Runtime Node.js, jamais mis en cache
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_API = 'https://api.stripe.com/v1';

// Pièces Bubble en promo -30%
const BUBBLE_IDS = [2, 6, 7, 8, 9, 10, 12, 13, 22];
const isBubble = (id: number) => BUBBLE_IDS.includes(id);

const BUNDLES = [
  { canape: 10, fauteuil: 2, figurine: 39 },
  { canape: 13, fauteuil: 6, figurine: 31 },
  { canape: 22, fauteuil: 8, figurine: 36 },
];
const BUNDLE_PRICE = 1900;

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_FEE = 4.9;
const chf = (amount: number) => Math.round(amount * 100);

// Appel direct à l'API Stripe via fetch (pas de SDK) — le plus robuste en serverless.
async function stripeRequest(path: string, key: string, params?: Record<string, string>) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: params ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? new URLSearchParams(params).toString() : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Stripe HTTP ${res.status}`);
  }
  return data;
}

// Diagnostic : teste la présence de la clé ET la connexion réelle à Stripe.
export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ stripeConfigured: false });
  try {
    const bal = await stripeRequest('/balance', key);
    return Response.json({ stripeConfigured: true, ping: 'ok', livemode: bal.livemode });
  } catch (e) {
    return Response.json({ stripeConfigured: true, ping: 'error', message: e instanceof Error ? e.message : String(e) });
  }
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return Response.json({ enabled: false }, { status: 200 });

  let body: { items?: { id: number; qty: number }[]; promo?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const cart = rawItems
    .map((it) => {
      const product = products.find((p) => p.id === Number(it.id));
      if (!product) return null;
      const qty = Math.max(1, Math.min(20, Math.floor(Number(it.qty) || 1)));
      const unit = isBubble(product.id) ? Math.round(product.price * 0.7) : product.price;
      return { product, qty, unit };
    })
    .filter(Boolean) as { product: typeof products[0]; qty: number; unit: number }[];

  if (cart.length === 0) return Response.json({ error: 'Panier vide' }, { status: 400 });

  try {
    // Recalcul sécurisé côté serveur
    const subtotal = cart.reduce((s, x) => s + x.unit * x.qty, 0);
    const qtyOf = (id: number) => cart.find((x) => x.product.id === id)?.qty ?? 0;
    const unitOf = (id: number) => cart.find((x) => x.product.id === id)?.unit ?? 0;
    const packDiscount = BUNDLES.reduce((s, b) => {
      const packs = Math.min(qtyOf(b.canape), qtyOf(b.fauteuil), qtyOf(b.figurine));
      if (packs === 0) return s;
      const trio = unitOf(b.canape) + unitOf(b.fauteuil) + unitOf(b.figurine);
      return s + packs * Math.max(0, trio - BUNDLE_PRICE);
    }, 0);
    const afterPack = subtotal - packDiscount;
    const welcomeDiscount = body.promo && afterPack > 0 ? afterPack * 0.1 : 0;
    const merchandise = afterPack - welcomeDiscount;
    const shipping = merchandise > 0 && merchandise < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;

    // On répartit les remises (pack + membre) proportionnellement dans les prix
    const factor = subtotal > 0 ? merchandise / subtotal : 1;

    const params: Record<string, string> = {
      mode: 'payment',
      'phone_number_collection[enabled]': 'true',
      locale: 'fr',
    };

    cart.forEach((x, i) => {
      params[`line_items[${i}][quantity]`] = String(x.qty);
      params[`line_items[${i}][price_data][currency]`] = 'chf';
      params[`line_items[${i}][price_data][unit_amount]`] = String(chf(x.unit * factor));
      params[`line_items[${i}][price_data][product_data][name]`] = x.product.name;
      const img = x.product.images[0];
      if (img) params[`line_items[${i}][price_data][product_data][images][0]`] = img;
    });

    // Frais de livraison en ligne séparée si applicable
    if (shipping > 0) {
      const i = cart.length;
      params[`line_items[${i}][quantity]`] = '1';
      params[`line_items[${i}][price_data][currency]`] = 'chf';
      params[`line_items[${i}][price_data][unit_amount]`] = String(chf(shipping));
      params[`line_items[${i}][price_data][product_data][name]`] = 'Frais de livraison';
    }

    ['CH', 'FR', 'DE', 'IT', 'AT', 'BE', 'LU'].forEach((c, i) => {
      params[`shipping_address_collection[allowed_countries][${i}]`] = c;
    });

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://maison-serenia.com';
    params['success_url'] = `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`;
    params['cancel_url'] = `${origin}/?panier=annule`;

    const session = await stripeRequest('/checkout/sessions', key, params);
    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return Response.json({ error: 'checkout_failed', message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
