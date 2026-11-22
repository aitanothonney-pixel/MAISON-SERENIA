'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Glisse, Ligne, Mots, Parallaxe, Rise, Segments } from '../motion-kit';

// F · Matière : titres révélés par masque, images en parallaxe, ligne dorée qui se dessine au défilement.
export function Matiere() {
  const histoireRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: histoireRef, offset: ['start 0.6', 'end 0.6'] });
  const trait = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { histoire, signature, valeurs, engagements } = APROPOS;

  return (
    <main className="bg-[#F6F2EB] text-[#221607]">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-black">
          ← {APROPOS.retour}
        </Link>
        <h1 className="pdp-display mt-16 max-w-6xl text-[48px] font-semibold leading-[0.98] tracking-[-0.04em] md:text-[124px]">
          <Ligne>L&apos;art de vivre,</Ligne>
          <Ligne delay={0.12}>
            <span className="block pl-[10vw]">en toute sérénité.</span>
          </Ligne>
        </h1>

        <div className="mt-20 grid gap-6 md:grid-cols-12 md:items-end">
          <Parallaxe amplitude={70} className="aspect-[4/5] md:col-span-7">
            <Image src="/catalog/canape-d-angle-modulable-en-u-gris-fonce-1.webp" alt="Canapé d'angle modulable en U gris foncé" fill priority sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" />
          </Parallaxe>
          <div className="md:col-span-4 md:col-start-9 md:pb-16">
            <Parallaxe amplitude={26} className="aspect-[3/4]">
              <Image src="/catalog/canape-modulable-en-l-style-nuage-blanc-chaud-4.webp" alt="Canapé modulable en L style nuage blanc chaud" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </Parallaxe>
          </div>
        </div>
      </section>

      <section ref={histoireRef} className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-12">
        <div className="relative hidden md:col-span-1 md:block">
          <motion.div style={{ scaleY: trait }} className="absolute left-1/2 top-0 h-full w-px origin-top bg-[#A68A6D]" />
        </div>
        <div className="md:col-span-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
          <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[64px]">
            <Mots texte={histoire.titre} />
          </h2>
        </div>
        <div className="space-y-7 text-[18px] leading-relaxed text-[#4D4842] md:col-span-6 md:col-start-7">
          {histoire.paragraphes.map((p, i) => (
            <Rise key={i} delay={i * 0.1}>
              <Segments segments={p} />
            </Rise>
          ))}
        </div>
      </section>

      <section className="relative">
        <Parallaxe amplitude={90} className="h-[80vh] min-h-[460px]">
          <Image src="/catalog/j9h5SNVC.jpg" alt={signature.alt} fill sizes="100vw" className="object-cover" />
        </Parallaxe>
        <div className="relative z-10 mx-auto -mt-24 max-w-2xl bg-[#F6F2EB] p-8 md:p-12">
          <Rise>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
            <h2 className="pdp-display mt-4 text-[36px] font-semibold tracking-[-0.03em] md:text-[52px]">{signature.titre}</h2>
          </Rise>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-[#4D4842]">
            {signature.paragraphes.map((t, i) => (
              <Rise key={i} delay={i * 0.1}>
                <p>{t}</p>
              </Rise>
            ))}
          </div>
          <Link href={signature.lienHref} className="mt-8 inline-flex border-b border-[#221607] pb-1 text-sm font-medium uppercase tracking-[0.15em] text-[#221607] transition-colors hover:border-[#A68A6D]">
            {signature.lien} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-32">
        <Rise>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
          <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] md:text-[64px]">{APROPOS.valeursTitre}</h2>
        </Rise>
        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {valeurs.map((v, i) => (
            <Rise key={v.titre} delay={i * 0.12} y={i === 1 ? 120 : 60} className={i === 1 ? 'md:mt-24' : ''}>
              <div className="bg-white p-8">
                <p className="pdp-display text-[56px] font-semibold leading-none tracking-[-0.04em] text-[#A68A6D]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="pdp-display mt-8 text-2xl font-semibold tracking-[-0.02em]">{v.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      <section className="bg-[#221607] px-6 py-32 text-[#F6F2EB]">
        <div className="mx-auto max-w-6xl">
          <Rise>
            <h2 className="pdp-display text-[40px] font-semibold tracking-[-0.03em] md:text-[64px]">{APROPOS.engagementsTitre}</h2>
          </Rise>
          <div className="mt-16 space-y-10">
            {engagements.map((e, i) => (
              <Glisse key={e.titre} sens={i % 2 ? 'droite' : 'gauche'} className="grid gap-3 border-t border-[#A68A6D]/40 pt-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
                <p className="pdp-display text-2xl font-semibold">{e.titre}</p>
                <p className="text-[#D8C9B5]">{e.texte}</p>
              </Glisse>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-32 text-center">
        <h2 className="pdp-display mx-auto max-w-4xl text-[40px] font-semibold tracking-[-0.03em] md:text-[80px]">
          <Mots texte={APROPOS.ctaTitre} />
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[#4D4842]">{APROPOS.ctaTexte}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={APROPOS.ctaPrincipal.href} className="bg-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-colors hover:bg-[#3E2F1B]">
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link href={APROPOS.ctaSecondaire.href} className="border border-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#221607] transition-colors hover:bg-[#221607] hover:text-[#F6F2EB]">
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </main>
  );
}
