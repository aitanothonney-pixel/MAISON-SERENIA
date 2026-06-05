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
    { productId: 33, color: 'Brun', colorHex: '#8B5E3C' },
  ],
};

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
    price: 1857,
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
      'https://i.ibb.co/gFctkCc0/IMG-2554.jpg',
      'https://i.ibb.co/Z1HkzsfN/IMG-2553.jpg',
      'https://i.ibb.co/x8LZvMgv/IMG-2565.jpg',
    ],
    dimensions: 'L 95 × P 90 × H 82 cm',
    material: 'Tissu maille 3D, base laquée',
    details: ['Forme sculpturale en modules gonflés', 'Tissu maille 3D haute résilience', 'Base laquée bleu nuit', 'Livraison en blanc incluse'],
  },
  {
    id: 13,
    name: 'Canapé Bubble bleu',
    category: 'Salon',
    price: 1857,
    description: 'Le Canapé Bubble 3 places en bleu Klein intense — une présence sculpturale et chromatique forte. Texture maille 3D signature, assise généreuse et enveloppante.',
    images: [
      'https://i.ibb.co/R1tJYDf/IMG-2491.jpg',
      'https://i.ibb.co/tMbZ7D3Y/IMG-0586.jpg',
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
    price: 1857,
    description: 'Le Canapé Bubble 3 places en rouge vif et ardent — énergie, caractère et confort sculptural. Une pièce iconique qui s\'impose avec force dans votre espace de vie.',
    images: [
      'https://i.ibb.co/zH4qtJVB/IMG-2511.jpg',
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
    price: 1857,
    description: 'Le Canapé Bubble 3 places dans un violet prune intense et vibrant — une édition spéciale aux proportions généreuses. Texture maille 3D unique, confort sculptural signature.',
    images: [
      'https://i.ibb.co/My8fK90B/IMG-2525.jpg',
      'https://i.ibb.co/yBk1BSq4/IMG-2659.jpg',
      'https://i.ibb.co/DfjGtFm8/IMG-2526.jpg',
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
  // ── Figurines KAWS Monde ─────────────────────────────────────────────────────
  {
    id: 31,
    name: 'Figurine KAWS noir monde',
    category: 'Figurines',
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
    category: 'Figurines',
    price: 75,
    description: 'Figurine KAWS édition Monde en coloris gris — subtilité et caractère dans une même pièce. Sculpture en vinyle premium, finition soyeuse, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/dss1k9Yf/IMG-0626.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition Monde collector', 'Vinyle premium finition soyeuse', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  {
    id: 33,
    name: 'Figurine KAWS brun monde',
    category: 'Figurines',
    price: 75,
    description: 'Figurine KAWS édition Monde en coloris brun chaleureux — une teinte rare et raffinée. Sculpture en vinyle premium, finition naturelle, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/WvDJ6BCH/IMG-0658.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition Monde collector', 'Vinyle premium finition naturelle', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Figurine KAWS Noir ────────────────────────────────────────────────────────
  {
    id: 34,
    name: 'Figurine Kaws noir (28 cm)',
    category: 'Figurines',
    price: 75,
    description: 'Figurine KAWS en coloris noir intense — pièce collector incontournable. Sculpture en vinyle premium, finition mate impeccable, 28 cm de hauteur.',
    images: [
      'https://i.ibb.co/rfHJgML3/IMG-0625.jpg',
      'https://i.ibb.co/s9x78xz3/IMG-0665.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Édition collector', 'Vinyle premium finition mate', 'Hauteur 28 cm', 'Livraison soigneusement emballée'],
  },
  // ── Bearbrick x Bape ─────────────────────────────────────────────────────────
  {
    id: 35,
    name: 'Bearbrick x Bape (28 cm)',
    category: 'Figurines',
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
    category: 'Figurines',
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
    category: 'Figurines',
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
    category: 'Figurines',
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
    category: 'Figurines',
    price: 75,
    description: 'Figurine KAWS câlin — une des poses les plus emblématiques de l\'artiste. Sculpture en vinyle premium, finition impeccable, pièce collector incontournable.',
    images: [
      'https://i.ibb.co/Tx10z5Hj/IMG-0627.jpg',
    ],
    dimensions: 'H 28 cm',
    material: 'Vinyle premium',
    details: ['Pose câlin emblématique', 'Vinyle premium finition mate', 'Pièce collector', 'Livraison soigneusement emballée'],
  },
];
