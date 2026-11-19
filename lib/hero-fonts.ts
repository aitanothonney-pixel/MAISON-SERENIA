import { Marcellus, Raleway } from 'next/font/google';

// Polices du hero d'accueil (version 8) : Marcellus pour le titre, Raleway pour les textes courts
// (accroche, boutons, réassurance, indication de défilement). Elles ne sont chargées que par le hero
// (voir app/page.tsx). Le préchargement est désactivé pour ne pas concurrencer la photo (LCP).
export const heroMarcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hero-titre',
  display: 'swap',
  preload: false,
});

export const heroRaleway = Raleway({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-hero-texte',
  display: 'swap',
  preload: false,
});
