'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface AddToCartToastProps {
  show: boolean;
  product: {
    name: string;
    price: number;
    image: string;
    category?: string;
  } | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export function AddToCartToast({ show, product, onClose, onContinueShopping }: AddToCartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && product && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-200">
            <h3 className="text-sm font-light tracking-wide">Produit Ajouté</h3>
            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            {/* Product image and details */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-24 h-24 bg-neutral-100 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 mb-1">{product.category}</p>
                <p className="text-sm font-light text-black leading-snug mb-2">{product.name}</p>
                <p className="font-serif font-semibold text-black">
                  {product.price.toLocaleString('fr-FR')} €
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm font-light text-neutral-600 leading-relaxed">
              Votre article a été ajouté à votre panier. Que souhaitez-vous faire maintenant ?
            </p>
          </div>

          {/* Footer with actions */}
          <div className="border-t border-neutral-200 px-6 py-6 space-y-3">
            {/* Primary CTA */}
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-4 rounded-full font-light text-sm tracking-wide hover:bg-neutral-900 transition-colors"
            >
              Voir mon panier
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => {
                onContinueShopping();
                onClose();
              }}
              className="w-full bg-white border border-black text-black py-4 rounded-full font-light text-sm tracking-wide hover:bg-neutral-50 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
