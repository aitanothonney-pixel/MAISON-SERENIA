import { describe, expect, it } from 'vitest';
import { isSoldOut, SOLD_OUT_IDS } from '../lib/soldout';

describe('produits en rupture de stock', () => {
  it('le canapé d\'angle 3 places crème (87) est en rupture et non achetable', () => {
    expect(SOLD_OUT_IDS.has(87)).toBe(true);
    expect(isSoldOut(87)).toBe(true);
  });

  it('le meuble TV extensible noir (61) est en rupture et non achetable', () => {
    expect(SOLD_OUT_IDS.has(61)).toBe(true);
    expect(isSoldOut(61)).toBe(true);
  });

  it('les produits nouvellement ajoutés restent en vente', () => {
    expect(isSoldOut(141)).toBe(false);
    expect(isSoldOut(142)).toBe(false);
    expect(isSoldOut(143)).toBe(false);
  });
});
