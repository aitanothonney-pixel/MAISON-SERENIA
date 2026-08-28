'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/products';
import { formatPrice, useCurrency } from '@/lib/currency';
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
  if (n.includes('table basse') || n.includes('gigogne')) return 'Tables basses';
  if (n.includes("table d'appoint") || n.includes('appoint')) return "Tables d'appoint";
  if (n.includes('table')) return 'Tables';
  if (n.includes('meuble tv') || n.includes('meuble télé')) return 'Meubles TV';
  if (n.includes('commode')) return 'Commodes';
  if (n.includes('armoire')) return 'Armoires';
  if (n.includes('buffet')) return 'Buffets';
  if (n.includes('étagère') || n.includes('etagere') || n.includes('rangement')) return 'Rangements';
  return 'Autres';
}

const ORDER = [
  'Canapés',
  'Tables basses', 'Meubles TV', 'Commodes', 'Fauteuils', 'Tables', "Tables d'appoint",
  'Armoires', 'Buffets', 'Rangements',
  'Luminaires', 'Tableaux', 'Vases',
  'Autres',
];

type SortKey = 'recommande' | 'prix-asc' | 'prix-desc' | 'nouveaute';

// Prix affiché en tenant compte de la promo Bubble (-30 %)
function displayPrice(p: Product): number {
  return p.name.includes('Bubble') ? Math.round(p.price * 0.7) : p.price;
}

export function CollectionGrid({ items }: { items: Product[] }) {
  const cur = useCurrency();

  // Gammes présentes, dans l'ordre défini
  const ranges = useMemo(() => {
    const present = new Set(items.map((p) => rangeOf(p.name)));
    return ORDER.filter((r) => present.has(r));
  }, [items]);

  // Bornes de prix globales (sur toute la collection)
  const [minBound, maxBound] = useMemo(() => {
    const prices = items.map(displayPrice);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [items]);

  // Sous-onglet initial : depuis l'URL (?g=Luminaires) si valide, sinon « Tous »
  const searchParams = useSearchParams();
  const initialG = searchParams.get('g');
  const [active, setActive] = useState<string>(initialG && ranges.includes(initialG) ? initialG : 'Tous');
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Tri + fourchette de prix
  const [sortKey, setSortKey] = useState<SortKey>('recommande');
  const [minPrice, setMinPrice] = useState(minBound);
  const [maxPrice, setMaxPrice] = useState(maxBound);

  // Recale la fourchette si la collection change
  useEffect(() => { setMinPrice(minBound); setMaxPrice(maxBound); }, [minBound, maxBound]);

  const byRange = active === 'Tous' ? items : items.filter((p) => rangeOf(p.name) === active);
  const filtered = useMemo(() => {
    const lo = Math.min(minPrice, maxPrice);
    const hi = Math.max(minPrice, maxPrice);
    const list = byRange.filter((p) => {
      const price = displayPrice(p);
      return price >= lo && price <= hi;
    });
    const sorted = [...list];
    if (sortKey === 'prix-asc') sorted.sort((a, b) => displayPrice(a) - displayPrice(b));
    else if (sortKey === 'prix-desc') sorted.sort((a, b) => displayPrice(b) - displayPrice(a));
    else if (sortKey === 'nouveaute') sorted.sort((a, b) => b.id - a.id);
    return sorted;
  }, [byRange, minPrice, maxPrice, sortKey]);

  const displayed = filtered.slice(0, visibleCount);
  const showMore = filtered.length > visibleCount;

  const selectRange = (r: string) => { setActive(r); setVisibleCount(PAGE_SIZE); };
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [minPrice, maxPrice, sortKey]);

  const rangeActive = minPrice > minBound || maxPrice < maxBound;
  const pct = (v: number) => maxBound === minBound ? 0 : ((v - minBound) / (maxBound - minBound)) * 100;

  return (
    <>
      {/* Sous-filtres par gamme (affichés seulement s'il y a plusieurs gammes) */}
      {ranges.length > 1 && (
        <div className="flex items-center gap-6 border-b border-neutral-100 mb-8 overflow-x-auto scrollbar-hide">
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

      {/* Barre de tri + fourchette de prix */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        {/* Fourchette de prix */}
        <div className="w-full md:max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400">Fourchette de prix</span>
            {rangeActive && (
              <button
                onClick={() => { setMinPrice(minBound); setMaxPrice(maxBound); }}
                className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 hover:text-black transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-black tabular-nums">{formatPrice(Math.min(minPrice, maxPrice), cur)}</span>
            <span className="flex-1 h-px bg-neutral-200" />
            <span className="text-sm font-semibold text-black tabular-nums">{formatPrice(Math.max(minPrice, maxPrice), cur)}</span>
          </div>
          {/* Double curseur */}
          <div className="relative h-5 select-none">
            <div className="absolute top-1/2 -translate-y-1/2 h-[3px] w-full rounded-full bg-neutral-200" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-black"
              style={{ left: `${pct(Math.min(minPrice, maxPrice))}%`, right: `${100 - pct(Math.max(minPrice, maxPrice))}%` }}
            />
            <input
              type="range" min={minBound} max={maxBound} value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
              className="range-thumb absolute w-full top-0 appearance-none bg-transparent pointer-events-none"
              aria-label="Prix minimum"
            />
            <input
              type="range" min={minBound} max={maxBound} value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
              className="range-thumb absolute w-full top-0 appearance-none bg-transparent pointer-events-none"
              aria-label="Prix maximum"
            />
          </div>
        </div>

        {/* Tri */}
        <div className="md:text-right">
          <label className="block text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-2">Trier par</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border border-neutral-300 bg-white text-sm text-black px-4 py-2.5 pr-8 focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="recommande">Recommandés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nouveaute">Nouveautés</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-center py-20">Aucun produit dans cette fourchette de prix.</p>
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
