'use client';

import Image from 'next/image';
import { Plus, Zap, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/useCart';

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
  savingsPercent?: number;
  savingsAmount?: number;
  icon: string;
}

const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Duo Minimaliste',
    description: 'Le Canapé et Fauteuil Bubble blanc — élégance épurée et confort sculptural',
    products: [
      {
        id: '10',
        name: 'Canapé Bubble blanc',
        price: 1857,
        image: 'https://i.ibb.co/wZRJYt6F/IMG-5364.jpg',
      },
      {
        id: '2',
        name: 'Fauteuil Bubble blanc',
        price: 713,
        image: 'https://i.ibb.co/Fk1YZvkY/IMG-2568.jpg',
      },
    ],
    bundlePrice: 1590,
    savingsAmount: 210,
    icon: '⚪',
  },
  {
    id: '2',
    name: 'Harmonie Bleue',
    description: 'Le Canapé et Fauteuil Bubble bleu — intensité Klein et présence sculpturale',
    products: [
      {
        id: '13',
        name: 'Canapé Bubble bleu',
        price: 1857,
        image: 'https://i.ibb.co/R1tJYDf/IMG-2491.jpg',
      },
      {
        id: '6',
        name: 'Fauteuil Bubble bleu',
        price: 713,
        image: 'https://i.ibb.co/j941fSYQ/9-E1-B62-F9-998-D-4476-AE71-C8-C6-E2831-AC1.jpg',
      },
    ],
    bundlePrice: 1590,
    savingsAmount: 210,
    icon: '🔵',
  },
  {
    id: '3',
    name: 'Passion Écarlate',
    description: 'Le Canapé et Fauteuil Bubble rouge — énergie audacieuse et caractère vibrant',
    products: [
      {
        id: '22',
        name: 'Canapé Bubble rouge',
        price: 1857,
        image: 'https://i.ibb.co/xSV6MBVx/47-B09888-A4-A8-44-E7-A80-D-7-E1-D7-BDDF6-ED.png',
      },
      {
        id: '8',
        name: 'Fauteuil Bubble rouge',
        price: 713,
        image: 'https://i.ibb.co/7Jc2Rvd8/IMG-5360.jpg',
      },
    ],
    bundlePrice: 1590,
    savingsAmount: 210,
    icon: '🔴',
  },
];

export function ProductBundles() {
  const { addItem } = useCart();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const handleAddBundle = (bundleId: string, bundleName: string) => {
    addItem(parseInt(bundleId) * -1000);
    setAddedBundleId(bundleId);
    setTimeout(() => setAddedBundleId(null), 2000);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-none border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
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
                    <div className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-none text-sm">
                      {bundle.savingsAmount ? `Rabais de ${bundle.savingsAmount}.-` : `−${bundle.savingsPercent}%`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="p-6 space-y-4 border-b border-neutral-100">
                {bundle.products.map((product, idx) => (
                  <div key={product.id} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 bg-neutral-100 rounded-none overflow-hidden flex-shrink-0">
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

                <button
                  onClick={() => handleAddBundle(bundle.id, bundle.name)}
                  className={`w-full py-3 rounded-none font-semibold transition-colors flex items-center justify-center gap-2 mb-2 ${
                    addedBundleId === bundle.id
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-black text-white hover:bg-neutral-900'
                  }`}>
                  {addedBundleId === bundle.id ? (
                    <>
                      <Check className="w-5 h-5" />
                      Ajouté au panier
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Acheter cet ensemble
                    </>
                  )}
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
