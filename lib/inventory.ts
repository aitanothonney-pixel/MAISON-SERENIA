// ============================================================================
// Réservation de stock — SERVEUR UNIQUEMENT.
//
// S'appuie sur lib/supabaseAdmin.ts (clé service_role, jamais NEXT_PUBLIC) :
// si Supabase n'est pas configuré, le suivi de stock reste désactivé (aucun
// effet, aucune fuite).
//
// Philosophie « fail-open » : en cas d'erreur réseau/base OU si le suivi n'est
// pas configuré, on NE bloque JAMAIS la vente (comportement identique à avant).
// Seule une variante réellement gérée (active = true) et en rupture renvoie une
// indisponibilité. La clé service_role n'est jamais journalisée.
// ============================================================================

import { sbRpc, isSupabaseConfigured } from './supabaseAdmin';

export interface ReserveItem {
  legacy_id: number;
  size: string | null;
  qty: number;
}

export interface Unavailable {
  legacy_id: number;
  size: string | null;
  sku: string;
  requested: number;
  available: number;
}

export function isInventoryEnabled(): boolean {
  return isSupabaseConfigured();
}

/**
 * Réserve le stock de façon atomique côté base (verrouillage de ligne).
 * Retourne { ok:false, unavailable:[...] } uniquement si une variante GÉRÉE
 * est en rupture. Sinon, et en cas d'erreur ou de suivi désactivé : ok:true.
 */
export async function reserveStock(
  items: ReserveItem[],
  token: string,
  ttlMinutes = 60,
): Promise<{ ok: boolean; unavailable: Unavailable[] }> {
  if (!isInventoryEnabled()) return { ok: true, unavailable: [] };
  try {
    const data = (await sbRpc('reserve_stock', {
      p_items: items,
      p_session: token,
      p_ttl_minutes: ttlMinutes,
    })) as { ok?: boolean; unavailable?: Unavailable[] } | null;
    const unavailable = Array.isArray(data?.unavailable) ? data!.unavailable! : [];
    return { ok: unavailable.length === 0, unavailable };
  } catch (e) {
    console.error('[inventory] reserve_stock a échoué — la commande est laissée passer :', e instanceof Error ? e.message : String(e));
    return { ok: true, unavailable: [] };
  }
}

/** Libère les réservations d'un jeton (abandon / échec de création Stripe). Best-effort. */
export async function releaseReservation(token: string): Promise<void> {
  if (!isInventoryEnabled()) return;
  try {
    await sbRpc('release_reservation', { p_token: token });
  } catch (e) {
    console.error('[inventory] release_reservation a échoué :', e instanceof Error ? e.message : String(e));
  }
}
