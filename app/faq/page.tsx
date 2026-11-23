'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EASE, Rise } from '@/components/a-propos/motion-kit';
import { INFO_KICKER, InfoEntete } from '@/components/ui/info-kit';

type FaqItem = { q: string; a: string };
type FaqGroup = { theme: string; items: FaqItem[] };

const FAQ_DATA: FaqGroup[] = [
  {
    theme: 'Livraison',
    items: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: "Comptez 1 à 4 semaines pour la livraison de votre commande, avec un numéro de suivi inclus dès l'expédition.",
      },
      {
        q: 'La livraison est-elle gratuite ?',
        a: "Oui, la livraison standard est offerte pour toute commande supérieure à 40 CHF. En dessous, le tarif est de 4,90 CHF.",
      },
      {
        q: 'Comment suivre ma commande ?',
        a: "Vous recevrez un e-mail avec votre numéro de suivi dès l'expédition de votre colis. Vous pourrez suivre son acheminement directement sur le site du transporteur.",
      },
      {
        q: 'Livrez-vous en dehors de la France ?',
        a: "Nous livrons en Suisse, en France, en Allemagne, en Italie, en Autriche, en Belgique et au Luxembourg. Comptez 1 à 4 semaines selon le pays de destination.",
      },
    ],
  },
  {
    theme: 'Produits',
    items: [
      {
        q: "Les couleurs à l'écran sont-elles fidèles ?",
        a: 'Nous faisons tout notre possible pour que les photographies reflètent fidèlement les produits. Il peut toutefois exister de légères variations selon la calibration de votre écran.',
      },
      {
        q: 'Comment entretenir mes articles ?',
        a: "Chaque produit est livré avec une notice d'entretien adaptée. Des conseils généraux sont également disponibles sur notre blog.",
      },
    ],
  },
  {
    theme: 'Paiements',
    items: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes Visa, Mastercard, American Express, ainsi que le paiement via PayPal. Tous les paiements sont traités de manière sécurisée par Stripe.',
      },
      {
        q: 'Mes données bancaires sont-elles sécurisées ?',
        a: 'Absolument. Nous ne stockons aucune donnée bancaire. Toutes les transactions passent par des prestataires de paiement certifiés PCI-DSS.',
      },
    ],
  },
  {
    theme: 'Retours',
    items: [
      {
        q: 'Quel est le délai pour retourner un article ?',
        a: 'Vous disposez de 30 jours à compter de la réception de votre commande pour nous retourner un article, sans avoir à justifier votre décision.',
      },
      {
        q: 'Les frais de retour sont-ils pris en charge ?',
        a: "Les frais de retour sont à votre charge, sauf en cas d'erreur de notre part ou d'article défectueux, auquel cas nous vous fournissons une étiquette prépayée.",
      },
      {
        q: 'Quand serai-je remboursé ?',
        a: "Le remboursement est effectué dans les 5 jours ouvrés suivant la réception et la vérification du colis retourné, sur votre moyen de paiement d'origine.",
      },
    ],
  },
  {
    theme: 'Commande',
    items: [
      {
        q: 'Comment passer une commande ?',
        a: 'Ajoutez les articles de votre choix au panier, puis suivez le processus de commande. Vous recevrez une confirmation par e-mail immédiatement après validation.',
      },
      {
        q: 'Puis-je modifier ma commande après validation ?',
        a: "Oui, tant que la commande n'a pas été expédiée. Contactez notre service client dans les plus brefs délais avec votre numéro de commande.",
      },
      {
        q: 'Comment annuler une commande ?',
        a: 'Une commande peut être annulée sans frais avant expédition. Passé ce délai, vous devrez procéder à un retour standard une fois le colis reçu.',
      },
      {
        q: 'Où trouver ma facture ?',
        a: "Votre facture est jointe à l'e-mail de confirmation de commande. Vous pouvez également la retrouver dans votre espace client.",
      },
    ],
  },
];

function FaqAccordion({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="pdp-display text-lg font-semibold tracking-[-0.01em] md:text-xl">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#D8C9B5] text-[#7F6A52]"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.4} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="reponse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-[#4D4842]">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [openMap, setOpenMap] = useState<Record<string, number | null>>({});

  function toggle(theme: string, idx: number) {
    setOpenMap(prev => ({
      ...prev,
      [theme]: prev[theme] === idx ? null : idx,
    }));
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.flatMap((g) => g.items).map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <InfoEntete
        kicker="Aide"
        titre="Questions Fréquentes"
        intro="Retrouvez les réponses aux questions les plus courantes, organisées par thème."
      />

      <div className="mx-auto max-w-6xl space-y-20 px-6 pb-32">
        {FAQ_DATA.map(group => (
          <Rise key={group.theme}>
            <section>
              <div className="flex items-center gap-6">
                <h2 className={INFO_KICKER}>{group.theme}</h2>
                <div className="h-px flex-1 bg-[#D8C9B5]" />
              </div>
              <div className="mt-6 divide-y divide-[#D8C9B5] border-y border-[#D8C9B5]">
                {group.items.map((item, idx) => (
                  <FaqAccordion
                    key={idx}
                    item={item}
                    isOpen={openMap[group.theme] === idx}
                    onToggle={() => toggle(group.theme, idx)}
                  />
                ))}
              </div>
            </section>
          </Rise>
        ))}

        <Rise>
          <section className="bg-[#221607] p-10 text-center text-[#F6F2EB] md:p-16">
            <h3 className="pdp-display text-3xl font-semibold tracking-[-0.02em]">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h3>
            <p className="mt-4 text-[#D8C9B5]">
              Notre équipe répond à toutes vos questions dans les 48 heures ouvrées.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center bg-[#F6F2EB] px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#221607] transition-transform duration-500 hover:-translate-y-0.5"
            >
              Nous contacter
            </Link>
          </section>
        </Rise>
      </div>
    </main>
  );
}
