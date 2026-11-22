// Version C « Fiche produit » : mise en page en lignes comme les fiches produit (libellés à gauche, contenu à droite),
// photo en cadre beige avec marge régulière, bouton anthracite.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Texte } from '../partage';

export const metadata: Metadata = {
  title: 'Aperçu C · Notre histoire',
  robots: { index: false, follow: false },
};

export default function VersionC() {
  const { histoire, signature } = APROPOS;
  return (
    <main className="bg-white text-[#34322F]">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-14 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-black">
            ← {APROPOS.retour}
          </Link>
          <p className="mt-16 text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52]">{APROPOS.accroche}</p>
          <h1 className="pdp-display mt-4 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-black md:text-[72px]">{APROPOS.titre}</h1>
        </div>
        <div className="md:col-span-5 md:pt-24">
          <p className="text-lg leading-relaxed text-[#4D4842]">{APROPOS.intro}</p>
          <dl className="mt-10 divide-y divide-[#E6DFD3] border-y border-[#E6DFD3] text-sm">
            <div className="flex justify-between gap-6 py-3">
              <dt className="text-[#6b6660]">Ville</dt>
              <dd className="text-right text-[#34322F]">Genève</dd>
            </div>
            <div className="flex justify-between gap-6 py-3">
              <dt className="text-[#6b6660]">Depuis</dt>
              <dd className="text-right text-[#34322F]">2024</dd>
            </div>
            <div className="flex justify-between gap-6 py-3">
              <dt className="text-[#6b6660]">Approche</dt>
              <dd className="text-right text-[#34322F]">Choisir mieux</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t border-[#E6DFD3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7F6A52] md:col-span-3">{histoire.kicker}</p>
          <div className="md:col-span-9">
            <h2 className="pdp-display text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[48px]">{histoire.titre}</h2>
            <div className="mt-8 max-w-3xl space-y-6 text-[17px] leading-relaxed text-[#4D4842]">
              {histoire.paragraphes.map((p, i) => (
                <Texte key={i} segments={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="bg-[#F6F2EB] p-10 md:p-16">
          <p className="pdp-display max-w-3xl text-[28px] font-semibold leading-snug tracking-[-0.02em] text-black md:text-[40px]">{APROPOS.citation}</p>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.12em] text-[#7F6A52]">{APROPOS.citationAuteur}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 md:grid-cols-2 md:items-start">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F2EB]">
          <Image src={signature.image} alt={signature.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover p-2" />
        </div>
        <div className="space-y-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7F6A52]">{signature.kicker}</p>
          <h2 className="pdp-display text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[48px]">{signature.titre}</h2>
          {signature.paragraphes.map((t, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-[#4D4842]">
              {t}
            </p>
          ))}
          <Link
            href={signature.lienHref}
            className="mt-4 inline-flex bg-[#34322F] px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-black"
          >
            {signature.lien}
          </Link>
        </div>
      </section>

      <section className="border-t border-[#E6DFD3]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
          <h2 className="pdp-display mt-4 text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[48px]">{APROPOS.valeursTitre}</h2>
          <div className="mt-12 divide-y divide-[#E6DFD3] border-y border-[#E6DFD3]">
            {APROPOS.valeurs.map((v) => (
              <div key={v.titre} className="grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
                <p className="pdp-display text-xl font-semibold tracking-[-0.02em] text-black">{v.titre}</p>
                <p className="text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F6F2EB]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="pdp-display text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[48px]">{APROPOS.engagementsTitre}</h2>
          <div className="mt-12 divide-y divide-[#D8C9B5] border-y border-[#D8C9B5]">
            {APROPOS.engagements.map((e) => (
              <div key={e.titre} className="grid gap-3 py-7 md:grid-cols-[1fr_2fr] md:gap-10">
                <p className="pdp-display text-xl font-semibold tracking-[-0.02em] text-black">{e.titre}</p>
                <p className="text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="pdp-display mx-auto max-w-2xl text-[36px] font-semibold tracking-[-0.03em] text-black md:text-[48px]">{APROPOS.ctaTitre}</h2>
        <p className="mx-auto mt-5 max-w-md text-[#4D4842]">{APROPOS.ctaTexte}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={APROPOS.ctaPrincipal.href}
            className="bg-[#34322F] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-black"
          >
            {APROPOS.ctaPrincipal.texte}
          </Link>
          <Link
            href={APROPOS.ctaSecondaire.href}
            className="border border-[#34322F] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#34322F] transition-colors hover:bg-[#34322F] hover:text-white"
          >
            {APROPOS.ctaSecondaire.texte}
          </Link>
        </div>
      </section>
    </main>
  );
}
