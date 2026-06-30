'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  discount?: number;
}

interface NewArrivalsProps {
  products?: Product[];
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Lampadaire Arc Doré',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1565182409498-de2e02d4114f?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 42,
    isNew: true,
  },
  {
    id: 2,
    name: 'Miroir Hexagonal Design',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 28,
    isNew: true,
    discount: 15,
  },
  {
    id: 3,
    name: 'Tapis Géométrique Beige',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 56,
    isNew: true,
  },
  {
    id: 4,
    name: 'Coussin Textue Naturel',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    rating: 5.0,
    reviewCount: 19,
    isNew: true,
    discount: 20,
  },
];

export function NewArrivals({ products = defaultProducts }: NewArrivalsProps) {
  const [wishedIds, setWishedIds] = useState<Set<string | number>>(new Set());

  const toggleWish = (id: string | number) => {
    const newWished = new Set(wishedIds);
    if (newWished.has(id)) {
      newWished.delete(id);
    } else {
      newWished.add(id);
    }
    setWishedIds(newWished);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
              Juste arrivées
            </h2>
            <p className="text-neutral-600 mt-2">Les pièces les plus récentes de notre collection</p>
          </div>
          <Link
            href="#"
            className="text-black font-semibold hover:opacity-60 transition-opacity flex items-center gap-2"
          >
            Voir tout →
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative mb-4 bg-neutral-100 rounded-none overflow-hidden aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && (
                    <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-none">
                      NOUVEAU
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-none">
                      −{product.discount}%
                    </span>
                  )}
                </div>

                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWish(product.id);
                  }}
                  className="absolute top-3 right-3 p-2.5 bg-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      wishedIds.has(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-black mb-2 group-hover:opacity-60 transition-opacity">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-serif font-bold text-black">
                  {product.price.toLocaleString('fr-FR')} €
                </p>
                {product.discount && (
                  <p className="text-sm text-neutral-400 line-through">
                    {(product.price / (1 - product.discount / 100)).toLocaleString('fr-FR')} €
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
