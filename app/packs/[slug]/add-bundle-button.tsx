'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useCart } from '@/lib/useCart';

export function AddBundleButton({ ids, gift }: { ids: number[]; gift?: { id: number; size: string } }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    ids.forEach((id) => addItem(id));
    if (gift) addItem(gift.id, gift.size);
    setAdded(true);
  };

  if (added) {
    return (
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
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-neutral-800 transition-colors"
    >
      Acheter cet ensemble
    </button>
  );
}
