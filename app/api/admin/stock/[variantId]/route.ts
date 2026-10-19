import { isAdmin } from '@/lib/adminAuth';
import { isSupabaseConfigured, sbRpc } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ variantId: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return Response.json({ error: 'no_db', message: 'Base non configurée.' }, { status: 400 });
  }

  const { variantId } = await params;
  let body: { stock?: number; active?: boolean; reason?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }

  const stock = Math.max(0, Math.floor(Number(body.stock)));
  if (!Number.isFinite(stock)) return Response.json({ error: 'invalid_stock' }, { status: 400 });
  const active = Boolean(body.active);

  try {
    const variant = await sbRpc('set_variant_stock', {
      p_variant_id: variantId,
      p_stock: stock,
      p_active: active,
      p_reason: typeof body.reason === 'string' ? body.reason : null,
      p_admin: 'admin',
    });
    return Response.json({ variant });
  } catch (e) {
    return Response.json({ error: 'server', message: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
