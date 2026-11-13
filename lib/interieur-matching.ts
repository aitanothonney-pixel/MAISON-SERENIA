// ─────────────────────────────────────────────────────────────────────────────
// MON INTÉRIEUR IA — Moteur de correspondance déterministe sur le VRAI catalogue.
//
// Règle absolue : on ne recommande QUE des produits réels de lib/products.ts,
// avec leurs prix, dimensions et coloris réels. Aucune invention possible ici,
// puisque toutes les données proviennent du catalogue existant.
//
// La couche IA (Claude) ne reçoit que les candidats réels produits ici : elle
// explique et classe, elle n'invente pas.
// ─────────────────────────────────────────────────────────────────────────────

import { products, nice99, type Product } from './products';

export type RoomKey =
  | 'salon' | 'chambre' | 'salle-a-manger' | 'bureau' | 'entree' | 'decoration' | 'autre';

export interface InterieurBrief {
  room: RoomKey;
  intent?: string;        // sous-choix (ex. 'canape', 'fauteuil', 'tout', 'deco', 'petit-espace')
  decoType?: string;      // si room = decoration ('murale'|'luminaires'|'objets'|'tapis'|'accessoires'|'autre')
  description?: string;
  dims?: {
    length?: number;      // longueur pièce (m)
    width?: number;       // largeur pièce (m)
    height?: number;      // hauteur sous plafond (m)
    maxWidth?: number;    // largeur max dispo pour un meuble (cm)
    maxDepth?: number;    // profondeur max dispo (cm)
  };
  styles?: string[];      // ex. ['moderne','minimaliste']
  colors?: string[];      // ex. ['beige','noir']
  budgetChf?: { min?: number; max?: number } | 'tbd';
  currency?: 'CHF' | 'EUR';
}

export type DimensionVerdict = 'fits' | 'tight' | 'too-big' | 'unknown';

export interface Reco {
  id: number;
  name: string;
  category: string;
  priceChf: number;
  dimensions: string;
  images: string[];
  colors: string[];
  score: number;
  dimensionVerdict: DimensionVerdict;
  reasons: {
    why: string;
    styleFit: string;
    dimension: string;
    placement: string;
  };
  pairWithId?: number;
}

// Prix de vente réel affiché (parité avec le reste du site).
export function sellingChf(p: Product): number {
  if (p.sizes?.length) return p.sizes[0].price;
  if (p.name.includes('Bubble')) return nice99(Math.round(p.price * 0.7));
  return p.price;
}

// Parse « L 115 × P 120 × H 70 cm » → { l, p, h } en cm.
function parseDims(s: string): { l?: number; p?: number; h?: number } {
  const num = (re: RegExp) => {
    const m = s.match(re);
    return m ? parseFloat(m[1].replace(',', '.')) : undefined;
  };
  return { l: num(/L\s*([\d.,]+)/i), p: num(/P\s*([\d.,]+)/i), h: num(/H\s*([\d.,]+)/i) };
}

// Coloris réels d'un produit (depuis imageColor[] sinon détectés dans le nom).
const COLOR_WORDS = ['blanc', 'noir', 'gris', 'beige', 'marron', 'taupe', 'crème', 'creme', 'bleu', 'vert', 'rouge', 'rose', 'violet', 'orange', 'jaune', 'or', 'doré', 'dore', 'argent', 'terracotta', 'camel', 'bordeaux'];
export function productColors(p: Product): string[] {
  const set = new Set<string>();
  (p.imageColor || []).forEach((c) => c && set.add(c.toLowerCase().trim()));
  const hay = `${p.name} ${p.description}`.toLowerCase();
  COLOR_WORDS.forEach((c) => { if (hay.includes(c)) set.add(c); });
  return [...set];
}

// Pièce → catégories du catalogue + mots-clés de nom pertinents.
// Mots-clés UNIQUEMENT sur des types de produits réellement présents au catalogue
// (canapés, fauteuils, commodes, meubles TV, tables, étagères, vases, tableaux,
// lampes/lustres). Aucun type non vendu (miroir, console, buffet, chaise, lit, tapis…).
const ROOM_MAP: Record<RoomKey, { categories: string[]; nameHints: string[] }> = {
  salon:            { categories: ['Salon', 'Décorations'], nameHints: ['canapé', 'fauteuil', 'table basse'] },
  chambre:          { categories: ['Meubles', 'Décorations'], nameHints: ['commode', 'table basse', 'lampe', 'tableau'] },
  'salle-a-manger': { categories: ['Meubles', 'Salon', 'Décorations'], nameHints: ['table à manger', 'table', 'lustre', 'suspension'] },
  bureau:           { categories: ['Meubles', 'Décorations'], nameHints: ['étagère', 'commode', 'lampe', 'support'] },
  entree:           { categories: ['Meubles', 'Décorations'], nameHints: ['commode', 'étagère', 'tableau', 'lampe'] },
  decoration:       { categories: ['Décorations'], nameHints: [] },
  autre:            { categories: ['Salon', 'Meubles', 'Décorations'], nameHints: [] },
};

