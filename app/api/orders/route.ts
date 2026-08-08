export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_API = 'https://api.stripe.com/v1';

async function stripeGet(path: string, key: string) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe HTTP ${res.status}`);
  return data;
}

export async function GET(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminPassword) {
    return Response.json(
      { error: 'config', message: "Aucun mot de passe défini. Ajoutez la variable ADMIN_PASSWORD dans Vercel." },
      { status: 500 },
    );
  }
  if (!key) {
    return Response.json({ error: 'config', message: 'Clé Stripe absente.' }, { status: 500 });
  }

  // Vérification du mot de passe
  const url = new URL(req.url);
  const provided = url.searchParams.get('key') || req.headers.get('x-admin-key') || '';
  if (provided !== adminPassword) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    // On récupère les 50 dernières sessions de paiement avec les articles
    const data = await stripeGet(
      '/checkout/sessions?limit=50&expand[]=data.line_items',
      key,
    );

    const orders = (data.data as Record<string, unknown>[])
      .filter((s) => s.payment_status === 'paid' || s.status === 'complete')
      .map((s) => {
        const cd = (s.customer_details || {}) as Record<string, unknown>;
        const shipping = (s.shipping_details || s.shipping || null) as Record<string, unknown> | null;
        const addr = (shipping?.address || cd.address || {}) as Record<string, unknown>;
        const lineItems = ((s.line_items as Record<string, unknown>)?.data || []) as Record<string, unknown>[];
        return {
          id: s.id,
          date: s.created,
          amount: typeof s.amount_total === 'number' ? s.amount_total / 100 : 0,
          currency: (s.currency as string)?.toUpperCase() || 'CHF',
          email: cd.email || null,
          phone: cd.phone || null,
          name: shipping?.name || cd.name || null,
          address: {
            line1: addr.line1 || null,
            line2: addr.line2 || null,
            postal_code: addr.postal_code || null,
            city: addr.city || null,
            country: addr.country || null,
          },
          items: lineItems.map((li) => ({
            description: li.description,
            quantity: li.quantity,
            amount: typeof li.amount_total === 'number' ? (li.amount_total as number) / 100 : 0,
          })),
        };
      });

    return Response.json({ orders });
  } catch (e) {
    return Response.json(
      { error: 'stripe', message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
