import { isAdmin } from '@/lib/adminAuth';
import { isSupabaseConfigured, sbSelect } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_API = 'https://api.stripe.com/v1';

export interface AdminOrder {
  id: string;
  order_ref: string;
  created_at: string;
  amount_total_cents: number | null;
  currency: string;
  email: string | null;
  phone: string | null;
  customer_name: string | null;
  shipping_address: Record<string, unknown> | null;
  payment_status: string;
  fulfillment_status: string | null;
  carrier: string | null;
  tracking_number: string | null;
  items: { product_name: string; option_label: string | null; quantity: number; unit_price_cents: number }[];
  editable: boolean; // true si persisté en base (statuts modifiables)
}

// Repli : lecture des 50 dernières sessions payées depuis Stripe (serveur).
async function readStripeOrders(): Promise<AdminOrder[]> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return [];
  const res = await fetch(`${STRIPE_API}/checkout/sessions?limit=50&expand[]=data.line_items`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe HTTP ${res.status}`);
  return (data.data as Record<string, unknown>[])
    .filter((s) => s.payment_status === 'paid' || s.status === 'complete')
    .map((s): AdminOrder => {
      const cd = (s.customer_details || {}) as Record<string, unknown>;
      const shipping = (s.shipping_details || s.shipping || null) as Record<string, unknown> | null;
      const addr = (shipping?.address || cd.address || null) as Record<string, unknown> | null;
      const lineItems = ((s.line_items as Record<string, unknown>)?.data || []) as Record<string, unknown>[];
      return {
        id: String(s.id),
        order_ref: String(s.id),
        created_at: new Date((Number(s.created) || 0) * 1000).toISOString(),
        amount_total_cents: typeof s.amount_total === 'number' ? (s.amount_total as number) : null,
        currency: ((s.currency as string) || 'chf').toUpperCase(),
        email: (cd.email as string) || null,
        phone: (cd.phone as string) || null,
        customer_name: (shipping?.name as string) || (cd.name as string) || null,
        shipping_address: addr,
        payment_status: 'paid',
        fulfillment_status: null,
        carrier: null,
        tracking_number: null,
        items: lineItems.map((li) => ({
          product_name: String(li.description || 'Article'),
          option_label: null,
          quantity: Number(li.quantity) || 1,
          unit_price_cents: typeof li.amount_total === 'number' ? (li.amount_total as number) / (Number(li.quantity) || 1) : 0,
        })),
        editable: false,
      };
    });
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401 });

  try {
    if (isSupabaseConfigured()) {
      const rows = await sbSelect(
        'orders',
        'select=id,order_ref,created_at,amount_total_cents,currency,email,phone,customer_name,shipping_address,payment_status,fulfillment_status,carrier,tracking_number,order_items(product_name,option_label,quantity,unit_price_cents)&order=created_at.desc&limit=100',
      );
      const orders: AdminOrder[] = rows.map((o) => ({
        id: String(o.id),
        order_ref: String(o.order_ref),
        created_at: String(o.created_at),
        amount_total_cents: (o.amount_total_cents as number) ?? null,
        currency: String(o.currency || 'CHF'),
        email: (o.email as string) ?? null,
        phone: (o.phone as string) ?? null,
        customer_name: (o.customer_name as string) ?? null,
        shipping_address: (o.shipping_address as Record<string, unknown>) ?? null,
        payment_status: String(o.payment_status || 'paid'),
        fulfillment_status: (o.fulfillment_status as string) ?? null,
        carrier: (o.carrier as string) ?? null,
        tracking_number: (o.tracking_number as string) ?? null,
        items: ((o.order_items as Record<string, unknown>[]) || []).map((it) => ({
          product_name: String(it.product_name),
          option_label: (it.option_label as string) ?? null,
          quantity: Number(it.quantity) || 1,
          unit_price_cents: Number(it.unit_price_cents) || 0,
        })),
        editable: true,
      }));
      return Response.json({ source: 'db', orders });
    }

    const orders = await readStripeOrders();
    return Response.json({ source: 'stripe', orders });
  } catch (e) {
    return Response.json({ error: 'server', message: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
