import { products, getVariantGroup, collapseVariantDuplicates, type Product } from './products';

export interface CollectionMeta {
  slug: string;
  label: string;
  kicker: string;
  description: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  { slug: 'salon', label: 'Salon', kicker: 'Collection', description: 'Canapés et fauteuils sculpturaux de la collection Bubble, pensés pour sublimer votre intérieur.' },
  { slug: 'figurines', label: 'Décorations', kicker: 'Collection', description: 'Sculptures et pièces de collection — KAWS, Bearbrick et éditions rares.' },
  { slug: 'meubles', label: 'Meubles', kicker: 'Collection', description: 'Meubles TV, tables et rangements pour aménager tout votre intérieur.' },
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
  // Dans les Décorations, on affiche les figurines (KAWS, Bearbrick) en dernier
  if (cat === 'Décorations') {
    const isFig = (n: string) => n.includes('KAWS') || n.includes('Bearbrick') || n.includes('Figurine');
    return [...list].sort((a, b) => {
      const aF = isFig(a.name) ? 1 : 0;
      const bF = isFig(b.name) ? 1 : 0;
      if (aF !== bF) return aF - bF;
      return a.id - b.id;
    });
  }
  // Dans le Salon, on affiche les produits Bubble en dernier
  if (cat === 'Salon') {
    return [...list].sort((a, b) => {
      const aB = a.name.includes('Bubble') ? 1 : 0;
      const bB = b.name.includes('Bubble') ? 1 : 0;
      if (aB !== bB) return aB - bB;
      return a.id - b.id;
    });
  }
  return list;
}
