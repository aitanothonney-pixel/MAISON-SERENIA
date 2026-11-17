import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Commande confirmée | Maison Serenia',
  description: 'Merci pour votre commande Maison Serenia.',
  path: '/commande/succes',
  noindex: true,
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
