-- ============================================================================
-- Maison Serenia — Migration 0002 : fonctions atomiques de stock
--
-- Réservation → vente, avec protection anti-survente par verrouillage de ligne.
-- À appliquer APRÈS 0001. Idempotent (create or replace / add column if not exists).
-- Ne contient AUCUNE clé secrète.
--
-- Principe de sûreté : seules les variantes « gérées » (active = true) sont
-- concernées. Une variante inconnue ou active = false n'est JAMAIS réservée ni
-- bloquée — le checkout se comporte comme avant tant qu'un admin n'a pas activé
-- le suivi de stock d'un produit. Impossible de bloquer une vente par erreur.
--
-- Disponible à la vente = stock − Σ réservations actives non expirées.
-- ============================================================================

-- Jeton de réservation (lien réservation ↔ session de paiement, via metadata Stripe)
alter table stock_reservations add column if not exists reservation_token text;
create index if not exists idx_resv_token on stock_reservations(reservation_token);

-- ───────────────────────── reserve_stock ───────────────────────────────────
-- p_items : [{ "legacy_id": 100, "size": "Noir"|null, "qty": 1 }, ...]
-- Verrouille chaque variante, vérifie la dispo, puis réserve TOUT ou RIEN.
-- Retour : { ok, unavailable:[{legacy_id,size,sku,requested,available}], token }
create or replace function reserve_stock(p_items jsonb, p_session text, p_ttl_minutes integer default 60)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item         record;
  v_variant    product_variants%rowtype;
  v_reserved   integer;
  v_available  integer;
  v_unavailable jsonb := '[]'::jsonb;
  v_to_insert  jsonb := '[]'::jsonb;
  ins          record;
begin
  -- Pass 1 : verrouiller + vérifier (quantités agrégées par variante de panier)
  for item in
    select (e->>'legacy_id')::int            as legacy_id,
           nullif(e->>'size', '')            as size,
           sum(greatest(1, (e->>'qty')::int)) as qty
    from jsonb_array_elements(p_items) e
    group by 1, 2
  loop
    select pv.* into v_variant
    from product_variants pv
    join products p on p.id = pv.product_id
    where p.legacy_id = item.legacy_id
      and coalesce(pv.legacy_size_label, '') = coalesce(item.size, '')
    for update of pv;

    -- Variante inconnue ou non gérée => ni réservée, ni bloquée
    if not found or v_variant.active = false then
      continue;
    end if;

    select coalesce(sum(quantity), 0) into v_reserved
    from stock_reservations
    where variant_id = v_variant.id
      and status = 'active'
      and expires_at > now();

    v_available := v_variant.stock - v_reserved;

    if v_available < item.qty then
      v_unavailable := v_unavailable || jsonb_build_object(
        'legacy_id', item.legacy_id,
        'size',      item.size,
        'sku',       v_variant.sku,
        'requested', item.qty,
        'available', greatest(0, v_available));
    else
      v_to_insert := v_to_insert || jsonb_build_object('variant_id', v_variant.id, 'qty', item.qty);
    end if;
  end loop;

  -- Indisponibilité => on n'insère RIEN (verrous relâchés au retour de transaction)
  if jsonb_array_length(v_unavailable) > 0 then
    return jsonb_build_object('ok', false, 'unavailable', v_unavailable);
  end if;

  -- Pass 2 : insérer les réservations
  for ins in select * from jsonb_to_recordset(v_to_insert) as x(variant_id uuid, qty integer)
  loop
    insert into stock_reservations (variant_id, reservation_token, quantity, status, expires_at)
    values (ins.variant_id, p_session, ins.qty, 'active', now() + make_interval(mins => p_ttl_minutes));
  end loop;

  return jsonb_build_object('ok', true, 'unavailable', '[]'::jsonb, 'token', p_session);
end;
$$;

-- ───────────────────────── release_reservation ─────────────────────────────
-- Libère les réservations actives d'un jeton (abandon / expiration de session).
create or replace function release_reservation(p_token text)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare n integer;
begin
  update stock_reservations
     set status = 'released', updated_at = now()
   where reservation_token = p_token and status = 'active';
  get diagnostics n = row_count;
  return n;
end;
$$;

-- ───────────────────────── consume_reservation ─────────────────────────────
-- Paiement confirmé : réservations active → consumed, décrément du stock une
-- seule fois, journal 'sale'. Idempotent (ne touche que les réservations actives).
create or replace function consume_reservation(p_token text, p_order_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare r record; n integer := 0;
begin
  for r in
    select * from stock_reservations
    where reservation_token = p_token and status = 'active'
    for update
  loop
    update product_variants
       set stock = greatest(0, stock - r.quantity), updated_at = now()
     where id = r.variant_id;

    update stock_reservations
       set status = 'consumed', order_id = coalesce(p_order_id, order_id), updated_at = now()
     where id = r.id;

    insert into inventory_movements (variant_id, delta, type, reason, order_id, created_by)
    values (r.variant_id, -r.quantity, 'sale', 'réservation consommée', p_order_id, 'system');

    n := n + 1;
  end loop;
  return n;
end;
$$;

-- ───────────────────────── cleanup_expired_reservations ────────────────────
-- Passe en 'expired' les réservations actives arrivées à échéance (cron Phase 5).
create or replace function cleanup_expired_reservations()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare n integer;
begin
  update stock_reservations
     set status = 'expired', updated_at = now()
   where status = 'active' and expires_at <= now();
  get diagnostics n = row_count;
  return n;
end;
$$;

-- ───────────────────────── vue : disponibilité ─────────────────────────────
create or replace view variant_availability as
select
  pv.id         as variant_id,
  pv.product_id,
  pv.sku,
  pv.active,
  pv.stock,
  coalesce((
    select sum(r.quantity) from stock_reservations r
    where r.variant_id = pv.id and r.status = 'active' and r.expires_at > now()
  ), 0) as reserved,
  pv.stock - coalesce((
    select sum(r.quantity) from stock_reservations r
    where r.variant_id = pv.id and r.status = 'active' and r.expires_at > now()
  ), 0) as available
from product_variants pv;

-- ───────────────────────── permissions ─────────────────────────────────────
-- Exécution réservée au rôle service_role (serveur). Jamais exposé au client.
revoke all on function reserve_stock(jsonb, text, integer)      from public;
revoke all on function release_reservation(text)                from public;
revoke all on function consume_reservation(text, uuid)          from public;
revoke all on function cleanup_expired_reservations()           from public;
grant execute on function reserve_stock(jsonb, text, integer)   to service_role;
grant execute on function release_reservation(text)             to service_role;
grant execute on function consume_reservation(text, uuid)       to service_role;
grant execute on function cleanup_expired_reservations()        to service_role;
