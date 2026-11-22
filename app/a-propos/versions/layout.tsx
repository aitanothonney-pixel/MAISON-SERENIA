import type { ReactNode } from 'react';
import { productInter, productInterTight } from '@/lib/product-fonts';

// Aperçus de la page « Notre histoire » : mêmes polices que la fiche produit
// (Inter Tight pour les titres, Inter pour le texte).
export default function VersionsLayout({ children }: { children: ReactNode }) {
  return <div className={`pdp ${productInter.variable} ${productInterTight.variable}`}>{children}</div>;
}
