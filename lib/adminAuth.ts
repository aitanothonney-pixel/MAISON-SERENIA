// ============================================================================
// Authentification admin — SERVEUR UNIQUEMENT (cookies).
//
// Session en cookie httpOnly signé : remplace le mot de passe passé en URL.
// Les fonctions pures (signature, vérification, mot de passe) sont dans
// lib/adminToken.ts afin d'être testables hors runtime Next.
// ============================================================================

import { cookies } from 'next/headers';
import { ADMIN_COOKIE, SESSION_MAX_AGE, createToken, verifyToken } from './adminToken';

export { adminConfigured, checkPassword, createToken, verifyToken, ADMIN_COOKIE } from './adminToken';

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
