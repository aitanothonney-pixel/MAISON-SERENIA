// Génération déterministe des avis clients — partagée entre la fiche produit
// et la page « tous les avis ». Chaque avis est construit à partir des données
// réelles du produit (type + matière), avec plusieurs formulations possibles par
// matière et des détails variés, pour rester spécifique au produit tout en
// évitant les répétitions (au sein d'un produit comme d'un produit à l'autre).

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
  const five = 4 + Math.floor(rng() * 4);   // 4–7
  const four = 1 + Math.floor(rng() * 3);    // 1–3
  const three = Math.floor(rng() * 2);       // 0–1
  const two = rng() < 0.12 ? 1 : 0;          // rare
  const one = rng() < 0.06 ? 1 : 0;          // très rare
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

// Nom commun du produit, intégré naturellement à l'avis.
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

// Plusieurs formulations possibles par matière (choisies au hasard par avis).
function matVariantsOf(material: string, family: Family): string[] {
  const m = material.toLowerCase();
  if (m.includes('velours')) return ['le velours est doux et bien dense', 'le velours a un toucher très agréable', 'le velours donne un rendu chaleureux'];
  if (m.includes('chenille')) return ['le tissu chenille est doux et enveloppant', 'la chenille est cosy et agréable', 'le tissu chenille a un beau tombé'];
  if (m.includes('maille')) return ['la maille 3D est unique et agréable', 'la texture en maille est vraiment originale', 'la maille 3D rend superbe en vrai'];
  if (m.includes('bouclé') || m.includes('boucle')) return ['le tissu bouclé est moelleux', 'le bouclé est doux et cosy'];
  if (m.includes('flanelle') || m.includes('côtelé') || m.includes('cotele')) return ['le tissu côtelé est très agréable', 'les côtes du tissu donnent du cachet', 'le côtelé est doux et épais'];
  if (m.includes('lin')) return ["l'aspect lin est chaleureux", 'le lin apporte un côté naturel'];
  if (m.includes('tissu')) return ['le tissu est agréable et bien tendu', 'le tissu est de belle qualité'];
  if (m.includes('vinyle')) return ['le vinyle est parfaitement fini', 'les finitions du vinyle sont nettes', 'le vinyle a un rendu premium'];
  if (m.includes('résine') || m.includes('resine')) return ['la résine est nette et bien détaillée', 'les détails en résine sont bluffants'];
  if (m.includes('céramique') || m.includes('ceramique')) return ['la céramique est délicate et soignée', 'la céramique mate est superbe', 'la céramique a un beau grain'];
  if (m.includes('marbre')) return ["l'effet marbre est superbe", 'le marbre donne un rendu très chic', "l'effet marbre est bluffant"];
  if (m.includes('verre')) return ['le plateau en verre est élégant', 'le verre est net et sans défaut'];
  if (m.includes('rotin') || m.includes('cannage') || m.includes('cannelé') || m.includes('cannele')) return ['les détails sont finement réalisés', 'le cannage est très bien exécuté', 'les façades ont beaucoup de cachet'];
  if (m.includes('noyer') || m.includes('chêne') || m.includes('chene') || m.includes('bois')) return ['le bois est de belle qualité', 'le bois a un beau veinage', 'le bois est solide et bien fini'];
  if (m.includes('métal') || m.includes('metal') || m.includes('acier')) return ['la structure métallique est robuste', 'le piètement métal est stable', 'la structure est solide'];
  if (m.includes('mdf') || m.includes('panneaux') || m.includes('aggloméré') || m.includes('agglomere')) return ['les finitions sont propres et nettes', 'les panneaux sont bien assemblés'];
  if (family === 'seating') return ["l'assise est confortable et bien rembourrée", 'le rembourrage est généreux'];
  if (family === 'deco') return ['la finition est soignée', 'les détails sont soignés'];
  return ['les finitions sont soignées', 'la qualité est au rendez-vous'];
}

