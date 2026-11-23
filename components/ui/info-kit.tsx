// Pages d'information (FAQ, livraison, retours, mentions légales, confidentialité, CGV) :
// même DA que « Notre histoire » et « Contact ». Les textes restent dans chaque page.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Mots, Rise } from '@/components/a-propos/motion-kit';

export const INFO_KICKER = 'text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]';
export const INFO_LIEN = 'text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-[#221607]';
export const INFO_PICTO = 'flex h-11 w-11 shrink-0 items-center justify-center border border-[#A68A6D]/50 text-[#221607]';
// Texte courant : liens soulignés, mots en gras et couleurs de la DA.
export const INFO_TEXTE =
  'space-y-5 text-[17px] leading-relaxed text-[#4D4842] [&_a]:text-[#221607] [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-[#7F6A52] [&_strong]:font-semibold [&_strong]:text-[#221607]';

// En-tête : retour à l'accueil, titre qui se dévoile mot par mot, introduction éventuelle.
export function InfoEntete({ titre, intro, children }: { titre: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-24 md:pt-16">
      <Link href="/" className={INFO_LIEN}>
        ← Retour à l&apos;accueil
      </Link>
      <h1 className="pdp-display mt-16 text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] md:mt-24 md:text-[88px]">
        <Mots texte={titre} />
      </h1>
      {intro && (
        <Rise delay={0.25}>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[#4D4842]">{intro}</p>
        </Rise>
      )}
      {children && (
        <Rise delay={0.3}>
          <div className="mt-12">{children}</div>
        </Rise>
      )}
    </section>
  );
}

// Une section : titre à gauche, texte à droite sur ordinateur ; elle apparaît en douceur au défilement.
export function InfoSection({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <Rise>
      <section className="grid gap-8 border-t border-[#D8C9B5] pt-14 md:grid-cols-12 md:gap-12 md:pt-20">
        <h2 className="pdp-display text-[28px] font-semibold leading-tight tracking-[-0.02em] md:col-span-4 md:text-[36px]">
          {titre}
        </h2>
        <div className={`md:col-span-7 md:col-start-6 ${INFO_TEXTE}`}>{children}</div>
      </section>
    </Rise>
  );
}

// Date de dernière mise à jour, en bas de page.
export function InfoDerniereMaj({ texte }: { texte: string }) {
  return (
    <Rise>
      <p className="mt-20 border-t border-[#D8C9B5] pt-8 text-xs text-[#7F6A52]">{texte}</p>
    </Rise>
  );
}
