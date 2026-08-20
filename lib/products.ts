export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  dimensions: string;
  material: string;
  details: string[];
}

export interface ProductVariant {
  productId: number;
  color: string;
  colorHex: string;
}

export const variantGroups: Record<string, ProductVariant[]> = {
  'figurine-kaws-monde': [
    { productId: 31, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 32, color: 'Gris', colorHex: '#9e9e9e' },
  ],
  'canape-bubble': [
    { productId: 10, color: 'Blanc', colorHex: '#f0ede8' },
    { productId: 13, color: 'Bleu', colorHex: '#1a2fad' },
    { productId: 22, color: 'Rouge', colorHex: '#c0392b' },
    { productId: 12, color: 'Violet', colorHex: '#6b3fa0' },
  ],
  'fauteuil-bubble': [
    { productId: 2, color: 'Blanc', colorHex: '#f0ede8' },
    { productId: 6, color: 'Bleu', colorHex: '#1a2fad' },
    { productId: 8, color: 'Rouge', colorHex: '#c0392b' },
    { productId: 7, color: 'Vert', colorHex: '#4a7c59' },
    { productId: 9, color: 'Orange', colorHex: '#d4622a' },
  ],
  'table-manger-ovale': [
    { productId: 63, color: 'Dark Brown', colorHex: '#5a3a24' },
    { productId: 62, color: 'Light Brown', colorHex: '#c19a6b' },
  ],
  'table-appoint-double': [
    { productId: 66, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 67, color: 'Blanc', colorHex: '#ece7de' },
    { productId: 65, color: 'Vert', colorHex: '#8aa876' },
  ],
  'sculpture-resine': [
    { productId: 70, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 69, color: 'Bleu', colorHex: '#4a6b8a' },
  ],
  'vase-ceramique-duo': [
    { productId: 72, color: 'Blanc', colorHex: '#ece7de' },
    { productId: 73, color: 'Noir', colorHex: '#1a1a1a' },
  ],
  'table-ovale-vintage': [
    { productId: 79, color: 'Brun', colorHex: '#6b4a30' },
    { productId: 80, color: 'Gris', colorHex: '#9e9e9e' },
  ],
  'table-gigognes-lot2': [
    { productId: 84, color: 'Blanc', colorHex: '#ece7de' },
    { productId: 85, color: 'Brun', colorHex: '#6b4a30' },
    { productId: 86, color: 'Blanc doré', colorHex: '#d9c9a3' },
  ],
  'canape-lit-modulaire': [
    { productId: 89, color: 'Vert', colorHex: '#4a5d4a' },
    { productId: 90, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 91, color: 'Beige', colorHex: '#d8c8a8' },
    { productId: 92, color: 'Bleu', colorHex: '#2d3a6b' },
  ],
  'canape-sectionnel-u': [
    { productId: 94, color: 'Gris foncé', colorHex: '#3a3a3a' },
    { productId: 95, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 96, color: 'Gris clair', colorHex: '#b3b3b3' },
    { productId: 97, color: 'Beige', colorHex: '#d8c8a8' },
    { productId: 98, color: 'Brun', colorHex: '#6b4a30' },
    { productId: 99, color: 'Vert', colorHex: '#4a5d4a' },
  ],
};

// Regroupe les variantes non-Bubble (ventilateur, bracelet, table) en une seule
// carte dans les listes. Les produits Bubble restent affichés par couleur.
export function collapseVariantDuplicates(list: Product[]): Product[] {
  return list.filter((p) => {
    if (p.name.includes('Bubble')) return true;
    const grp = getVariantGroup(p.id);
    if (grp) {
      // On ne garde que le représentant du groupe (le premier)
      return p.id === grp[0].productId;
    }
    return true;
  });
}

export function getVariantGroup(productId: number): ProductVariant[] | null {
  for (const group of Object.values(variantGroups)) {
    if (group.some((v) => v.productId === productId)) return group;
  }
  return null;
}

