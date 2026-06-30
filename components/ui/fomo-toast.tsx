'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';

interface FOmoToastProps {
  show?: boolean;
  onDismiss?: () => void;
}

const recentPurchases = [
  { name: 'Canapé Bubble Gris', user: 'Marie D.' },
  { name: 'Fauteuil Velours', user: 'Jean-Pierre L.' },
  { name: 'Table Basse Design', user: 'Sophie M.' },
  { name: 'Lampadaire LED', user: 'Thomas R.' },
];

export function FOmoToast({ show = true, onDismiss }: FOmoToastProps) {
  const [visible, setVisible] = useState(show);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const purchase = recentPurchases[currentIndex % recentPurchases.length];

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-left">
      <div className="bg-white rounded-none shadow-lg border border-neutral-200 p-4 max-w-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-none mt-0.5">
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-900">
                {purchase.user} vient d&apos;acheter
              </p>
              <p className="text-sm text-neutral-600">{purchase.name}</p>
              <p className="text-xs text-neutral-400 mt-1">À l&apos;instant</p>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
