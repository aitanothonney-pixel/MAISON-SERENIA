'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/products';
import { CollectionCard } from './collection-card';

// Détermine la gamme d'un produit à partir de son nom
function rangeOf(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('tableau')) return 'Tableaux';
  if (n.includes('vase')) return 'Vases';
  if (n.includes('lampe') || n.includes('lustre') || n.includes('suspendue') || n.includes('luminaire')) return 'Luminaires';
  return 'Autres';
}

const ORDER = ['Tableaux', 'Vases', 'Luminaires', 'Autres'];

export function CollectionGrid({ items }: { items: Product[] }) {
  // Gammes présentes, dans l'ordre défini
  const ranges = useMemo(() => {
    const present = new Set(items.map((p) => rangeOf(p.name)));
    return ORDER.filter((r) => present.has(r));
  }, [items]);

  const [active, setActive] = useState<string>('Tous');

  const filtered = active === 'Tous' ? items : items.filter((p) => rangeOf(p.name) === active);

  return (
    <>
      {/* Sous-filtres par gamme (affichés seulement s'il y a plusieurs gammes) */}
      {ranges.length > 1 && (
        <div className="flex items-center gap-6 border-b border-neutral-100 mb-10 overflow-x-auto scrollbar-hide">
          {['Tous', ...ranges].map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className={`text-[12px] tracking-[0.15em] uppercase whitespace-nowrap pb-3 -mb-px border-b-2 transition-colors ${
                active === r ? 'text-black border-black' : 'text-neutral-400 border-transparent hover:text-black'
              }`}
            >
              {r}
              <span className="ml-1.5 text-neutral-300">
                {r === 'Tous' ? items.length : items.filter((p) => rangeOf(p.name) === r).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-center py-20">Aucun produit dans cette gamme pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {filtered.map((product) => (
            <CollectionCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
