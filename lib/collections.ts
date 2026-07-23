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
  { slug: 'ete', label: 'Collection Été', kicker: 'Saisonnier', description: 'Accessoires nomades pensés pour la belle saison.' },
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
  return collapseVariantDuplicates(products.filter((p) => p.category === cat && p.category !== 'Été'));
}
