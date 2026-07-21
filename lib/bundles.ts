import { products } from './products';

export interface Bundle {
  slug: string;
  color: string;
  canapeId: number;
  fauteuilId: number;
  figurineId: number;
  rabais: number;
}

export const BUNDLE_PRICE = 1900;

export const BUNDLES: Bundle[] = [
  { slug: 'blanc', color: 'Blanc', canapeId: 10, fauteuilId: 2, figurineId: 39, rabais: 175 },
  { slug: 'bleu', color: 'Bleu', canapeId: 13, fauteuilId: 6, figurineId: 31, rabais: 175 },
  { slug: 'rouge', color: 'Rouge', canapeId: 22, fauteuilId: 8, figurineId: 36, rabais: 200 },
];

export function getBundle(slug: string): Bundle | undefined {
  return BUNDLES.find((b) => b.slug === slug);
}

// Détail calculé d'un pack (produits + prix)
export function getBundleDetail(slug: string) {
  const bundle = getBundle(slug);
  if (!bundle) return undefined;
  const canape = products.find((p) => p.id === bundle.canapeId);
  const fauteuil = products.find((p) => p.id === bundle.fauteuilId);
  const figurine = products.find((p) => p.id === bundle.figurineId);
  if (!canape || !fauteuil || !figurine) return undefined;
  const canapePromo = Math.round(canape.price * 0.7);
  const fauteuilPromo = Math.round(fauteuil.price * 0.7);
  const sum = canapePromo + fauteuilPromo + figurine.price;
  return { bundle, canape, fauteuil, figurine, canapePromo, fauteuilPromo, sum, price: BUNDLE_PRICE };
}
