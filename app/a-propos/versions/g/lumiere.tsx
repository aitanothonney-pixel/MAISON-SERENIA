'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Mots, Rise, Segments, useMasqueLumiere, usePointeur } from '../motion-kit';

// G · Lumière : la page passe de la nuit au jour en défilant ; le pointeur éclaire le titre et la photo Bubble.
export function Lumiere() {
  const { scrollYProgress } = useScroll();
  const fond = useTransform(scrollYProgress, [0, 0.4], ['#0a0a0a', '#F6F2EB']);
  const encre = useTransform(scrollYProgress, [0, 0.4], ['#ece6dc', '#221607']);

  const pointeurTitre = usePointeur();
  const masqueTitre = useMasqueLumiere(pointeurTitre.x, pointeurTitre.y, 260);
  const pointeurPhoto = usePointeur();
  const masquePhoto = useMasqueLumiere(pointeurPhoto.x, pointeurPhoto.y, 180, true);
  const { histoire, signature, valeurs, engagements } = APROPOS;

  return (
    <motion.main style={{ backgroundColor: fond, color: encre }} className="min-h-screen">
      <section onPointerMove={pointeurTitre.suivre} className="relative flex min-h-[100svh] items-center overflow-hidden px-6">
        <Link href="/" className="absolute left-6 top-8 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-white">
          ← {APROPOS.retour}
        </Link>
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{APROPOS.accroche}</p>
          <div className="relative mt-8">
            <h1 className="pdp-display text-[52px] font-semibold leading-[1.0] tracking-[-0.035em] text-[#4a4640] md:text-[120px]">{APROPOS.titre}</h1>
            <motion.h1
              aria-hidden="true"
              style={{ WebkitMaskImage: masqueTitre, maskImage: masqueTitre }}
              className="pdp-display absolute inset-0 text-[52px] font-semibold leading-[1.0] tracking-[-0.035em] text-white md:text-[120px]"
            >
              {APROPOS.titre}
            </motion.h1>
          </div>
          <p className="mt-10 max-w-lg text-lg leading-relaxed text-neutral-400">{APROPOS.intro}</p>
        </div>
        <p className="absolute bottom-8 left-6 text-[11px] uppercase tracking-[0.2em] text-neutral-600">Survolez le titre pour l&apos;éclairer</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-32 md:grid-cols-12 md:items-center">
        <div onPointerMove={pointeurPhoto.suivre} className="relative aspect-[4/3] overflow-hidden md:col-span-7">
          <Image src="/catalog/j9h5SNVC.jpg" alt={signature.alt} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" />
          <motion.div aria-hidden="true" style={{ WebkitMaskImage: masquePhoto, maskImage: masquePhoto }} className="absolute inset-0 bg-[#0a0a0a]/55" />
          <p className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.25em] text-white/80">Survolez pour éclairer</p>
        </div>
        <Rise className="md:col-span-4 md:col-start-9">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
          <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] md:text-[56px]">{signature.titre}</h2>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed opacity-80">
            {signature.paragraphes.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </Rise>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
        <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] md:text-[60px]">
          <Mots texte={histoire.titre} />
        </h2>
        <div className="mt-10 space-y-6 text-left text-[17px] leading-relaxed opacity-80">
          {histoire.paragraphes.map((p, i) => (
            <Rise key={i} delay={i * 0.08}>
              <Segments segments={p} />
            </Rise>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <Rise>
          <p className="pdp-display mx-auto max-w-4xl text-[30px] font-semibold leading-snug tracking-[-0.02em] md:text-[52px]">{APROPOS.citation}</p>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.25em] opacity-70">{APROPOS.citationAuteur}</p>
        </Rise>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-28">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
        <h2 className="pdp-display mt-4 text-center text-[40px] font-semibold tracking-[-0.03em] md:text-[56px]">{APROPOS.valeursTitre}</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {valeurs.map((v, i) => (
            <Rise key={v.titre} delay={i * 0.1} className="border-t border-current/20 pt-6">
              <p className="pdp-display text-[26px] font-semibold tracking-[-0.02em]">{v.titre}</p>
              <p className="mt-3 text-sm leading-relaxed opacity-75">{v.texte}</p>
            </Rise>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-px bg-current/20 md:grid-cols-2">
          {engagements.map((e, i) => (
            <Rise key={e.titre} delay={i * 0.06} className="p-8">
              <p className="pdp-display text-xl font-semibold">{e.titre}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{e.texte}</p>
            </Rise>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32 text-center">
        <h2 className="pdp-display mx-auto max-w-3xl text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[72px]">{APROPOS.ctaTitre}</h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={APROPOS.ctaPrincipal.href} className="bg-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-opacity hover:opacity-80">
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link href={APROPOS.ctaSecondaire.href} className="border border-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#221607] hover:text-[#F6F2EB]">
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
