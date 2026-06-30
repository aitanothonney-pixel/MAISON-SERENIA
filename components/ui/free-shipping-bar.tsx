'use client';

import { Truck } from 'lucide-react';

interface FreeShippingBarProps {
  cartTotal?: number;
  freeShippingThreshold?: number;
}

export function FreeShippingBar({
  cartTotal = 0,
  freeShippingThreshold = 60,
}: FreeShippingBarProps) {
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const percentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const isFreeShipping = cartTotal >= freeShippingThreshold;

  return (
    <div className="bg-green-50 border-t border-b border-green-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {isFreeShipping ? (
          <div className="flex items-center justify-center gap-3 text-green-700 font-semibold">
            <Truck className="w-5 h-5" />
            🎉 Vous avez la livraison gratuite !
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-700">
                Plus que <span className="text-green-600">{remaining.toLocaleString('fr-FR')} €</span> pour la livraison gratuite
              </span>
              <span className="text-xs text-neutral-500">
                {cartTotal.toLocaleString('fr-FR')} € / {freeShippingThreshold.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-none overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
