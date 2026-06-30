'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface OftenBoughtTogetherProps {
  currentProductId: string;
  products?: Product[];
}

const defaultProducts: Product[] = [
  {
    id: '2',
    name: 'Coussin Velours Gris',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    category: 'Accessoires',
  },
  {
    id: '3',
    name: 'Plaid Coton Naturel',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1574394615383-655b15b41beb?w=400&h=400&fit=crop',
    category: 'Textiles',
  },
];

export function OftenBoughtTogether({ currentProductId, products = defaultProducts }: OftenBoughtTogetherProps) {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-serif font-bold text-black mb-8">Souvent acheté ensemble</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black text-sm mb-1 truncate">
                <Link href={`/products/${product.id}`} className="hover:opacity-60 transition-opacity">
                  {product.name}
                </Link>
              </h3>
              <p className="text-xs text-neutral-600">{product.category}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-serif font-bold text-black">{product.price.toLocaleString('fr-FR')} €</p>
            </div>

            <button className="p-2 bg-black text-white rounded-lg hover:bg-neutral-900 transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Bundle offer CTA */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900 font-semibold">
          💡 Économisez 10% en achetant ces 3 articles ensemble
        </p>
      </div>
    </section>
  );
}
