'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';

interface ProductQuickViewProps {
  open: boolean;
  onClose: () => void;
  product?: {
    id: string | number;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
    image: string;
    description: string;
    colors: string[];
  };
  onAddToCart?: () => void;
}

export function ProductQuickView({
  open,
  onClose,
  product = {
    id: '1',
    name: 'Canapé Bubble Premium',
    price: 599,
    rating: 4.8,
    reviewCount: 147,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
    description: 'Canapé design ultra-confortable en velours premium.',
    colors: ['#7a7a7a', '#2c2c2a', '#e8d4c4'],
  },
  onAddToCart,
}: ProductQuickViewProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-xl font-serif font-bold">Aperçu rapide</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="bg-neutral-100 rounded-xl overflow-hidden h-80 md:h-96">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {/* Title & Rating */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-black mb-3">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-neutral-600">
                        {product.rating} ({product.reviewCount} avis)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-3xl font-serif font-bold text-black">
                      {product.price.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-sm text-green-600 font-semibold mt-2">
                      ✓ Livraison gratuite à partir de 60€
                    </p>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="text-sm font-semibold text-black mb-3 block">
                      Couleur
                    </label>
                    <div className="flex gap-3">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            selectedColor === idx
                              ? 'border-black scale-110'
                              : 'border-neutral-200'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Couleur ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-sm font-semibold text-black mb-3 block">
                      Quantité
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onAddToCart}
                      className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Ajouter au panier
                    </button>
                    <button className="w-12 h-12 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* View full */}
                  <a href="#" className="block text-sm font-semibold text-black hover:opacity-60 transition-opacity text-center pt-4 border-t border-neutral-200">
                    Voir la page complète →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
