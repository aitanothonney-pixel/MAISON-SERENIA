import { checkPassword, setSessionCookie, clearSessionCookie, adminConfigured } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return Response.json({ error: 'config', message: 'ADMIN_PASSWORD non défini sur le serveur.' }, { status: 500 });
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!checkPassword(typeof body.password === 'string' ? body.password : '')) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  await setSessionCookie();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
