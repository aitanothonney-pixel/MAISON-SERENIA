'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type FaqItem = { q: string; a: string };
type FaqGroup = { theme: string; items: FaqItem[] };

const FAQ_DATA: FaqGroup[] = [
  {
    theme: 'Livraison',
    items: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: "La livraison standard Colissimo prend 3 à 5 jours ouvrés. En express 24h (commande avant 14h), vous recevez votre colis le lendemain. Pour l'Europe, comptez 7 à 14 jours ouvrés.",
      },
      {
        q: 'La livraison est-elle gratuite ?',
        a: "Oui, la livraison Colissimo Standard est offerte pour toute commande d'un montant supérieur à 80 €. En dessous, le tarif est de 4,90 €.",
      },
      {
        q: 'Comment suivre ma commande ?',
        a: "Vous recevrez un e-mail avec votre numéro de suivi dès l'expédition de votre colis. Vous pourrez suivre son acheminement directement sur le site Colissimo ou Chronopost.",
      },
      {
        q: 'Livrez-vous en dehors de la France ?',
        a: "Nous livrons dans l'ensemble de l'Union Européenne. Les frais et délais varient selon le pays de destination (à partir de 12,90 € pour 7 à 14 jours ouvrés).",
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
        q: 'Proposez-vous des pièces sur-mesure ?',
        a: 'Pour certaines collections de mobilier, une personnalisation de dimensions ou de finitions est possible. Contactez notre service client pour obtenir un devis.',
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
        a: 'Nous acceptons les cartes Visa, Mastercard, American Express, ainsi que le paiement via PayPal. Tous les paiements sont sécurisés par chiffrement SSL.',
      },
      {
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Oui, nous proposons le paiement en 3 ou 4 fois sans frais via Alma pour les commandes à partir de 150 €, disponible au moment du paiement.',
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
    <div className="border-b border-neutral-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left hover:text-neutral-600 transition-colors"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        <span className="font-semibold text-black text-sm leading-relaxed">{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="text-neutral-500 text-sm leading-relaxed pb-5"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {item.a}
            </p>
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

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour à l'accueil
          </Link>
          <h1
            className="text-4xl md:text-5xl font-bold text-black mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Questions Fréquentes
          </h1>
          <p className="text-neutral-500 text-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Retrouvez les réponses aux questions les plus courantes, organisées par thème.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">

        {FAQ_DATA.map(group => (
          <section key={group.theme}>
            <div className="flex items-center gap-4 mb-6">
              <h2
                className="text-xs uppercase tracking-[0.3em] font-semibold text-neutral-400"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {group.theme}
              </h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>
            <div className="border border-neutral-200 px-6">
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
        ))}

        {/* Footer CTA */}
        <section className="border-t border-neutral-100 pt-12">
          <div className="bg-neutral-950 p-10 text-center">
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p
              className="text-neutral-400 text-sm mb-6"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Notre équipe répond à toutes vos questions dans les 48 heures ouvrées.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-black text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-100 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
