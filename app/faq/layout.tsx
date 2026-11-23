import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';
import { productInter, productInterTight } from '@/lib/product-fonts';

export const metadata = pageMetadata({
  title: 'FAQ | Maison Serenia',
  description: 'Livraison, retours, paiement et commandes : les réponses aux questions fréquentes sur Maison Serenia.',
  path: '/faq',
});

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={`pdp ${productInter.variable} ${productInterTight.variable}`}>{children}</div>;
}
