'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { nice99, type Product } from '@/lib/products';
import { formatPrice, useCurrency } from '@/lib/currency';

// position : 'lcp' = première carte (préchargée), 'eager' = cartes visibles dès l'ouverture, undefined = lazy
export function CollectionCard({ product, position }: { product: Product; position?: 'lcp' | 'eager' }) {
  const cur = useCurrency();
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isBubble = product.name.includes('Bubble');
  const promoPrice = isBubble ? nice99(Math.round(product.price * 0.7)) : product.price;
  const contain = isBubble || product.imageFit === 'contain' || product.category === 'Décorations' || product.category === 'Été';

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {/* Carrousel défilable horizontalement */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          tabIndex={0} role="region" aria-label="Photos du produit" className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {product.images.map((img, i) => (
            <div key={i} className={`relative w-full h-full flex-shrink-0 snap-center ${contain ? 'p-4' : ''}`}>
              <Image
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                preload={position === 'lcp' && i === 0}
                fetchPriority={position && i === 0 ? 'high' : 'auto'}
                loading={position && i === 0 ? 'eager' : undefined}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={contain ? 'object-contain' : 'object-cover'}
              />
            </div>
          ))}
        </div>

        {isBubble && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 z-10 pointer-events-none">
            −30%
          </div>
        )}

      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">{product.category}</p>
        </div>
        <h2 className="titre-produit text-black group-hover:underline">
          {product.name}
        </h2>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-semibold text-black">{formatPrice(promoPrice, cur)}</span>
          {isBubble && (
            <span className="text-xs text-neutral-500 line-through">{formatPrice(product.price, cur)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