const rawProducts: Product[] = [
  // ── Bubble Blanc ─────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Fauteuil Bubble blanc',
    category: 'Salon',
    price: 713,
    description: 'Le Fauteuil Bubble en version blanc immaculé — une silhouette sculpturale aux formes généreuses et organiques. Confort enveloppant, esthétique contemporaine, présence forte dans tout intérieur.',
    images: [
      'https://i.ibb.co/Fk1YZvkY/IMG-2568.jpg',
      'https://i.ibb.co/NdBTdp4B/IMG-2567.jpg',
      'https://i.ibb.co/tPsrFXWs/IMG-2566.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu structuré, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu résistant haute qualité', 'Base laquée blanc mat', 'Livraison en blanc incluse'],
  },
  {
    id: 10,
    name: 'Canapé Bubble blanc',
    category: 'Salon',
    price: 2143,
    description: 'Le Canapé Bubble 3 places en blanc crème immaculé — silhouette sculpturale et enveloppante, tissu bouclé doux au toucher. Une pièce maîtresse qui transforme instantanément votre salon.',
    images: [
      'https://i.ibb.co/wZRJYt6F/IMG-5364.jpg',
      'https://i.ibb.co/mV8MC19X/IMG-2541.jpg',
      'https://i.ibb.co/j9h5SNVC/IMG-2392.jpg',
    ],
    dimensions: 'L 220 × P 105 × H 80 cm',
    material: 'Tissu bouclé, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu bouclé doux haute résilience', 'Base laquée blanc mat', 'Livraison en blanc incluse'],
  },
  // ── Bubble Bleu ──────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Fauteuil Bubble bleu',
    category: 'Salon',
    price: 713,
    description: 'Le Fauteuil Bubble dans un bleu Klein intense et vibrant — une déclaration artistique autant qu\'une invitation au confort absolu. Texture unique en maille 3D structurée.',
    images: [
      'https://i.ibb.co/j941fSYQ/9-E1-B62-F9-998-D-4476-AE71-C8-C6-E2831-AC1.jpg',
      'https://i.ibb.co/Z1HkzsfN/IMG-2553.jpg',
      'https://i.ibb.co/x8LZvMgv/IMG-2565.jpg',
      'https://i.ibb.co/rR0zYMWg/IMG-0932.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée bleu nuit', 'Livraison en blanc incluse'],
  },
  {
    id: 13,
    name: 'Canapé Bubble bleu',
    category: 'Salon',
    price: 2143,
    description: 'Le Canapé Bubble 3 places en bleu Klein intense — une présence sculpturale et chromatique forte. Texture maille 3D signature, assise généreuse et enveloppante.',
    images: [
      'https://i.ibb.co/R1tJYDf/IMG-2491.jpg',
      'https://i.ibb.co/tMbZ7D3Y/IMG-0586.jpg',
      'https://i.ibb.co/QjXv6K98/IMG-0930.jpg',
    ],
    dimensions: 'L 225 × P 105 × H 80 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée bleu nuit', 'Livraison en blanc incluse'],
  },
  // ── Bubble Rouge ─────────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Fauteuil Bubble rouge',
    category: 'Salon',
    price: 713,
    description: 'Le Fauteuil Bubble dans un rouge vif et audacieux — énergie, caractère et confort sculptural réunis. Une pièce iconique qui s\'impose dès le premier regard dans votre salon.',
    images: [
      'https://i.ibb.co/7Jc2Rvd8/IMG-5360.jpg',
      'https://i.ibb.co/Cs8CPTX4/IMG-2558.jpg',
      'https://i.ibb.co/5XbbZ7DH/IMG-2563.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée rouge mat', 'Livraison en blanc incluse'],
  },
  {
    id: 22,
    name: 'Canapé Bubble rouge',
    category: 'Salon',
    price: 2143,
    description: 'Le Canapé Bubble 3 places en rouge vif et ardent — énergie, caractère et confort sculptural. Une pièce iconique qui s\'impose avec force dans votre espace de vie.',
    images: [
      'https://i.ibb.co/xSV6MBVx/47-B09888-A4-A8-44-E7-A80-D-7-E1-D7-BDDF6-ED.png',
      'https://i.ibb.co/Kx5RnfCy/IMG-2542.jpg',
      'https://i.ibb.co/99H4L0sP/IMG-2616.jpg',
    ],
    dimensions: 'L 225 × P 105 × H 80 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée rouge mat', 'Livraison en blanc incluse'],
  },
  // ── Bubble Violet ────────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'Canapé Bubble violet spécial',
    category: 'Salon',
    price: 2143,
    description: 'Le Canapé Bubble 3 places dans un violet prune intense et vibrant — une édition spéciale aux proportions généreuses. Texture maille 3D unique, confort sculptural signature.',
    images: [
      'https://i.ibb.co/My8fK90B/IMG-2525.jpg',
      'https://i.ibb.co/yBk1BSq4/IMG-2659.jpg',
      'https://i.ibb.co/DfjGtFm8/IMG-2526.jpg',
      'https://i.ibb.co/MksNPSck/IMG-2527.jpg',
    ],
    dimensions: 'L 230 × P 105 × H 80 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Édition spéciale coloris prune', 'Tissu maille 3D haute résilience', 'Base laquée violet mat', 'Livraison en blanc incluse'],
  },
  // ── Bubble Vert ──────────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Fauteuil Bubble vert',
    category: 'Salon',
    price: 713,
    description: 'Le Fauteuil Bubble dans un vert pistache lumineux — douceur organique et présence végétale. Même confort sculpturale signature, dans une teinte qui renouvelle l\'intérieur.',
    images: [
      'https://i.ibb.co/0pnzSpFV/IMG-2557.jpg',
      'https://i.ibb.co/nMm0vSZz/IMG-2552.jpg',
      'https://i.ibb.co/99RwzY1n/IMG-2534.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée vert mat', 'Livraison en blanc incluse'],
  },
  // ── Bubble Orange ────────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Fauteuil Bubble orange',
    category: 'Salon',
    price: 713,
    description: 'Le Fauteuil Bubble dans un orange soleil audacieux — même silhouette sculpturale, même confort enveloppant, avec une couleur qui illumine instantanément votre intérieur.',
    images: [
      'https://i.ibb.co/xQ4XWSy/IMG-2530.jpg',
      'https://i.ibb.co/mCyQ2HWm/IMG-2560.jpg',
      'https://i.ibb.co/Jwd6qRVm/IMG-2559.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu structuré, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu résistant haute qualité', 'Base laquée orange mat', 'Livraison en blanc incluse'],
  },
  // ── Décorations KAWS Monde ─────────────────────────────────────────────────────
  {
    id: 31,
    name: 'Figurine KAWS noir monde',
    category: 'Décorations',
    price: 75,
    description: 'Figurine KAWS édition Monde en coloris noir intense — une pièce collector incontournable. Sculpture en vinyle premium, finition mate impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/r1YNwbR/IMG-0657.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition Monde collector', 'Vinyle premium finition mate', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  {
    id: 32,
    name: 'Figurine KAWS gris monde',
    category: 'Décorations',
    price: 75,
    description: 'Figurine KAWS édition Monde en coloris gris — subtilité et caractère dans une même pièce. Sculpture en vinyle premium, finition soyeuse, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/dss1k9Yf/IMG-0626.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition Monde collector', 'Vinyle premium finition soyeuse', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Figurine KAWS Noir ────────────────────────────────────────────────────────
  {
    id: 34,
    name: 'Figurine Kaws noir (28 cm)',
    category: 'Décorations',
    price: 75,
    description: 'Figurine KAWS en coloris noir intense — pièce collector incontournable. Sculpture en vinyle premium, finition mate impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/4Zy6w7XR/E307812-D-5-A20-4-AF5-A8-BC-48-EEA34-EB12-B.jpg',
      'https://i.ibb.co/4Z9wfJJb/6306-D2-ED-20-EC-42-E8-8266-013-CAE098-AAD.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition collector', 'Vinyle premium finition mate', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Bearbrick x Bape ─────────────────────────────────────────────────────────
  {
    id: 35,
    name: 'Bearbrick x Bape (28 cm)',
    category: 'Décorations',
    price: 150,
    description: 'Bearbrick x A Bathing Ape — collaboration iconique entre deux géants du streetwear et du art toy. Pièce collector en vinyle premium, finition impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/212j4PLX/IMG-0662.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Collaboration Bearbrick × Bape', 'Vinyle premium finition mate', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Bearbrick x Bape Rose ─────────────────────────────────────────────────────
  {
    id: 36,
    name: 'Bearbrick x Bape rose (28 cm)',
    category: 'Décorations',
    price: 150,
    description: 'Bearbrick x A Bathing Ape coloris rose — édition rare et très recherchée. Pièce collector en vinyle premium, finition impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/hxfV4W3d/IMG-0663.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Collaboration Bearbrick × Bape', 'Coloris rose édition rare', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Figurine Kaws ─────────────────────────────────────────────────────────────
  {
    id: 37,
    name: 'Figurine Kaws (28 cm)',
    category: 'Décorations',
    price: 75,
    description: 'Figurine KAWS collector en vinyle premium — une icône du art toy contemporain. Finition impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/yM7CjY2/IMG-0664.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition collector', 'Vinyle premium', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Bearbrick x Bape Noir ─────────────────────────────────────────────────────
  {
    id: 38,
    name: 'Bearbrick x Bape noir (28 cm)',
    category: 'Décorations',
    price: 150,
    description: 'Bearbrick x A Bathing Ape coloris noir — édition rare et très recherchée. Pièce collector en vinyle premium, finition impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/rKTj3YSh/IMG-0659.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Collaboration Bearbrick × Bape', 'Coloris noir édition collector', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Figurine Kaws Câlin ───────────────────────────────────────────────────────
  {
    id: 39,
    name: 'Figurine Kaws câlin',
    category: 'Décorations',
    price: 75,
    description: 'Figurine KAWS câlin — une des poses les plus emblématiques de l\'artiste. Sculpture en vinyle premium, finition impeccable, pièce collector incontournable.',
    images: [
      'https://i.ibb.co/Tx10z5Hj/IMG-0627.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Pose câlin emblématique', 'Vinyle premium finition mate', 'Pièce collector', 'Livraison soigneusement emballée'],
  },
  // ── Salon : Meuble TV bois ───────────────────────────────────────────────────
  {
    id: 60,
    name: 'Meuble TV bois 150 cm',
    category: 'Salon',
    price: 215,
    description: 'Meuble TV contemporain en bois avec 2 tiroirs et niche ouverte. Façades cannelées, piètement métal noir incliné — un banc bas élégant qui structure votre salon, compatible TV jusqu\'à 60 pouces.',
    images: [
      'https://i.ibb.co/mr26F03b/Capture-d-e-cran-2026-07-23-a-12-11-20.png',
      'https://i.ibb.co/cSvwJ9DP/Capture-d-e-cran-2026-07-23-a-12-10-23.png',
      'https://i.ibb.co/jZ4hRQrZ/Capture-d-e-cran-2026-07-23-a-12-11-31.png',
      'https://i.ibb.co/NdngcPKj/Capture-d-e-cran-2026-07-23-a-12-11-43.png',
      'https://i.ibb.co/JRdmv4M3/Capture-d-e-cran-2026-07-23-a-12-12-46.png',
    ],
    dimensions: 'L 150 × P 38 × H 44 cm',
    material: 'Bois, façades cannelées, piètement métal noir',
    details: ['2 tiroirs de rangement', 'Niche ouverte centrale', 'Compatible TV jusqu\'à 60 pouces', 'Piètement métal noir incliné'],
  },
  // ── Salon : Meuble TV Rosahqnda noir ─────────────────────────────────────────
  {
    id: 61,
    name: 'Meuble TV extensible noir',
    category: 'Salon',
    price: 150,
    description: 'Meuble TV au design extensible (146 à 180 cm), en rotin avec 2 tiroirs, compartiments ouverts et rangement à 2 portes. Finition noir chêne élégante, parfait pour structurer un salon contemporain.',
    images: [
      'https://i.ibb.co/PzVTnCtx/Capture-d-e-cran-2026-07-23-a-12-31-48.png',
      'https://i.ibb.co/CKtMcfGs/Capture-d-e-cran-2026-07-23-a-12-31-56.png',
      'https://i.ibb.co/NdNsLBF2/Capture-d-e-cran-2026-07-23-a-12-32-21.png',
      'https://i.ibb.co/0WwS9zn/Capture-d-e-cran-2026-07-23-a-12-32-09.png',
    ],
    dimensions: 'L 146–180 × P 30 × H 44 cm',
    material: 'Aggloméré et MDF, façades rotin, coloris noir/chêne',
    details: ['Design extensible 146 à 180 cm', '2 tiroirs + rangement 2 portes', 'Compartiments ouverts', 'Façades en rotin tressé'],
  },
  // ── Salon : Table à manger ovale bois massif ─────────────────────────────────
  {
    id: 62,
    name: 'Table à manger ovale en bois massif',
    category: 'Meubles',
    price: 215,
    description: 'Table à manger moderne au design épuré, plateau ovale en bois massif et piètement cannelé. Chaleureuse et élégante, elle accueille jusqu\'à 6 personnes. Disponible en Dark Brown et Light Brown.',
    images: [
      'https://i.ibb.co/qMTxqsDx/Capture-d-e-cran-2026-07-23-a-14-36-33.png',
      'https://i.ibb.co/WpP25YqM/Capture-d-e-cran-2026-07-23-a-14-36-15.png',
      'https://i.ibb.co/XZ3vYFnR/Capture-d-e-cran-2026-07-23-a-14-36-08.png',
    ],
    dimensions: 'L 180 × l 90 cm',
    material: 'Bois massif, plateau ovale, piètement cannelé',
    details: ['Plateau ovale en bois massif', 'Jusqu\'à 6 personnes', 'Design contemporain épuré', 'Coloris Light Brown'],
  },
  // ── Salon : Table à manger ovale — Dark Brown ────────────────────────────────
  {
    id: 63,
    name: 'Table à manger ovale en bois massif',
    category: 'Meubles',
    price: 215,
    description: 'Table à manger moderne au design épuré, plateau ovale en bois massif et piètement cannelé. Chaleureuse et élégante, elle accueille jusqu\'à 6 personnes. Coloris Dark Brown, teinte chaude et profonde.',
    images: [
      'https://i.ibb.co/B2VB3r8B/Capture-d-e-cran-2026-07-23-a-14-35-40.png',
      'https://i.ibb.co/Q7mcpzGW/Capture-d-e-cran-2026-07-23-a-14-35-51.png',
      'https://i.ibb.co/4gYLRVP0/Capture-d-e-cran-2026-07-23-a-14-35-48.png',
      'https://i.ibb.co/1Js6RdH8/Capture-d-e-cran-2026-07-23-a-14-36-00.png',
    ],
    dimensions: 'L 180 × l 90 cm',
    material: 'Bois massif, plateau ovale, piètement cannelé',
    details: ['Plateau ovale en bois massif', 'Jusqu\'à 6 personnes', 'Design contemporain épuré', 'Coloris Dark Brown'],
  },
  // ── Salon : Meuble TV industriel brun rustique ───────────────────────────────
  {
    id: 64,
    name: 'Meuble TV industriel brun rustique',
    category: 'Salon',
    price: 98,
    description: 'Banc TV de style industriel en brun rustique, pour téléviseur jusqu\'à 55 pouces. Compartiments ouverts, étagère réglable et structure métal noir robuste. Idéal pour salon ou chambre.',
    images: [
      'https://i.ibb.co/Pv2QZk4f/Capture-d-e-cran-2026-07-23-a-20-55-56.png',
      'https://i.ibb.co/wrQbTCNM/Capture-d-e-cran-2026-07-23-a-20-55-45.png',
      'https://i.ibb.co/p6rYtCdV/Capture-d-e-cran-2026-07-23-a-20-56-12.png',
    ],
    dimensions: 'L 110 cm',
    material: 'Bois aspect brun rustique, structure métal noir',
    details: ['Compatible TV jusqu\'à 55 pouces', 'Compartiments ouverts', 'Étagère centrale réglable', 'Structure métal industriel'],
  },
  // ── Salon : Table d'appoint double couche — Vert ─────────────────────────────
  {
    id: 65,
    name: 'Table d\'appoint double couche',
    category: 'Meubles',
    price: 49,
    description: 'Petite table d\'appoint double couche au design moderne et compact (40 × 40 cm). Plateau en plastique résistant sur cadre bois pour une stabilité optimale. Parfaite comme table de chevet ou d\'appoint au salon. Coloris Vert.',
    images: [
      'https://i.ibb.co/HLQrYmp5/Capture-d-e-cran-2026-07-23-a-21-14-51.png',
    ],
    dimensions: 'Ø 40 × H 40 cm',
    material: 'Plateau plastique résistant, cadre bois',
    details: ['Design double couche (2 plateaux)', 'Compact et léger', 'Cadre bois stable', 'Coloris Vert'],
  },
  // ── Salon : Table d'appoint double couche — Noir ─────────────────────────────
  {
    id: 66,
    name: 'Table d\'appoint double couche',
    category: 'Meubles',
    price: 49,
    description: 'Petite table d\'appoint double couche au design moderne et compact (40 × 40 cm). Plateau en plastique résistant sur cadre bois pour une stabilité optimale. Parfaite comme table de chevet ou d\'appoint au salon. Coloris Noir.',
    images: [
      'https://i.ibb.co/mCm4Hqgs/Capture-d-e-cran-2026-07-23-a-21-14-34.png',
    ],
    dimensions: 'Ø 40 × H 40 cm',
    material: 'Plateau plastique résistant, cadre bois',
    details: ['Design double couche (2 plateaux)', 'Compact et léger', 'Cadre bois stable', 'Coloris Noir'],
  },
  // ── Salon : Table d'appoint double couche — Blanc ────────────────────────────
  {
    id: 67,
    name: 'Table d\'appoint double couche',
    category: 'Meubles',
    price: 49,
    description: 'Petite table d\'appoint double couche au design moderne et compact (40 × 40 cm). Plateau en plastique résistant sur cadre bois pour une stabilité optimale. Parfaite comme table de chevet ou d\'appoint au salon. Coloris Blanc.',
    images: [
      'https://i.ibb.co/SwSfG0B8/Capture-d-e-cran-2026-07-23-a-21-14-43.png',
    ],
    dimensions: 'Ø 40 × H 40 cm',
    material: 'Plateau plastique résistant, cadre bois',
    details: ['Design double couche (2 plateaux)', 'Compact et léger', 'Cadre bois stable', 'Coloris Blanc'],
  },
  // ── Salon : Table basse Mahjong mobile ───────────────────────────────────────
  {
    id: 68,
    name: 'Table basse mobile noire',
    category: 'Meubles',
    price: 49,
    description: 'Table basse mobile multifonction en noir : support à thé, étagère de rangement et surface de jeu (échecs, cartes, Mahjong). Double plateau et roulettes pour la déplacer facilement dans tout le salon.',
    images: [
      'https://i.ibb.co/Z6xfjVMN/Capture-d-e-cran-2026-07-23-a-21-31-37.png',
      'https://i.ibb.co/ym393YzM/Capture-d-e-cran-2026-07-23-a-21-32-06.png',
      'https://i.ibb.co/XxGH6wkC/Capture-d-e-cran-2026-07-23-a-21-31-54.png',
    ],
    dimensions: 'Table basse à roulettes, double plateau',
    material: 'Métal et plateau laqué noir',
    details: ['Double plateau de rangement', 'Roulettes pour un déplacement facile', 'Multifonction : thé, jeux, appoint', 'Finition noire élégante'],
  },
  // ── Décorations : Sculpture artistique en résine ───────────────────────────────
  {
    id: 69,
    name: 'Sculpture artistique en résine bleue',
    category: 'Décorations',
    price: 250,
    description: 'Sculpture décorative verticale en résine, inspirée du mouvement de l\'eau et du vent. Design abstrait new classical / post-modern en coloris gris bleuté, avec sphère de cristal sur socle. Une pièce d\'ambiance unique pour sublimer une entrée ou un salon de luxe.',
    images: [
      'https://i.ibb.co/274kX9Bw/Capture-d-e-cran-2026-07-23-a-21-43-24.png',
      'https://i.ibb.co/pBZSfvx3/Capture-d-e-cran-2026-07-23-a-21-44-13.png',
    ],
    dimensions: 'Sculpture verticale sur socle',
    material: 'Résine artistique, sphère cristal, socle laqué',
    details: ['Design abstrait new classical', 'Coloris gris bleuté', 'Sphère de cristal sur socle', 'Pièce décorative d\'exception'],
  },
  // ── Décorations : Sculpture artistique en résine — Noir ────────────────────────
  {
    id: 70,
    name: 'Sculpture artistique en résine bleue',
    category: 'Décorations',
    price: 250,
    description: 'Sculpture décorative verticale en résine, inspirée du mouvement de l\'eau et du vent. Design abstrait new classical / post-modern en coloris noir profond, avec sphère de cristal sur socle. Une pièce d\'ambiance unique pour sublimer une entrée ou un salon de luxe.',
    images: [
      'https://i.ibb.co/nN8Nr9JH/Capture-d-e-cran-2026-07-23-a-21-44-36.png',
    ],
    dimensions: 'Sculpture verticale sur socle',
    material: 'Résine artistique, sphère cristal, socle laqué',
    details: ['Design abstrait new classical', 'Coloris noir profond', 'Sphère de cristal sur socle', 'Pièce décorative d\'exception'],
  },
  // ── Décorations : Vase céramique coquille ────────────────────────────────────
  {
    id: 71,
    name: 'Vase céramique coquille',
    category: 'Décorations',
    price: 68,
    description: 'Vase d\'angle décoratif en céramique de style nordique, aux motifs inspirés du jardin et à la forme sculpturale de coquille. Fait main, blanc mat, il apporte une touche artistique et organique à votre intérieur.',
    images: [
      'https://i.ibb.co/F4fc8mqW/Capture-d-e-cran-2026-07-23-a-21-56-13.png',
      'https://i.ibb.co/MXbJ1Ss/Capture-d-e-cran-2026-07-23-a-21-55-49.png',
      'https://i.ibb.co/QjxsrSKs/Capture-d-e-cran-2026-07-23-a-21-56-06.png',
      'https://i.ibb.co/DHsm1RcJ/Capture-d-e-cran-2026-07-23-a-21-56-21.png',
    ],
    dimensions: 'Vase d\'angle décoratif',
    material: 'Céramique blanche mate, fait main',
    details: ['Style nordique, forme coquille', 'Fait main, finition blanc mat', 'Motifs inspirés du jardin', 'Pièce décorative sculpturale'],
  },
  // ── Décorations : Vase céramique minimaliste — Blanc ─────────────────────────
  {
    id: 72,
    name: 'Vase céramique minimaliste',
    category: 'Décorations',
    price: 49,
    description: 'Vase en céramique au design moderne et minimaliste, forme sculpturale arrondie. Parfait pour un arrangement floral ou en pièce décorative seule dans le salon. Artisanat soigné, finition mate. Coloris Blanc.',
    images: [
      'https://i.ibb.co/JwSGCFym/Capture-d-e-cran-2026-07-23-a-22-04-47.png',
      'https://i.ibb.co/S4qCf5tR/Capture-d-e-cran-2026-07-23-a-22-04-15.png',
    ],
    dimensions: 'Vase décoratif moderne',
    material: 'Céramique finition mate',
    details: ['Design moderne minimaliste', 'Forme sculpturale arrondie', 'Idéal fleurs séchées ou déco', 'Coloris Blanc'],
  },
  // ── Décorations : Vase céramique minimaliste — Noir ──────────────────────────
  {
    id: 73,
    name: 'Vase céramique minimaliste',
    category: 'Décorations',
    price: 49,
    description: 'Vase en céramique au design moderne et minimaliste, forme sculpturale arrondie. Parfait pour un arrangement floral ou en pièce décorative seule dans le salon. Artisanat soigné, finition mate. Coloris Noir.',
    images: [
      'https://i.ibb.co/cKJj0NkY/Capture-d-e-cran-2026-07-23-a-22-05-14.png',
      'https://i.ibb.co/fV7ZZcWf/Capture-d-e-cran-2026-07-23-a-22-05-04.png',
    ],
    dimensions: 'Vase décoratif moderne',
    material: 'Céramique finition mate',
    details: ['Design moderne minimaliste', 'Forme sculpturale arrondie', 'Idéal fleurs séchées ou déco', 'Coloris Noir'],
  },
  // ── Meubles : Commode 6 tiroirs ──────────────────────────────────────────────
  {
    id: 74,
    name: 'Commode 6 tiroirs bois & noir',
    category: 'Meubles',
    price: 170,
    description: 'Commode moderne à 6 tiroirs, unité de rangement idéale pour la chambre ou l\'entrée. Structure noire et façades bois chocolat, en MDF durable. Grande capacité pour vêtements et essentiels, style contemporain.',
    images: [
      'https://i.ibb.co/cSH9XcdH/Capture-d-e-cran-2026-07-23-a-22-23-19.png',
      'https://i.ibb.co/kWbJVR5/Capture-d-e-cran-2026-07-23-a-22-21-45.png',
      'https://i.ibb.co/bg1YMfM9/Capture-d-e-cran-2026-07-23-a-22-23-11.png',
      'https://i.ibb.co/Mxf3wGjT/Capture-d-e-cran-2026-07-23-a-22-23-03.png',
      'https://i.ibb.co/DHp15LLC/Capture-d-e-cran-2026-07-23-a-22-22-03.png',
    ],
    dimensions: 'L 100 × P 30 × H 70 cm',
    material: 'MDF durable, structure noire, façades bois chocolat',
    details: ['6 grands tiroirs de rangement', 'Structure noire, façades bois', 'MDF durable', 'Idéale chambre ou entrée'],
  },
  // ── Meubles : Commode meuble TV long à tiroirs ───────────────────────────────
  {
    id: 75,
    name: 'Commode meuble TV long à tiroirs',
    category: 'Meubles',
    price: 200,
    description: 'Commode multifonction et meuble TV long, avec étagère de rangement ouverte et tiroirs en tissu. Sur roulettes pour un déplacement facile. Unité de rangement polyvalente pour la chambre comme pour le salon.',
    images: [
      'https://i.ibb.co/dwT4Jdkt/Capture-d-e-cran-2026-07-28-a-17-06-39.png',
      'https://i.ibb.co/QF9bT2B6/Capture-d-e-cran-2026-07-28-a-17-06-56.png',
      'https://i.ibb.co/dwQYzJc7/Capture-d-e-cran-2026-07-28-a-17-06-48.png',
      'https://i.ibb.co/ZpbfLsNS/Capture-d-e-cran-2026-07-28-a-17-07-42.png',
      'https://i.ibb.co/DHTCpCs4/Capture-d-e-cran-2026-07-28-a-17-07-30.png',
    ],
    dimensions: 'Meuble TV long avec étagère',
    material: 'Panneaux bois, tiroirs en tissu, roulettes',
    details: ['5 tiroirs en tissu', 'Étagère de rangement ouverte', '4 roulettes pour déplacer facilement', 'Polyvalent chambre & salon'],
  },
  // ── Meubles : Commode blanche 6 tiroirs ──────────────────────────────────────
  {
    id: 76,
    name: 'Commode blanche 6 tiroirs',
    category: 'Meubles',
    price: 150,
    description: 'Commode de rangement moderne à 6 tiroirs, en blanc épuré. Grande capacité pour la chambre, le salon ou un couloir. Lignes minimalistes et finition soignée qui s\'accordent à tous les intérieurs.',
    images: [
      'https://i.ibb.co/xK73wXnm/Capture-d-e-cran-2026-08-02-a-14-26-49.png',
      'https://i.ibb.co/QjKfjjHr/Capture-d-e-cran-2026-08-02-a-14-27-14.png',
      'https://i.ibb.co/DPSMdRnk/Capture-d-e-cran-2026-08-02-a-14-27-22.png',
      'https://i.ibb.co/F2Sb5GL/Capture-d-e-cran-2026-08-02-a-14-26-59.png',
    ],
    dimensions: 'L 100 × P 36 × H 69 cm',
    material: 'Panneaux finition blanche mate',
    details: ['6 grands tiroirs de rangement', 'Design moderne épuré', 'Finition blanche mate', 'Idéale chambre, salon ou couloir'],
  },
];

// Hausse de +10% sur tous les prix, arrondie au chiffre finissant par 9 le plus proche
// (ex. 215 → 236,50 → 239 ; 499 → 548,90 → 549 ; 136 → 149,60 → 149).
function bumpPrice(price: number): number {
  const raised = price * 1.1;
  const rounded = Math.round((raised - 9) / 10) * 10 + 9;
  return Math.max(9, rounded);
}

// Produits à prix fixe défini par la boutique (non concernés par la hausse +10%)
const exactPriceProducts: Product[] = [
  // ── Meubles : Table basse Farmhouse en bois ─────────────────────────────────
  {
    id: 77,
    name: 'Table basse Farmhouse en bois',
    category: 'Salon',
    price: 218,
    description: 'Table basse rectangulaire au style farmhouse chaleureux, en bois d\'ingénierie finition Rustic Brown. Plateau généreux et base sculpturale robuste pour un salon à la fois convivial et raffiné. Une pièce centrale qui structure l\'espace.',
    images: [
      'https://i.ibb.co/SDHV1Yz6/Capture-d-e-cran-2026-08-06-a-00-47-21.png',
      'https://i.ibb.co/Z6CK14Xr/Capture-d-e-cran-2026-08-06-a-00-47-31.png',
      'https://i.ibb.co/Kc0mw8tF/Capture-d-e-cran-2026-08-06-a-00-47-38.png',
      'https://i.ibb.co/MwjW91n/Capture-d-e-cran-2026-08-06-a-00-49-43.png',
    ],
    dimensions: 'L 120 × P 60 × H 45 cm',
    material: 'Bois d\'ingénierie, finition Rustic Brown',
    details: ['Style farmhouse chaleureux', 'Bois d\'ingénierie résistant', 'Base sculpturale robuste', 'Plateau spacieux pour le salon'],
  },
  // ── Meubles : Table basse industrielle 2 niveaux ─────────────────────────────
  {
    id: 78,
    name: 'Table basse industrielle 2 niveaux',
    category: 'Salon',
    price: 98,
    description: 'Table basse rectangulaire au style industriel, alliant bois vintage marron rustique et cadre en métal robuste. Étagère inférieure en maille pour un rangement pratique. Un design chaleureux et solide, parfait pour un salon au caractère affirmé.',
    images: [
      'https://i.ibb.co/Kj17z6q7/Capture-d-e-cran-2026-08-06-a-01-00-22.png',
      'https://i.ibb.co/rR5Yq6tj/Capture-d-e-cran-2026-08-06-a-01-00-28.png',
      'https://i.ibb.co/4nrFJF61/Capture-d-e-cran-2026-08-06-a-01-00-34.png',
      'https://i.ibb.co/5WtBFMz5/Capture-d-e-cran-2026-08-06-a-01-00-50.png',
    ],
    dimensions: 'L 106 × P 60 × H 45 cm',
    material: 'Bois vintage & cadre métal, étagère en maille',
    details: ['Style industriel bois & métal', 'Étagère inférieure en maille', 'Cadre en métal robuste', 'Montage facile'],
  },
  // ── Meubles : Table basse ovale vintage 2 niveaux — Brun ─────────────────────
  {
    id: 79,
    name: 'Table basse ovale vintage 2 niveaux',
    category: 'Salon',
    price: 128,
    description: 'Table basse ovale à profil bas, style Mid-Century vintage. Deux niveaux généreux, plateau supérieur galbé et étagère de rangement, portés par des pieds tournés élégants. Finition bois brun chaleureuse — une pièce de caractère pour le salon.',
    images: [
      'https://i.ibb.co/gMh9nwq7/Capture-d-e-cran-2026-08-06-a-01-04-31.png',
      'https://i.ibb.co/PBzHLg1/Capture-d-e-cran-2026-08-06-a-01-04-39.png',
      'https://i.ibb.co/fzg8Sgdd/Capture-d-e-cran-2026-08-06-a-01-05-15.png',
    ],
    dimensions: 'L 120 × P 54 × H 44 cm',
    material: 'Bois finition brun vintage, pieds tournés',
    details: ['Forme ovale profil bas', 'Style Mid-Century vintage', '2 niveaux de rangement', 'Pieds tournés élégants'],
  },
  // ── Meubles : Table basse ovale vintage 2 niveaux — Gris ─────────────────────
  {
    id: 80,
    name: 'Table basse ovale vintage 2 niveaux',
    category: 'Salon',
    price: 128,
    description: 'Table basse ovale à profil bas, style Mid-Century vintage. Deux niveaux généreux, plateau supérieur galbé et étagère de rangement, portés par des pieds tournés élégants. Finition bois gris raffinée — une pièce de caractère pour le salon.',
    images: [
      'https://i.ibb.co/Kj2CF2k0/Capture-d-e-cran-2026-08-06-a-01-05-26.png',
    ],
    dimensions: 'L 120 × P 54 × H 44 cm',
    material: 'Bois finition gris, pieds tournés',
    details: ['Forme ovale profil bas', 'Style Mid-Century vintage', '2 niveaux de rangement', 'Pieds tournés élégants'],
  },
  // ── Meubles : Table basse moderne noire 2 étagères ───────────────────────────
  {
    id: 81,
    name: 'Table basse moderne noire 2 étagères',
    category: 'Salon',
    price: 148,
    description: 'Table basse rectangulaire au design moderne et épuré, plateau effet marbre noir et structure en métal. Double étagère pour un rangement élégant et pratique. Une pièce contemporaine qui apporte une touche chic et graphique au salon.',
    images: [
      'https://i.ibb.co/SD1GmP8Z/Capture-d-e-cran-2026-08-06-a-01-08-32.png',
      'https://i.ibb.co/9kVvX3K1/Capture-d-e-cran-2026-08-06-a-01-08-51.png',
      'https://i.ibb.co/VcMJsnw2/Capture-d-e-cran-2026-08-06-a-01-09-00.png',
      'https://i.ibb.co/zWghJRJ4/Capture-d-e-cran-2026-08-06-a-01-09-08.png',
      'https://i.ibb.co/Fq6q5p0c/Capture-d-e-cran-2026-08-06-a-01-09-22.png',
    ],
    dimensions: 'L 106 × P 50 × H 47 cm',
    material: 'Plateau effet marbre noir, structure métal',
    details: ['Design moderne épuré', 'Plateau effet marbre noir', 'Double étagère de rangement', 'Structure métal robuste'],
  },
  // ── Meubles : Table d'appoint 2 niveaux noyer ────────────────────────────────
  {
    id: 82,
    name: 'Table d\'appoint 2 niveaux noyer',
    category: 'Meubles',
    price: 98,
    description: 'Table d\'appoint compacte à 2 niveaux, plateau à surface ondulée cannelée finition noyer et structure métal noir. Idéale en bout de canapé, table de chevet ou coin café. Un design chaleureux et pratique qui se glisse partout.',
    images: [
      'https://i.ibb.co/qMPSJqd4/Capture-d-e-cran-2026-08-06-a-01-12-08.png',
      'https://i.ibb.co/VWrfcJz8/Capture-d-e-cran-2026-08-06-a-01-12-17.png',
      'https://i.ibb.co/4nJ3qC8n/Capture-d-e-cran-2026-08-06-a-01-12-27.png',
      'https://i.ibb.co/Q3hcf3FW/Capture-d-e-cran-2026-08-06-a-01-12-41.png',
    ],
    dimensions: 'L 45 × P 45 × H 50 cm',
    material: 'Plateau cannelé finition noyer, structure métal noir',
    details: ['Format compact 2 niveaux', 'Surface ondulée cannelée', 'Structure métal noir', 'Bout de canapé, chevet ou coin café'],
  },
  // ── Meubles : Table basse bicolore à niveaux décalés ─────────────────────────
  {
    id: 83,
    name: 'Table basse bicolore à niveaux décalés',
    category: 'Salon',
    price: 98,
    description: 'Table basse moderne au design bicolore, associant bois naturel et noir mat. Niveaux décalés et étagère de rangement intégrée pour un rendu graphique et fonctionnel. Une pièce contemporaine qui structure élégamment le salon.',
    images: [
      'https://i.ibb.co/S7BMVnNQ/Capture-d-e-cran-2026-08-06-a-01-18-11.png',
      'https://i.ibb.co/zhNQM9GZ/Capture-d-e-cran-2026-08-06-a-01-18-38.png',
      'https://i.ibb.co/wNCXwxpb/Capture-d-e-cran-2026-08-06-a-01-18-47.png',
      'https://i.ibb.co/wNrWyr2c/Capture-d-e-cran-2026-08-06-a-01-18-30.png',
      'https://i.ibb.co/YFgmqk26/Capture-d-e-cran-2026-08-06-a-01-18-54.png',
    ],
    dimensions: 'L 95 × P 55 × H 50 cm',
    material: 'Bois naturel & noir mat',
    details: ['Design bicolore bois & noir', 'Niveaux décalés graphiques', 'Étagère de rangement intégrée', 'Style moderne contemporain'],
  },
  // ── Meubles : Lot de 2 tables gigognes — Blanc ───────────────────────────────
  {
    id: 84,
    name: 'Lot de 2 tables gigognes',
    category: 'Salon',
    price: 128,
    description: 'Lot de 2 tables gigognes au design moderne, plateau blanc et cadre métal fin. Modulables et gain de place, elles se glissent l\'une sous l\'autre. Parfaites en table basse, table d\'appoint ou coin café, dans le salon comme la chambre.',
    images: [
      'https://i.ibb.co/fVbkCLdC/Capture-d-e-cran-2026-08-06-a-01-33-06.png',
      'https://i.ibb.co/hF5HJ53s/Capture-d-e-cran-2026-08-06-a-01-33-00.png',
      'https://i.ibb.co/ccSyXtVZ/Capture-d-e-cran-2026-08-06-a-01-32-54.png',
      'https://i.ibb.co/3yqwcrvy/Capture-d-e-cran-2026-08-06-a-01-32-48.png',
      'https://i.ibb.co/hJ5BnXZC/Capture-d-e-cran-2026-08-06-a-01-33-14.png',
      'https://i.ibb.co/TD8c0tKK/Capture-d-e-cran-2026-08-06-a-01-32-38.png',
    ],
    dimensions: 'Grande L 90 × Petite L 50 cm',
    material: 'Plateau blanc, cadre métal',
    details: ['Lot de 2 tables gigognes', 'Modulables & gain de place', 'Cadre métal fin', 'Plateau blanc moderne'],
  },
  // ── Meubles : Lot de 2 tables gigognes — Brun ────────────────────────────────
  {
    id: 85,
    name: 'Lot de 2 tables gigognes',
    category: 'Salon',
    price: 128,
    description: 'Lot de 2 tables gigognes au design moderne, plateau bois brun chaleureux et cadre métal fin. Modulables et gain de place, elles se glissent l\'une sous l\'autre. Parfaites en table basse, table d\'appoint ou coin café.',
    images: [
      'https://i.ibb.co/VcZ8jxKk/Capture-d-e-cran-2026-08-06-a-01-33-23.png',
      'https://i.ibb.co/Hkjw6mS/Capture-d-e-cran-2026-08-06-a-01-33-52.png',
      'https://i.ibb.co/B2PjMSKD/Capture-d-e-cran-2026-08-06-a-01-33-43.png',
      'https://i.ibb.co/DHYp06mn/Capture-d-e-cran-2026-08-06-a-01-33-35.png',
      'https://i.ibb.co/fYYXG84b/Capture-d-e-cran-2026-08-06-a-01-34-09.png',
    ],
    dimensions: 'Grande L 90 × Petite L 50 cm',
    material: 'Plateau bois brun, cadre métal',
    details: ['Lot de 2 tables gigognes', 'Modulables & gain de place', 'Cadre métal fin', 'Plateau bois brun chaleureux'],
  },
  // ── Meubles : Lot de 2 tables gigognes — Blanc doré ──────────────────────────
  {
    id: 86,
    name: 'Lot de 2 tables gigognes',
    category: 'Salon',
    price: 128,
    description: 'Lot de 2 tables gigognes au design chic, plateau blanc et cadre métal doré. Modulables et gain de place, elles se glissent l\'une sous l\'autre. Une touche précieuse et élégante pour le salon ou la chambre.',
    images: [
      'https://i.ibb.co/N6CMBgfk/Capture-d-e-cran-2026-08-06-a-01-34-19.png',
      'https://i.ibb.co/p62p74HL/Capture-d-e-cran-2026-08-06-a-01-39-16.png',
      'https://i.ibb.co/200DjQYM/Capture-d-e-cran-2026-08-06-a-01-39-09.png',
      'https://i.ibb.co/zWfZ7RQ0/Capture-d-e-cran-2026-08-06-a-01-39-24.png',
      'https://i.ibb.co/7xH9dj6t/Capture-d-e-cran-2026-08-06-a-01-39-48.png',
      'https://i.ibb.co/60gQqrRB/Capture-d-e-cran-2026-08-06-a-01-34-28.png',
    ],
    dimensions: 'Grande L 90 × Petite L 50 cm',
    material: 'Plateau blanc, cadre métal doré',
    details: ['Lot de 2 tables gigognes', 'Modulables & gain de place', 'Cadre métal doré chic', 'Plateau blanc élégant'],
  },
  // ── Salon : Canapé d'angle 3 places crème ────────────────────────────────────
  {
    id: 87,
    name: 'Canapé d\'angle 3 places crème',
    category: 'Salon',
    price: 798,
    description: 'Canapé d\'angle modulable 3 places en tissu aspect lin crème, avec pouf de rangement intégré. Assise large et enveloppante pour un confort optimal, méridienne réversible pour s\'adapter à votre pièce. Élégance douce et fonctionnalité réunies.',
    images: [
      'https://i.ibb.co/MxPD6Ykm/Capture-d-e-cran-2026-08-06-a-01-52-14.png',
      'https://i.ibb.co/tMFHN8wt/Capture-d-e-cran-2026-08-06-a-01-52-35.png',
      'https://i.ibb.co/BKvzDWGY/Capture-d-e-cran-2026-08-06-a-01-52-20.png',
      'https://i.ibb.co/rfKtRwXk/Capture-d-e-cran-2026-08-06-a-01-52-27.png',
      'https://i.ibb.co/k6XQCgLK/Capture-d-e-cran-2026-08-06-a-01-52-44.png',
    ],
    dimensions: 'L 210 cm · angle modulable',
    material: 'Tissu aspect lin crème, pouf de rangement',
    details: ['3 places + pouf de rangement', 'Angle modulable réversible', 'Assise large et confortable', 'Tissu aspect lin crème'],
  },
  // ── Salon : Canapé d'angle en L chenille bleu ────────────────────────────────
  {
    id: 88,
    name: 'Canapé d\'angle en L chenille bleu',
    category: 'Salon',
    price: 798,
    description: 'Canapé d\'angle en L au style italien minimaliste, en tissu chenille bleu doux et enveloppant. Assise capitonnée profonde, coussins moelleux et lignes modulables épurées. Une pièce généreuse et raffinée pour un salon contemporain et cosy.',
    images: [
      'https://i.ibb.co/k2sPz4nZ/Capture-d-e-cran-2026-08-06-a-01-57-03.png',
      'https://i.ibb.co/84ns2HPM/Capture-d-e-cran-2026-08-06-a-01-58-13.png',
      'https://i.ibb.co/6R9n25Mg/Capture-d-e-cran-2026-08-06-a-01-58-34.png',
    ],
    dimensions: 'Canapé d\'angle en L modulable',
    material: 'Tissu chenille bleu, assise capitonnée',
    details: ['Forme en L modulable', 'Tissu chenille doux', 'Assise capitonnée profonde', 'Style italien minimaliste'],
  },
  // ── Salon : Canapé-lit modulaire chenille — Vert ─────────────────────────────
  {
    id: 89,
    name: 'Canapé-lit modulaire chenille',
    category: 'Salon',
    price: 750,
    description: 'Canapé-lit modulaire convertible en tissu chenille doux, 2 places sectionnel et combinable. Assise profonde et enveloppante, adapté aux animaux domestiques. Livré compressé sous vide, sans assemblage — un couchage d\'appoint aussi confortable qu\'élégant. Coloris Vert.',
    images: [
      'https://i.ibb.co/wZN1xXXW/Capture-d-e-cran-2026-08-07-a-17-30-58.png',
      'https://i.ibb.co/rG0Xc7J9/Capture-d-e-cran-2026-08-07-a-17-31-08.png',
      'https://i.ibb.co/mVmFqtRH/Capture-d-e-cran-2026-08-07-a-17-31-21.png',
      'https://i.ibb.co/wZSBkJWC/Capture-d-e-cran-2026-08-07-a-17-31-33.png',
      'https://i.ibb.co/MxbKdfXk/Capture-d-e-cran-2026-08-07-a-17-31-43.png',
      'https://i.ibb.co/CpB9STSb/Capture-d-e-cran-2026-08-07-a-17-31-53.png',
      'https://i.ibb.co/d0YmvKMk/Capture-d-e-cran-2026-08-07-a-17-32-01.png',
      'https://i.ibb.co/dwyRGfqF/Capture-d-e-cran-2026-08-07-a-17-32-10.png',
    ],
    dimensions: 'Canapé-lit sectionnel 2 places',
    material: 'Tissu chenille, livré compressé sous vide',
    details: ['Convertible canapé-lit', 'Modulable & combinable', 'Adapté aux animaux', 'Sans assemblage (compressé sous vide)'],
  },
  // ── Salon : Canapé-lit modulaire chenille — Noir ─────────────────────────────
  {
    id: 90,
    name: 'Canapé-lit modulaire chenille',
    category: 'Salon',
    price: 750,
    description: 'Canapé-lit modulaire convertible en tissu chenille doux, 2 places sectionnel et combinable. Assise profonde et enveloppante, adapté aux animaux domestiques. Livré compressé sous vide, sans assemblage — un couchage d\'appoint aussi confortable qu\'élégant. Coloris Noir.',
    images: [
      'https://i.ibb.co/WTPptv1/Capture-d-e-cran-2026-08-07-a-17-32-33.png',
    ],
    dimensions: 'Canapé-lit sectionnel 2 places',
    material: 'Tissu chenille, livré compressé sous vide',
    details: ['Convertible canapé-lit', 'Modulable & combinable', 'Adapté aux animaux', 'Sans assemblage (compressé sous vide)'],
  },
  // ── Salon : Canapé-lit modulaire chenille — Beige ────────────────────────────
  {
    id: 91,
    name: 'Canapé-lit modulaire chenille',
    category: 'Salon',
    price: 750,
    description: 'Canapé-lit modulaire convertible en tissu chenille doux, 2 places sectionnel et combinable. Assise profonde et enveloppante, adapté aux animaux domestiques. Livré compressé sous vide, sans assemblage — un couchage d\'appoint aussi confortable qu\'élégant. Coloris Beige.',
    images: [
      'https://i.ibb.co/p6CnFZ6v/Capture-d-e-cran-2026-08-07-a-17-32-18.png',
    ],
    dimensions: 'Canapé-lit sectionnel 2 places',
    material: 'Tissu chenille, livré compressé sous vide',
    details: ['Convertible canapé-lit', 'Modulable & combinable', 'Adapté aux animaux', 'Sans assemblage (compressé sous vide)'],
  },
  // ── Salon : Canapé-lit modulaire chenille — Bleu ─────────────────────────────
  {
    id: 92,
    name: 'Canapé-lit modulaire chenille',
    category: 'Salon',
    price: 750,
    description: 'Canapé-lit modulaire convertible en tissu chenille doux, 2 places sectionnel et combinable. Assise profonde et enveloppante, adapté aux animaux domestiques. Livré compressé sous vide, sans assemblage — un couchage d\'appoint aussi confortable qu\'élégant. Coloris Bleu.',
    images: [
      'https://i.ibb.co/MkhGH94b/Capture-d-e-cran-2026-08-07-a-17-32-26.png',
    ],
    dimensions: 'Canapé-lit sectionnel 2 places',
    material: 'Tissu chenille, livré compressé sous vide',
    details: ['Convertible canapé-lit', 'Modulable & combinable', 'Adapté aux animaux', 'Sans assemblage (compressé sous vide)'],
  },
  // ── Salon : Canapé-lit modulaire flanelle 150 cm ─────────────────────────────
  {
    id: 93,
    name: 'Canapé-lit modulaire flanelle',
    category: 'Salon',
    price: 999,
    description: 'Canapé modulaire déformable en tissu flanelle côtelé, au design moderne et enveloppant (150 cm). Assise moelleuse à compression d\'air, convertible en couchage d\'appoint. Lignes douces et généreuses pour un salon cosy et contemporain.',
    images: [
      'https://i.ibb.co/XfbpfYJh/Capture-d-e-cran-2026-08-07-a-17-49-18.png',
      'https://i.ibb.co/nMQ2tDQk/Capture-d-e-cran-2026-08-07-a-17-49-22.png',
      'https://i.ibb.co/JWKDDRcW/Capture-d-e-cran-2026-08-07-a-17-49-28.png',
    ],
    dimensions: 'L 150 cm · canapé-lit modulable',
    material: 'Tissu flanelle côtelé, assise à compression d\'air',
    details: ['Design modulable déformable', 'Tissu flanelle côtelé doux', 'Convertible canapé-lit', 'Assise moelleuse enveloppante'],
  },
  // ── Salon : Canapé d'angle modulable en U (chenille) — 6 coloris ─────────────
  {
    id: 94,
    name: 'Canapé d\'angle modulable en U gris foncé',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris gris foncé, élégant et intemporel.',
    images: ['https://placehold.co/600x450/3a3a3a/ffffff?text=Canape+U+-+Gris+fonce'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
  {
    id: 95,
    name: 'Canapé d\'angle modulable en U noir',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris noir profond, moderne et affirmé.',
    images: ['https://placehold.co/600x450/1a1a1a/ffffff?text=Canape+U+-+Noir'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
  {
    id: 96,
    name: 'Canapé d\'angle modulable en U gris clair',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris gris clair, doux et lumineux.',
    images: ['https://placehold.co/600x450/b3b3b3/333333?text=Canape+U+-+Gris+clair'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
  {
    id: 97,
    name: 'Canapé d\'angle modulable en U beige',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris beige chaleureux, parfait pour un intérieur cosy.',
    images: ['https://placehold.co/600x450/d8c8a8/333333?text=Canape+U+-+Beige'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
  {
    id: 98,
    name: 'Canapé d\'angle modulable en U brun',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris brun profond, chaleureux et raffiné.',
    images: ['https://placehold.co/600x450/6b4a30/ffffff?text=Canape+U+-+Brun'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
  {
    id: 99,
    name: 'Canapé d\'angle modulable en U vert',
    category: 'Salon',
    price: 749,
    description: 'Grand canapé sectionnel en forme de U avec double méridienne, en tissu chenille doux et enveloppant. Modulable et combinable selon votre espace, il offre une assise généreuse pour toute la famille. Coloris vert sauge, élégant et tendance.',
    images: ['https://placehold.co/600x450/4a5d4a/ffffff?text=Canape+U+-+Vert'],
    dimensions: 'L 285 × P 185 × H 85 cm (canapé en U)',
    material: 'Tissu chenille, structure bois',
    details: ['Forme en U avec double méridienne', 'Tissu chenille doux et résistant', 'Modulable et combinable', 'Assise généreuse 4-5 places'],
  },
];

// Produits à afficher en dernier dans leur section (Meubles)
const SHOW_LAST_IDS = [65, 66, 67, 68]; // Table d'appoint double couche + Table basse mobile noire

const allProducts: Product[] = [
  ...rawProducts.map((p) => ({ ...p, price: bumpPrice(p.price) })),
  ...exactPriceProducts,
];

export const products: Product[] = [
  ...allProducts.filter((p) => !SHOW_LAST_IDS.includes(p.id)),
  ...allProducts.filter((p) => SHOW_LAST_IDS.includes(p.id)),
];
