'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { products, nice99 } from '@/lib/products';
import { formatPrice, useCurrency } from '@/lib/currency';
import type { HeroHotspot } from '@/lib/hero-hotspots';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LARGEUR_ETIQUETTE = 224;

interface PointAffiche {
  id: number;
  nom: string;
  prix: string;
  prixBarre: string | null;
  x: number;
  y: number;
}

/**
 * Points dorés posés sur une photo d'ambiance. Ils restent visibles. Un appui sur un point le fait
 * réagir (un petit cercle se diffuse), puis l'étiquette du produit apparaît. Un appui sur l'étiquette
 * ouvre la fiche produit ; un clic ailleurs ou la touche Échap la referme.
 */
export function HeroHotspots({ items }: { items: HeroHotspot[] }) {
  const cur = useCurrency();
  const reduce = !!useReducedMotion();
  const [actif, setActif] = useState<{ id: number; n: number } | null>(null);
  const racine = useRef<HTMLDivElement>(null);

  // Ferme l'étiquette ouverte au clic ailleurs ou avec la touche Échap
  useEffect(() => {
    if (!actif) return;
    const surClic = (e: PointerEvent) => {
      if (!racine.current?.contains(e.target as Node)) setActif(null);
    };
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActif(null);
    };
    document.addEventListener('pointerdown', surClic);
    document.addEventListener('keydown', surTouche);
    return () => {
      document.removeEventListener('pointerdown', surClic);
      document.removeEventListener('keydown', surTouche);
    };
  }, [actif]);

  const basculer = (id: number) =>
    setActif((a) => (a?.id === id ? null : { id, n: (a?.n ?? 0) + 1 }));

  const affiches: PointAffiche[] = [];
  for (const item of items) {
    const p = products.find((x) => x.id === item.productId);
    if (!p) continue;
    const promo = p.name.includes('Bubble');
    affiches.push({
      id: p.id,
      nom: p.name,
      prix: formatPrice(promo ? nice99(Math.round(p.price * 0.7)) : p.price, cur),
      prixBarre: promo ? formatPrice(p.price, cur) : null,
      x: item.x,
      y: item.y,
    });
  }

  return (
    <div ref={racine} className="pointer-events-none absolute inset-0 z-20" style={{ containerType: 'size' }}>
      {/* Calque aux dimensions de la photo recadrée (object-cover, cadrage en bas et au centre) */}
      <div
        className="absolute bottom-0 left-1/2 aspect-[1672/941] -translate-x-1/2"
        style={{ width: 'max(100cqw, calc(100cqh * 1672 / 941))' }}
      >
        {affiches.map((pt) => (
          <Point
            key={pt.id}
            point={pt}
            ouvert={actif?.id === pt.id}
            n={actif?.id === pt.id ? actif.n : 0}
            reduce={reduce}
            onClick={() => basculer(pt.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Point({
  point,
  ouvert,
  n,
  reduce,
  onClick,
}: {
  point: PointAffiche;
  ouvert: boolean;
  n: number;
  reduce: boolean;
  onClick: () => void;
}) {
  // L'étiquette s'ouvre du côté où il reste le plus de place
  const adroite = point.x < 50;
  const largeur = adroite
    ? `min(${LARGEUR_ETIQUETTE}px, calc(100% - ${point.x}% - 24px))`
    : `min(${LARGEUR_ETIQUETTE}px, calc(${point.x}% - 24px))`;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-expanded={ouvert}
        aria-label={`Voir ${point.nom}`}
        className="pointer-events-auto absolute z-[1] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A68A6D]"
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
      >
        <motion.span
          className="relative block h-[7px] w-[7px] rounded-full bg-[#A68A6D]"
          style={{ boxShadow: '0 0 0 1.5px rgba(251, 247, 242, 0.9), 0 3px 10px rgba(34, 22, 7, 0.3)' }}
          animate={{ scale: ouvert ? 1.3 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute -inset-2 rounded-full border border-[#FBF7F2]/50"
              animate={{ scale: [0.45, 1.15], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {ouvert && !reduce && (
            <motion.span
              key={n}
              aria-hidden="true"
              className="absolute -inset-2 rounded-full border border-[#FBF7F2]/80"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          )}
        </motion.span>
      </button>

      <div
        className="pointer-events-none absolute z-[2]"
        style={{
          top: `clamp(0px, calc(${point.y}% - 72px), calc(100% - 160px))`,
          left: adroite ? `calc(${point.x}% + 16px)` : undefined,
          right: adroite ? undefined : `calc(${100 - point.x}% + 16px)`,
          width: largeur,
        }}
      >
        <AnimatePresence>
          {ouvert && (
            <motion.div
              key="etiquette"
              className="pointer-events-auto"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, delay: reduce ? 0 : 0.26, ease: EASE }}
            >
              <Link
                href={`/products/${point.id}`}
                className="block border border-[#D8C9B5] bg-[#F6F2EB] px-4 pb-3 pt-3.5 text-[#221607] shadow-[0_18px_40px_-20px_rgba(34,22,7,0.55)]"
              >
                <motion.span
                  className="pdp-display block text-[15px] font-semibold leading-snug tracking-[-0.01em]"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.34, ease: EASE }}
                >
                  {point.nom}
                </motion.span>
                <motion.span
                  className="mt-1.5 block text-[13px] font-medium tabular-nums"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.42, ease: EASE }}
                >
                  {point.prix}
                  {point.prixBarre && <s className="ml-1.5 font-normal text-[#6B6660]">{point.prixBarre}</s>}
                </motion.span>
                <motion.span
                  className="mt-3 flex items-center justify-between border-t border-[#D8C9B5] pt-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7F6A52]"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.5, ease: EASE }}
                >
                  Voir le produit
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </motion.span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
