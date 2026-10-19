# Supabase — Maison Serenia

Base de données PostgreSQL (inventaire, commandes, stock). Migrations SQL **versionnées**
dans `supabase/migrations/`. **Rien n'est appliqué automatiquement** : les migrations sont
lancées manuellement, après validation (voir Phase 8).

> ⚠️ Pendant le développement, on ne touche ni à la production ni à aucune base réelle.
> Ces fichiers décrivent le modèle ; ils seront appliqués sur un projet Supabase dédié
> au moment voulu, avec sauvegarde préalable.

## Migrations

| Fichier | Contenu |
|---|---|
| `0001_init.sql` | Schéma initial : tables, contraintes, index, RLS, statuts |
| `0002_stock_functions.sql` | Fonctions atomiques réservation → vente + anti-survente |
| `0003_seed_catalog.sql` | **Généré** : amorçage catalogue (86 produits · 343 variantes) |

> Les migrations s'appliquent dans l'ordre du numéro. `0003` ne dépend que du
> schéma `0001` ; `0002` ajoute les fonctions de stock. Aucune ne crée de stock.

### Fonctions de stock (`0002`, Phase 4)

Protection anti-survente par **verrouillage de ligne** (`select … for update`).
Disponible à la vente = `stock` − Σ réservations `active` non expirées.

- `reserve_stock(p_items, p_token, p_ttl_minutes)` — réserve **tout ou rien**.
  N'agit que sur les variantes `active = true` ; une variante inconnue ou non
  gérée n'est **ni réservée ni bloquée**. Items : `[{legacy_id, size, qty}]`.
- `release_reservation(p_token)` — libère les réservations d'un jeton (abandon).
- `consume_reservation(p_token, p_order_id)` — paiement confirmé : décrémente le
  stock **une seule fois**, journalise un mouvement `sale` (appelé en Phase 5).
- `cleanup_expired_reservations()` — passe les réservations échues en `expired`.
- Vue `variant_availability` — `stock`, `reserved`, `available` par variante.

Exécution **réservée à `service_role`** (serveur). Le checkout
(`app/api/checkout/route.ts`) réserve via `lib/inventory.ts` **avant** de créer
la session Stripe et transmet le jeton dans `metadata`. En **fail-open** : si
Supabase n'est pas configuré ou répond en erreur, la vente passe comme avant.

### Webhook Stripe (Phase 5)

Endpoint : `POST /api/stripe/webhook` (`app/api/stripe/webhook/route.ts`).

- **Vérifie la signature** Stripe sur le corps brut (`STRIPE_WEBHOOK_SECRET`).
- **Idempotent** : `orders` est upserté sur `stripe_session_id` (clé unique) —
  une relance Stripe ne crée jamais de doublon. Table `stripe_events` = journal.
- `checkout.session.completed` → crée `orders` + `order_items` (prix figés depuis
  les lignes Stripe) puis `consume_reservation()` (décrément stock une fois).
- `checkout.session.expired` / échec → `release_reservation()`.
- `charge.refunded` → passe la commande en `refunded` / `partially_refunded`.
- Sans Supabase configuré : la signature est vérifiée puis l'événement est
  **acquitté** sans rien persister (aucune relance inutile).

À configurer côté Stripe (Phase 8) : un point de terminaison vers
`https://<domaine>/api/stripe/webhook` écoutant `checkout.session.completed`,
`checkout.session.expired`, `charge.refunded`. Planifier aussi
`cleanup_expired_reservations()` (tâche régulière) pour solder les réservations
échues.

### Lier les variantes aux `order_items`

En Phase 5, `order_items.sku = 'N/A'` et `variant_id = null` : la source figée
est la ligne Stripe (nom + prix net facturé). Le rattachement précis à une
variante se fera quand le suivi de stock sera activé (via les réservations
consommées). Cela n'affecte ni le montant ni l'affichage client.

### Amorçage du catalogue (`0003`, Phase 3)

Fichier **généré**, jamais édité à la main :

```bash
npm run export:catalog
```

Le script `scripts/export-catalog.mjs` lit `lib/products.ts` et produit :

