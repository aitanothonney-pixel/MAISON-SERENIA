// Version B « Lumière » : fond beige, grands titres centrés, photo pleine largeur, valeurs en liste numérotée.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Heart, Leaf, Quote, Star } from 'lucide-react';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Texte } from '../partage';

export const metadata: Metadata = {
  title: 'Aperçu B · Notre histoire',
  robots: { index: false, follow: false },
};

const ICONES_ENGAGEMENTS = [Leaf, Star, Heart, Award];

export default function VersionB() {
  const { histoire, signature } = APROPOS;
  return (
    <main className="bg-[#F6F2EB] text-[#34322F]">
      <section className="px-6 pb-24 pt-14 text-center md:pt-20">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-black">
          ← {APROPOS.retour}
        </Link>
        <p className="mt-20 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.accroche}</p>
        <h1 className="pdp-display mx-auto mt-6 max-w-5xl text-[48px] font-semibold leading-[1] tracking-[-0.035em] text-[#221607] md:text-[112px]">
          {APROPOS.titre}
        </h1>
        <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-[#4D4842]">{APROPOS.intro}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-28 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
        <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] text-[#221607] md:text-[60px]">{histoire.titre}</h2>
        <div className="mt-10 space-y-6 text-left text-[17px] leading-relaxed text-[#4D4842]">
          {histoire.paragraphes.map((p, i) => (
            <Texte key={i} segments={p} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden bg-[#F6F2EB] p-2">
        <Image src={signature.image} alt={signature.alt} fill sizes="(max-width: 1024px) 100vw, 1152px" className="object-cover p-2" />
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
        <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] text-[#221607] md:text-[56px]">{signature.titre}</h2>
        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-[#4D4842]">
          {signature.paragraphes.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <Link
          href={signature.lienHref}
          className="mt-10 inline-flex border-b border-[#221607] pb-1 text-sm font-medium uppercase tracking-[0.15em] text-[#221607] transition-colors hover:border-[#A68A6D] hover:text-[#7F6A52]"
        >
          {signature.lien} →
        </Link>
      </section>

      <section className="px-6 py-28 text-center">
        <Quote className="mx-auto h-9 w-9 text-[#A68A6D]" strokeWidth={1.2} />
        <p className="pdp-display mx-auto mt-8 max-w-4xl text-[30px] font-semibold leading-snug tracking-[-0.02em] text-[#221607] md:text-[46px]">
          {APROPOS.citation}
        </p>
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7F6A52]">{APROPOS.citationAuteur}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-28">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
        <h2 className="pdp-display mt-4 text-center text-[40px] font-semibold tracking-[-0.03em] text-[#221607] md:text-[56px]">
          {APROPOS.valeursTitre}
        </h2>
        <ol className="mt-14 border-t border-[#D8C9B5]">
          {APROPOS.valeurs.map((v, i) => (
            <li key={v.titre} className="grid gap-4 border-b border-[#D8C9B5] py-8 md:grid-cols-[90px_1fr_1.4fr] md:items-baseline">
              <span className="text-[13px] font-medium tracking-[0.1em] text-[#A68A6D]">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="pdp-display text-[26px] font-semibold tracking-[-0.02em] text-[#221607]">{v.titre}</h3>
              <p className="text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="pdp-display text-center text-[40px] font-semibold tracking-[-0.03em] text-[#221607] md:text-[56px]">{APROPOS.engagementsTitre}</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {APROPOS.engagements.map((e, i) => {
              const Icone = ICONES_ENGAGEMENTS[i];
              return (
                <div key={e.titre} className="border-t-2 border-[#A68A6D] pt-6">
                  <Icone className="h-5 w-5 text-[#7F6A52]" strokeWidth={1.5} />
                  <p className="pdp-display mt-5 text-lg font-semibold tracking-[-0.01em] text-[#221607]">{e.titre}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#34322F] px-6 py-24 text-center text-white">
        <h2 className="pdp-display mx-auto max-w-2xl text-[36px] font-semibold tracking-[-0.03em] md:text-[52px]">{APROPOS.ctaTitre}</h2>
        <p className="mx-auto mt-5 max-w-md text-[#D8C9B5]">{APROPOS.ctaTexte}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={APROPOS.ctaPrincipal.href} className="bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#221607] transition-colors hover:bg-[#D8C9B5]">
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link href={APROPOS.ctaSecondaire.href} className="border border-white px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#221607]">
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </main>
  );
}
