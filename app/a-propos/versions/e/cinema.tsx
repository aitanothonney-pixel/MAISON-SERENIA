'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { APROPOS } from '@/lib/a-propos-contenu';
import { EASE, Ligne, Mots, MotsDefilement, Rise, Segments } from '../motion-kit';

// Une photo par chapitre : elle change pendant que le texte défile à côté.
const PHOTOS = [
  '/catalog/canape-modulable-en-l-style-nuage-gris-anthracite-1.webp',
  '/catalog/canape-d-angle-modulable-en-u-beige-1.webp',
  '/catalog/j9h5SNVC.jpg',
];

const VUE_CHAPITRE = { margin: '-42% 0px -42% 0px' };

// E · Cinéma : storytelling au défilement. Photo fixe qui change par chapitre, citation qui s'éclaire mot à mot.
export function Cinema() {
  const { scrollYProgress } = useScroll();
  const barre = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [chapitre, setChapitre] = useState(0);
  const citationRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: avancementCitation } = useScroll({ target: citationRef, offset: ['start 0.85', 'end 0.35'] });
  const { histoire, signature, valeurs } = APROPOS;

  return (
    <main className="bg-[#0a0a0a] text-white">
      <motion.div style={{ scaleX: barre }} className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[#A68A6D]" />

      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: EASE }} className="absolute inset-0">
          <Image src={PHOTOS[0]} alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <Link href="/" className="absolute left-6 top-8 z-10 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white">
          ← {APROPOS.retour}
        </Link>
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-20">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-[#D8C9B5]">{APROPOS.accroche}</p>
          <h1 className="pdp-display text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[96px]">
            <Ligne>L&apos;art de vivre,</Ligne>
            <Ligne delay={0.15}>en toute sérénité.</Ligne>
          </h1>
        </div>
      </section>

      <section className="relative grid md:grid-cols-2">
        <div className="hidden md:sticky md:top-0 md:block md:h-[100svh]">
          {PHOTOS.map((src, i) => (
            <motion.div
              key={src}
              initial={false}
              animate={{ opacity: chapitre === i ? 1 : 0, scale: chapitre === i ? 1 : 1.05 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="absolute inset-0"
            >
              <Image src={src} alt="" fill sizes="50vw" className="object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="space-y-[40vh] px-6 py-[22vh] md:px-16">
          <motion.article onViewportEnter={() => setChapitre(0)} viewport={VUE_CHAPITRE} className="max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{histoire.kicker}</p>
            <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
              <Mots texte={histoire.titre} />
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-neutral-300">
              {histoire.paragraphes.map((p, i) => (
                <Segments key={i} segments={p} />
              ))}
            </div>
          </motion.article>

          <motion.article onViewportEnter={() => setChapitre(1)} viewport={VUE_CHAPITRE} className="max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{signature.kicker}</p>
            <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">{signature.titre}</h2>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-neutral-300">
              {signature.paragraphes.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <Link href={signature.lienHref} className="mt-8 inline-flex border-b border-[#A68A6D] pb-1 text-sm font-medium uppercase tracking-[0.15em] text-white">
              {signature.lien} →
            </Link>
          </motion.article>

          <motion.article onViewportEnter={() => setChapitre(2)} viewport={VUE_CHAPITRE} className="max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{APROPOS.valeursKicker}</p>
            <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">{APROPOS.valeursTitre}</h2>
            <div className="mt-8 space-y-8">
              {valeurs.map((v) => (
                <div key={v.titre}>
                  <p className="pdp-display text-xl font-semibold">{v.titre}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{v.texte}</p>
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </section>

      <section ref={citationRef} className="px-6 py-40 md:py-56">
        <p className="pdp-display mx-auto max-w-5xl text-center text-[34px] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[64px]">
          <MotsDefilement texte={APROPOS.citation} progression={avancementCitation} />
        </p>
        <p className="mt-10 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-[#A68A6D]">{APROPOS.citationAuteur}</p>
      </section>

      <section className="border-t border-white/10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <Rise>
            <h2 className="pdp-display text-[40px] font-semibold tracking-[-0.03em] md:text-[64px]">{APROPOS.engagementsTitre}</h2>
          </Rise>
          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
            {APROPOS.engagements.map((e, i) => (
              <Rise key={e.titre} delay={i * 0.08} className="bg-[#0a0a0a] p-8">
                <p className="pdp-display text-xl font-semibold">{e.titre}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{e.texte}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-32 pt-10 text-center">
        <h2 className="pdp-display mx-auto max-w-3xl text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[72px]">
          <Mots texte={APROPOS.ctaTitre} />
        </h2>
        <p className="mx-auto mt-6 max-w-md text-neutral-400">{APROPOS.ctaTexte}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={APROPOS.ctaPrincipal.href} className="bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-black transition-colors hover:bg-[#D8C9B5]">
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link href={APROPOS.ctaSecondaire.href} className="border border-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black">
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </main>
  );
}