// ── Pools de phrases (combinées pour maximiser la variété) ───────────────────
// Placeholders : {noun} = type de produit, {mat} = matière (variable par avis),
// {Dem} = Ce/Cette, {art} = Le/La (début de phrase), {artl} = le/la (milieu).
const OPEN: Record<number, string[]> = {
  5: [
    'Un vrai coup de cœur.', 'Ravie de mon achat.', "Exactement ce que j'espérais.",
    '{Dem} {noun} est superbe.', 'Je recommande les yeux fermés.', 'Parfait du début à la fin.',
    '{Dem} {noun} rend encore mieux en vrai.', 'Sans hésiter, un excellent choix.',
    'Je suis vraiment conquise.', 'Rien à redire, du grand soin.',
    'Absolument ravi(e) de cet achat.', 'Au-delà de mes attentes.',
    '{Dem} {noun} dépasse mes espérances.', 'Une réussite totale.',
    'Je ne pouvais pas mieux tomber.', 'Coup de cœur immédiat.',
  ],
  4: [
    'Très satisfait de mon achat.', '{Dem} {noun} correspond bien à la description.',
    'Content dans l’ensemble.', '{Dem} {noun} est de belle facture.', 'Achat que je referais.',
    'Globalement très bien.', 'Une bonne surprise dans l’ensemble.',
    'Très bon achat, quelques détails près.', '{Dem} {noun} me plaît beaucoup.',
  ],
  3: [
    '{Dem} {noun} est convenable dans l’ensemble.', 'Correct, sans plus.', 'Mon avis est partagé.',
    'Un achat en demi-teinte.', 'Ni déçu(e) ni conquis(e).', '{Dem} {noun} fait le travail, sans plus.',
    'Résultat correct pour le prix.', 'Dans la moyenne, sans surprise.',
  ],
  2: [
    'Un peu déçu(e) par {artl} {noun}.', 'Expérience en demi-teinte.',
    'Pas totalement convaincu(e).', 'Quelques réserves sur cet achat.',
    'En dessous de ce que j’espérais.',
  ],
  1: [
    'Déçu(e) de cet achat.', 'Pas à la hauteur de mes attentes.',
    'Franchement décevant.', 'Je m’attendais à bien mieux.',
    'Vraiment pas convaincu(e).',
  ],
};

const DETAIL: Record<Family, Record<number, string[]>> = {
  seating: {
    5: [
      "L'assise est incroyablement confortable et {mat}.", 'On s’y sent tout de suite bien, et {mat}.',
      'Le maintien est parfait et {mat}.', 'Il transforme le salon, {mat}.',
      'La couleur est fidèle aux photos et {mat}.', 'On s’y enfonce comme dans un nuage, {mat}.',
      'Le confort d’assise est vraiment au rendez-vous, {mat}.', 'Il a beaucoup d’allure dans mon salon, {mat}.',
      'Moelleux à souhait, {mat}.', 'Les assises sont profondes et {mat}.',
      'Un confort digne d’une boutique haut de gamme, {mat}.',
    ],
    4: [
      'Confortable au quotidien, {mat}.', 'Bonne assise, {mat}.', 'Agréable à l’usage, {mat}.',
      'Confortable, avec juste un léger délai de livraison.', 'L’assise est accueillante, {mat}.',
      'Très cosy au quotidien, {mat}.', 'Belle assise enveloppante, {mat}.',
    ],
    3: [
      'L’assise reste correcte et {mat}, malgré un emballage perfectible.',
      'Le confort est là, {mat}, mais la teinte diffère un peu de l’écran.',
      'Confortable, mais la livraison a été un peu longue.',
      'Assise agréable, {mat}, même si les coussins manquent un peu de fermeté.',
      'Correct à l’usage, {mat}, mais rien d’exceptionnel.',
    ],
    2: [
      'Le confort est correct une fois installé, mais la livraison a traîné.',
      'Assise correcte, mais l’emballage laissait à désirer.',
      'Le rendu est sympa, {mat}, mais les finitions manquent de soin.',
      'Assise un peu ferme à mon goût, malgré un joli tissu.',
    ],
    1: [
      '{art} {noun} plaît beaucoup, mais l’attente a vraiment gâché l’expérience.',
      'Confort au rendez-vous, mais le délai était bien trop long.',
      'Déçu(e) : l’assise s’affaisse plus vite que prévu.',
      'Le tissu marque vite, dommage pour le prix.',
    ],
  },
  furniture: {
    5: [
      'Très solide et stable, {mat}.', 'Le montage a été simple et {mat}.',
      'Les dimensions sont exactes et {mat}.', 'Très bonne stabilité, {mat}.',
      'Aucune rayure à l’arrivée et {mat}.', 'Le montage a pris cinq minutes, tout s’emboîte parfaitement.',
      'Il structure vraiment la pièce.', 'Rapport qualité-prix imbattable pour ce rendu.',
    ],
    4: [
      'Bien fini, {mat}.', 'Montage un peu long mais tout s’emboîte, {mat}.', 'Solide pour le prix, {mat}.',
      'Conforme aux dimensions annoncées.', 'Quelques minutes de montage, résultat propre.',
    ],
    3: [
      'L’ensemble reste stable et {mat}, mais la livraison a été longue.',
      'Quelques finitions perfectibles, même si {mat}.',
      'Correct, mais le montage demande un peu de patience.',
      'Fait le travail, {mat}, mais la notice est peu claire.',
      'Correct dans l’ensemble, {mat}, sans être haut de gamme.',
    ],
    2: [
      'Un angle légèrement marqué à l’arrivée, mais {artl} {noun} reste utilisable.',
      'Montage laborieux, mais le résultat est correct.',
      'Quelques traces à la réception, même si {mat}.',
      'Les finitions manquent de soin pour ce tarif.',
    ],
    1: [
      '{art} {noun} tient ses promesses, mais l’attente a été bien trop longue.',
      'Produit correct, mais la livraison a vraiment traîné.',
      'Une pièce arrivée abîmée, difficile à monter.',
      'Matériau plus léger que prévu, déçu(e).',
    ],
  },
  deco: {
    5: [
      'La finition est nette et {mat}.', 'Très photogénique, {mat}.',
      'Très bel effet sur l’étagère, {mat}.', 'Les détails sont soignés et {mat}.',
      'Un objet qui attire tous les regards.', 'Un vrai petit objet de collection.',
      'Parfait pour habiller un meuble.',
    ],
    4: [
      'Joli rendu, {mat}.', 'La taille est un peu différente de l’écran, mais {mat}.',
      'Bel objet, {mat}.', 'Bel effet déco, et bien emballé.',
    ],
    3: [
      'Correct dans l’ensemble et {mat}, mais la taille surprend un peu.',
      'Joli, mais un peu plus petit que prévu.',
      'Bel objet, {mat}, mais la teinte diffère un peu des photos.',
      'Sympa pour le prix, sans être exceptionnel.',
    ],
    2: [
      'L’emballage était juste, mais la pièce est arrivée intacte.',
      'Plus petit que ce que j’imaginais, un peu déçu(e).',
      'Finition correcte, mais la couleur est moins vive en vrai.',
    ],
    1: [
      'La pièce est belle mais la livraison a été bien trop longue.',
      'Arrivée avec un léger défaut, dommage.',
      'Ne correspond pas tout à fait aux photos.',
    ],
  },
};

