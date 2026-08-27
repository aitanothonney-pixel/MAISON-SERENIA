import { products, getVariantGroup, collapseVariantDuplicates, type Product } from './products';

export interface CollectionMeta {
  slug: string;
  label: string;
  kicker: string;
  description: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  { slug: 'salon', label: 'Salon', kicker: 'Collection', description: 'Canapés, fauteuils et tables pour sublimer votre salon.' },
  { slug: 'meubles', label: 'Meubles', kicker: 'Collection', description: 'Meubles TV, tables et rangements pour aménager tout votre intérieur.' },
  { slug: 'figurines', label: 'Décorations', kicker: 'Collection', description: "Tableaux d'art, vases et pièces déco pour sublimer votre intérieur." },
  { slug: 'bubble', label: 'Collection Bubble', kicker: 'Signature · −30%', description: "La collection signature aux formes gonflées iconiques, en édition limitée." },
];

const SLUG_TO_CATEGORY: Record<string, string> = {
  salon: 'Salon',
  figurines: 'Décorations',
  ete: 'Été',
  meubles: 'Meubles',
};

// Slug URL-safe à partir d'une catégorie (pour le menu)
export function categoryToSlug(category: string): string {
  const found = Object.entries(SLUG_TO_CATEGORY).find(([, cat]) => cat === category);
  return found ? found[0] : category.toLowerCase();
}

export function getCollectionMeta(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionProducts(slug: string): Product[] {
  if (slug === 'bubble') {
    return products.filter((p) => p.name.includes('Bubble'));
  }
  if (slug === 'ete') {
    const seen = new Set<number>();
    return products.filter((p) => {
      if (p.category !== 'Été') return false;
      const grp = getVariantGroup(p.id);
      if (grp) {
        const first = grp[0].productId;
        if (seen.has(first)) return false;
        seen.add(first);
        return p.id === first;
      }
      return true;
    });
  }
  const cat = SLUG_TO_CATEGORY[slug];
  if (!cat) return [];
  const list = collapseVariantDuplicates(products.filter((p) => p.category === cat && p.category !== 'Été'));
  // Dans les Décorations : tableaux en premier, figurines (KAWS, Bearbrick) en dernier
  if (cat === 'Décorations') {
    const rank = (n: string) => {
      if (n.includes('Tableau')) return 0;
      if (n.includes('KAWS') || n.includes('Bearbrick') || n.includes('Figurine')) return 2;
      return 1;
    };
    return [...list].sort((a, b) => {
      const ra = rank(a.name);
      const rb = rank(b.name);
      if (ra !== rb) return ra - rb;
      return a.id - b.id;
    });
  }
  // Le Salon : ordre prioritaire, puis les autres canapés, puis les meubles ;
  // les Bubble (canapés et fauteuils) sont placés tout à la fin de leur gamme.
  if (cat === 'Salon') {
    const PRIORITY = [100, 102, 101, 87, 88, 94, 89];
    const rank = (p: Product) => {
      // Bubble en dernier : canapés Bubble après les autres canapés,
      // fauteuils Bubble après les autres fauteuils.
      if (p.name.includes('Bubble')) return p.name.includes('Canapé') ? 300 : 400;
      const i = PRIORITY.indexOf(p.id);
      if (i !== -1) return i;                     // 0..5 : ordre prioritaire
      if (p.name.includes('Canapé')) return 100;  // autres canapés ensuite
      if (p.name.includes('Fauteuil')) return 150; // fauteuils
      return 200;                                 // meubles (TV…) en dernier
    };
    return list.sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      return a.id - b.id;
    });
  }
  // Meubles : ordre prioritaire choisi, puis le reste, puis certains forcés en fin
  if (cat === 'Meubles') {
    const PRIORITY = [77, 83, 78, 79, 81, 84, 75, 76];
    const LAST = [68, 66, 82]; // forcés tout à la fin, dans cet ordre
    const rank = (id: number) => {
      const i = PRIORITY.indexOf(id);
      if (i !== -1) return i;
      const l = LAST.indexOf(id);
      if (l !== -1) return 1000 + l;
      return 500;
    };
    return [...list].sort((a, b) => {
      const ra = rank(a.id);
      const rb = rank(b.id);
      if (ra !== rb) return ra - rb;
      return a.id - b.id;
    });
  }
  return list;
}
