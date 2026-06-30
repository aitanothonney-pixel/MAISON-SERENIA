'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';

interface SimilarProduct {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}

interface SimilarProductsProps {
  currentProductId: string | number;
  category?: string;
  products?: SimilarProduct[];
}

const defaultProducts: SimilarProduct[] = [
  {
    id: 2,
    name: 'Fauteuil Lounge Premium',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    category: 'Salon',
  },
  {
    id: 3,
    name: 'Pouf Ottoman Design',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 45,
    category: 'Salon',
  },
  {
    id: 4,
    name: 'Canapé d\'angle Modulaire',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 112,
    category: 'Salon',
  },
  {
    id: 5,
    name: 'Méridienne Velours',
    price: 459.99,
    image: 'https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 67,
    category: 'Salon',
  },
  {
    id: 6,
    name: 'Table Basse Marbre',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 98,
    category: 'Salon',
  },
  {
    id: 7,
    name: 'Lampadaire Arc Design',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1565182409498-de2e02d4114f?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 76,
    category: 'Éclairage',
  },
  {
    id: 8,
    name: 'Coussin Texturé Luxe',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 156,
    category: 'Accessoires',
  },
  {
    id: 9,
    name: 'Plaid Coton Premium',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 43,
    category: 'Accessoires',
  },
  {
    id: 10,
    name: 'Miroir Doré Moderne',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1572190829246-f45e957022da?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 82,
    category: 'Décoration',
  },
  {
    id: 11,
    name: 'Tabouret Velours',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 61,
    category: 'Salon',
  },
  {
    id: 12,
    name: 'Étagère Murale Design',
    price: 279.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 105,
    category: 'Rangement',
  },
];

export function SimilarProducts({
  currentProductId,
  category,
  products = defaultProducts,
}: SimilarProductsProps) {
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

  const similarProducts = useMemo(() => {
    const filtered = products.filter((p) => p.id !== currentProductId);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [currentProductId, products]);

  return (
    <section className="py-16">
      <h2 className="text-2xl font-serif font-bold text-black mb-8">Vous aimerez aussi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarProducts.map((product) => (
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
            <p className="text-lg font-serif font-bold text-black">
              {product.price.toLocaleString('fr-FR')} €
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