const CLOSE: Record<number, string[]> = {
  5: [
    'Livraison soignée, rien à redire.', 'Emballage impeccable.', 'Le rendu est vraiment haut de gamme.',
    'Je recommande cette boutique.', 'Un achat que je ne regrette pas.', 'Merci Maison Serenia !',
    'Expédition rapide et soignée.', 'Je repasserai commande sans hésiter.',
    'Une boutique sérieuse, je reviendrai.', 'Colis parfaitement protégé.',
    'Service au top du début à la fin.', 'Exactement conforme à la description.',
  ],
  4: [
    'Bon rapport qualité-prix.', 'Service client réactif.', 'Livraison correcte dans les temps.',
    'Rien à signaler côté livraison.', 'Emballage soigné dans l’ensemble.',
    'Une boutique fiable.',
  ],
  3: [
    'Le SAV a tout de même été à l’écoute.', 'Reste correct pour le prix.',
    'Un achat correct au final.', 'Ça reste acceptable.', 'Rien d’exceptionnel, mais ça va.',
  ],
  2: [
    'Le service a fini par arranger les choses.', 'Communication à améliorer.',
    'J’espérais un peu mieux.', 'Peut mieux faire.',
  ],
  1: [
    'Suivi de commande décevant.', 'J’espère que le service s’améliorera.',
    'Je ne recommande pas vraiment.', 'Expérience à revoir.',
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

// Comme pick, mais décale l'index d'un « sel » propre au produit : deux produits
// différents ne tombent (quasi) jamais sur la même combinaison de phrases.
const pickRot = <T,>(pool: T[], rng: () => number, salt: number): T =>
  pool[(Math.floor(rng() * pool.length) + (salt % pool.length) + pool.length) % pool.length];

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
  const matVariants = matVariantsOf(mat, family);
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

  const fill = (s: string, matPhrase: string) =>
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
      // Compose un texte unique au sein du produit (matière variable par avis)
      let text = '';
      for (let attempt = 0; attempt < 12; attempt++) {
        const mp = pick(matVariants, rng);
        const candidate =
          `${fill(pickRot(OPEN[rating], rng, productId), mp)} ${fill(pickRot(DETAIL[family][rating], rng, productId * 2 + 1), mp)} ${fill(pickRot(CLOSE[rating], rng, productId * 3 + 2), mp)}`;
        text = candidate;
        if (!seenTexts.has(candidate)) break;
      }
      seenTexts.add(text);

      // Nom unique au sein du produit
      let reviewer = '';
      for (let attempt = 0; attempt < 15; attempt++) {
        const candidate = `${pick(FIRST_NAMES, rng)} ${pick(LAST_INITIALS, rng)}`;
        reviewer = candidate;
        if (!seenNames.has(candidate)) break;
      }
      seenNames.add(reviewer);

      reviews.push({ name: reviewer, rating, text, date: makeDate(rng) });
    }
  }

  // Mélange pour ne pas afficher tous les 5★ d'affilée
  for (let i = reviews.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
  }

  return reviews.slice(0, cap);
}
