'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface GiftGuideItem {
  id: string;
  name: string;
  image: string;
  price: number;
  occasion: string;
  reason: string;
}

const giftGuides: Record<string, GiftGuideItem[]> = {
  anniversaire: [
    {
      id: '1',
      name: 'Canapé Bubble Velours',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      price: 599,
      occasion: 'anniversaire',
      reason: 'Pour célébrer un grand moment ensemble',
    },
    {
      id: '2',
      name: 'Fauteuil Lounge Premium',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e262?w=400&h=400&fit=crop',
      price: 349,
      occasion: 'anniversaire',
      reason: 'Confort et luxe pour les moments de détente',
    },
  ],
  mariage: [
    {
      id: '3',
      name: 'Table Basse Design',
      image: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=400&h=400&fit=crop',
      price: 199,
      occasion: 'mariage',
      reason: 'Pièce maîtresse pour leur nouveau foyer',
    },
    {
      id: '4',
      name: 'Lampadaire Arc',
      image: 'https://images.unsplash.com/photo-1565182409498-de2e02d4114f?w=400&h=400&fit=crop',
      price: 189,
      occasion: 'mariage',
      reason: "Créer l'ambiance parfaite dans leur maison",
    },
  ],
  noel: [
    {
      id: '5',
      name: 'Coussin Texturé',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      price: 49,
      occasion: 'noel',
      reason: 'Petit luxe pour décorer le salon',
    },
    {
      id: '6',
      name: 'Plaid Coton Premium',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      price: 89,
      occasion: 'noel',
      reason: "Confort et chaleur pour les soirées d'hiver",
    },
  ],
};

const tabs = [
  {
    id: 'anniversaire',
    label: 'Anniversaire',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="flex-shrink-0">
        <path d="M12 8 C12 8 8 2 5 4 C2 6 6 8 12 8" />
        <path d="M12 8 C12 8 16 2 19 4 C22 6 18 8 12 8" />
        <rect x="4" y="8" width="16" height="13" />
        <path d="M4 12 H20" />
        <path d="M12 8 V21" />
      </svg>
    ),
  },
  {
    id: 'mariage',
    label: 'Mariage',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="flex-shrink-0">
        <circle cx="12" cy="15" r="7" />
        <path d="M8 8 L10 4 L12 6 L14 4 L16 8 L12 10 Z" />
      </svg>
    ),
  },
  {
    id: 'noel',
    label: 'Noël',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="flex-shrink-0">
        <path d="M12 2 L14.5 9 H22 L16 13.5 L18.5 20.5 L12 16 L5.5 20.5 L8 13.5 L2 9 H9.5 Z" />
      </svg>
    ),
  },
];

export function GiftGuide({ selectedOccasion = 'anniversaire' }: { selectedOccasion?: string }) {
  const [occasion, setOccasion] = useState(selectedOccasion);

  const items = giftGuides[occasion] || giftGuides.anniversaire;

  return (
    <section className="py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-light mb-4">Sélection</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
            <path d="M12 8 C12 8 8 2 5 4 C2 6 6 8 12 8" />
            <path d="M12 8 C12 8 16 2 19 4 C22 6 18 8 12 8" />
            <rect x="4" y="8" width="16" height="13" />
            <path d="M4 12 H20" />
            <path d="M12 8 V21" />
          </svg>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            Guide des cadeaux
          </h2>
        </div>
        <div className="w-8 h-px bg-neutral-300 mx-auto mb-6" />
        <p className="text-xs text-neutral-500 font-light tracking-wide">
          Trouvez le cadeau parfait pour chaque occasion
        </p>

        {/* Occasion Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setOccasion(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-light tracking-[0.15em] uppercase transition-all duration-200 border ${
                occasion === tab.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-neutral-300 hover:border-black'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gift Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-all duration-300 group"
          >
            <Link href={`/products/${item.id}`}>
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-2">
                Pourquoi cette pièce
              </p>
              <p className="text-xs text-neutral-500 font-light mb-5 leading-relaxed">{item.reason}</p>

              <h3 className="text-sm font-light text-black mb-4 group-hover:opacity-60 transition-opacity">
                {item.name}
              </h3>

              <div className="flex items-center justify-between mb-5">
                <p className="text-2xl font-serif font-light text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  {item.price.toLocaleString('fr-FR')}€
                </p>
              </div>

              <Link
                href={`/products/${item.id}`}
                className="w-full block text-center bg-black text-white py-3 text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="border border-neutral-200 p-10">
        <div className="flex items-center gap-3 mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7 V13" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
          <h3 className="text-xs tracking-[0.2em] uppercase text-black font-light">Conseils de sélection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <div className="md:pr-8">
            <p className="text-xs tracking-[0.1em] uppercase text-black font-light mb-3">Petit budget</p>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Commencez par des accessoires comme les coussins ou les plaids (49€–89€)
            </p>
          </div>
          <div className="md:px-8 pt-6 md:pt-0">
            <p className="text-xs tracking-[0.1em] uppercase text-black font-light mb-3">Budget moyen</p>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Optez pour des pièces fonctionnelles comme les lampes ou tables (189€–349€)
            </p>
          </div>
          <div className="md:pl-8 pt-6 md:pt-0">
            <p className="text-xs tracking-[0.1em] uppercase text-black font-light mb-3">Grand budget</p>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Investissez dans une pièce maîtresse comme un canapé premium (599€+)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