const DECO_HINTS: Record<string, string[]> = {
  murale: ['tableau'],
  luminaires: ['lampe', 'lustre', 'suspension'],
  objets: ['vase', 'support', 'étagère'],
  autre: [],
};

const STYLE_KEYWORDS: Record<string, string[]> = {
  moderne: ['moderne', 'design', 'contemporain'],
  minimaliste: ['minimaliste', 'épuré', 'epure', 'sobre', 'ligne'],
  contemporain: ['contemporain', 'moderne'],
  scandinave: ['scandinave', 'bois clair', 'nordique', 'chêne', 'chene'],
  vintage: ['vintage', 'rétro', 'retro', 'années', 'bohème', 'boho'],
  industriel: ['industriel', 'métal', 'metal', 'acier', 'loft'],
  luxe: ['luxe', 'marbre', 'velours', 'laiton', 'doré', 'dore', 'raffiné', 'raffine'],
  chaleureux: ['chaleureux', 'bois', 'cosy', 'cocooning', 'laine', 'tissu'],
};

function dimensionCheck(p: Product, brief: InterieurBrief): { verdict: DimensionVerdict; text: string } {
  const d = parseDims(p.dimensions);
  const maxW = brief.dims?.maxWidth;
  const maxD = brief.dims?.maxDepth;
  // Largeur de mur en mètres → borne souple (90 % du mur) si pas de maxWidth explicite.
  const wallW = brief.dims?.width ? Math.round(brief.dims.width * 100 * 0.9) : undefined;
  const limW = maxW ?? wallW;
  if (!d.l && !d.p) return { verdict: 'unknown', text: `Dimensions du produit : ${p.dimensions}. Communiquez vos mesures pour une vérification précise.` };
  if (!limW && !maxD) return { verdict: 'unknown', text: `Dimensions : ${p.dimensions}. Ajoutez la largeur/profondeur disponible pour que je vérifie l'encombrement.` };
  const overW = limW && d.l ? d.l > limW : false;
  const overD = maxD && d.p ? d.p > maxD : false;
  if (overW || overD) {
    return { verdict: 'too-big', text: `⚠️ Ce meuble mesure ${p.dimensions} — il dépasse l'espace indiqué (${limW ? `largeur dispo ~${limW} cm` : ''}${limW && maxD ? ', ' : ''}${maxD ? `profondeur ~${maxD} cm` : ''}). À vérifier avant achat.` };
  }
  // Tight si > 80 % de la contrainte.
  const tightW = limW && d.l ? d.l > limW * 0.8 : false;
  if (tightW) return { verdict: 'tight', text: `Il rentre (${p.dimensions}) mais occupe une bonne part de l'espace disponible (~${limW} cm) : prévoyez le dégagement.` };
  return { verdict: 'fits', text: `✅ Rentre dans votre espace : ${p.dimensions}${limW ? ` (largeur dispo ~${limW} cm)` : ''}.` };
}

function placementTip(category: string, name: string): string {
  const n = name.toLowerCase();
  if (n.includes('canapé')) return 'À placer face au point focal de la pièce (TV, cheminée) en laissant ~80 cm de passage.';
  if (n.includes('fauteuil')) return 'Idéal en angle de lecture près d’une fenêtre ou en complément du canapé.';
  if (n.includes('table basse')) return 'Centrez-la devant le canapé en gardant ~40 cm d’écart pour circuler.';
  if (n.includes('table')) return 'Prévoyez ~90 cm de dégagement autour pour circuler confortablement.';
  if (n.includes('tableau')) return 'À accrocher à hauteur des yeux (~150 cm du sol) sur un mur dégagé.';
  if (n.includes('lampe') || n.includes('suspension') || n.includes('lustre')) return 'Parfait pour réchauffer un angle ou créer une lumière d’ambiance tamisée.';
  if (n.includes('étagère') || n.includes('support')) return 'À adosser à un mur pour exposer livres et objets sans encombrer le sol.';
  if (n.includes('vase')) return 'À poser sur une étagère, une commode ou une table basse pour rythmer la pièce.';
  if (category === 'Meubles') return 'À adosser à un mur libre pour structurer l’espace sans gêner la circulation.';
  return 'S’intègre facilement comme pièce d’accent dans votre composition.';
}

