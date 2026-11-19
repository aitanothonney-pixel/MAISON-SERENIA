'use client';

import type { Product } from '@/lib/products';
import { BADGE_BUBBLE, PlancheCard, prixBubble, zoomDe } from '@/components/ui/planche-card';

// Carte d'une collection : la planche du produit, avec la même présentation que l'accueil.
// position : 'lcp' = première carte (chargée en priorité), 'eager' = visible dès l'ouverture, undefined = chargement différé
export function CollectionCard({ product, index, position }: { product: Product; index?: number; position?: 'lcp' | 'eager' }) {
  const isBubble = product.name.includes('Bubble');
  const prix = isBubble ? prixBubble(product.price) : { price: product.price, oldPrice: undefined };

  return (
    <PlancheCard
      product={product}
      index={index}
      price={prix.price}
      oldPrice={prix.oldPrice}
      badge={isBubble ? BADGE_BUBBLE : undefined}
      zoom={zoomDe(product.id)}
      chargement={position}
    />
  );
}
