// ============================================================================
// Jeton de session admin — fonctions PURES (sans next/headers).
//
// Isolé de lib/adminAuth.ts pour être testable hors runtime Next. Signature
// HMAC-SHA256, comparaisons à temps constant. Aucune clé n'est journalisée.
// ============================================================================

import crypto from 'node:crypto';

export const ADMIN_COOKIE = 'ms_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours (secondes)

function secret(): string {
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

export function createToken(nowMs: number = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: nowMs + SESSION_MAX_AGE * 1000 })).toString('base64url');
  return `${payload}.${hmac(payload, secret())}`;
}

export function verifyToken(token: string | undefined, nowMs: number = Date.now()): boolean {
  const key = secret();
  if (!token || !key) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  if (!timingEqual(sig, hmac(payload, key))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number };
    return typeof exp === 'number' && exp > nowMs;
  } catch {
    return false;
  }
}
