'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/products';
import { CollectionCard } from './collection-card';

// Détermine la gamme d'un produit à partir de son nom
function rangeOf(name: string): string {
  const n = name.toLowerCase();
  // Décorations
  if (n.includes('tableau')) return 'Tableaux';
  if (n.includes('vase')) return 'Vases';
  if (n.includes('lampe') || n.includes('lustre') || n.includes('suspendue') || n.includes('luminaire')) return 'Luminaires';
  // Salon
  if (n.includes('canapé')) return 'Canapés';
  if (n.includes('fauteuil')) return 'Fauteuils';
  // Meubles (du plus spécifique au plus général)
  if (n.includes('table basse')) return 'Tables basses';
  if (n.includes("table d'appoint") || n.includes('appoint') || n.includes('gigogne')) return "Tables d'appoint";
  if (n.includes('table')) return 'Tables';
  if (n.includes('meuble tv') || n.includes('meuble télé')) return 'Meubles TV';
  if (n.includes('commode')) return 'Commodes';
  if (n.includes('armoire')) return 'Armoires';
  if (n.includes('buffet')) return 'Buffets';
  if (n.includes('étagère') || n.includes('etagere') || n.includes('rangement')) return 'Rangements';
  return 'Autres';
}

const ORDER = [
  'Canapés', 'Fauteuils',
  'Tables basses', "Tables d'appoint", 'Tables',
  'Commodes', 'Meubles TV', 'Armoires', 'Buffets', 'Rangements',
  'Tableaux', 'Vases', 'Luminaires',
  'Autres',
];

export function CollectionGrid({ items }: { items: Product[] }) {
  // Gammes présentes, dans l'ordre défini
  const ranges = useMemo(() => {
    const present = new Set(items.map((p) => rangeOf(p.name)));
    return ORDER.filter((r) => present.has(r));
  }, [items]);

  const [active, setActive] = useState<string>('Tous');
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = active === 'Tous' ? items : items.filter((p) => rangeOf(p.name) === active);
  const displayed = filtered.slice(0, visibleCount);
  const showMore = filtered.length > visibleCount;

  const selectRange = (r: string) => { setActive(r); setVisibleCount(PAGE_SIZE); };

  return (
    <>
      {/* Sous-filtres par gamme (affichés seulement s'il y a plusieurs gammes) */}
      {ranges.length > 1 && (
        <div className="flex items-center gap-6 border-b border-neutral-100 mb-10 overflow-x-auto scrollbar-hide">
          {['Tous', ...ranges].map((r) => (
            <button
              key={r}
              onClick={() => selectRange(r)}
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
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8"
            >
              {displayed.map((product) => (
                <CollectionCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {(showMore || visibleCount > PAGE_SIZE) && (
            <div className="flex flex-col items-center gap-3 mt-12">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {showMore && (
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 border border-black text-black text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Voir plus de produits
                  </button>
                )}
                {visibleCount > PAGE_SIZE && (
                  <button
                    onClick={() => setVisibleCount(PAGE_SIZE)}
                    className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-600 text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:border-black hover:text-black transition-colors duration-300"
                  >
                    Voir moins
                  </button>
                )}
              </div>
              <span className="text-[11px] tracking-wide text-neutral-400">
                {displayed.length} sur {filtered.length} produits
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
