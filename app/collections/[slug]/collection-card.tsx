'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/products';

export function CollectionCard({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const isBubble = product.name.includes('Bubble');
  const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;
  const contain = isBubble || product.category === 'Décorations' || product.category === 'Été';
  const hasMultiple = product.images.length > 1;

  const go = (e: React.MouseEvent, dir: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((idx + dir + product.images.length) % product.images.length);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500">
      <div className={`relative aspect-[4/3] overflow-hidden bg-neutral-50 ${contain ? 'p-4' : ''}`}>
        <Image
          key={idx}
          src={product.images[idx]}
          alt={product.name}
          fill
          className={`transition-transform duration-500 group-hover:scale-105 ${contain ? 'object-contain' : 'object-cover'}`}
        />
        {isBubble && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 z-10">
            −30%
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={(e) => go(e, -1)}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black shadow opacity-0 group-hover:opacity-100 hover:bg-white transition-all z-10"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={(e) => go(e, 1)}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black shadow opacity-0 group-hover:opacity-100 hover:bg-white transition-all z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Points indicateurs */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-black' : 'bg-black/25'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400">{product.category}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
            <span className="text-[10px] text-neutral-400 tabular-nums">{(4.6 + (product.id % 4) * 0.1).toFixed(1)}</span>
          </div>
        </div>
        <h2 className="font-serif font-bold text-sm text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-playfair)' }}>
          {product.name}
        </h2>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-semibold text-black">{promoPrice.toLocaleString('fr-FR')} €</span>
          {isBubble && (
            <span className="text-xs text-neutral-400 line-through">{product.price.toLocaleString('fr-FR')} €</span>
          )}
        </div>
      </div>
    </Link>
  );
}
