// ============================================================================
// Client Supabase — SERVEUR UNIQUEMENT (clé service_role, jamais NEXT_PUBLIC).
//
// Fin wrapper sur l'API REST de Supabase (PostgREST) : aucune dépendance SDK,
// cohérent avec le reste du projet (appels Stripe en fetch brut). La clé
// service_role contourne la RLS — à n'utiliser que côté serveur. Elle n'est
// JAMAIS journalisée.
// ============================================================================

export function supabaseConfig(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured(): boolean {
  return supabaseConfig() !== null;
}

async function restFetch(path: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error('Supabase non configuré');
  const { prefer, headers, ...rest } = init;
  return fetch(`${cfg.url}/rest/v1${path}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...(headers || {}),
    },
  });
}

async function okOrThrow(res: Response, label: string): Promise<unknown> {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${label} HTTP ${res.status} ${txt.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** Appel d'une fonction SQL (RPC). */
export async function sbRpc(fn: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await restFetch(`/rpc/${fn}`, { method: 'POST', body: JSON.stringify(body) });
  return okOrThrow(res, `rpc ${fn}`);
}

/** INSERT renvoyant les lignes créées. */
export async function sbInsert(table: string, rows: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  const res = await restFetch(`/${table}`, {
    method: 'POST',
    prefer: 'return=representation',
    body: JSON.stringify(rows),
  });
  return (await okOrThrow(res, `insert ${table}`)) as Record<string, unknown>[];
}

/**
 * UPSERT « ignore-duplicates » : insère, et IGNORE silencieusement les conflits
 * sur `onConflict`. Renvoie uniquement les lignes RÉELLEMENT insérées
 * (vide = déjà présent) → sert de garde d'idempotence.
 */
export async function sbUpsertIgnore(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
): Promise<Record<string, unknown>[]> {
  const res = await restFetch(`/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=representation',
    body: JSON.stringify(rows),
  });
  return (await okOrThrow(res, `upsert ${table}`)) as Record<string, unknown>[];
}

/** UPDATE filtré (filtre au format PostgREST, ex. "stripe_payment_intent_id=eq.pi_123"). */
export async function sbUpdate(table: string, filter: string, patch: Record<string, unknown>): Promise<Record<string, unknown>[]> {
  const res = await restFetch(`/${table}?${filter}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: JSON.stringify(patch),
  });
  return (await okOrThrow(res, `update ${table}`)) as Record<string, unknown>[];
}

/** SELECT (query au format PostgREST, ex. "select=*&payment_status=eq.paid&order=created_at.desc"). */
export async function sbSelect(table: string, query: string): Promise<Record<string, unknown>[]> {
  const res = await restFetch(`/${table}?${query}`, { method: 'GET' });
  return (await okOrThrow(res, `select ${table}`)) as Record<string, unknown>[];
}
