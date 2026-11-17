import type { Metadata } from 'next';
import NotFoundContent from '@/components/ui/not-found-content';

export const metadata: Metadata = {
  title: 'Page introuvable | Maison Serenia',
  description: "Cette page n'existe pas ou n'est plus disponible. Découvrez les collections Maison Serenia.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
