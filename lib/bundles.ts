import { products } from './products';

export interface Bundle {
  slug: string;
  color: string;
  canapeId: number;
  fauteuilId: number;
  rabais: number;
}

export const BUNDLE_PRICE = 1900;
// Tableau offert avec chaque ensemble (taille 50×70 cm)
export const GIFT_TABLEAU_ID = 103;
export const GIFT_TABLEAU_SIZE = '50×70 cm';
export const GIFT_TABLEAU_PRICE = 80;

export const BUNDLES: Bundle[] = [
  { slug: 'blanc', color: 'Blanc', canapeId: 10, fauteuilId: 2, rabais: 175 },
  { slug: 'bleu', color: 'Bleu', canapeId: 13, fauteuilId: 6, rabais: 175 },
  { slug: 'rouge', color: 'Rouge', canapeId: 22, fauteuilId: 8, rabais: 200 },
];

export function getBundle(slug: string): Bundle | undefined {
  return BUNDLES.find((b) => b.slug === slug);
}

// Détail calculé d'un ensemble (produits + prix), avec tableau 50×70 offert.
export function getBundleDetail(slug: string) {
  const bundle = getBundle(slug);
  if (!bundle) return undefined;
  const canape = products.find((p) => p.id === bundle.canapeId);
  const fauteuil = products.find((p) => p.id === bundle.fauteuilId);
  const gift = products.find((p) => p.id === GIFT_TABLEAU_ID);
  if (!canape || !fauteuil || !gift) return undefined;
  const canapePromo = Math.round(canape.price * 0.7);
  const fauteuilPromo = Math.round(fauteuil.price * 0.7);
  const sum = canapePromo + fauteuilPromo + GIFT_TABLEAU_PRICE;
  return { bundle, canape, fauteuil, gift, canapePromo, fauteuilPromo, sum, price: BUNDLE_PRICE };
}