// Complément logique (vrai produit) pour « Pour compléter votre intérieur ».
function complementFor(p: Product, pool: Product[]): Product | undefined {
  const n = p.name.toLowerCase();
  const find = (kw: string) => pool.find((x) => x.id !== p.id && x.name.toLowerCase().includes(kw));
  if (n.includes('canapé')) return find('table basse') || find('fauteuil') || find('lampe') || find('tableau');
  if (n.includes('fauteuil')) return find('lampe') || find('table basse') || find('tableau');
  if (n.includes('table')) return find('suspension') || find('lustre') || find('vase');
  if (n.includes('tableau')) return find('lampe') || find('vase');
  if (n.includes('lampe') || n.includes('lustre')) return find('tableau') || find('vase');
  return find('vase') || find('tableau') || find('étagère');
}

export interface MatchResult {
  recos: Reco[];
  complements: { id: number; name: string; category: string; priceChf: number; images: string[] }[];
  meta: { candidateCount: number; roomLabel: string; noExactMatch?: boolean; note?: string };
}

const ROOM_LABELS: Record<RoomKey, string> = {
  salon: 'Salon', chambre: 'Chambre', 'salle-a-manger': 'Salle à manger',
  bureau: 'Bureau', entree: 'Entrée', decoration: 'Décoration', autre: 'Votre espace',
};

