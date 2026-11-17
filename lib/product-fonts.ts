import { Inter, Inter_Tight } from 'next/font/google';

// Polices de la fiche produit (mise en page V2) : Inter Tight pour les titres et
// les prix, Inter pour le texte. Elles ne sont chargées que par les fiches produit
// (voir app/products/[id]/page.tsx). Le préchargement est désactivé pour ne pas
// concurrencer la photo principale dans le chargement initial (LCP).
export const productInter = Inter({
  subsets: ['latin'],
  variable: '--font-pdp-inter',
  display: 'swap',
  preload: false,
});

export const productInterTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-pdp-inter-tight',
  display: 'swap',
  preload: false,
});
