'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, Lock } from 'lucide-react';
import { products } from '@/lib/products';
import { useCart } from '@/lib/useCart';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty } = useCart();
  const isBubble = (id: number) => [2, 6, 7, 8, 9, 10, 12, 13, 22].includes(id);

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return null;
    const price = isBubble(product.id) ? Math.round(product.price * 0.7) : product.price;
    return { ...item, product, price };
  }).filter(Boolean) as { id: number; qty: number; product: typeof products[0]; price: number }[];

  useEffect(() => {
    if (open) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${sw}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const totalQty = cartProducts.reduce((sum, x) => sum + x.qty, 0);
  const subtotal = cartProducts.reduce((sum, x) => sum + x.price * x.qty, 0);
  const total = subtotal;

  const goShopping = () => {
    onClose();
    if (window.location.pathname === '/') {
      setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } else {
      window.location.href = '/#section-salon';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl"
          >
            {/* Top help strip */}
            <div className="flex items-center gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex-shrink-0">
              <span className="w-8 h-8 bg-black text-white text-[10px] font-bold tracking-wider flex items-center justify-center flex-shrink-0">
                MS
              </span>
              <p className="text-[13px] text-neutral-700 leading-tight">
                Besoin d&apos;aide? <a href="mailto:aitanothonney@gmail.com" className="font-semibold text-black hover:underline">Contactez-nous à aitanothonney@gmail.com</a>
              </p>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  Mon Panier
                </span>
                {totalQty > 0 && (
                  <span className="text-neutral-400 text-sm">({totalQty})</span>
                )}
              </div>
              <button onClick={onClose} className="p-1 hover:bg-neutral-100 transition-colors" aria-label="Fermer">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-16">
                  <ShoppingBag className="w-11 h-11 text-neutral-300" strokeWidth={1.4} />
                  <p className="font-serif text-base text-neutral-500" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                    Votre panier est vide
                  </p>
                  <p className="text-xs text-neutral-400">Ajoutez des produits pour commencer.</p>
                  <button
                    onClick={goShopping}
                    className="mt-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3 hover:bg-neutral-800 transition-colors"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-5">
                  {cartProducts.map(({ id, qty, product, price }) => (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-4"
                    >
                      {/* Image */}
                      <div className="shrink-0 w-[92px] h-[92px] bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`w-full h-full ${isBubble(id) || product.category === 'Figurines' || product.category === 'Été' ? 'object-contain p-2' : 'object-cover'}`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] text-black leading-snug">{product.name}</p>
                            <p className="text-xs text-neutral-400 mt-1">{product.category}</p>
                            <p
                              className="text-[19px] font-bold text-black mt-2 italic"
                              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                            >
                              {price.toLocaleString('fr-FR')} €
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(id)}
                            className="shrink-0 p-1 text-neutral-400 hover:text-black transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Qty */}
                        <div className="flex items-center gap-0 mt-3">
                          <button
                            onClick={() => updateQty(id, Math.max(1, qty - 1))}
                            className="w-8 h-8 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors text-neutral-700"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm text-black">{qty}</span>
                          <button
                            onClick={() => updateQty(id, qty + 1)}
                            className="w-8 h-8 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors text-neutral-700"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="border-t border-neutral-100 flex-shrink-0">
                <div className="px-6 pt-6 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Sous-total</span>
                    <span className="text-sm text-neutral-600">{subtotal.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Livraison</span>
                    <span className="text-sm text-neutral-600">Gratuite</span>
                  </div>
                </div>

                <div className="px-6">
                  <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
                </div>

                <div className="px-6 py-5">
                  <div className="flex items-end justify-between mb-6">
                    <span className="text-[11px] tracking-[0.3em] uppercase text-black font-semibold">Total</span>
                    <span
                      className="text-3xl font-bold text-black italic leading-none"
                      style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                    >
                      {total.toLocaleString('fr-FR')} €
                    </span>
                  </div>

                  <button
                    className="w-full text-white py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)' }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Payer par carte
                  </button>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <button
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center gap-1.5"
                      aria-label="Payer avec PayPal"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="#1A1A1A" />
                      </svg>
                      <span className="text-[11px] font-semibold tracking-wide">PayPal</span>
                    </button>
                    <button
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center gap-1"
                      aria-label="Payer avec Apple Pay"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="text-[11px] font-semibold tracking-wide">Pay</span>
                    </button>
                    <button
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center font-bold tracking-wide text-[11px]"
                      aria-label="Payer avec TWINT"
                    >
                      TWINT
                    </button>
                  </div>
                </div>

                <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 flex items-start gap-2.5">
                  <Lock className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-1">Paiement sécurisé</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Maison Serenia accepte les modes de paiement sécurisés. Vos données sont traitées de façon confidentielle.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
