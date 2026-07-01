'use client';

import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Luxury Header */}
        <div className="mb-16 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-3 font-light">Collections Exclusives</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            Packs & Ensembles
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mb-6" />
          <p className="text-sm text-neutral-600 font-light tracking-wide max-w-2xl mx-auto">
            Découvrez nos sélections curatées pour harmonie et élégance.
          </p>
        </div>

        {/* Bundles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="group bg-white border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-all duration-300"
            >
              {/* Icon & Title Section */}
              <div className="p-8 pb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{bundle.icon}</span>
                      <h3 className="text-xl font-serif font-bold text-black leading-tight">
                        {bundle.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {bundle.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-150" />

              {/* Products */}
              <div className="p-8 space-y-6">
                {bundle.products.map((product, idx) => (
                  <div key={product.id}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-24 h-24 bg-neutral-50 overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 pt-1">
                        <p className="text-sm font-light text-black mb-1">{product.name}</p>
                        <p className="text-xs text-neutral-500 font-light">{product.price}€</p>
                      </div>

                      {idx < bundle.products.length - 1 && (
                        <div className="flex items-center justify-center pt-8">
                          <Plus className="w-3.5 h-3.5 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    {idx < bundle.products.length - 1 && <div className="h-px bg-neutral-150" />}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-150" />

              {/* Pricing Section */}
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-end justify-between mb-2">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-light">
                      Prix du bundle
                    </p>
                    <p className="text-xs text-neutral-400 line-through font-light">
                      {bundle.products.reduce((sum, p) => sum + p.price, 0)}€
                    </p>
                  </div>
                  <p className="text-3xl font-serif font-light text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                    {bundle.bundlePrice}€
                  </p>
                </div>

                {/* Savings Badge */}
                <div className="mb-6 text-center">
                  <span className="inline-block text-xs font-light tracking-widest uppercase text-neutral-600 bg-neutral-50 px-4 py-2">
                    {bundle.savingsAmount ? `Économies de ${bundle.savingsAmount}€` : `−${bundle.savingsPercent}%`}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleAddBundle(bundle.id, bundle.name)}
                  className={`w-full py-4 px-6 font-light tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedBundleId === bundle.id
                      ? 'bg-black text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {addedBundleId === bundle.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ajouté au panier
                    </>
                  ) : (
                    'Acheter cet ensemble'
                  )}
                </button>

                {/* Info Footer */}
                <p className="text-[10px] text-center text-neutral-500 mt-4 font-light tracking-wide">
                  Livraison gratuite à partir de 60€
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
