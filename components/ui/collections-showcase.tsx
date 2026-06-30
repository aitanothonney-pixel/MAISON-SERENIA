'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CollectionShowcaseProps {
  onCollectionClick?: (collectionId: string) => void;
}

export function CollectionsShowcase({ onCollectionClick }: CollectionShowcaseProps) {
  const collections = [
    {
      id: 'salon',
      name: 'Salon Cosy',
      description: 'Canapés, fauteuils et tables basses pour créer votre havre de paix',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop',
    },
    {
      id: 'chambre',
      name: 'Chambre Zen',
      description: 'Lits, tables de nuit et étagères pour un sommeil réparateur',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    },
    {
      id: 'bureau',
      name: 'Bureau Design',
      description: 'Bureaux, chaises ergonomiques et rangements pour votre productivité',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
          Explorez nos univers
        </h2>
        <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
          Découvrez nos sélections curatées pour chaque pièce de votre maison
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onCollectionClick?.(collection.id)}
              className="group relative overflow-hidden rounded-lg h-64 md:h-80"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <h3 className="text-2xl font-serif font-bold mb-2">{collection.name}</h3>
                <p className="text-sm text-white/80 mb-4">{collection.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                  Explorer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
