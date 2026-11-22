'use client';

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import type { Paragraphe } from '@/lib/a-propos-contenu';

// Courbe douce et précise : le mouvement reste calme, dans l'esprit d'une maison de meubles haut de gamme.
export const EASE = [0.22, 1, 0.36, 1] as const;

const VUE = { once: true, margin: '-60px' } as const;

// Bloc qui monte doucement à son arrivée dans l'écran.
export function Rise({ children, delay = 0, y = 48, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={VUE} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

// Bloc qui glisse latéralement à son arrivée.
export function Glisse({ children, sens = 'gauche', delay = 0, className }: { children: ReactNode; sens?: 'gauche' | 'droite'; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, x: sens === 'gauche' ? -70 : 70 }} whileInView={{ opacity: 1, x: 0 }} viewport={VUE} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

// Ligne de titre qui se dévoile depuis un masque, comme dans un magazine.
export function Ligne({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]" initial="cache" whileInView="visible" viewport={{ once: true }}>
      <motion.span
        className={`block ${className ?? ''}`}
        variants={{ cache: { y: '108%' }, visible: { y: '0%', transition: { duration: 1.1, ease: EASE, delay } } }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Titre révélé mot par mot.
export function Mots({ texte, delay = 0, className }: { texte: string; delay?: number; className?: string }) {
  const mots = texte.split(' ');
  return (
    <span className={className}>
      {mots.map((mot, i) => (
        <motion.span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top" initial="cache" whileInView="visible" viewport={{ once: true }}>
          <motion.span
            className="inline-block"
            variants={{ cache: { y: '110%' }, visible: { y: '0%', transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.05 } } }}
          >
            {mot}
          </motion.span>
          {i < mots.length - 1 ? ' ' : null}
        </motion.span>
      ))}
    </span>
  );
}

// Texte dont chaque mot s'éclaire au fil du défilement.
export function MotsDefilement({ texte, progression, className }: { texte: string; progression: MotionValue<number>; className?: string }) {
  const mots = texte.split(' ');
  return (
    <span className={className}>
      {mots.map((mot, i) => (
        <MotDefilement key={i} mot={mot} i={i} n={mots.length} progression={progression} />
      ))}
    </span>
  );
}

function MotDefilement({ mot, i, n, progression }: { mot: string; i: number; n: number; progression: MotionValue<number> }) {
  const debut = (i / n) * 0.8;
  const opacite = useTransform(progression, [debut, debut + 0.2], [0.14, 1]);
  return (
    <motion.span style={{ opacity: opacite }} className="mr-[0.28em] inline-block">
      {mot}
    </motion.span>
  );
}

// Bloc qui glisse à une vitesse différente de la page (effet de profondeur).
export function Parallaxe({ children, amplitude = 60, className }: { children: ReactNode; amplitude?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-amplitude, amplitude]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
        {children}
      </motion.div>
    </div>
  );
}

// Paragraphe avec des mots mis en valeur ; la couleur suit le texte environnant.
export function Segments({ segments }: { segments: Paragraphe }) {
  return (
    <p>
      {segments.map(([texte, gras], i) =>
        gras ? (
          <strong key={i} className="font-medium text-current">
            {texte}
          </strong>
        ) : (
          <span key={i}>{texte}</span>
        ),
      )}
    </p>
  );
}

// Position du pointeur (ou du doigt) dans un élément, pour les effets de lumière.
export function usePointeur() {
  const x = useMotionValue(-2000);
  const y = useMotionValue(-2000);
  const suivre = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  return { x, y, suivre };
}

// Masque circulaire qui suit le pointeur. inverse = true : le centre est masqué (l'ombre entoure la lumière).
export function useMasqueLumiere(x: MotionValue<number>, y: MotionValue<number>, rayon: number, inverse = false) {
  const debut = inverse ? 'transparent' : '#000';
  const fin = inverse ? '#000' : 'transparent';
  return useMotionTemplate`radial-gradient(circle ${rayon}px at ${x}px ${y}px, ${debut} 0%, ${fin} 100%)`;
}
