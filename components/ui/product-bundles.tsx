'use client';

import Image from 'next/image';
import { Plus, Zap } from 'lucide-react';

interface BundleProduct {
  id: string | number;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  bundlePrice: number;
  savingsPercent: number;
  icon: string;
}

const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Le Salon Complet',
    description: 'Tout ce dont vous avez besoin pour un salon parfait',
    products: [
      {
        id: '1',
        name: 'Canapé Bubble',
        price: 599,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      },
      {
        id: '2',
        name: 'Table Basse Design',
        price: 199,
        image: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=300&h=300&fit=crop',
      },
      {
        id: '3',
        name: 'Fauteuil Lounge',
        price: 349,
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e262?w=300&h=300&fit=crop',
      },
    ],
    bundlePrice: 999,
    savingsPercent: 30,
    icon: '🛋️',
  },
  {
    id: '2',
    name: 'Ambiance Chaleureuse',
    description: 'Créez une atmosphère cosy chez vous',
    products: [
      {
        id: '4',
        name: 'Lampadaire Arc',
        price: 189,
        image: 'https://images.unsplash.com/photo-1565182409498-de2e02d4114f?w=300&h=300&fit=crop',
      },
      {
        id: '5',
        name: 'Coussin Texturé',
        price: 49,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      },
      {
        id: '6',
        name: 'Plaid Coton',
        price: 89,
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
      },
    ],
    bundlePrice: 279,
    savingsPercent: 25,
    icon: '✨',
  },
];

export function ProductBundles() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-3">
            Packs & Ensembles
          </h2>
          <p className="text-neutral-600">
            Économisez jusqu'à 30% en achetant nos ensembles curatés
          </p>
        </div>

        {/* Bundles grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-black flex items-center gap-2">
                      <span>{bundle.icon}</span>
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">{bundle.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-lg text-sm">
                      −{bundle.savingsPercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="p-6 space-y-4 border-b border-neutral-100">
                {bundle.products.map((product, idx) => (
                  <div key={product.id} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-black">{product.name}</p>
                        <p className="text-sm text-neutral-600">{product.price}€</p>
                      </div>
                      {idx < bundle.products.length - 1 && (
                        <Plus className="w-4 h-4 text-neutral-400 mx-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & CTA */}
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Prix du bundle</p>
                    <p className="text-3xl font-serif font-bold text-black">
                      {bundle.bundlePrice}€
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500 line-through">
                    {bundle.products.reduce((sum, p) => sum + p.price, 0)}€
                  </p>
                </div>

                <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  Acheter cet ensemble
                </button>

                <p className="text-xs text-center text-neutral-600">
                  ✓ Livraison gratuite à partir de 60€
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
