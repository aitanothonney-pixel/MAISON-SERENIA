'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductFAQProps {
  productName?: string;
}

const defaultFAQs = [
  {
    question: 'Combien de temps pour la livraison ?',
    answer: 'Nous expédions sous 24 heures. La livraison prend ensuite 8-15 jours ouvrés en fonction de votre localisation. Vous recevrez un numéro de suivi par email.',
  },
  {
    question: 'Comment retourner un article ?',
    answer: 'Vous avez 30 jours pour retourner tout article non utilisé. Contactez-nous à returns@maisonserenia.ch avec votre numéro de commande. Les frais de retour sont gratuits en cas d\'erreur de notre part.',
  },
  {
    question: 'Le produit est-il conforme aux photos ?',
    answer: 'Oui, nous montrons plusieurs angles et dimensions précises. Si le produit ne correspond pas à vos attentes, vous pouvez le retourner dans les 30 jours sans frais.',
  },
  {
    question: 'Offrez-vous une garantie ?',
    answer: 'Oui, tous nos produits incluent une garantie contre les défauts de fabrication. En cas de problème, nous remplaçons gratuitement. Contactez-nous sous 48h après réception.',
  },
  {
    question: 'Puis-je payer en plusieurs fois ?',
    answer: 'Oui ! Nous proposons Klarna qui permet de payer en 3-4 fois sans frais. Disponible lors du paiement.',
  },
];

export function ProductFAQ({ productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-serif font-bold text-black mb-8">Questions fréquentes</h2>
      <div className="space-y-4">
        {defaultFAQs.map((faq, idx) => (
          <button
            key={idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full text-left p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-none border border-neutral-200"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-black pr-4">{faq.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-neutral-600 shrink-0 transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </div>
            {openIndex === idx && (
              <p className="text-sm text-neutral-700 leading-relaxed mt-3">{faq.answer}</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
