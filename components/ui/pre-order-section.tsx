'use client';

import Image from 'next/image';
import { Calendar, Bell, Clock } from 'lucide-react';
import { useState } from 'react';

interface PreOrderProduct {
  id: string;
  name: string;
  image: string;
  releaseDate: string;
  description: string;
  expectedPrice?: number;
  preOrderCount?: number;
  notifyMe?: boolean;
}

interface PreOrderSectionProps {
  products?: PreOrderProduct[];
}

const defaultProducts: PreOrderProduct[] = [
  {
    id: '1',
    name: 'Canapé Velours Édition Limitée',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    releaseDate: '15 juillet 2026',
    description: 'Collaboration exclusive avec le designer Pierre Vandamme',
    expectedPrice: 1299,
    preOrderCount: 47,
  },
  {
    id: '2',
    name: 'Table Basse Marbre Noir',
    image: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=400&h=400&fit=crop',
    releaseDate: '22 juillet 2026',
    description: 'Marbre naturel avec structure acier brossé',
    expectedPrice: 599,
    preOrderCount: 23,
  },
];

export function PreOrderSection({ products = defaultProducts }: PreOrderSectionProps) {
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const toggleNotification = (id: string) => {
    const newNotified = new Set(notifiedIds);
    if (newNotified.has(id)) {
      newNotified.delete(id);
    } else {
      newNotified.add(id);
    }
    setNotifiedIds(newNotified);
  };

  return (
    <section className="py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-3">
          Prochains Arrivals
        </h2>
        <p className="text-neutral-600">
          Découvrez les produits à venir et soyez parmi les premiers à les acquérir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image container with coming soon overlay */}
            <div className="relative bg-neutral-100 aspect-video overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-white mb-2 mx-auto" />
                  <p className="text-white font-bold text-lg">Bientôt disponible</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-2">{product.name}</h3>
              <p className="text-sm text-neutral-600 mb-4">{product.description}</p>

              {/* Release date */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-600 uppercase font-semibold">
                    Date de sortie
                  </p>
                  <p className="text-sm font-bold text-amber-900">{product.releaseDate}</p>
                </div>
              </div>

              {/* Pricing and pre-orders */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {product.expectedPrice && (
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Prix estimé</p>
                    <p className="text-2xl font-bold text-black">
                      {product.expectedPrice.toLocaleString('fr-FR')}€
                    </p>
                  </div>
                )}
                {product.preOrderCount !== undefined && (
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Précommandes</p>
                    <p className="text-2xl font-bold text-green-700">
                      +{product.preOrderCount}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => toggleNotification(product.id)}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  notifiedIds.has(product.id)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-black text-white hover:bg-neutral-900'
                }`}
              >
                <Bell className="w-5 h-5" />
                {notifiedIds.has(product.id) ? 'Notification activée ✓' : 'Me notifier'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
