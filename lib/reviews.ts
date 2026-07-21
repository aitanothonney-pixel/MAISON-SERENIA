// Génération déterministe des avis clients — partagée entre la page produit
// et la page « tous les avis » pour que les statistiques restent cohérentes.

export function seedFromId(seed: number) {
  let s = seed;
  return function next() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildReviewStats(productId: number) {
  const rng = seedFromId(productId * 7 + 4242);
  const five = 45 + Math.floor(rng() * 55);
  const four = 15 + Math.floor(rng() * 30);
  const three = 6 + Math.floor(rng() * 12);
  const two = 2 + Math.floor(rng() * 6);
  const one = 1 + Math.floor(rng() * 4);
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

const TEXTS: Record<number, string[]> = {
  5: [
    "Absolument magnifique ! Conforme aux photos, emballage impeccable et livraison rapide. Je recommande vivement.",
    "Un véritable coup de cœur. La qualité est au rendez-vous et le rendu dans mon salon est superbe.",
    "Exactement ce que je cherchais. Finitions soignées, confort incroyable. Rien à redire.",
    "Produit premium, service client réactif. La pièce transforme complètement la pièce, je suis ravie.",
    "Livraison soignée et montage facile. La qualité dépasse mes attentes, un achat que je ne regrette pas.",
    "Parfait du début à la fin. Commande simple, suivi impeccable et un produit sublime à l'arrivée.",
  ],
  4: [
    "Très bon produit, conforme à la description. Un petit délai de livraison mais le résultat en vaut la peine.",
    "Qualité au rendez-vous, exactement ce que je cherchais pour mon intérieur. Livraison soignée.",
    "Très satisfait dans l'ensemble. La couleur est légèrement différente de l'écran mais reste superbe.",
    "Bel objet, bien fini. J'aurais aimé un emballage encore plus protecteur, mais rien de cassé.",
    "Content de mon achat. Rapport qualité-prix correct et service client à l'écoute.",
  ],
  3: [
    "Produit correct mais la livraison a été plus longue que prévu. La qualité reste au rendez-vous.",
    "Conforme dans l'ensemble, quelques détails de finition perfectibles. Service client réactif malgré tout.",
    "Bien mais sans plus. La teinte est un peu différente de ce que j'imaginais.",
  ],
  2: [
    "Livraison retardée et communication à améliorer. Le produit en lui-même reste correct.",
    "Un peu déçu par l'emballage à l'arrivée. Le SAV a été arrangeant heureusement.",
  ],
  1: [
    "Délai de livraison bien trop long à mon goût. Le produit est beau mais l'attente a gâché l'expérience.",
    "Déçu par le suivi de commande. J'espère que le service s'améliorera.",
  ],
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
export function buildAllReviews(productId: number, cap = 999): Review[] {
  const stats = buildReviewStats(productId);
  const rng = seedFromId(productId * 101 + 31);

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
      const texts = TEXTS[rating];
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
