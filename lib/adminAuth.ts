// ============================================================================
// Authentification admin — SERVEUR UNIQUEMENT.
//
// Remplace le mot de passe passé en URL (?key=) par une session en cookie
// httpOnly signé (HMAC-SHA256). Le mot de passe ne transite qu'une fois, en
// POST, et n'est jamais stocké côté navigateur. Comparaisons à temps constant.
// ============================================================================

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'ms_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function secret(): string {
  // Secret dédié si fourni, sinon dérivé du mot de passe admin.
  return (process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '').trim();
}

function hmac(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('base64url');
}

function timingEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function adminConfigured(): boolean {
  return !!(process.env.ADMIN_PASSWORD || '').trim();
}

export function checkPassword(input: string): boolean {
  const pw = (process.env.ADMIN_PASSWORD || '').trim();
  if (!pw || !input) return false;
  return timingEqual(input, pw);
}

export function createToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  return `${payload}.${hmac(payload, secret())}`;
}

export function verifyToken(token: string | undefined): boolean {
  const key = secret();
  if (!token || !key) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  if (!timingEqual(sig, hmac(payload, key))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number };
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
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