- `supabase/migrations/0003_seed_catalog.sql` — un `insert` par produit + un par variante.
- `supabase/catalog-mapping.json` — correspondance **ancien id → slug + SKU** (traçabilité).

Règles de l'amorçage :

- **SKU stable** par variante : `P<id>` (sans option) ou `P<id>-<OPTION>` (ex. `P137-ARGENT`,
  `P134-AMBER-5-TETES`). `legacy_size_label` = le champ `size` du panier.
- `price_cents` = **prix catalogue (liste)** en centimes CHF, *avant* remises dynamiques
  (Bubble −30 %, packs 1900.-, tableau offert, −10 % membre). Ces remises restent
  appliquées au paiement (`app/api/checkout/route.ts`) et seront ré-appliquées en
  Phase 4/5 à partir de ce prix de base — **aucun** changement de prix affiché.
- **Aucun stock inventé** : `stock = 0`, `active = false`, `published = false` partout.
  La boutique publique continue de lire `lib/products.ts` jusqu'à la bascule validée.
- **Idempotent** : `on conflict do nothing` — rejouer la migration ne réécrase ni le
  stock ni l'état `active` qu'un admin aurait réglés après l'amorçage.

## Modèle de données (0001)

- **products** — catalogue (nom, description, images, `published`). `legacy_id` = ancien id numérique.
- **product_variants** — SKU unique, `option_label`, `price_cents` (centimes CHF), `stock`, `active`.
  Une variante vendable = (produit, option). `legacy_size_label` = le champ `size` du panier.
- **orders** — `order_ref` (MS-AAAA-NNNNN), ids Stripe, coordonnées, adresse, montants,
  `payment_status`, `fulfillment_status`, transporteur + suivi.
- **order_items** — variante, SKU, nom, option, quantité, **prix unitaire figé**.
- **stock_reservations** — quantité réservée, `expires_at`, `status`.
- **inventory_movements** — journal des entrées/sorties/corrections.
- **stripe_events** — ids d'événements Stripe déjà traités (**idempotence**).
- **admin_users** — comptes admin (bcrypt).

### Statuts & transitions autorisées

**payment_status** : `pending` → `paid` | `failed` | `expired` ; `paid` → `refunded` | `partially_refunded`.

**fulfillment_status** : `to_prepare` → `prepared` → `shipped` ; `to_prepare`/`prepared` → `cancelled`.

**reservation_status** : `active` → `consumed` (paiement confirmé) | `released`/`expired` (échec/expiration).
Une réservation `consumed` **ne peut pas** être libérée.

## Stratégie de stock (validée)

1. **À la création du checkout** : on réserve la quantité de façon **atomique**
   (`stock_reservations`, `active`, avec `expires_at`). Disponible à la vente
   = `stock` − somme des réservations `active`.
2. **Au webhook `checkout.session.completed` / paiement confirmé** : la réservation
   devient `consumed`, on **décrémente le stock physique une seule fois**, et on écrit
   un `inventory_movements` de type `sale`.
3. **Échec / expiration** : la réservation passe `released`/`expired`, le stock n'est
   **jamais** décrémenté.
4. **Remboursement** : procédure explicite et journalisée. On **ne remet pas**
   automatiquement en stock un article déjà expédié.

## Sécurité

- **RLS activée** sur toutes les tables.
- `anon` (public) : **lecture seule** des produits `published` et variantes `active`.
- Toutes les écritures et lectures sensibles passent par la clé **`service_role`**,
  **côté serveur uniquement**. Ne jamais exposer `service_role` au navigateur.

## Variables d'environnement (noms uniquement)

À définir dans Vercel au moment du déploiement (Phase 8) :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  *(serveur uniquement — jamais `NEXT_PUBLIC`)*
- `STRIPE_WEBHOOK_SECRET`

## Appliquer (plus tard, après validation)

```bash
# Option A — Supabase SQL Editor : coller le contenu de 0001_init.sql et exécuter.
# Option B — Supabase CLI :
supabase db push      # applique les migrations versionnées du dossier
```
