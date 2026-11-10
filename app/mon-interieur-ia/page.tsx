import type { Metadata } from 'next';
import Assistant from './assistant';

export const metadata: Metadata = {
  title: 'Mon Intérieur IA — Conseiller déco | MAISON SERENIA',
  description:
    "Décrivez votre espace, vos envies et vos dimensions : notre assistant IA vous recommande les meubles et accessoires MAISON SERENIA adaptés à votre intérieur, parmi notre collection réelle.",
  alternates: { canonical: 'https://maison-serenia.com/mon-interieur-ia' },
  openGraph: {
    title: 'Mon Intérieur IA — Conseiller déco MAISON SERENIA',
    description: "Un conseiller déco intelligent qui recommande les bonnes pièces de notre collection selon votre espace, votre style et votre budget.",
    type: 'website',
    url: 'https://maison-serenia.com/mon-interieur-ia',
  },
};

export default function MonInterieurIaPage() {
  return <Assistant />;
}
