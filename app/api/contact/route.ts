export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Envoi des messages du formulaire de contact vers la boîte mail via Web3Forms.
// La clé (WEB3FORMS_KEY) reste côté serveur, jamais exposée au navigateur.
export async function POST(req: Request) {
  const key = process.env.WEB3FORMS_KEY?.trim();
  if (!key) {
    return Response.json(
      { error: 'config', message: "Le formulaire n'est pas encore configuré. Ajoutez WEB3FORMS_KEY dans Vercel." },
      { status: 500 },
    );
  }

  let body: { nom?: string; email?: string; sujet?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const nom = (body.nom || '').trim();
  const email = (body.email || '').trim();
  const sujet = (body.sujet || 'Autre').trim();
  const message = (body.message || '').trim();

  if (!nom || !email || !message) {
    return Response.json({ error: 'missing', message: 'Champs manquants.' }, { status: 400 });
  }
  // Validation e-mail basique
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'email', message: 'Adresse e-mail invalide.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `Nouveau message (${sujet}) — Maison Serenia`,
        from_name: 'Formulaire Maison Serenia',
        name: nom,
        email, // devient l'adresse de réponse (répondre directement au client)
        replyto: email,
        Sujet: sujet,
        Message: message,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      return Response.json({ error: 'send', message: data?.message || 'Envoi impossible.' }, { status: 502 });
    }
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'network', message: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
