import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isInventoryEnabled, reserveStock, releaseReservation } from '../lib/inventory';

describe('inventory — fail-open quand le suivi est désactivé', () => {
  beforeEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it('est désactivé sans configuration Supabase', () => {
    expect(isInventoryEnabled()).toBe(false);
  });

  it('reserveStock ne bloque jamais la vente et n\'appelle pas le réseau', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const r = await reserveStock([{ legacy_id: 100, size: 'Noir', qty: 2 }], 'rsv_test');
    expect(r).toEqual({ ok: true, unavailable: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('releaseReservation est un no-op sans configuration', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(releaseReservation('rsv_test')).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
