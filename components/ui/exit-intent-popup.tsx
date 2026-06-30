'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full mx-6 bg-white rounded-2xl shadow-2xl p-8"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-black mb-2">
                Une dernière chose! ✨
              </h2>
              <p className="text-neutral-600 mb-6">
                Vous partez déjà? Recevez une remise exclusive avant de nous quitter.
              </p>

              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-6 mb-6">
                <p className="text-3xl font-bold text-red-600 mb-1">−15%</p>
                <p className="text-sm font-semibold text-red-700 mb-2">
                  SUR VOTRE PREMIÈRE COMMANDE
                </p>
                <p className="text-xs text-red-600">
                  Code: <span className="font-mono font-bold">GOODBYE15</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShow(false)}
                  className="flex-1 py-3 rounded-lg font-semibold text-black border border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  Non, merci
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="flex-1 py-3 rounded-lg font-semibold text-white bg-black hover:bg-neutral-900 transition-colors"
                >
                  Réclamer l'offre
                </button>
              </div>

              <p className="text-xs text-neutral-500 mt-4">
                ✓ Livraison gratuite + Installation · ✓ Retour 30 jours
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
