// Pages d'information (FAQ, livraison, retours, mentions légales, confidentialité, CGV) :
// même DA que la page Contact. Les textes restent dans chaque page.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Mots, Rise } from '@/components/a-propos/motion-kit';

export const INFO_KICKER = 'text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]';
export const INFO_LIEN = 'text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-[#221607]';
export const INFO_PICTO = 'flex h-11 w-11 shrink-0 items-center justify-center border border-[#A68A6D]/50 text-[#221607]';
// Texte courant : liens soulignés, mots en gras et couleurs de la DA.
export const INFO_TEXTE =
  'space-y-5 text-[17px] leading-relaxed text-[#4D4842] [&_a]:text-[#221607] [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-[#7F6A52] [&_strong]:font-semibold [&_strong]:text-[#221607]';

// En-tête identique à la page Contact : retour, étiquette, titre qui se dévoile, introduction.
export function InfoEntete({ kicker, titre, intro, children }: { kicker: string; titre: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pb-24 md:pt-16">
      <Link href="/" className={INFO_LIEN}>
        ← Retour à l’accueil
      </Link>
      <Rise>
        <p className={`${INFO_KICKER} mt-16 md:mt-24`}>{kicker}</p>
      </Rise>
      <h1 className="pdp-display mt-6 text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[104px]">
        <Mots texte={titre} />
      </h1>
      {intro && (
        <Rise delay={0.25}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-[#4D4842]">{intro}</p>
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

// Une section d'un texte légal : titre, puis texte. Elle apparaît en douceur au défilement.
export function InfoSection({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <Rise>
      <section className="space-y-6">
        <h2 className="pdp-display text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[38px]">{titre}</h2>
        <div className={INFO_TEXTE}>{children}</div>
      </section>
    </Rise>
  );
}

// Carte blanche sur fond crème, comme le formulaire de la page Contact.
export function InfoCarte({ children }: { children: ReactNode }) {
  return (
    <Rise>
      <div className="bg-white p-8 shadow-[0_24px_60px_-34px_rgba(34,22,7,0.4)] md:p-12">{children}</div>
    </Rise>
  );
}

const CONSULTEZ = [
  { href: '/faq', libelle: 'FAQ complète' },
  { href: '/livraison', libelle: 'Livraison & Délais' },
  { href: '/retours', libelle: 'Retours & Remboursements' },
];

// Bloc « Consultez aussi », repris de la page Contact.
export function InfoConsultez() {
  return (
    <Rise delay={0.2}>
      <div className="border border-[#D8C9B5] bg-white/60 p-8">
        <p className={INFO_KICKER}>Consultez aussi</p>
        <ul className="mt-6 divide-y divide-[#D8C9B5]">
          {CONSULTEZ.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-center justify-between py-4 text-[16px]">
                <span className="underline-offset-4 group-hover:underline">{l.libelle}</span>
                <ArrowUpRight
                  className="h-4 w-4 text-[#7F6A52] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.4}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Rise>
  );
}

// Date de dernière mise à jour.
export function InfoDerniereMaj({ texte }: { texte: string }) {
  return (
    <Rise>
      <p className="mt-16 border-t border-[#D8C9B5] pt-8 text-xs text-[#7F6A52]">{texte}</p>
    </Rise>
  );
}
