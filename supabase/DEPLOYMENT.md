# Déploiement — Maison Serenia (inventaire + commandes)

Mise en service de la base de données (Phases 3 → 7). **Rien n'est automatique** :
chaque étape se fait à la main, avec sauvegarde et possibilité de revenir en
arrière. Tant que les variables d'environnement ne sont pas posées, **le code
reste dormant** et la boutique fonctionne exactement comme aujourd'hui.

> ✅ Les 4 migrations ont été validées sur un PostgreSQL 16 local jetable :
> application dans l'ordre, 86 produits / 343 variantes, réservation
> atomique, refus de survente, consommation unique, RLS (anon ne voit que
> l'actif/publié, `orders` protégée). Aucune base réelle n'a été touchée.

---

## Principe de bascule (sans risque)

1. La boutique publique lit toujours `lib/products.ts`. Elle ne dépend **pas**
   de la base pour vendre.
2. La base sert d'abord à **persister les commandes** et à **suivre le stock**.
3. Le suivi de stock est **opt-in par variante** (`active`). Tant qu'une variante
   est `active = false`, elle se vend **sans limite** (comportement actuel).
4. Donc : on peut tout brancher en production **sans rien bloquer**, puis activer
   le stock produit par produit, à ton rythme.

---

## Étape 1 — Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com) → **New project** (région **EU**, ex. Francfort).
2. Noter : **Project URL**, clé **anon**, clé **service_role** (Settings → API).
3. Dans Settings → Database, activer les **sauvegardes** (Point-in-Time Recovery
   si disponible). Un projet neuf est vide : la vraie sauvegarde protège les
   commandes qui arriveront ensuite.

## Étape 2 — Appliquer les migrations (dans l'ordre)

Option A — **SQL Editor** (coller puis exécuter, un fichier après l'autre) :

```
supabase/migrations/0001_init.sql
supabase/migrations/0002_stock_functions.sql
supabase/migrations/0003_seed_catalog.sql
supabase/migrations/0004_admin_functions.sql
```

Option B — **Supabase CLI** : `supabase link` puis `supabase db push`.

**Vérification** (attendu : 86 et 343) :

```sql
select count(*) from products;          -- 86
select count(*) from product_variants;  -- 343
```

## Étape 3 — Variables d'environnement (Vercel)

Settings → Environment Variables (Preview **et** Production), puis **redeploy** :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service_role — **jamais** `NEXT_PUBLIC` |
| `STRIPE_WEBHOOK_SECRET` | voir Étape 4 |
| `ADMIN_PASSWORD` | (déjà présent) accès `/gestion` |
| `ADMIN_SESSION_SECRET` | optionnel — chaîne aléatoire longue |

> Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté navigateur ni la coller
> dans un ticket, un commit ou une capture d'écran.

## Étape 4 — Webhook Stripe

1. Stripe → Developers → **Webhooks** → Add endpoint :
   `https://<ton-domaine>/api/stripe/webhook`
2. Événements : `checkout.session.completed`, `checkout.session.expired`,
   `charge.refunded` (et si utilisés : `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`).
3. Copier le **Signing secret** → variable `STRIPE_WEBHOOK_SECRET` (Étape 3) → redeploy.
4. Test : Stripe CLI `stripe listen --forward-to .../api/stripe/webhook`, ou un
   paiement en **mode test**.

## Étape 5 — Planifier le nettoyage des réservations

Supabase → Database → **Cron** (pg_cron) ou un planificateur, toutes les 15 min :

```sql
select cleanup_expired_reservations();
```

## Étape 6 — Tests de fumée (mode test Stripe)

1. Passer une commande test de bout en bout.
2. `/gestion/commandes` → la commande apparaît (**source : base de données**),
   statut modifiable (préparée / expédiée + transporteur + suivi).
3. Activer le stock d'une variante dans `/gestion/stock` (cocher « géré »,
   mettre une quantité). Repasser une commande : le stock **diminue une fois**.
4. Mettre une variante « gérée » à **0** et vérifier que l'achat affiche
   « stock insuffisant » (les variantes non gérées restent vendables sans limite).
5. Rejouer le même événement webhook depuis Stripe : **aucune commande en double**
   (idempotence).

## Étape 7 — Activation progressive

Pour chaque produit dont tu veux suivre le stock : `/gestion/stock` → saisir la
quantité réelle, cocher « géré ». Les autres restent vendables sans limite.
**N'active jamais un stock que tu n'as pas vérifié.**

---

## Retour arrière (rollback)

- **Immédiat, sans perte** : supprimer les variables Supabase dans Vercel +
  redeploy → le code redevient dormant (catalogue statique, admin en lecture
  Stripe). La boutique vend comme avant.
- **Désactiver le suivi d'un produit** : décocher « géré » dans `/gestion/stock`.
- **Webhook** : désactiver l'endpoint dans Stripe.
- **Base** : les migrations sont additives. Pour tout retirer (projet de test) :
  `drop function if exists reserve_stock, release_reservation, consume_reservation,
  cleanup_expired_reservations, set_variant_stock;` puis `drop table …`. Ne jamais
  faire cela sur une base contenant de vraies commandes sans sauvegarde.

## Mise en production du code

Le code de cette mission est sur la branche de **développement/préversion**.
Le passage en production (fusion vers la branche de prod) se fait **uniquement
avec ton accord explicite** — il n'est pas automatique.
