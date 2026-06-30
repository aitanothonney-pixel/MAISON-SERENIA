'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ViewedProduct {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface RecentlyViewedProps {
  maxItems?: number;
  products?: ViewedProduct[];
}

const sampleProducts: ViewedProduct[] = [
  {
    id: 1,
    name: 'Canapé Bubble Velours',
    price: 599,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Fauteuil Lounge',
    price: 349,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e262?w=300&h=300&fit=crop',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Table Basse Design',
    price: 199,
    image: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=300&h=300&fit=crop',
    rating: 4.7,
  },
];

export function RecentlyViewed({
  maxItems = 3,
  products = sampleProducts,
}: RecentlyViewedProps) {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage?.getItem('recentlyViewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).slice(0, maxItems);
        setViewedProducts(parsed);
      } catch {
        setViewedProducts(products.slice(0, maxItems));
      }
    } else {
      setViewedProducts(products.slice(0, maxItems));
    }
  }, [maxItems, products]);

  if (!isVisible || viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-30 max-w-sm bg-white rounded-none shadow-lg border border-neutral-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-black text-sm">Récemment consultés</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-neutral-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {viewedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="flex gap-3 p-2 rounded-none hover:bg-neutral-50 transition-colors group"
          >
            {/* Image */}
            <div className="relative w-16 h-16 bg-neutral-100 rounded-none overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate group-hover:opacity-60 transition-opacity">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 mb-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">({product.rating})</span>
              </div>
              <p className="text-sm font-bold text-black">
                {product.price.toLocaleString('fr-FR')}€
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/products"
        className="mt-4 w-full block text-center text-sm font-semibold text-black border border-neutral-300 py-2 rounded-none hover:bg-neutral-50 transition-colors"
      >
        Voir tous les produits
      </Link>
    </div>
  );
}
