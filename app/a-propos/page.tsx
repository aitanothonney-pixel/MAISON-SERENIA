import type { Metadata } from 'next';
import { Modulable } from '@/components/a-propos/modulable';

export const metadata: Metadata = {
  alternates: { canonical: 'https://maison-serenia.com/a-propos' },
  title: 'Notre Histoire | MAISON SERENIA',
  description:
    "L'histoire de MAISON SERENIA, maison de design fondée à Genève : une sélection de mobilier sculptural et de pièces d'exception, pour composer un intérieur serein et plein de caractère.",
};

export default function AProposPage() {
  return <Modulable />;
}
