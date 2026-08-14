// Génération déterministe des avis clients — partagée entre la page produit
// et la page « tous les avis » pour que les statistiques restent cohérentes.
// Les textes sont adaptés à la catégorie du produit (mobilier).

export function seedFromId(seed: number) {
  let s = seed;
  return function next() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Volumes réalistes et modérés (une douzaine à une trentaine d'avis par produit).
export function buildReviewStats(productId: number) {
  const rng = seedFromId(productId * 7 + 4242);
  const five = 9 + Math.floor(rng() * 13);   // 9–21
  const four = 3 + Math.floor(rng() * 5);     // 3–7
  const three = 1 + Math.floor(rng() * 3);    // 1–3
  const two = Math.floor(rng() * 2);          // 0–1
  const one = Math.floor(rng() * 2);          // 0–1
  const total = five + four + three + two + one;
  const avg = Math.round(((five * 5 + four * 4 + three * 3 + two * 2 + one * 1) / total) * 10) / 10;
  return { five, four, three, two, one, total, avg };
}

const FIRST_NAMES = [
  'Sophie', 'Antoine', 'Laura', 'Thomas', 'Camille', 'Nicolas', 'Marie', 'Julien',
  'Émilie', 'Alexandre', 'Chloé', 'Maxime', 'Léa', 'Hugo', 'Sarah', 'Lucas',
  'Manon', 'Romain', 'Clara', 'Pierre', 'Inès', 'Baptiste', 'Juliette', 'Mathieu',
  'Anaïs', 'Guillaume', 'Océane', 'Vincent', 'Pauline', 'Florian', 'Céline', 'Damien',
];
const LAST_INITIALS = ['M.', 'R.', 'P.', 'G.', 'L.', 'B.', 'D.', 'F.', 'T.', 'C.', 'V.', 'S.'];

// ── Textes d'avis par famille de produit ────────────────────────────────────
// On regroupe par « type » de meuble pour que l'avis colle vraiment au produit.
type Family = 'seating' | 'furniture' | 'deco';

function familyOf(category: string, name: string): Family {
  if (name.includes('Bubble') || category === 'Salon') return 'seating';
  if (category === 'Décorations') return 'deco';
  return 'furniture';
}

const TEXTS: Record<Family, Record<number, string[]>> = {
  // Canapés & fauteuils
  seating: {
    5: [
      "Assise incroyablement moelleuse, on ne veut plus se lever ! Le tissu est doux et la couleur est fidèle aux photos.",
      "Ce canapé transforme complètement le salon. Confort exceptionnel et finitions haut de gamme, un vrai coup de cœur.",
      "Encore plus beau en vrai. Très confortable, bien rembourré, et la mousse garde parfaitement sa forme.",
      "Livré bien emballé, aucune trace. L'assise est ferme mais enveloppante, exactement le confort que je cherchais.",
      "Pièce maîtresse de mon salon. Le rendu est luxueux et tout le monde me demande où je l'ai acheté.",
    ],
    4: [
      "Très confortable et joli. Le montage des pieds demande deux minutes mais rien de compliqué.",
      "Beau canapé, tissu agréable. La teinte est très légèrement plus foncée qu'à l'écran, mais superbe quand même.",
      "Confort au rendez-vous. Livraison un peu longue mais la qualité de l'assise vaut l'attente.",
    ],
    3: [
      "Assise confortable mais l'emballage aurait pu être plus protecteur. Le produit en lui-même reste très bien.",
      "Conforme dans l'ensemble. La couleur est un peu différente de ce que j'imaginais mais le confort est là.",
    ],
    2: [
      "Livraison retardée et suivi à améliorer. Le canapé est confortable une fois installé, heureusement.",
    ],
    1: [
      "Délai d'attente trop long à mon goût. Le canapé est beau mais l'expérience a été gâchée par la logistique.",
    ],
  },
  // Meubles (tables, meubles TV, commodes, buffets…)
  furniture: {
    5: [
      "Meuble très solide, le bois est de belle qualité et le montage a été simple avec la notice fournie.",
      "Exactement les bonnes dimensions pour mon intérieur. Finitions nettes, aucune rayure, je recommande.",
      "Superbe pièce, stable et robuste. Le rendu est élégant et bien plus qualitatif que le prix ne le laisse penser.",
      "Montage rapide et résultat impeccable. Le plateau est bien fini et la structure ne bouge pas d'un pouce.",
      "Très satisfaite : le meuble structure la pièce, matériaux agréables au toucher et coloris fidèle.",
    ],
    4: [
      "Bon meuble, bien fini. Le montage prend un peu de temps mais tout s'emboîte correctement.",
      "Conforme à la description, solide. Une petite marque à la livraison mais le SAV a été réactif.",
      "Rapport qualité-prix correct. Les dimensions sont exactes, parfait pour l'espace prévu.",
    ],
    3: [
      "Meuble correct mais la livraison a été plus longue que prévu. La qualité reste au rendez-vous.",
      "Quelques détails de finition perfectibles, mais l'ensemble est stable et fait son effet.",
    ],
    2: [
      "Emballage à améliorer, un angle légèrement marqué à l'arrivée. Le meuble reste utilisable et correct.",
    ],
    1: [
      "Délai de livraison bien trop long. Le meuble est joli une fois monté mais l'attente a gâché l'achat.",
    ],
  },
  // Décorations (sculptures, vases, objets déco)
  deco: {
    5: [
      "Pièce déco magnifique, elle attire tous les regards sur mon étagère. Finition impeccable et taille parfaite.",
      "Exactement le rendu que j'espérais. Objet de belle facture, bien emballé, un vrai petit bijou déco.",
      "Superbe ! Les détails sont soignés et la présentation est très haut de gamme. Je recommande.",
      "Très belle pièce, elle habille parfaitement mon salon. Conforme aux photos et livraison soignée.",
    ],
    4: [
      "Joli objet, bien fini. Un peu plus petit que je pensais mais l'effet déco est réussi.",
      "Très content de mon achat. La teinte est légèrement différente de l'écran mais reste superbe.",
    ],
    3: [
      "Bien mais sans plus. La taille est un peu différente de ce que j'imaginais.",
    ],
    2: [
      "Emballage à améliorer, mais l'objet est arrivé intact et fait son petit effet.",
    ],
    1: [
      "Livraison bien trop longue. L'objet est beau mais l'attente a gâché l'expérience.",
    ],
  },
};

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function makeDate(rng: () => number) {
  const day = 1 + Math.floor(rng() * 27);
  const month = MONTHS[Math.floor(rng() * MONTHS.length)];
  const year = rng() < 0.35 ? 2025 : 2026;
  return `${day} ${month} ${year}`;
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

// Génère la liste complète des avis, répartis selon les statistiques du produit.
export function buildAllReviews(productId: number, category = 'Meubles', name = '', cap = 999): Review[] {
  const stats = buildReviewStats(productId);
  const rng = seedFromId(productId * 101 + 31);
  const family = familyOf(category, name);
  const pool = TEXTS[family];

  const buckets: { rating: number; count: number }[] = [
    { rating: 5, count: stats.five },
    { rating: 4, count: stats.four },
    { rating: 3, count: stats.three },
    { rating: 2, count: stats.two },
    { rating: 1, count: stats.one },
  ];

  const reviews: Review[] = [];
  for (const { rating, count } of buckets) {
    for (let i = 0; i < count; i++) {
      const texts = pool[rating];
      reviews.push({
        name: `${FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(rng() * LAST_INITIALS.length)]}`,
        rating,
        text: texts[Math.floor(rng() * texts.length)],
        date: makeDate(rng),
      });
    }
  }

  // Mélange pour ne pas afficher tous les 5★ d'affilée
  for (let i = reviews.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
  }

  return reviews.slice(0, cap);
}
