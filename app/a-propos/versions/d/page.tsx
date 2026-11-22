// Version D « Manifeste » : titres très grands, grande photo pleine largeur avec carte beige, bandeaux dorés.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APROPOS } from '@/lib/a-propos-contenu';
import { Texte } from '../partage';

export const metadata: Metadata = {
  title: 'Aperçu D · Notre histoire',
  robots: { index: false, follow: false },
};

export default function VersionD() {
  const { histoire, signature } = APROPOS;
  return (
    <main className="bg-white text-[#34322F]">
      <section className="relative flex min-h-[88vh] flex-col justify-end bg-[#0a0a0a] px-6 pb-16 pt-28 text-white md:px-16">
        <Link href="/" className="absolute left-6 top-8 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-white md:left-16">
          ← {APROPOS.retour}
        </Link>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#A68A6D]">{APROPOS.accroche}</p>
        <h1 className="pdp-display mt-6 max-w-6xl text-[56px] font-semibold leading-[0.95] tracking-[-0.045em] md:text-[128px]">{APROPOS.titre}</h1>
        <div className="mt-12 h-px w-24 bg-[#A68A6D]" />
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-neutral-400">{APROPOS.intro}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="pdp-display text-[64px] font-semibold leading-none tracking-[-0.04em] text-[#A68A6D] md:col-span-3">01</p>
          <div className="md:col-span-9">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{histoire.kicker}</p>
            <h2 className="pdp-display mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-black md:text-[64px]">{histoire.titre}</h2>
            <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-[#4D4842]">
              {histoire.paragraphes.map((p, i) => (
                <Texte key={i} segments={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#A68A6D] px-6 py-28 text-[#0a0a0a]">
        <div className="mx-auto max-w-5xl">
          <p className="pdp-display text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[64px]">{APROPOS.citation}</p>
          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.25em]">{APROPOS.citationAuteur}</p>
        </div>
      </section>

      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-[#F6F2EB]">
        <Image src={signature.image} alt={signature.alt} fill sizes="100vw" className="object-cover" />
        <div className="absolute bottom-6 left-6 right-6 bg-[#F6F2EB] p-8 md:bottom-12 md:left-12 md:right-auto md:max-w-md md:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{signature.kicker}</p>
          <h2 className="pdp-display mt-3 text-[32px] font-semibold tracking-[-0.03em] text-black md:text-[40px]">{signature.titre}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#4D4842]">{signature.paragraphes[0]}</p>
          <Link href={signature.lienHref} className="mt-6 inline-flex border-b border-black pb-1 text-sm font-medium uppercase tracking-[0.12em] text-black">
            {signature.lien} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">{APROPOS.valeursKicker}</p>
        <h2 className="pdp-display mt-4 text-[40px] font-semibold tracking-[-0.03em] text-black md:text-[64px]">{APROPOS.valeursTitre}</h2>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {APROPOS.valeurs.map((v, i) => (
            <div key={v.titre} className="border-t border-black pt-6">
              <p className="pdp-display text-[56px] font-semibold leading-none tracking-[-0.04em] text-[#A68A6D]">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="pdp-display mt-8 text-[26px] font-semibold tracking-[-0.02em] text-black">{v.titre}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4D4842]">{v.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F6F2EB] px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="pdp-display text-[40px] font-semibold tracking-[-0.03em] text-black md:text-[64px]">{APROPOS.engagementsTitre}</h2>
          <ul className="mt-12 divide-y divide-[#D8C9B5] border-y border-[#D8C9B5]">
            {APROPOS.engagements.map((e) => (
              <li key={e.titre} className="grid gap-2 py-7 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-10">
                <p className="pdp-display text-2xl font-semibold tracking-[-0.02em] text-black">{e.titre}</p>
                <p className="text-sm leading-relaxed text-[#4D4842]">{e.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="bg-[#0a0a0a] px-6 py-24 text-white md:px-16">
          <h2 className="pdp-display text-[40px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[64px]">{APROPOS.ctaTitre}</h2>
        </div>
        <div className="flex flex-col justify-center gap-6 bg-[#A68A6D] px-6 py-24 md:px-16">
          <p className="max-w-sm text-lg leading-relaxed text-[#0a0a0a]">{APROPOS.ctaTexte}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={APROPOS.ctaPrincipal.href} className="bg-[#0a0a0a] px-8 py-4 text-center text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#34322F]">
              {APROPOS.ctaPrincipal.texte}
            </Link>
            <Link href={APROPOS.ctaSecondaire.href} className="border border-[#0a0a0a] px-8 py-4 text-center text-sm font-medium uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white">
              {APROPOS.ctaSecondaire.texte}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
