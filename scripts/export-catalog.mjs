// ============================================================================
// Maison Serenia — Export du catalogue vers une migration SQL versionnée.
//
// Lit le catalogue statique (`lib/products.ts`) et génère :
//   • supabase/migrations/0003_seed_catalog.sql   (inserts idempotents)
//   • supabase/catalog-mapping.json               (ancien id → slug + SKU)
//
// Règles (parité avec le site actuel) :
//   • price_cents = PRIX CATALOGUE (liste) en centimes CHF, c.-à-d. le prix de
//     base du produit / de la taille AVANT remises dynamiques. Les remises
//     (Bubble −30 %, packs 1900.-, tableau offert, −10 % membre) restent des
//     règles appliquées au paiement (voir app/api/checkout/route.ts) et seront
//     ré-appliquées en Phase 4/5 à partir de ce prix de base.
//   • Une variante vendable = (produit, option de panier). legacy_size_label
//     correspond au champ `size` du panier (null = produit sans option).
//   • AUCUN stock inventé : tout démarre stock = 0 et active = false.
//     La boutique publique continue de lire lib/products.ts jusqu'à bascule.
//
// Ne touche AUCUNE base réelle : écrit seulement des fichiers.
// Rejouable : regénère des fichiers identiques pour un catalogue identique.
//
// Lancer :  npm run export:catalog       (Node ≥ 22.18, lecture TS native)
// ============================================================================

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const { products } = await import(new URL('lib/products.ts', ROOT).href);

// ─────────────────────────── utilitaires ───────────────────────────────────
const stripDiacritics = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// slug produit : minuscules, sans accents, alphanumérique + tirets
const toSlug = (s) =>
  stripDiacritics(String(s))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'produit';

// code SKU d'une option : MAJUSCULES, sans accents, '×'/'·' lisibles
const toSkuCode = (s) =>
  stripDiacritics(String(s))
    .replace(/[×x]/gi, 'X')
    .replace(/·/g, '-')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'OPT';

// littéraux SQL
const sql = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const jsonb = (o) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`;
const cents = (n) => Math.round(Number(n) * 100);

// ─────────────────────────── construction ──────────────────────────────────
const slugSeen = new Map();
const skuSeen = new Set();
const productRows = [];
const variantRows = [];
const mapping = [];
let variantCount = 0;

for (const p of products) {
  // slug produit unique (déterministe : 1re occurrence garde le slug propre)
  let slug = toSlug(p.name);
  const n = (slugSeen.get(slug) ?? 0) + 1;
  slugSeen.set(slug, n);
  if (n > 1) slug = `${slug}-${p.id}`;

  productRows.push(
    `  (${p.id}, ${sql(slug)}, ${sql(p.name)}, ${sql(p.description)}, ` +
      `${sql(p.category)}, ${jsonb(p.images ?? [])}, false)`,
  );

  // variantes : une par taille, sinon une variante « Default » sans option
  const sized = Array.isArray(p.sizes) && p.sizes.length > 0;
  const variants = sized
    ? p.sizes.map((s) => ({ option: s.label, size: s.label, price: s.price }))
    : [{ option: 'Default', size: null, price: p.price }];

  const codeSeen = new Map();
  const mapVariants = [];
  for (const v of variants) {
    let sku = `P${p.id}`;
    if (v.size !== null) {
      let code = toSkuCode(v.option);
      const c = (codeSeen.get(code) ?? 0) + 1;
      codeSeen.set(code, c);
      if (c > 1) code = `${code}-${c}`;
      sku = `P${p.id}-${code}`;
    }
    if (skuSeen.has(sku)) throw new Error(`SKU en double: ${sku}`);
    skuSeen.add(sku);

    variantRows.push(
      `  (${p.id}, ${sql(sku)}, ${sql(v.option)}, ${sql(v.size)}, ${cents(v.price)})`,
    );
    mapVariants.push({ sku, option: v.option, size: v.size, price_cents: cents(v.price) });
    variantCount++;
  }

  mapping.push({ legacy_id: p.id, slug, name: p.name, category: p.category, variants: mapVariants });
}

// ─────────────────────────── SQL généré ────────────────────────────────────
const stamp = new Date().toISOString().slice(0, 10);
const out = `-- ============================================================================
-- Maison Serenia — Migration 0003 : amorçage du catalogue (GÉNÉRÉ)
--
-- Généré par scripts/export-catalog.mjs à partir de lib/products.ts le ${stamp}.
-- NE PAS éditer à la main : relancer \`npm run export:catalog\`.
--
-- ${mapping.length} produits · ${variantCount} variantes.
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
--   select count(*) from products;          -- ${mapping.length}
--   select count(*) from product_variants;  -- ${variantCount}
`;

const sqlPath = fileURLToPath(new URL('supabase/migrations/0003_seed_catalog.sql', ROOT));
const mapPath = fileURLToPath(new URL('supabase/catalog-mapping.json', ROOT));
writeFileSync(sqlPath, out);
writeFileSync(
  mapPath,
  JSON.stringify(
    { generated_at: stamp, source: 'lib/products.ts', products: mapping.length, variants: variantCount, items: mapping },
    null,
    2,
  ) + '\n',
);

// ─────────────────────────── rapport ───────────────────────────────────────
const byCat = {};
for (const m of mapping) byCat[m.category] = (byCat[m.category] ?? 0) + 1;
console.log('Catalogue exporté :');
console.log(`  produits : ${mapping.length}`);
console.log(`  variantes: ${variantCount}`);
console.log('  par catégorie :');
for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) console.log(`    ${c}: ${n}`);
console.log(`  → ${sqlPath.replace(fileURLToPath(ROOT), '')}`);
console.log(`  → ${mapPath.replace(fileURLToPath(ROOT), '')}`);
