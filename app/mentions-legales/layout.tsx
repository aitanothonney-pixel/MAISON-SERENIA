import type { ReactNode } from 'react';
import { productInter, productInterTight } from '@/lib/product-fonts';

// Pages d'information : mêmes polices que la page « Notre histoire » (Inter Tight pour les titres, Inter pour le texte).
export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`pdp ${productInter.variable} ${productInterTight.variable}`}>{children}</div>;
}
