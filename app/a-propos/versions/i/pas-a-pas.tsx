'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Ligne, Rise, Segments } from '../motion-kit';

// I · Pas à pas : le défilement vertical fait avancer une bande horizontale épinglée.
// Avec « réduire les mouvements », les mêmes panneaux s'empilent verticalement.
export function PasAPas() {
  // « Réduire les mouvements » n'est lu qu'après le montage : le premier rendu reste identique au serveur.
  const reduitBrut = useReducedMotion();
  // Vrai seulement côté navigateur, après l'hydratation (le serveur et le premier rendu voient « faux »).
  const monte = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const reduit = monte && reduitBrut === true;
  const pin = useRef<HTMLElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [decalage, setDecalage] = useState(0);

  useEffect(() => {
    const mesurer = () => {
      if (piste.current) setDistance(Math.max(0, piste.current.scrollWidth - window.innerWidth));
      if (pin.current) setDecalage(Math.max(0, pin.current.offsetHeight - window.innerHeight));
    };
    mesurer();
    window.addEventListener('resize', mesurer);
    document.fonts?.ready.then(mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, []);

  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  // Bande « collée » sans position sticky (le style global du site empêche le sticky) : elle suit le défilement.
  const decal = useTransform(scrollYProgress, [0, 1], [0, decalage]);
  const trait = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const { histoire, signature, valeurs } = APROPOS;

  const panneaux: ReactNode[] = [
    <div key="annee">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.accroche}</p>
      <p className="pdp-display mt-6 text-[120px] font-semibold leading-none tracking-[-0.05em] text-[#221607] md:text-[200px]">2024</p>
      <p className="pdp-display mt-4 text-3xl font-semibold tracking-[-0.02em]">Genève</p>
    </div>,
    <div key="histoire" className="max-w-xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
      <h2 className="pdp-display mt-4 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[72px]">{histoire.titre}</h2>
      <div className="mt-6 text-[17px] leading-relaxed text-[#4D4842]">
        <Segments segments={histoire.paragraphes[0]} />
      </div>
    </div>,
    <div key="photo" className="flex w-full flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F2EB]">
        <Image src="/catalog/j9h5SNVC.jpg" alt={signature.alt} fill sizes="(max-width: 768px) 84vw, 52vw" className="object-cover" />
      </div>
      <p className="pdp-display text-2xl font-semibold tracking-[-0.02em]">{signature.titre}</p>
    </div>,
    <div key="choisir" className="max-w-xl">
      <p className="pdp-display text-[52px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#221607] md:text-[96px]">Choisir mieux.</p>
      <div className="mt-8 text-[17px] leading-relaxed text-[#4D4842]">
        <Segments segments={histoire.paragraphes[1]} />
      </div>
    </div>,
    <div key="valeurs" className="w-full">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {valeurs.map((v) => (
          <div key={v.titre} className="bg-white p-6">
            <p className="pdp-display text-xl font-semibold tracking-[-0.02em]">{v.titre}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
          </div>
        ))}
      </div>
    </div>,
    <div key="cta" className="max-w-xl">
      <p className="pdp-display text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[72px]">{APROPOS.ctaTitre}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={APROPOS.ctaPrincipal.href} className="bg-[#221607] px-8 py-4 text-center text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB]">
          {APROPOS.ctaPrincipal.texte}
        </Link>
        <Link href={APROPOS.ctaSecondaire.href} className="border border-[#221607] px-8 py-4 text-center text-sm font-medium uppercase tracking-[0.12em]">
          {APROPOS.ctaSecondaire.texte}
        </Link>
      </div>
    </div>,
  ];

  return (
    <main className="bg-[#F6F2EB] text-[#221607]">
      <section className="px-6 pb-12 pt-16 md:pt-24">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-black">
          ← {APROPOS.retour}
        </Link>
        <h1 className="pdp-display mt-14 max-w-5xl text-[44px] font-semibold leading-[1.0] tracking-[-0.035em] md:text-[104px]">
          <Ligne>L&apos;art de vivre,</Ligne>
          <Ligne delay={0.12}>
            <span className="block pl-[8vw]">en toute sérénité.</span>
          </Ligne>
        </h1>
        <p className="mt-8 text-sm text-[#7F6A52]">Faites défiler vers le bas pour avancer.</p>
      </section>

      {reduit ? (
        <section className="space-y-28 px-6 py-24">
          {panneaux.map((p, i) => (
            <Rise key={i}>{p}</Rise>
          ))}
        </section>
      ) : (
        <section ref={pin} className="relative h-[420vh]">
          <motion.div style={{ y: decal }} className="absolute inset-x-0 top-0 flex h-screen items-center overflow-hidden">
            <motion.div ref={piste} style={{ x }} className="flex items-center gap-10 pl-[8vw] pr-[8vw]">
              {panneaux.map((p, i) => (
                <div key={i} className="flex h-[76vh] w-[82vw] flex-none items-center md:w-[52vw]">
                  {p}
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-x-6 bottom-8 h-px bg-[#D8C9B5]">
              <motion.div style={{ width: trait }} className="h-px bg-[#221607]" />
            </div>
          </motion.div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-32">
        <Rise>
          <h2 className="pdp-display text-[40px] font-semibold tracking-[-0.03em] md:text-[64px]">{APROPOS.engagementsTitre}</h2>
        </Rise>
        <div className="mt-16 grid gap-px bg-[#D8C9B5] md:grid-cols-2">
          {APROPOS.engagements.map((e, i) => (
            <Rise key={e.titre} delay={i * 0.08} className="bg-[#F6F2EB] p-8">
              <p className="pdp-display text-xl font-semibold">{e.titre}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
            </Rise>
          ))}
        </div>
      </section>
    </main>
  );
}
