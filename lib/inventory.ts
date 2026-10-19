// ============================================================================
// Réservation de stock — SERVEUR UNIQUEMENT.
//
// N'utilise que des variables d'environnement serveur (jamais NEXT_PUBLIC) :
// si ce module était importé par erreur côté client, la clé serait absente et
// le suivi de stock resté désactivé (aucune fuite, aucun effet).
//
// Philosophie « fail-open » : en cas d'erreur réseau/base OU si le suivi n'est
// pas configuré, on NE bloque JAMAIS la vente (comportement identique à avant).
// Seule une variante réellement gérée (active = true) et en rupture renvoie une
// indisponibilité. La clé service_role n'est jamais journalisée.
// ============================================================================

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

function config(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return url && key ? { url, key } : null;
}

export function isInventoryEnabled(): boolean {
  return config() !== null;
}

async function rpc(fn: string, body: Record<string, unknown>): Promise<unknown> {
  const cfg = config();
  if (!cfg) return null;
  const res = await fetch(`${cfg.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    // Le corps d'erreur PostgREST ne contient jamais la clé ; sûr à journaliser.
    const txt = await res.text().catch(() => '');
    throw new Error(`RPC ${fn} HTTP ${res.status} ${txt.slice(0, 200)}`);
  }
  return res.json();
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
    const data = (await rpc('reserve_stock', {
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
    await rpc('release_reservation', { p_token: token });
  } catch (e) {
    console.error('[inventory] release_reservation a échoué :', e instanceof Error ? e.message : String(e));
  }
}
