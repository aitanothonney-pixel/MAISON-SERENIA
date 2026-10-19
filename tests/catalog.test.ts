import { describe, it, expect } from 'vitest';
// @ts-expect-error — module .mjs sans déclaration de types
import { buildCatalog, toSlug, toSkuCode, cents } from '../scripts/catalog-lib.mjs';
import { products } from '../lib/products';

describe('catalog-lib — helpers', () => {
  it('toSlug : minuscules, sans accents, tirets', () => {
    expect(toSlug('Fauteuil Bubble blanc')).toBe('fauteuil-bubble-blanc');
    expect(toSlug('Vase décoratif — résine OR')).toBe('vase-decoratif-resine-or');
  });
  it('toSkuCode : MAJUSCULES, gère × et ·', () => {
    expect(toSkuCode('Noir')).toBe('NOIR');
    expect(toSkuCode('Amber · 5 têtes')).toBe('AMBER-5-TETES');
    expect(toSkuCode('50×70 cm')).toBe('50X70-CM');
  });
  it('cents : conversion CHF → centimes', () => {
    expect(cents(549)).toBe(54900);
    expect(cents(4.9)).toBe(490);
  });
});

describe('buildCatalog(products)', () => {
  const { items, productCount, variantCount } = buildCatalog(products);

  it('compte produits et variantes', () => {
    expect(productCount).toBe(products.length);
    expect(productCount).toBeGreaterThan(0);
    expect(variantCount).toBe(items.reduce((s: number, i: { variants: unknown[] }) => s + i.variants.length, 0));
  });

  it('SKU uniques', () => {
    const skus = items.flatMap((i: { variants: { sku: string }[] }) => i.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });

  it('slugs uniques', () => {
    const slugs = items.map((i: { slug: string }) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('prix en centimes entiers ≥ 0', () => {
    for (const it of items as { variants: { price_cents: number }[] }[]) {
      for (const v of it.variants) {
        expect(Number.isInteger(v.price_cents)).toBe(true);
        expect(v.price_cents).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('fige le prix LISTE : Bubble non remisé en base (−30 % au paiement)', () => {
    const p2 = items.find((i: { legacy_id: number }) => i.legacy_id === 2);
    expect(p2?.variants[0]).toMatchObject({ sku: 'P2', price_cents: 78900 });
  });

  it('variante à options : legacy_size_label (size) présent', () => {
    const p137 = items.find((i: { legacy_id: number }) => i.legacy_id === 137);
    expect(p137?.variants.map((v: { sku: string }) => v.sku)).toContain('P137-ARGENT');
    expect(p137?.variants.every((v: { size: string | null }) => v.size !== null)).toBe(true);
  });
});
