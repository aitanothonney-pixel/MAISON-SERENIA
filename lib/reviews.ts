// Génération déterministe des avis clients — partagée entre la fiche produit
// et la page « tous les avis ». Les avis sont construits à partir des données
// réelles du produit (type + matière) et combinés (ouverture + détail + clôture)
// pour être spécifiques au produit et éviter les répétitions d'un produit à l'autre.

import { products } from './products';

export function seedFromId(seed: number) {
  let s = seed;
  return function next() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Volumes volontairement modestes (quelques avis crédibles par produit).
export function buildReviewStats(productId: number) {
  const rng = seedFromId(productId * 7 + 4242);
  const five = 5 + Math.floor(rng() * 5);   // 5–9
  const four = 2 + Math.floor(rng() * 3);    // 2–4
  const three = Math.floor(rng() * 2);       // 0–1
  const two = rng() < 0.15 ? 1 : 0;          // rare
  const one = rng() < 0.08 ? 1 : 0;          // très rare
  const total = five + four + three + two + one;
  const avg = Math.round(((five * 5 + four * 4 + three * 3 + two * 2 + one * 1) / total) * 10) / 10;
  return { five, four, three, two, one, total, avg };
}

const FIRST_NAMES = [
  'Sophie', 'Antoine', 'Laura', 'Thomas', 'Camille', 'Nicolas', 'Marie', 'Julien',
  'Émilie', 'Alexandre', 'Chloé', 'Maxime', 'Léa', 'Hugo', 'Sarah', 'Lucas',
  'Manon', 'Romain', 'Clara', 'Pierre', 'Inès', 'Baptiste', 'Juliette', 'Mathieu',
  'Anaïs', 'Guillaume', 'Océane', 'Vincent', 'Pauline', 'Florian', 'Céline', 'Damien',
  'Nadia', 'Boris', 'Diane', 'Marc', 'Alice', 'Hélène', 'Fabien', 'Sabrina',
];
const LAST_INITIALS = ['M.', 'R.', 'P.', 'G.', 'L.', 'B.', 'D.', 'F.', 'T.', 'C.', 'V.', 'S.', 'K.', 'N.'];

type Family = 'seating' | 'furniture' | 'deco';

function familyOf(category: string, name: string): Family {
  if (name.includes('Bubble') || category === 'Salon') return 'seating';
  if (category === 'Décorations') return 'deco';
  return 'furniture';
}

// Détermine le nom commun du produit pour l'intégrer naturellement à l'avis.
function nounOf(name: string, category: string): string {
  const n = name.toLowerCase();
  if (n.includes('canapé-lit')) return 'canapé-lit';
  if (n.includes('canapé')) return 'canapé';
  if (n.includes('fauteuil')) return 'fauteuil';
  if (n.includes('table basse')) return 'table basse';
  if (n.includes('table')) return 'table';
  if (n.includes('meuble tv') || n.includes('meuble télé')) return 'meuble TV';
  if (n.includes('commode')) return 'commode';
  if (n.includes('buffet')) return 'buffet';
  if (n.includes('étagère') || n.includes('etagere')) return 'étagère';
  if (n.includes('vase')) return 'vase';
  if (n.includes('bearbrick') || n.includes('kaws') || n.includes('figurine')) return 'figurine';
  if (category === 'Décorations') return 'pièce';
  if (category === 'Salon') return 'canapé';
  return 'meuble';
}

// Genre grammatical du nom commun (pour accorder Ce/Cette, Le/La).
function isFeminine(noun: string): boolean {
  return ['table basse', 'table', 'commode', 'étagère', 'figurine', 'pièce'].includes(noun);
}

// Traduit la matière du produit en une petite proposition (en minuscule, milieu de phrase).
function matPhraseOf(material: string, family: Family): string {
  const m = material.toLowerCase();
  if (m.includes('velours')) return 'le velours est doux et bien dense';
  if (m.includes('chenille')) return 'le tissu chenille est doux et enveloppant';
  if (m.includes('maille')) return 'la maille 3D est unique et agréable';
  if (m.includes('bouclé') || m.includes('boucle')) return 'le tissu bouclé est moelleux';
  if (m.includes('flanelle') || m.includes('côtelé') || m.includes('cotele')) return 'le tissu côtelé est très agréable';
  if (m.includes('lin')) return "l'aspect lin est chaleureux";
  if (m.includes('tissu')) return 'le tissu est agréable et bien tendu';
  if (m.includes('vinyle')) return 'le vinyle est parfaitement fini';
  if (m.includes('résine') || m.includes('resine')) return 'la résine est nette et bien détaillée';
  if (m.includes('céramique') || m.includes('ceramique')) return 'la céramique est délicate et soignée';
  if (m.includes('marbre')) return "le plateau effet marbre est superbe";
  if (m.includes('verre')) return 'le plateau en verre est élégant';
  if (m.includes('rotin') || m.includes('cannage') || m.includes('cannelé')) return 'les détails sont finement réalisés';
  if (m.includes('noyer') || m.includes('chêne') || m.includes('chene') || m.includes('bois')) return 'le bois est de belle qualité';
  if (m.includes('métal') || m.includes('metal') || m.includes('acier')) return 'la structure métallique est robuste';
  if (m.includes('mdf') || m.includes('panneaux') || m.includes('aggloméré') || m.includes('agglomere')) return 'les finitions sont propres et nettes';
  if (family === 'seating') return "l'assise est confortable et bien rembourrée";
  if (family === 'deco') return 'la finition est soignée';
  return 'les finitions sont soignées';
}

// ── Pools de phrases (combinées pour maximiser la variété) ───────────────────
// Placeholders : {noun} = type de produit, {mat} = matière, {Dem} = Ce/Cette,
// {art} = Le/La (début de phrase), {artl} = le/la (milieu de phrase).
const OPEN: Record<number, string[]> = {
  5: [
    'Un vrai coup de cœur.', 'Ravie de mon achat.', "Exactement ce que j'espérais.",
    '{Dem} {noun} est superbe.', 'Je recommande les yeux fermés.', 'Parfait du début à la fin.',
    '{Dem} {noun} rend encore mieux en vrai.', 'Sans hésiter, un excellent choix.',
  ],
  4: [
    'Très satisfait de mon achat.', '{Dem} {noun} correspond bien à la description.',
    'Content dans l’ensemble.', '{Dem} {noun} est de belle facture.', 'Achat que je referais.',
  ],
  3: [
    '{Dem} {noun} est convenable dans l’ensemble.', 'Correct, sans plus.', 'Mon avis est partagé.',
  ],
  2: [
    'Un peu déçu(e) par {artl} {noun}.', 'Expérience mitigée.',
  ],
  1: [
    'Déçu(e) de cet achat.', 'Pas à la hauteur de mes attentes.',
  ],
};

const DETAIL: Record<Family, Record<number, string[]>> = {
  seating: {
    5: [
      "L'assise est incroyablement confortable et {mat}.", 'On s’y sent tout de suite bien, et {mat}.',
      'Le maintien est parfait et {mat}.', 'Il transforme le salon, {mat}.', 'La couleur est fidèle aux photos et {mat}.',
    ],
    4: [
      'Confortable au quotidien, {mat}.', 'Bonne assise, {mat}.', 'Agréable à l’usage, {mat}.',
    ],
    3: [
      'L’assise reste correcte et {mat}, malgré un emballage perfectible.',
      'Le confort est là, {mat}, mais la teinte diffère un peu de l’écran.',
    ],
    2: ['Le confort est correct une fois installé, mais la livraison a traîné.'],
    1: ['{art} {noun} plaît beaucoup, mais l’attente a vraiment gâché l’expérience.'],
  },
  furniture: {
    5: [
      'Très solide et stable, {mat}.', 'Le montage a été simple et {mat}.',
      'Les dimensions sont exactes et {mat}.', 'Structure robuste, {mat}.', 'Aucune rayure à l’arrivée et {mat}.',
    ],
    4: [
      'Bien fini, {mat}.', 'Montage un peu long mais tout s’emboîte, {mat}.', 'Solide pour le prix, {mat}.',
    ],
    3: [
      'L’ensemble reste stable et {mat}, mais la livraison a été longue.',
      'Quelques finitions perfectibles, même si {mat}.',
    ],
    2: ['Un angle légèrement marqué à l’arrivée, mais {artl} {noun} reste utilisable.'],
    1: ['{art} {noun} tient ses promesses, mais l’attente a été bien trop longue.'],
  },
  deco: {
    5: [
      'La finition est superbe et {mat}.', 'Très photogénique, {mat}.',
      'Très bel effet sur l’étagère, {mat}.', 'Les détails sont soignés et {mat}.',
    ],
    4: [
      'Joli rendu, {mat}.', 'La taille est un peu différente de l’écran, mais {mat}.', 'Bel objet, {mat}.',
    ],
    3: [
      'Correct dans l’ensemble et {mat}, mais la taille surprend un peu.',
    ],
    2: ['L’emballage était juste, mais la pièce est arrivée intacte.'],
    1: ['La pièce est belle mais la livraison a été bien trop longue.'],
  },
};

const CLOSE: Record<number, string[]> = {
  5: [
    'Livraison soignée, rien à redire.', 'Emballage impeccable.', 'Le rendu est vraiment haut de gamme.',
    'Je recommande cette boutique.', 'Un achat que je ne regrette pas.', 'Merci Maison Serenia !',
  ],
  4: [
    'Bon rapport qualité-prix.', 'Service client réactif.', 'Livraison correcte dans les temps.',
  ],
  3: [
    'Le SAV a tout de même été à l’écoute.', 'Reste correct pour le prix.',
  ],
  2: [
    'Le service a fini par arranger les choses.', 'Communication à améliorer.',
  ],
  1: [
    'Suivi de commande décevant.', 'J’espère que le service s’améliorera.',
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

const pick = <T,>(pool: T[], rng: () => number): T => pool[Math.floor(rng() * pool.length)];

// Génère les avis d'un produit : spécifiques (type + matière), variés, sans doublon interne.
export function buildAllReviews(productId: number, category = 'Meubles', name = '', cap = 999): Review[] {
  const product = products.find((p) => p.id === productId);
  const cat = product?.category ?? category;
  const nm = product?.name ?? name;
  const mat = product?.material ?? '';

  const stats = buildReviewStats(productId);
  const rng = seedFromId(productId * 101 + 31);
  const family = familyOf(cat, nm);
  const noun = nounOf(nm, cat);
  const matPhrase = matPhraseOf(mat, family);
  const fem = isFeminine(noun);
  const dem = fem ? 'Cette' : 'Ce';
  const artCap = fem ? 'La' : 'Le';
  const artLow = fem ? 'la' : 'le';

  const buckets = [
    { rating: 5, count: stats.five },
    { rating: 4, count: stats.four },
    { rating: 3, count: stats.three },
    { rating: 2, count: stats.two },
    { rating: 1, count: stats.one },
  ];

  const fill = (s: string) =>
    s
      .replace(/\{Dem\}/g, dem)
      .replace(/\{art\}/g, artCap)
      .replace(/\{artl\}/g, artLow)
      .replace(/\{noun\}/g, noun)
      .replace(/\{mat\}/g, matPhrase);

  const reviews: Review[] = [];
  const seenTexts = new Set<string>();
  const seenNames = new Set<string>();

  for (const { rating, count } of buckets) {
    for (let i = 0; i < count; i++) {
      // Compose un texte unique au sein du produit
      let text = '';
      for (let attempt = 0; attempt < 10; attempt++) {
        const detailPool = DETAIL[family][rating];
        const candidate = `${fill(pick(OPEN[rating], rng))} ${fill(pick(detailPool, rng))} ${fill(pick(CLOSE[rating], rng))}`;
        text = candidate;
        if (!seenTexts.has(candidate)) break;
      }
      seenTexts.add(text);

      // Nom unique au sein du produit
      let name = '';
      for (let attempt = 0; attempt < 12; attempt++) {
        const candidate = `${pick(FIRST_NAMES, rng)} ${pick(LAST_INITIALS, rng)}`;
        name = candidate;
        if (!seenNames.has(candidate)) break;
      }
      seenNames.add(name);

      reviews.push({ name, rating, text, date: makeDate(rng) });
    }
  }

  // Mélange pour ne pas afficher tous les 5★ d'affilée
  for (let i = reviews.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
  }

  return reviews.slice(0, cap);
}
