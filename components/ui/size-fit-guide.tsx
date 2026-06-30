'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SizeFitGuideProps {
  productType?: 'canapé' | 'fauteuil' | 'table' | 'meuble';
}

const guides = {
  canapé: [
    {
      title: 'Avant de commencer',
      items: [
        'Mesurez la largeur, la profondeur et la hauteur de votre espace',
        'Vérifiez les portes et escaliers (la plupart de nos canapés passent par une porte standard)',
        'Notez l\'épaisseur des pieds si vous avez un tapis',
      ],
    },
    {
      title: 'Guide des dimensions',
      items: [
        '2 places: 150-180cm - Idéal pour petits espaces',
        '3 places: 180-220cm - Standard pour plupart des salons',
        '4+ places: 220cm+ - Pour grands espaces/divertissement',
      ],
    },
    {
      title: 'Profondeur d\'assise',
      items: [
        'Peu profond (70cm): Pour petits espaces, regarder TV',
        'Standard (80cm): Le plus confortable pour la plupart',
        'Très profond (90cm+): Ultra-cosy, pour relaxer',
      ],
    },
  ],
  fauteuil: [
    {
      title: 'Dimensions clés',
      items: [
        'Largeur: 70-90cm standard',
        'Hauteur d\'assise: 40-45cm (confortable pour se lever)',
        'Profondeur: 75-85cm',
      ],
    },
  ],
  table: [
    {
      title: 'Hauteur table',
      items: [
        '70-75cm: Standard pour tables à manger',
        'Doit être 30cm plus haut que le siège',
      ],
    },
  ],
  meuble: [
    {
      title: 'Mesures importantes',
      items: [
        'Hauteur des plafonds (laisser 10cm de dégagement)',
        'Largeur des portes pour entrée',
        'Prises électriques et radiateurs à contourner',
      ],
    },
  ],
};

export function SizeFitGuide({ productType = 'canapé' }: SizeFitGuideProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const guideItems = guides[productType] || guides.canapé;

  return (
    <div className="bg-neutral-50 rounded-none p-6 md:p-8">
      <h3 className="text-xl font-serif font-bold text-black mb-6">
        Guide des dimensions & tailles
      </h3>

      <div className="space-y-4">
        {guideItems.map((section, idx) => (
          <button
            key={idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full text-left p-4 bg-white rounded-none border border-neutral-200 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-black">{section.title}</h4>
              <ChevronDown
                className={`w-5 h-5 text-neutral-600 transition-transform ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </div>

            {openIndex === idx && (
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-black font-semibold">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </button>
        ))}
      </div>

      {/* Help section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-none">
        <p className="text-sm text-blue-900">
          <strong>Besoin d'aide?</strong> Notre équipe SAV peut vous aider à choisir les bonnes dimensions.{' '}
          <a href="/contact" className="underline hover:opacity-60">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}
