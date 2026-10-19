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
| `0002_*` (à venir) | Fonctions atomiques réservation → vente (Phase 4/5) |

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
