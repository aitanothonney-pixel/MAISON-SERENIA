// ============================================================================
// Maison Serenia — Export du catalogue vers une migration SQL versionnée.
//
// Lit le catalogue statique (`lib/products.ts`) et génère :
//   • supabase/migrations/0003_seed_catalog.sql   (inserts idempotents)
//   • supabase/catalog-mapping.json               (ancien id → slug + SKU)
//
// La logique pure est dans scripts/catalog-lib.mjs (testée par Vitest).
//
// Règles (parité avec le site actuel) :
//   • price_cents = PRIX CATALOGUE (liste) en centimes CHF, AVANT remises
//     dynamiques (Bubble −30 %, packs, −10 % membre), ré-appliquées au paiement.
//   • AUCUN stock inventé : stock = 0, active = false, published = false.
//
// Ne touche AUCUNE base réelle : écrit seulement des fichiers.
// Rejouable : regénère des fichiers identiques pour un catalogue identique.
//
// Lancer :  npm run export:catalog       (Node ≥ 22.18, lecture TS native)
// ============================================================================

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildCatalog } from './catalog-lib.mjs';

const ROOT = new URL('../', import.meta.url);
const { products } = await import(new URL('lib/products.ts', ROOT).href);

const { items, productCount, variantCount } = buildCatalog(products);

// littéraux SQL
const sql = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const jsonb = (o) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`;

const productRows = items.map(
  (it) =>
    `  (${it.legacy_id}, ${sql(it.slug)}, ${sql(it.name)}, ${sql(it.description)}, ` +
    `${sql(it.category)}, ${jsonb(it.images)}, false)`,
);

const variantRows = items.flatMap((it) =>
  it.variants.map(
    (v) => `  (${it.legacy_id}, ${sql(v.sku)}, ${sql(v.option)}, ${sql(v.size)}, ${v.price_cents})`,
  ),
);

const stamp = new Date().toISOString().slice(0, 10);
const out = `-- ============================================================================
-- Maison Serenia — Migration 0003 : amorçage du catalogue (GÉNÉRÉ)
--
-- Généré par scripts/export-catalog.mjs à partir de lib/products.ts le ${stamp}.
-- NE PAS éditer à la main : relancer \`npm run export:catalog\`.
--
-- ${productCount} produits · ${variantCount} variantes.
-- price_cents = prix catalogue (liste) en centimes CHF, AVANT remises dynamiques
-- (Bubble −30 %, packs, −10 % membre restent appliqués au paiement).
-- stock = 0 et active = false partout : aucun stock inventé. La boutique
-- publique continue de lire lib/products.ts jusqu'à la bascule validée.
--
-- Idempotent : \`on conflict do nothing\` ne réécrase ni le stock ni l'état
-- « active » qu'un admin aurait réglés après l'amorçage.
-- ============================================================================

begin;

-- ── products ────────────────────────────────────────────────────────────────
insert into products (legacy_id, slug, name, description, category, images, published) values
${productRows.join(',\n')}
on conflict (legacy_id) do nothing;

-- ── product_variants ─────────────────────────────────────────────────────────
-- product_id est résolu depuis legacy_id. La première ligne (nulls typés) sert
-- d'ancrage de types pour VALUES et est éliminée par le join.
insert into product_variants
  (product_id, sku, option_label, legacy_size_label, price_cents, currency, stock, active)
select p.id, v.sku, v.option_label, v.legacy_size_label, v.price_cents, 'CHF', 0, false
from (values
  (null::int, null::text, null::text, null::text, null::int),
${variantRows.join(',\n')}
) as v(legacy_id, sku, option_label, legacy_size_label, price_cents)
join products p on p.legacy_id = v.legacy_id
on conflict (sku) do nothing;

commit;

-- Vérification attendue :
--   select count(*) from products;          -- ${productCount}
--   select count(*) from product_variants;  -- ${variantCount}
`;

const sqlPath = fileURLToPath(new URL('supabase/migrations/0003_seed_catalog.sql', ROOT));
const mapPath = fileURLToPath(new URL('supabase/catalog-mapping.json', ROOT));
writeFileSync(sqlPath, out);
writeFileSync(
  mapPath,
  JSON.stringify(
    {
      generated_at: stamp,
      source: 'lib/products.ts',
      products: productCount,
      variants: variantCount,
      items: items.map((it) => ({
        legacy_id: it.legacy_id,
        slug: it.slug,
        name: it.name,
        category: it.category,
        variants: it.variants,
      })),
    },
    null,
    2,
  ) + '\n',
);

// ─────────────────────────── rapport ───────────────────────────────────────
const byCat = {};
for (const it of items) byCat[it.category] = (byCat[it.category] ?? 0) + 1;
console.log('Catalogue exporté :');
console.log(`  produits : ${productCount}`);
console.log(`  variantes: ${variantCount}`);
console.log('  par catégorie :');
for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) console.log(`    ${c}: ${n}`);
console.log(`  → ${sqlPath.replace(fileURLToPath(ROOT), '')}`);
console.log(`  → ${mapPath.replace(fileURLToPath(ROOT), '')}`);
