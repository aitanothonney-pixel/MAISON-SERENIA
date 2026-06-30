'use client';

import { Sparkles, DollarSign, Headphones } from 'lucide-react';

export function DifferentiatorsSection() {
  const differentiators = [
    {
      icon: Sparkles,
      title: 'Curation premium',
      description: 'Chaque produit est sélectionné pour sa qualité et son design, sans compromis.',
    },
    {
      icon: DollarSign,
      title: 'Prix direct fabricant',
      description: 'Pas d\'intermédiaires : vous obtenez les meilleurs prix du marché.',
    },
    {
      icon: Headphones,
      title: 'SAV réactif',
      description: 'Équipe disponible 6j/7 pour répondre à vos questions en moins de 4 heures.',
    },
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
          Pourquoi nous choisir ?
        </h2>
        <p className="text-center text-neutral-600 mb-16 max-w-2xl mx-auto">
          Plus que une boutique, une expérience de shopping pensée pour vous
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {differentiators.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-white rounded-none">
                <Icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
