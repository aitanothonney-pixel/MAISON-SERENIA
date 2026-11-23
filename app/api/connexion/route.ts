import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// « Se connecter » dans l'en-tête : l'adresse e-mail laissée par le visiteur est transmise à la boîte
// de la boutique (Web3Forms), comme le formulaire de contact. La clé WEB3FORMS_KEY reste côté serveur.
export async function POST(req: Request) {
  const key = process.env.WEB3FORMS_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { success: false, message: 'Le service est momentanément indisponible. Écrivez-nous à maisonserenia@gmail.com.' },
      { status: 500 },
    );
  }

  let email = '';
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim();
  } catch {
    return NextResponse.json({ success: false, message: 'Requête invalide.' }, { status: 400 });
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: 'Adresse e-mail invalide.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: 'Demande de connexion — Maison Serenia',
        from_name: 'Site Maison Serenia',
        email,
        replyto: email,
        Message: `Adresse e-mail laissée dans « Se connecter » : ${email}`,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return NextResponse.json(
        { success: false, message: "L'envoi a échoué. Réessayez ou écrivez-nous à maisonserenia@gmail.com." },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur de connexion. Réessayez.' }, { status: 502 });
  }
}
