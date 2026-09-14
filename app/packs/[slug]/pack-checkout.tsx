'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Gift, Eye, X } from 'lucide-react';
import { Price } from '@/lib/currency';
import { useCart } from '@/lib/useCart';

interface Tableau {
  id: number;
  name: string;
  image: string;
}

export function PackCheckout({
  ids,
  tableaux,
  defaultGiftId,
  giftSize,
  giftPrice,
}: {
  ids: number[];
  tableaux: Tableau[];
  defaultGiftId: number;
  giftSize: string;
  giftPrice: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedGift, setSelectedGift] = useState<number>(defaultGiftId);
  const [lightbox, setLightbox] = useState(false);

  const gift = tableaux.find((t) => t.id === selectedGift) ?? tableaux[0];

  const handleAdd = () => {
    ids.forEach((id) => addItem(id));
    if (gift) addItem(gift.id, giftSize);
    setAdded(true);
  };

  return (
    <div>
      {/* Choix du tableau offert */}
      <div className="border border-neutral-200 p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-5 h-5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}>
            <Gift className="w-3 h-3 text-white" strokeWidth={2} />
          </span>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#A07840]">Votre tableau offert · {giftSize}</p>
        </div>
        <div className="flex items-center gap-3">
          {gift && (
            <button
              type="button"
              onClick={() => setLightbox(true)}
              title="Voir le tableau en grand"
              className="relative w-16 h-16 bg-white border border-neutral-100 shrink-0 overflow-hidden group/gift cursor-zoom-in"
            >
              <Image src={gift.image} alt={gift.name} fill className="object-cover" />
              <span className="absolute inset-0 bg-black/0 group-hover/gift:bg-black/30 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 text-white opacity-0 group-hover/gift:opacity-100 transition-opacity" />
              </span>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <select
              value={selectedGift}
              onChange={(e) => setSelectedGift(Number(e.target.value))}
              disabled={added}
              className="w-full text-[13px] border border-neutral-200 px-2 py-1.5 bg-white focus:outline-none focus:border-black"
            >
              {tableaux.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <p className="flex items-center gap-2 mt-1.5">
              <span className="text-neutral-400 line-through text-xs"><Price value={giftPrice} /></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Offert</span>
            </p>
          </div>
        </div>
      </div>

      {added ? (
        <div className="space-y-3">
          <div className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white text-xs font-bold tracking-widest uppercase py-4">
            <Check className="w-4 h-4" /> Ensemble ajouté au panier
          </div>
          <Link
            href="/"
            className="block w-full text-center border border-black text-black text-xs font-bold tracking-widest uppercase py-3.5 hover:bg-black hover:text-white transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-neutral-800 transition-colors"
        >
          Acheter cet ensemble
        </button>
      )}

      {/* Lightbox du tableau offert */}
      {lightbox && gift && (
        <div
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm cursor-zoom-out"
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Fermer"
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-2xl w-full text-center">
            <Image src={gift.image} alt={gift.name} width={900} height={1200} className="w-full h-auto max-h-[80vh] object-contain shadow-2xl" />
            <p className="text-white text-sm mt-4 tracking-wide">{gift.name} · {giftSize}</p>
          </div>
        </div>
      )}
    </div>
  );
}
