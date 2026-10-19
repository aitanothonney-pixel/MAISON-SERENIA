// ============================================================================
// Logique PURE de construction du catalogue (testable, sans I/O ni SQL).
// Utilisée par scripts/export-catalog.mjs et par les tests.
// ============================================================================

export const stripDiacritics = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');

// slug produit : minuscules, sans accents, alphanumérique + tirets
export const toSlug = (s) =>
  stripDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'produit';

// code SKU d'une option : MAJUSCULES, sans accents, '×'/'·' lisibles
export const toSkuCode = (s) =>
  stripDiacritics(s)
    .replace(/[×x]/gi, 'X')
    .replace(/·/g, '-')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'OPT';

export const cents = (n) => Math.round(Number(n) * 100);

/**
 * Construit la représentation catalogue à partir du tableau `products`.
 * Pur et déterministe. Lève si un SKU se retrouve en double.
 * @returns { items, productCount, variantCount }
 *   items[i] = { legacy_id, slug, name, description, category, images,
 *                variants:[{ sku, option, size, price_cents }] }
 */
export function buildCatalog(products) {
  const slugSeen = new Map();
  const skuSeen = new Set();
  const items = [];
  let variantCount = 0;

  for (const p of products) {
    // slug unique (1re occurrence garde le slug propre)
    let slug = toSlug(p.name);
    const n = (slugSeen.get(slug) ?? 0) + 1;
    slugSeen.set(slug, n);
    if (n > 1) slug = `${slug}-${p.id}`;

    const sized = Array.isArray(p.sizes) && p.sizes.length > 0;
    const rawVariants = sized
      ? p.sizes.map((s) => ({ option: s.label, size: s.label, price: s.price }))
      : [{ option: 'Default', size: null, price: p.price }];

    const codeSeen = new Map();
    const variants = [];
    for (const v of rawVariants) {
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
      variants.push({ sku, option: v.option, size: v.size, price_cents: cents(v.price) });
      variantCount++;
    }

    items.push({
      legacy_id: p.id,
      slug,
      name: p.name,
      description: p.description,
      category: p.category,
      images: p.images ?? [],
      variants,
    });
  }

  return { items, productCount: items.length, variantCount };
}
