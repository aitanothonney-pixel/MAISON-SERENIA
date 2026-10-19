import { isAdmin } from '@/lib/adminAuth';
import { isSupabaseConfigured, sbUpdate } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FULFILLMENT = ['to_prepare', 'prepared', 'shipped', 'cancelled'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return Response.json({ error: 'no_db', message: 'Base non configurée : statuts non modifiables.' }, { status: 400 });
  }

  const { id } = await params;
  let body: { fulfillment_status?: string; carrier?: string; tracking_number?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.fulfillment_status === 'string') {
    if (!FULFILLMENT.includes(body.fulfillment_status)) {
      return Response.json({ error: 'invalid_status' }, { status: 400 });
    }
    patch.fulfillment_status = body.fulfillment_status;
  }
  if (typeof body.carrier === 'string') patch.carrier = body.carrier.trim() || null;
  if (typeof body.tracking_number === 'string') patch.tracking_number = body.tracking_number.trim() || null;

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: 'empty' }, { status: 400 });
  }

  try {
    const rows = await sbUpdate('orders', `id=eq.${encodeURIComponent(id)}`, patch);
    return Response.json({ order: rows[0] ?? null });
  } catch (e) {
    return Response.json({ error: 'server', message: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
