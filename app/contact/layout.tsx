import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact | Maison Serenia',
  description: "Contactez l'équipe Maison Serenia pour toute question sur nos collections, votre commande ou votre livraison.",
  path: '/contact',
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
