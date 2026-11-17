import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Retours et remboursements | Maison Serenia',
  description: 'Conditions de retour et de remboursement Maison Serenia : délais, démarches et contact du service client.',
  path: '/retours',
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
