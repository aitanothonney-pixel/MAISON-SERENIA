/**
 * Points cliquables posés sur les photos d'ambiance de l'accueil.
 * x et y sont en pourcentage de la photo (1672 × 941) : les points restent sur les meubles
 * à toutes les tailles d'écran, la photo étant recadrée sur ordinateur.
 * Pour déplacer un point, modifier x et y ; pour changer de produit, modifier productId.
 */
export interface HeroHotspot {
  productId: number;
  x: number;
  y: number;
}

// « Collection Bubble » : public/catalog/bubble-ambiance.webp
export const BUBBLE_HERO_HOTSPOTS: HeroHotspot[] = [
  { productId: 10, x: 44, y: 76 }, // canapé Bubble blanc
  { productId: 2, x: 91, y: 76 }, // fauteuil Bubble blanc
  { productId: 133, x: 71, y: 86 }, // table basse ronde : correspondance approchée
  { productId: 60, x: 80, y: 66 }, // buffet à lames : correspondance approchée
];

// « Notre service conseil » : public/catalog/mon-interieur-ia-salon-clair.webp
export const CONSEIL_HERO_HOTSPOTS: HeroHotspot[] = [
  { productId: 100, x: 28, y: 86 }, // canapé d'angle : correspondance approchée
  { productId: 61, x: 82, y: 62 }, // meuble TV noir
  { productId: 81, x: 63, y: 73 }, // table basse à plateau marbre : correspondance approchée
  { productId: 66, x: 90, y: 75 }, // table d'appoint ronde
];
