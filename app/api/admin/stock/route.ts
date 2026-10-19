import { isAdmin } from '@/lib/adminAuth';
import { isSupabaseConfigured, sbSelect } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return Response.json({ enabled: false, variants: [] });
  }

  try {
    const [vars, avail] = await Promise.all([
      sbSelect(
        'product_variants',
        'select=id,sku,option_label,legacy_size_label,price_cents,stock,active,products(legacy_id,name,category)&order=product_id',
      ),
      sbSelect('variant_availability', 'select=variant_id,reserved,available'),
    ]);

    const byId = new Map<string, { reserved: number; available: number }>();
    for (const a of avail) {
      byId.set(String(a.variant_id), {
        reserved: Number(a.reserved) || 0,
        available: Number(a.available) || 0,
      });
    }

    const variants = vars.map((v) => {
      const p = (v.products as Record<string, unknown>) || {};
      const extra = byId.get(String(v.id)) || { reserved: 0, available: Number(v.stock) || 0 };
      return {
        id: String(v.id),
        sku: String(v.sku),
        option_label: (v.option_label as string) ?? null,
        legacy_size_label: (v.legacy_size_label as string) ?? null,
        price_cents: Number(v.price_cents) || 0,
        stock: Number(v.stock) || 0,
        active: Boolean(v.active),
        reserved: extra.reserved,
        available: extra.available,
        product_name: String(p.name || v.sku),
        category: (p.category as string) ?? null,
        legacy_id: (p.legacy_id as number) ?? null,
      };
    });

    return Response.json({ enabled: true, variants });
  } catch (e) {
    return Response.json({ error: 'server', message: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
