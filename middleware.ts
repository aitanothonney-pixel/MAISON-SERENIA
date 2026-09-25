import { NextResponse, type NextRequest } from 'next/server';

// Détecte le pays du visiteur (en-tête géo de Vercel) et pose un cookie devise :
// Suisse -> CHF, partout ailleurs -> EUR.
// Le paramètre ?devise=CHF (ou EUR) force la devise : il est utilisé par les liens
// du flux Google Merchant Center (/feed.xml), pour que Google voie les prix en CHF
// même quand son robot visite le site depuis l'étranger.
export function middleware(request: NextRequest) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    '';
  const forced = request.nextUrl.searchParams.get('devise')?.toUpperCase();
  const currency =
    forced === 'CHF' || forced === 'EUR'
      ? forced
      : country.toUpperCase() === 'CH' ? 'CHF' : 'EUR';

  const res = NextResponse.next();
  res.cookies.set('mss-currency', currency, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });
  return res;
}

export const config = {
  // On applique à toutes les pages (hors assets statiques et images optimisées).
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
