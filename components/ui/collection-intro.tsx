'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CollectionIntroProps {
  eyebrow: string;
  title: string;
  tagline?: string;
  description: string;
  count: number;
}

/**
 * Intro de catégorie (option « Éditorial ») : nom et compteur à gauche, texte et action à droite,
 * filet doré qui se déroule en bas. Les animations se lancent à l'arrivée sur la page ;
 * elles sont désactivées si le visiteur a demandé moins de mouvement.
 */
export function CollectionIntro({ eyebrow, title, tagline, description, count }: CollectionIntroProps) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  // Avec mouvement réduit, le total s'affiche directement ; sinon le compteur monte depuis 0
  const displayed = reduce ? count : shown;

  // Le compteur de pièces monte jusqu'au nombre réel
  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, count, {
      duration: 1.1,
      delay: 1.3,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [count, reduce]);

  return (
    <section className="bg-[#F6F2EB]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 pb-14 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-16 lg:pt-20">
          <div className="lg:col-span-7">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]"
            >
              {eyebrow}
            </motion.p>

            {/* Le masque empêche le nom de dépasser pendant qu'il monte */}
            <div className="mt-5 overflow-hidden pb-2 pt-3">
              <motion.h1
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, delay: 0.35, ease: EASE }}
                className="pdp-display text-[60px] font-semibold leading-[0.95] tracking-[-0.045em] text-[#221607] md:text-[96px] xl:text-[120px]"
              >
                {title}
              </motion.h1>
            </div>

            {tagline && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
                className="mt-4 text-[15px] tracking-[0.01em] text-[#4D4842]"
              >
                {tagline}
              </motion.p>
            )}

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3, ease: EASE }}
              className="mt-5 text-[11px] uppercase tracking-[0.22em] text-[#7F6A52]"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              {String(displayed).padStart(2, '0')} {count === 1 ? 'pièce' : 'pièces'}
            </motion.p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:justify-between">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="text-[17px] leading-[1.6] text-[#4D4842]"
            >
              {description}
            </motion.p>
            <motion.a
              href="#collection-produits"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 2.2, ease: EASE }}
              className="inline-flex w-fit items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#221607] transition-opacity hover:opacity-60"
            >
              Découvrir <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.4} />
            </motion.a>
          </div>
        </div>

        {/* Filet qui se déroule en bas de l'intro */}
        <div className="relative h-px bg-[#D8C9B5]">
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.8, ease: 'linear' }}
            className="absolute inset-0 origin-left bg-[#A68A6D]"
          />
        </div>
      </div>
    </section>
  );
}
