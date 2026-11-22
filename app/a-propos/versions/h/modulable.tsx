'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Rise, Segments } from '../motion-kit';

// Décalages de départ (en px et en degrés) : chaque bloc arrive de sa position éparpillée et se range.
const DECALAGES = [
  { x: -140, y: 90, r: -7 },
  { x: 110, y: -70, r: 6 },
  { x: -70, y: 130, r: -3 },
  { x: 150, y: 50, r: 8 },
  { x: -120, y: -90, r: 4 },
  { x: 70, y: 120, r: -5 },
];

const DECALAGES_TITRE = [
  { x: -160, y: -80, r: -8 },
  { x: 120, y: 60, r: 6 },
  { x: -90, y: 110, r: -4 },
  { x: 170, y: -40, r: 9 },
  { x: -130, y: 70, r: -6 },
  { x: 90, y: -100, r: 5 },
];

const TUILES = [
  { src: '/catalog/canape-d-angle-modulable-en-u-beige-1.webp', legende: 'U beige' },
  { src: '/catalog/canape-d-angle-3-places-creme-2.webp', legende: '3 places crème' },
  { src: '/catalog/canape-modulable-en-l-style-nuage-gris-anthracite-2.webp', legende: 'L gris anthracite' },
  { src: '/catalog/canape-d-angle-modulable-en-u-gris-fonce-4.webp', legende: 'U gris foncé' },
  { src: '/catalog/canape-modulable-en-l-style-nuage-blanc-chaud-2.webp', legende: 'L blanc chaud' },
  { src: '/catalog/j9h5SNVC.jpg', legende: 'Bubble' },
];

// Une tuile photo : éparpillée au départ, elle se range dans la grille quand elle entre dans l'écran.
function Tuile({ src, legende, index }: { src: string; legende: string; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.98', 'start 0.4'] });
  const d = DECALAGES[index % DECALAGES.length];
  const x = useTransform(scrollYProgress, [0, 1], [d.x, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [d.y, 0]);
  const rotation = useTransform(scrollYProgress, [0, 1], [d.r, 0]);
  return (
    <motion.figure ref={ref} style={{ x, y, rotate: rotation }} className="relative m-0 aspect-[4/5] overflow-hidden bg-[#F6F2EB] shadow-[0_30px_60px_-35px_rgba(34,22,7,0.45)]">
      <Image src={src} alt={legende} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover p-2" />
      <figcaption className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-[#221607]">{legende}</figcaption>
    </motion.figure>
  );
}

// H · Modulable : des blocs éparpillés s'assemblent en grille, comme un intérieur qui se compose.
export function Modulable() {
  const { histoire, signature, valeurs, engagements } = APROPOS;
  const mots = APROPOS.titre.split(' ');

  return (
    <main className="bg-[#F6F2EB] text-[#221607]">
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-20">
        <Link href="/" className="absolute left-6 top-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-black">
          ← {APROPOS.retour}
        </Link>
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.accroche}</p>
          <h1 className="mt-8 flex flex-wrap gap-x-3 gap-y-4">
            {mots.map((mot, i) => {
              const d = DECALAGES_TITRE[i % DECALAGES_TITRE.length];
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: d.x, y: d.y, rotate: d.r }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 110, damping: 16, delay: 0.15 + i * 0.1 }}
                  className="pdp-display inline-block rounded-[3px] bg-[#221607] px-4 py-2 text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#F6F2EB] md:px-6 md:py-4 md:text-[92px]"
                >
                  {mot}
                </motion.span>
              );
            })}
          </h1>
          <p className="mt-12 max-w-lg text-lg leading-relaxed text-[#4D4842]">{APROPOS.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Rise>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
        </Rise>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
          {TUILES.map((t, i) => (
            <Tuile key={t.src} src={t.src} legende={t.legende} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
          <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[60px]">{histoire.titre}</h2>
        </div>
        <div className="space-y-6 text-[17px] leading-relaxed text-[#4D4842] md:col-span-7 md:col-start-6">
          {histoire.paragraphes.map((p, i) => (
            <Rise key={i} delay={i * 0.08}>
              <Segments segments={p} />
            </Rise>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Rise>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
          <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] md:text-[60px]">{APROPOS.valeursTitre}</h2>
        </Rise>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {valeurs.map((v, i) => (
            <motion.div
              key={v.titre}
              initial={{ opacity: 0, y: 140, rotate: i % 2 ? 2.5 : -2.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.1 }}
              className="bg-white p-8 shadow-[0_24px_60px_-34px_rgba(34,22,7,0.4)]"
            >
              <p className="pdp-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-[#A68A6D]">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="pdp-display mt-8 text-2xl font-semibold tracking-[-0.02em]">{v.titre}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
          {engagements.map((e, i) => (
            <motion.div
              key={e.titre}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 240, damping: 20, delay: i * 0.07 }}
              className="border border-[#D8C9B5] bg-white/60 p-8"
            >
              <p className="pdp-display text-xl font-semibold">{e.titre}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32 pt-16 text-center">
        <Rise>
          <h2 className="pdp-display mx-auto max-w-3xl text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[72px]">{APROPOS.ctaTitre}</h2>
          <p className="mx-auto mt-6 max-w-md text-[#4D4842]">{APROPOS.ctaTexte}</p>
        </Rise>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <Link href={APROPOS.ctaPrincipal.href} className="block bg-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB]">
              {APROPOS.ctaPrincipal.texte}
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <Link href={APROPOS.ctaSecondaire.href} className="block border border-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em]">
              {APROPOS.ctaSecondaire.texte}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