export function matchProducts(brief: InterieurBrief): MatchResult {
  const map = ROOM_MAP[brief.room] ?? ROOM_MAP.autre;
  const styleKws = (brief.styles || []).flatMap((s) => STYLE_KEYWORDS[s] || [s]);
  const colorKws = (brief.colors || []).map((c) => c.toLowerCase());
  const budget = brief.budgetChf && brief.budgetChf !== 'tbd' ? brief.budgetChf : undefined;

  // Mots-clés de nom (selon intention / type de déco).
  // Objectif : coller au plus près de ce que l'utilisateur demande vraiment.
  let nameHints = map.nameHints;
  if (brief.room === 'decoration' && brief.decoType) nameHints = DECO_HINTS[brief.decoType] ?? [];
  if (brief.intent === 'canape') nameHints = ['canapé'];
  if (brief.intent === 'fauteuil') nameHints = ['fauteuil'];
  // « Je cherche du mobilier / rangement / table » → on cible le vrai type de meuble de la pièce
  if (brief.intent === 'mobilier') {
    const MOBILIER_HINTS: Partial<Record<RoomKey, string[]>> = {
      salle_a_manger: ['table à manger', 'table'],
      'salle-a-manger': ['table à manger', 'table'],
      chambre: ['commode', 'table'],
      bureau: ['étagère', 'commode', 'support'],
      entree: ['commode', 'étagère'],
    } as Partial<Record<RoomKey, string[]>>;
    nameHints = MOBILIER_HINTS[brief.room] ?? map.nameHints;
  }
  // « Ajouter de la décoration / luminaire » dans une pièce → on cible les objets décoratifs réels
  if (brief.intent === 'deco' || brief.intent === 'decoration') {
    nameHints = brief.room === 'decoration' ? [] : ['tableau', 'lampe', 'lustre', 'suspension', 'vase'];
  }
  // « Aménager toute la pièce » / « petit espace » : on garde les pistes par défaut de la pièce.

  const scored = products
    .filter((p) => map.categories.includes(p.category))
    .map((p) => {
      const price = sellingChf(p);
      const hay = `${p.name} ${p.description} ${p.material}`.toLowerCase();
      let score = 10;
      // Correspondance type de produit (intention / déco).
      // typeMatch = ce produit est-il VRAIMENT le bon type demandé ?
      // (si aucune piste de type n'est donnée, tout produit de la pièce convient)
      const typeMatch = nameHints.length === 0
        ? true
        : nameHints.some((h) => p.name.toLowerCase().includes(h));
      if (nameHints.length) {
        score += typeMatch ? 40 : (brief.room === 'decoration' ? -30 : -5);
      }
      // Déco : si room = decoration mais catégorie = Décorations, bonus de base
      if (brief.room === 'decoration' && p.category === 'Décorations') score += 10;
      // Budget réel
      let budgetFit = true;
      if (budget) {
        const okMin = budget.min == null || price >= budget.min * 0.9;
        const okMax = budget.max == null || price <= budget.max * 1.1;
        budgetFit = okMin && okMax;
        score += budgetFit ? 25 : -40;
      }
      // Style (mots-clés dans le texte réel)
      const styleHits = styleKws.filter((k) => hay.includes(k));
      score += Math.min(styleHits.length, 3) * 8;
      // Couleur
      const pColors = productColors(p);
      const colorHits = colorKws.filter((c) => pColors.includes(c) || hay.includes(c));
      score += Math.min(colorHits.length, 2) * 10;
      // Dimensions
      const dim = dimensionCheck(p, brief);
      if (dim.verdict === 'fits') score += 15;
      else if (dim.verdict === 'tight') score += 5;
      else if (dim.verdict === 'too-big') score -= 25;

      // Distance au budget (0 = dans la fourchette) — sert au classement de secours
      let budgetDistance = 0;
      if (budget) {
        if (budget.min != null && price < budget.min) budgetDistance = budget.min - price;
        else if (budget.max != null && price > budget.max) budgetDistance = price - budget.max;
      }
      return { p, price, score, budgetFit, typeMatch, budgetDistance, styleHits, colorHits, dim };
    })
    .sort((a, b) => b.score - a.score);

  // 1) On ne garde comme vraies recommandations que les produits qui
  //    correspondent au BON TYPE demandé ET (si un budget est fixé) au budget.
  const strong = scored.filter((x) => x.typeMatch && (!budget || x.budgetFit));

  // 2) Si rien ne colle vraiment, on bascule sur une sélection de secours :
  //    on propose les produits les plus proches (bon type en priorité, puis
  //    le plus proche du budget) et on prévient honnêtement l'utilisateur.
  // On évite d'afficher plusieurs variantes au nom identique (ex. mêmes modèles
  // déclinés en coloris) : une seule carte par nom de produit.
  const dedupeByName = <T extends { p: Product }>(list: T[]): T[] => {
    const seenNames = new Set<string>();
    return list.filter((x) => {
      const key = x.p.name.trim().toLowerCase();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });
  };

  let noExactMatch = false;
  let top: typeof scored;
  if (strong.length > 0) {
    top = dedupeByName(strong).slice(0, 5);
  } else {
    noExactMatch = true;
    const ordered = [...scored].sort((a, b) => {
      // le bon type d'abord
      if (a.typeMatch !== b.typeMatch) return a.typeMatch ? -1 : 1;
      // puis le plus proche du budget
      if (a.budgetDistance !== b.budgetDistance) return a.budgetDistance - b.budgetDistance;
      // puis le meilleur score global
      return b.score - a.score;
    });
    top = dedupeByName(ordered).slice(0, 4);
  }
  const pool = products;

  const recos: Reco[] = top.map((x) => {
    const pairing = complementFor(x.p, pool);
    const styleTxt = x.styleHits.length
      ? `Correspond à votre style : ${x.styleHits.slice(0, 3).join(', ')}.`
      : (brief.styles?.length ? 'Une ligne sobre qui s’accorde avec le style recherché.' : 'Un design au caractère affirmé, facile à marier.');
    const colorTxt = x.colorHits.length ? ` Coloris proches de vos envies (${x.colorHits.join(', ')}).` : '';
    return {
      id: x.p.id,
      name: x.p.name,
      category: x.p.category,
      priceChf: x.price,
      dimensions: x.p.dimensions,
      images: x.p.images.slice(0, 1),
      colors: productColors(x.p),
      score: x.score,
      dimensionVerdict: x.dim.verdict,
      reasons: {
        why: `Sélectionné pour votre ${ROOM_LABELS[brief.room].toLowerCase()} : ${x.p.category.toLowerCase()} pertinent pour votre projet.`,
        styleFit: styleTxt + colorTxt,
        dimension: x.dim.text,
        placement: placementTip(x.p.category, x.p.name),
      },
      pairWithId: pairing?.id,
    };
  });

  // Compléments : produits réels distincts des recos.
  const recoIds = new Set(recos.map((r) => r.id));
  const complementPool = top.flatMap((x) => {
    const c = complementFor(x.p, pool);
    return c && !recoIds.has(c.id) ? [c] : [];
  });
  const seen = new Set<number>();
  const complements = complementPool
    .filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)))
    .slice(0, 4)
    .map((c) => ({ id: c.id, name: c.name, category: c.category, priceChf: sellingChf(c), images: c.images.slice(0, 1) }));

  return {
    recos,
    complements,
    meta: {
      candidateCount: scored.length,
      roomLabel: ROOM_LABELS[brief.room],
      noExactMatch,
      note: recos.length === 0
        ? 'Aucun produit ne correspond précisément à ces critères dans notre catalogue actuel.'
        : (noExactMatch
          ? 'Nous n’avons pas exactement ce produit, mais voici nos suggestions les plus proches.'
          : undefined),
    },
  };
}
