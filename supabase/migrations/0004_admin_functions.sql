-- ============================================================================
-- Maison Serenia — Migration 0004 : fonctions d'administration
--
-- Ajustement de stock atomique + journalisation. À appliquer après 0002.
-- Exécution réservée au rôle service_role. Aucune clé secrète.
-- ============================================================================

-- set_variant_stock : fixe le stock et l'état « active » d'une variante et
-- journalise l'écart dans inventory_movements (type 'correction').
create or replace function set_variant_stock(
  p_variant_id uuid,
  p_stock      integer,
  p_active     boolean,
  p_reason     text default null,
  p_admin      text default 'admin'
)
returns product_variants
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_before integer;
  v        product_variants%rowtype;
begin
  select stock into v_before from product_variants where id = p_variant_id for update;
  if not found then
    raise exception 'variante introuvable: %', p_variant_id;
  end if;

  update product_variants
     set stock = greatest(0, p_stock), active = p_active, updated_at = now()
   where id = p_variant_id
  returning * into v;

  if v.stock <> v_before then
    insert into inventory_movements (variant_id, delta, type, reason, created_by)
    values (p_variant_id, v.stock - v_before, 'correction', coalesce(p_reason, 'ajustement admin'), p_admin);
  end if;

  return v;
end;
$$;

revoke all on function set_variant_stock(uuid, integer, boolean, text, text) from public;
grant execute on function set_variant_stock(uuid, integer, boolean, text, text) to service_role;
