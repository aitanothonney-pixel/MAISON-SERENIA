import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FAQ | Maison Serenia',
  description: 'Livraison, retours, paiement et commandes : les réponses aux questions fréquentes sur Maison Serenia.',
  path: '/faq',
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
