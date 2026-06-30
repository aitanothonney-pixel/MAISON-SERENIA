'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Gift, Heart } from 'lucide-react';
import { useState } from 'react';

interface GiftGuideItem {
  id: string;
  name: string;
  image: string;
  price: number;
  occasion: string;
  reason: string;
}

interface GiftGuideProps {
  selectedOccasion?: string;
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
      reason: 'Créer l\'ambiance parfaite dans leur maison',
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
      reason: 'Confort et chaleur pour les soirées d\'hiver',
    },
  ],
};

export function GiftGuide({ selectedOccasion = 'anniversaire' }: GiftGuideProps) {
  const [occasion, setOccasion] = useState(selectedOccasion);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const items = giftGuides[occasion] || giftGuides.anniversaire;

  const toggleLike = (id: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="w-8 h-8 text-purple-700" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
            Guide des cadeaux
          </h2>
        </div>
        <p className="text-neutral-600 mb-8">
          Trouvez le cadeau parfait pour chaque occasion
        </p>

        {/* Occasion Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'anniversaire', label: '🎂 Anniversaire' },
            { id: 'mariage', label: '💍 Mariage' },
            { id: 'noel', label: '🎄 Noël' },
          ].map((occ) => (
            <button
              key={occ.id}
              onClick={() => setOccasion(occ.id)}
              className={`px-6 py-3 rounded-none font-semibold transition-all ${
                occasion === occ.id
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black hover:bg-neutral-200'
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gift Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-neutral-200 rounded-none overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Image */}
            <Link href={`/products/${item.id}`}>
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      liked.has(item.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>
            </Link>

            {/* Content */}
            <div className="p-6">
              <p className="text-xs text-purple-600 uppercase font-semibold mb-2">
                Pourquoi cette pièce?
              </p>
              <p className="text-sm text-neutral-600 mb-4">{item.reason}</p>

              <h3 className="font-bold text-black mb-3 group-hover:opacity-60 transition-opacity">
                {item.name}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-black">
                  {item.price.toLocaleString('fr-FR')}€
                </p>
              </div>

              <Link
                href={`/products/${item.id}`}
                className="w-full block text-center bg-black text-white py-3 rounded-none font-semibold hover:bg-neutral-900 transition-colors"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-none p-8">
        <h3 className="text-xl font-serif font-bold text-black mb-6">
          💡 Conseils de cadeaux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-black mb-2">Pour un petit budget</p>
            <p className="text-sm text-neutral-600">
              Commencez par des accessoires comme les coussins ou les plaids (€49-€89)
            </p>
          </div>
          <div>
            <p className="font-semibold text-black mb-2">Pour un budget moyen</p>
            <p className="text-sm text-neutral-600">
              Optez pour des pièces fonctionnelles comme les lampes ou tables (€189-€349)
            </p>
          </div>
          <div>
            <p className="font-semibold text-black mb-2">Pour un grand budget</p>
            <p className="text-sm text-neutral-600">
              Investissez dans une pièce maîtresse comme un canapé premium (€599+)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
