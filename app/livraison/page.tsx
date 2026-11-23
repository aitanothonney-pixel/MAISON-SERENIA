import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Package, Truck } from 'lucide-react';
import { Rise } from '@/components/a-propos/motion-kit';
import { INFO_PICTO, InfoEntete, InfoSection } from '@/components/ui/info-kit';

export const metadata: Metadata = {
  alternates: { canonical: 'https://maison-serenia.com/livraison' },
  title: 'Livraison & Délais | MAISON SERENIA',
  description: 'Informations sur nos modes de livraison, délais et suivi de commande.',
};

const SUIVI = [
  'Confirmation de commande immédiate par e-mail',
  "Notification d'expédition avec numéro de suivi",
  'Livraison avec signature pour les articles premium',
  'Support disponible 7j/7 en cas de problème',
];

const CARTES = [
  {
    icon: Truck,
    title: 'Livraison en pièce',
    desc: "Le transporteur monte les articles jusqu'à la pièce de votre choix et procède à l'installation si vous le souhaitez.",
  },
  {
    icon: Package,
    title: 'Emballage renforcé',
    desc: 'Chaque meuble est protégé par un double emballage sur mesure pour garantir un arrivage impeccable.',
  },
  {
    icon: MapPin,
    title: 'Zone de livraison',
    desc: 'Suisse, France, Allemagne, Italie, Autriche, Belgique et Luxembourg. Délai : 1 à 4 semaines selon disponibilité.',
  },
];

export default function LivraisonPage() {
  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <InfoEntete
        kicker="Expédition"
        titre="Livraison & Délais"
        intro="Nous expédions chaque commande avec le plus grand soin, pour que vos pièces arrivent en parfait état."
      />

      <div className="mx-auto max-w-6xl px-6 pb-32">
        <InfoSection titre="Suivi de commande">
          <p>
            Dès l&apos;expédition de votre colis, vous recevrez un e-mail contenant votre numéro de suivi. Vous pouvez à tout moment suivre l&apos;acheminement de votre commande directement sur le site du transporteur.
          </p>
          <ul className="mt-6 space-y-3">
            {SUIVI.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#221607]" />
                {item}
              </li>
            ))}
          </ul>
        </InfoSection>

        <InfoSection titre="Livraison mobilier">
          <p>
            Les pièces de mobilier (canapés, tables, armoires…) sont acheminées par un transporteur spécialisé équipé pour manipuler des articles volumineux et fragiles.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {CARTES.map((carte, i) => (
              <Rise key={carte.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col border border-[#D8C9B5] bg-white p-6 transition-transform duration-500 hover:-translate-y-1">
                  <span className={`${INFO_PICTO} mb-6`}>
                    <carte.icon className="h-4 w-4" strokeWidth={1.4} />
                  </span>
                  <p className="pdp-display text-lg font-semibold tracking-[-0.01em]">{carte.title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4D4842]">{carte.desc}</p>
                </div>
              </Rise>
            ))}
          </div>
        </InfoSection>

        <Rise>
          <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-[#D8C9B5] pt-12 sm:flex-row sm:items-center">
            <p className="text-lg text-[#4D4842]">Une question sur votre livraison ?</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[#221607] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-transform duration-500 hover:-translate-y-0.5"
            >
              Nous contacter
            </Link>
          </div>
        </Rise>
      </div>
    </main>
  );
}
