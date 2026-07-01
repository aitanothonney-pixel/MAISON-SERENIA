'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: 'Commandes',
    question: 'Combien de temps pour recevoir ma commande ?',
    answer: 'Les commandes sont généralement expédiées sous 24 heures. La livraison prend ensuite 8-15 jours ouvrés selon votre localisation. Vous recevrez un numéro de suivi dès l\'expédition.'
  },
  {
    category: 'Commandes',
    question: 'Puis-je modifier ou annuler ma commande ?',
    answer: 'Vous pouvez annuler votre commande jusqu\'à 24 heures après sa passation. Après ce délai, contactez-nous au plus tôt. Les frais d\'expédition ne sont pas remboursables sauf erreur de notre part.'
  },
  {
    category: 'Commandes',
    question: 'Offrez-vous la livraison gratuite ?',
    answer: 'Oui ! La livraison est gratuite pour toute commande supérieure à 60€. Pour les commandes inférieures, les frais de port sont calculés automatiquement en fonction de votre adresse.'
  },
  {
    category: 'Retours',
    question: 'Comment retourner un article ?',
    answer: 'Vous avez 30 jours pour retourner tout article non utilisé. Contactez-nous à maisonserenia@gmail.com avec votre numéro de commande. Nous vous fournirons une étiquette de retour. Une fois reçu, vous êtes remboursé sous 14 jours.'
  },
  {
    category: 'Retours',
    question: 'Qui paie les frais de retour ?',
    answer: 'Les retours sans raison valable sont à votre charge (5-10€). En cas de défaut ou erreur de notre part, les frais sont gratuits. Vous recevrez les détails lors de votre demande de retour.'
  },
  {
    category: 'Retours',
    question: 'Puis-je échanger un produit ?',
    answer: 'Bien sûr ! Un échange est possible dans les 30 jours. Une fois votre retour reçu, nous vous envoyons le nouveau produit gratuitement. Contactez maisonserenia@gmail.com pour commencer.'
  },
  {
    category: 'Paiements',
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons : Carte bancaire (Visa, Mastercard), PayPal, TWINT, Apple Pay, Google Pay, et Klarna.'
  },
  {
    category: 'Paiements',
    question: 'Mon paiement est-il sécurisé ?',
    answer: 'Oui, totalement. Tous les paiements sont chiffrés en SSL 256-bit. Nous n\'avons jamais accès à vos données bancaires complètes. Les paiements sont traités par des prestataires de confiance certifiés PCI-DSS.'
  },
  {
    category: 'Produits',
    question: 'Les produits sont-ils conformes aux photos ?',
    answer: 'Oui, nous montrons plusieurs angles de chaque produit. Les dimensions sont précises. Si un article ne correspond pas à vos attentes, vous pouvez le retourner sans frais dans les 30 jours.'
  },
  {
    category: 'Produits',
    question: 'Offrez-vous des garanties sur les produits ?',
    answer: 'Oui, tous nos produits incluent une garantie contre les défauts de fabrication. En cas de problème, nous remplaçons gratuitement. Contactez-nous sous 48h après réception si vous constatez un défaut.'
  },
  {
    category: 'Service Client',
    question: 'Comment contacter le service client ?',
    answer: 'Vous pouvez nous joindre par email à maisonserenia@gmail.com, par téléphone au +41 xx xxx xx xx (lun-ven 9h-17h), ou via le formulaire de contact. Nous répondons dans les 4 heures en semaine.'
  },
  {
    category: 'Service Client',
    question: 'Livrez-vous à l\'étranger ?',
    answer: 'Oui, nous livrons dans toute l\'Europe. Les délais et frais de livraison varient selon le pays. Lors du checkout, sélectionnez votre pays pour voir les tarifs exacts.'
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-serif font-bold mb-4">Questions fréquentes</h1>
            <p className="text-lg text-neutral-600">
              Trouvez les réponses à vos questions les plus courantes.
            </p>
          </div>

          {/* FAQ by category */}
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-black mb-6">{category}</h2>
              <div className="space-y-4">
                {faqItems
                  .filter(item => item.category === category)
                  .map((item, idx) => {
                    const globalIndex = faqItems.indexOf(item);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <button
                        key={globalIndex}
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full text-left p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-none border border-neutral-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold text-black pr-4">
                            {item.question}
                          </h3>
                          <ChevronDown
                            className={`w-5 h-5 text-neutral-600 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        {isOpen && (
                          <p className="text-neutral-700 leading-relaxed mt-4">
                            {item.answer}
                          </p>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 bg-neutral-50 p-8 rounded-none text-center">
            <h2 className="text-2xl font-serif font-bold text-black mb-4">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h2>
            <p className="text-neutral-600 mb-6">
              Notre équipe est disponible pour vous aider.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-none hover:bg-neutral-900 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
