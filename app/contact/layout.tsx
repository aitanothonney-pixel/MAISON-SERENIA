import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';
import { productInter, productInterTight } from '@/lib/product-fonts';

export const metadata = pageMetadata({
  title: 'Contact | Maison Serenia',
  description: "Contactez l'équipe Maison Serenia pour toute question sur nos collections, votre commande ou votre livraison.",
  path: '/contact',
});

export default function Layout({ children }: { children: ReactNode }) {
  // Page Contact : mêmes polices que la page « Notre histoire » (Inter Tight pour les titres, Inter pour le texte).
  return <div className={`pdp ${productInter.variable} ${productInterTight.variable}`}>{children}</div>;
}
