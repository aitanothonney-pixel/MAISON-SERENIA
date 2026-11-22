// Version A « Éditorial » : hero noir, texte en colonnes, citation sur fond beige, grilles à filets dorés.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Heart, Leaf, Quote, Star } from 'lucide-react';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Texte } from '../partage';

export const metadata: Metadata = {
  title: 'Aperçu A · Notre histoire',
  robots: { index: false, follow: false },
};

const ICONES_VALEURS = [Award, Star, Heart];
const ICONES_ENGAGEMENTS = [Leaf, Star, Heart, Award];

export default function VersionA() {
  const { histoire, signature } = APROPOS;
  return (
    <main className="bg-white text-[#34322F]">
      <section className="bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-6xl px-6 pb-28 pt-16 md:pt-24">
          <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-white">
            ← {APROPOS.retour}
          </Link>
          <p className="mt-16 text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{APROPOS.accroche}</p>
          <h1 className="pdp-display mt-5 max-w-4xl text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[84px]">
            {APROPOS.titre}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400">{APROPOS.intro}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
          <h2 className="pdp-display mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[52px]">
            {histoire.titre}
          </h2>
        </div>
        <div className="space-y-6 text-[17px] leading-relaxed text-[#4D4842]">
          {histoire.paragraphes.map((p, i) => (
            <Texte key={i} segments={p} />
          ))}
        </div>
      </section>

      <section className="bg-[#F6F2EB]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <Quote className="mx-auto h-10 w-10 text-[#A68A6D]" strokeWidth={1.2} />
          <p className="pdp-display mx-auto mt-8 max-w-3xl text-[30px] font-semibold leading-snug tracking-[-0.02em] text-black md:text-[44px]">
            {APROPOS.citation}
          </p>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7F6A52]">{APROPOS.citationAuteur}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F2EB]">
          <Image src={signature.image} alt={signature.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover p-2" />
        </div>
        <div className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
          <h2 className="pdp-display text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[52px]">{signature.titre}</h2>
          {signature.paragraphes.map((t, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-[#4D4842]">
              {t}
            </p>
          ))}
          <Link
            href={signature.lienHref}
            className="inline-flex border-b border-[#A68A6D] pb-1 text-sm font-medium uppercase tracking-[0.15em] text-black transition-colors hover:border-black"
          >
            {signature.lien} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
        <h2 className="pdp-display mt-4 text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[52px]">{APROPOS.valeursTitre}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {APROPOS.valeurs.map((v, i) => {
            const Icone = ICONES_VALEURS[i];
            return (
              <div key={v.titre} className="bg-[#F6F2EB] p-8">
                <Icone className="h-6 w-6 text-black" strokeWidth={1.5} />
                <h3 className="pdp-display mt-8 text-2xl font-semibold tracking-[-0.02em] text-black">{v.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#F6F2EB]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="pdp-display text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[52px]">{APROPOS.engagementsTitre}</h2>
          <div className="mt-12 grid gap-px bg-[#D8C9B5] md:grid-cols-2">
            {APROPOS.engagements.map((e, i) => {
              const Icone = ICONES_ENGAGEMENTS[i];
              return (
                <div key={e.titre} className="flex items-start gap-5 bg-[#F6F2EB] p-7">
                  <Icone className="mt-1 h-5 w-5 flex-shrink-0 text-[#7F6A52]" strokeWidth={1.5} />
                  <div>
                    <p className="pdp-display text-lg font-semibold tracking-[-0.01em] text-black">{e.titre}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-24 text-center text-white">
        <h2 className="pdp-display mx-auto max-w-2xl px-6 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[52px]">
          {APROPOS.ctaTitre}
        </h2>
        <p className="mx-auto mt-5 max-w-md px-6 text-neutral-400">{APROPOS.ctaTexte}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 px-6 sm:flex-row">
          <Link
            href={APROPOS.ctaPrincipal.href}
            className="bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-black transition-colors hover:bg-[#D8C9B5]"
          >
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link
            href={APROPOS.ctaSecondaire.href}
            className="border border-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black"
          >
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </main>
  );
}
