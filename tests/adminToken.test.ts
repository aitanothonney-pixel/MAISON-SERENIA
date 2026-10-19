import { describe, it, expect, beforeEach } from 'vitest';
import { createToken, verifyToken, checkPassword, adminConfigured } from '../lib/adminToken';

describe('adminToken (session signée)', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'secret-pw';
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it('valide un jeton fraîchement créé', () => {
    expect(verifyToken(createToken())).toBe(true);
  });

  it('rejette une tentative de prolonger l\'expiration (signature invalide)', () => {
    const token = createToken();
    const sig = token.split('.')[1];
    const forgedPayload = Buffer.from(JSON.stringify({ exp: Date.now() + 1e12 })).toString('base64url');
    expect(verifyToken(`${forgedPayload}.${sig}`)).toBe(false);
  });

  it('rejette un jeton expiré', () => {
    const createdEightDaysAgo = Date.now() - 8 * 24 * 3600 * 1000; // TTL = 7 jours
    expect(verifyToken(createToken(createdEightDaysAgo))).toBe(false);
  });

  it('rejette si le secret change', () => {
    const token = createToken();
    process.env.ADMIN_PASSWORD = 'autre-pw';
    expect(verifyToken(token)).toBe(false);
  });

  it('rejette un jeton vide ou mal formé', () => {
    expect(verifyToken(undefined)).toBe(false);
    expect(verifyToken('')).toBe(false);
    expect(verifyToken('nimportequoi')).toBe(false);
  });

  it('checkPassword compare correctement', () => {
    expect(checkPassword('secret-pw')).toBe(true);
    expect(checkPassword('mauvais')).toBe(false);
    expect(checkPassword('')).toBe(false);
  });

  it('adminConfigured reflète ADMIN_PASSWORD', () => {
    expect(adminConfigured()).toBe(true);
    delete process.env.ADMIN_PASSWORD;
    expect(adminConfigured()).toBe(false);
  });

  it('sans secret serveur, aucun jeton n\'est accepté', () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyToken(createToken())).toBe(false);
  });
});
