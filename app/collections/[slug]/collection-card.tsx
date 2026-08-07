'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/products';

export function CollectionCard({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isBubble = product.name.includes('Bubble');
  const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;
  const contain = isBubble || product.category === 'Décorations' || product.category === 'Été';
  const hasMultiple = product.images.length > 1;

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
        {/* Carrousel défilable horizontalement */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {product.images.map((img, i) => (
            <div key={i} className={`relative w-full h-full flex-shrink-0 snap-center ${contain ? 'p-4' : ''}`}>
              <Image
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`transition-transform duration-500 group-hover:scale-105 ${contain ? 'object-contain' : 'object-cover'}`}
              />
            </div>
          ))}
        </div>

        {isBubble && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 z-10 pointer-events-none">
            −30%
          </div>
        )}

        {/* Points indicateurs */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
            {product.images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-black' : 'bg-black/25'}`} />
            ))}
          </div>
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
