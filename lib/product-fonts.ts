import { Inter, Inter_Tight } from 'next/font/google';

// Polices du site : Inter Tight pour les titres et les prix, Inter pour le texte.
// Elles sont chargées sur toutes les pages. Le préchargement est désactivé pour ne pas
// concurrencer la photo principale de la fiche produit dans le chargement initial (LCP).
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
