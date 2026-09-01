import { NextResponse } from 'next/server';

// Inscrit un email dans Brevo (newsletter). La clé API et l'ID de liste
// sont lus depuis les variables d'environnement, jamais exposés au client.
export async function POST(req: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // Brevo pas encore configuré : on ne bloque pas le visiteur.
    return NextResponse.json({ ok: true, stored: false, reason: 'not_configured' });
  }

  let email = '';
  let source = 'site';
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim().toLowerCase();
    if (body?.source) source = String(body.source);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const listId = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : undefined;

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes: { SOURCE: source },
        ...(listId ? { listIds: [listId] } : {}),
      }),
    });

    // 201 (créé) ou 204 (mis à jour) = succès. Un doublon renvoie 400 avec
    // le code "duplicate_parameter" : on le considère comme un succès.
    if (res.ok) return NextResponse.json({ ok: true, stored: true });
    const data = await res.json().catch(() => ({}));
    if (data?.code === 'duplicate_parameter') {
      return NextResponse.json({ ok: true, stored: true, already: true });
    }
    return NextResponse.json({ ok: false, error: data?.message ?? 'brevo_error' }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
  }
}
