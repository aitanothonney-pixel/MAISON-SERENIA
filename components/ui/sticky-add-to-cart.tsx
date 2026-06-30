'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

interface StickyAddToCartProps {
  productName?: string;
  price?: number;
  onAddToCart?: () => void;
  show?: boolean;
}

export function StickyAddToCart({
  productName = 'Produit',
  price = 99.99,
  onAddToCart,
  show = true,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!show || dismissed) {
      setVisible(false);
      return;
    }

    // Show after scrolling down 400px
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show, dismissed]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black truncate">{productName}</p>
          <p className="text-lg font-serif font-bold text-black">
            {price.toLocaleString('fr-FR')} €
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onAddToCart}
            className="px-6 py-3 bg-black text-white rounded-none font-semibold hover:bg-neutral-900 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
