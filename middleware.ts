import { NextResponse, type NextRequest } from 'next/server';

// Détecte le pays du visiteur (en-tête géo de Vercel) et pose un cookie devise :
// Suisse -> CHF, partout ailleurs -> EUR.
export function middleware(request: NextRequest) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    '';
  const currency = country.toUpperCase() === 'CH' ? 'CHF' : 'EUR';

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
