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
  'bracelet-anti-moustiques': [
    { productId: 51, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 52, color: 'Rose', colorHex: '#f4a7b9' },
  ],
  'ventilateur-nomade': [
    { productId: 50, color: 'Blanc', colorHex: '#f5f5f5' },
    { productId: 53, color: 'Noir', colorHex: '#1a1a1a' },
    { productId: 54, color: 'Rose', colorHex: '#f4a7b9' },
    { productId: 55, color: 'Bleu nuit', colorHex: '#2d3a6b' },
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

export const products: Product[] = [
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
  // ── Été : Ventilateur Nomade ──────────────────────────────────────────────────
  {
    id: 50,
    name: 'Ventilateur Nomade blanc',
    category: 'Été',
    price: 18.99,
    description: 'Ventilateur portable rechargeable avec affichage digital LED, moteur silencieux haute performance et finitions dorées. Compact et élégant, il vous accompagne partout cet été.',
    images: [
      'https://i.ibb.co/mVsj5XR1/116-AD85-E-F417-45-D8-9577-D23-F33-CE5173.jpg',
    ],
    dimensions: 'H 18 × Ø 8 cm',
    material: 'ABS, acier inoxydable doré',
    details: ['Affichage LED digital', 'Rechargeable via USB-C', 'Moteur silencieux haute vitesse', 'Coloris Blanc'],
  },
  {
    id: 53,
    name: 'Ventilateur Nomade noir',
    category: 'Été',
    price: 18.99,
    description: 'Ventilateur portable rechargeable avec affichage digital LED, moteur silencieux haute performance et finitions dorées. Compact et élégant, il vous accompagne partout cet été.',
    images: [
      'https://i.ibb.co/x8SJ741Q/7-EE2-AE36-D232-499-C-9937-7-DA23-FBA42-D7.jpg',
    ],
    dimensions: 'H 18 × Ø 8 cm',
    material: 'ABS, acier inoxydable doré',
    details: ['Affichage LED digital', 'Rechargeable via USB-C', 'Moteur silencieux haute vitesse', 'Coloris Noir'],
  },
  {
    id: 54,
    name: 'Ventilateur Nomade rose',
    category: 'Été',
    price: 18.99,
    description: 'Ventilateur portable rechargeable avec affichage digital LED, moteur silencieux haute performance et finitions dorées. Compact et élégant, il vous accompagne partout cet été.',
    images: [
      'https://i.ibb.co/vxMfNkQj/D1-C91-BD8-1-E54-4518-82-EA-311-E3-A712694.jpg',
    ],
    dimensions: 'H 18 × Ø 8 cm',
    material: 'ABS, acier inoxydable doré',
    details: ['Affichage LED digital', 'Rechargeable via USB-C', 'Moteur silencieux haute vitesse', 'Coloris Rose'],
  },
  {
    id: 55,
    name: 'Ventilateur Nomade bleu nuit',
    category: 'Été',
    price: 18.99,
    description: 'Ventilateur portable rechargeable avec affichage digital LED, moteur silencieux haute performance et finitions dorées. Compact et élégant, il vous accompagne partout cet été.',
    images: [
      'https://i.ibb.co/sdmTndYQ/7-E7761-CB-D102-4-C74-9-E8-A-634-D4-D7-CB2-CD.jpg',
    ],
    dimensions: 'H 18 × Ø 8 cm',
    material: 'ABS, acier inoxydable doré',
    details: ['Affichage LED digital', 'Rechargeable via USB-C', 'Moteur silencieux haute vitesse', 'Coloris Bleu nuit'],
  },
  // ── Été : Bracelet Anti-Moustiques Noir ──────────────────────────────────────
  {
    id: 51,
    name: 'Bracelet Anti-Moustiques noir',
    category: 'Été',
    price: 28.99,
    description: 'Bracelet anti-moustiques rechargeable à ultrasons, en silicone souple avec capsule dorée. Protection discrète et élégante pour profiter de l\'été sans contraintes.',
    images: [
      'https://i.ibb.co/pjRGLdRW/318937-AA-FD64-4-B9-C-BD1-F-1-AFC14-E53-C00.jpg',
      'https://i.ibb.co/GfXdSYqS/84-A6-F724-482-E-4741-A4-E0-A78827829-FAA.jpg',
    ],
    dimensions: 'Tour de poignet : 14–20 cm',
    material: 'Silicone, acier inoxydable doré',
    details: ['Technologie ultrasons', 'Silicone souple hypoallergénique', 'Rechargeable USB-C', 'Coloris Noir'],
  },
  // ── Été : Bracelet Anti-Moustiques Rose ──────────────────────────────────────
  {
    id: 52,
    name: 'Bracelet Anti-Moustiques rose',
    category: 'Été',
    price: 28.99,
    description: 'Bracelet anti-moustiques rechargeable à ultrasons, en silicone souple avec capsule dorée. Protection discrète et élégante pour profiter de l\'été sans contraintes.',
    images: [
      'https://i.ibb.co/840cLP5P/54-C52836-7029-4-D0-E-8-FA9-56-F70-AD0-DFB2.jpg',
    ],
    dimensions: 'Tour de poignet : 14–20 cm',
    material: 'Silicone, acier inoxydable doré',
    details: ['Technologie ultrasons', 'Silicone souple hypoallergénique', 'Rechargeable USB-C', 'Coloris Rose'],
  },
  // ── Salon : Meuble TV bois ───────────────────────────────────────────────────
  {
    id: 60,
    name: 'Meuble TV bois 150 cm',
    category: 'Meubles',
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
    category: 'Meubles',
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
    category: 'Meubles',
    price: 98,
    description: 'Banc TV de style industriel en brun rustique, pour téléviseur jusqu\'à 55 pouces. Compartiments ouverts, étagère réglable et structure métal noir robuste. Idéal pour salon ou chambre.',
    images: [
      'https://i.ibb.co/wrQbTCNM/Capture-d-e-cran-2026-07-23-a-20-55-45.png',
      'https://i.ibb.co/Pv2QZk4f/Capture-d-e-cran-2026-07-23-a-20-55-56.png',
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
];
