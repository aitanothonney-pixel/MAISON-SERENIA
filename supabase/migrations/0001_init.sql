-- ============================================================================
-- Maison Serenia — Migration 0001 : schéma initial
-- Inventaire fiable, commandes persistées, réservations de stock, idempotence.
--
-- À appliquer sur Supabase (SQL Editor ou `supabase db push`) APRÈS validation.
-- Ne contient AUCUNE clé secrète. Idempotent (ré-exécutable sans casse).
-- Les fonctions atomiques de réservation/vente arrivent en migration 0002 (Phase 4/5).
-- ============================================================================

create extension if not exists pgcrypto;

-- ───────────────────────── Types / statuts ─────────────────────────────────
do $$ begin
  create type payment_status as enum
    ('pending','paid','failed','expired','refunded','partially_refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fulfillment_status as enum
    ('to_prepare','prepared','shipped','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reservation_status as enum
    ('active','consumed','released','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type movement_type as enum
    ('sale','restock','correction','return','reservation','release');
exception when duplicate_object then null; end $$;

-- ───────────────────────── Helper : updated_at ─────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ───────────────────────── products ────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  legacy_id   integer unique,                 -- ancien id numérique (lib/products.ts)
  slug        text unique,
  name        text not null,
  description text,
  category    text,
  images      jsonb not null default '[]'::jsonb,
  published   boolean not null default false, -- visible sur la boutique publique
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- ───────────────────────── product_variants ────────────────────────────────
-- Une variante vendable = (produit, option). Correspondance panier : (legacy_id, size).
create table if not exists product_variants (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid not null references products(id) on delete cascade,
  sku               text not null unique,
  option_label      text not null default 'Default',  -- ex. "Noir", "90×150 cm"
  legacy_size_label text,                              -- = champ 'size' du panier (null = sans option)
  price_cents       integer not null check (price_cents >= 0),  -- prix catalogue, centimes CHF
  currency          text not null default 'CHF',
  stock             integer not null default 0 check (stock >= 0),  -- stock physique
  active            boolean not null default false,   -- vendable uniquement si true
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
-- Une seule variante par (produit, option de panier)
create unique index if not exists uniq_variant_product_size
  on product_variants (product_id, coalesce(legacy_size_label, ''));
create index if not exists idx_variant_product on product_variants(product_id);
drop trigger if exists trg_variants_updated on product_variants;
create trigger trg_variants_updated before update on product_variants
  for each row execute function set_updated_at();

-- ───────────────────────── orders ──────────────────────────────────────────
create sequence if not exists order_ref_seq;
create table if not exists orders (
  id                        uuid primary key default gen_random_uuid(),
  order_ref                 text not null unique
    default ('MS-' || to_char(now(),'YYYY') || '-' || lpad(nextval('order_ref_seq')::text, 5, '0')),
  stripe_session_id         text unique,
  stripe_payment_intent_id  text unique,
  email                     text,
  phone                     text,
  customer_name             text,
  shipping_address          jsonb,
  amount_total_cents        integer check (amount_total_cents is null or amount_total_cents >= 0),
  currency                  text not null default 'CHF',
  payment_status            payment_status not null default 'pending',
  fulfillment_status        fulfillment_status not null default 'to_prepare',
  carrier                   text,
  tracking_number           text,
  paid_at                   timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
create index if not exists idx_orders_payment     on orders(payment_status);
create index if not exists idx_orders_fulfillment on orders(fulfillment_status);
create index if not exists idx_orders_created     on orders(created_at desc);
drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

-- ───────────────────────── order_items (prix figés) ────────────────────────
create table if not exists order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id) on delete cascade,
  variant_id       uuid references product_variants(id) on delete restrict, -- garde l'historique
  sku              text not null,          -- figé au moment de la commande
  product_name     text not null,          -- figé
  option_label     text,                   -- figé
  quantity         integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),  -- figé
  created_at       timestamptz not null default now()
);
create index if not exists idx_items_order on order_items(order_id);

-- ───────────────────────── stock_reservations ──────────────────────────────
create table if not exists stock_reservations (
  id                uuid primary key default gen_random_uuid(),
  variant_id        uuid not null references product_variants(id) on delete cascade,
  order_id          uuid references orders(id) on delete set null,
  stripe_session_id text,
  quantity          integer not null check (quantity > 0),
  status            reservation_status not null default 'active',
  expires_at        timestamptz not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_resv_status_expiry on stock_reservations(status, expires_at);
create index if not exists idx_resv_variant       on stock_reservations(variant_id);
create index if not exists idx_resv_session       on stock_reservations(stripe_session_id);
drop trigger if exists trg_resv_updated on stock_reservations;
create trigger trg_resv_updated before update on stock_reservations
  for each row execute function set_updated_at();

-- ───────────────────────── inventory_movements (journal) ───────────────────
create table if not exists inventory_movements (
  id         uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variants(id) on delete cascade,
  delta      integer not null,                 -- + entrée, - sortie
  type       movement_type not null,
  reason     text,
  order_id   uuid references orders(id) on delete set null,
  created_by text not null default 'system',   -- 'system' ou email admin
  created_at timestamptz not null default now()
);
create index if not exists idx_mov_variant on inventory_movements(variant_id);
create index if not exists idx_mov_created on inventory_movements(created_at desc);

-- ───────────────────────── stripe_events (idempotence) ─────────────────────
create table if not exists stripe_events (
  id           text primary key,     -- id d'événement Stripe (evt_...)
  type         text not null,
  payload      jsonb,
  processed_at timestamptz not null default now()
);

-- ───────────────────────── admin_users ─────────────────────────────────────
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,       -- bcrypt ; jamais en clair
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

-- ───────────────────────── Row Level Security ──────────────────────────────
alter table products            enable row level security;
alter table product_variants    enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table stock_reservations  enable row level security;
alter table inventory_movements enable row level security;
alter table stripe_events       enable row level security;
alter table admin_users         enable row level security;

-- Public (clé anon) : lecture seule du catalogue publié / actif.
drop policy if exists "public read published products" on products;
create policy "public read published products" on products
  for select to anon using (published = true);

drop policy if exists "public read active variants" on product_variants;
create policy "public read active variants" on product_variants
  for select to anon using (active = true);

-- Aucune policy pour `anon` sur les autres tables => accès refusé par défaut.
-- Les écritures et les lectures sensibles passent par la clé `service_role`
-- (serveur uniquement), qui contourne la RLS. Ne JAMAIS exposer service_role au client.

-- Privilèges de table : une policy filtre les LIGNES mais ne donne pas le droit
-- SELECT. On l'accorde explicitement sur les deux tables en lecture publique
-- (la RLS ci-dessus limite ensuite aux lignes published / active). Les rôles
-- anon / authenticated existent déjà sur Supabase.
grant usage on schema public to anon, authenticated;
grant select on products, product_variants to anon, authenticated;
