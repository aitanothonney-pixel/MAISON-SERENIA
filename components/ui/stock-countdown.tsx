'use client';

import { AlertCircle } from 'lucide-react';

interface StockCountdownProps {
  itemsLeft: number;
  threshold?: number; // Show urgency when below this count
  totalSold?: number;
}

export function StockCountdown({
  itemsLeft,
  threshold = 5,
  totalSold = 0,
}: StockCountdownProps) {
  const showUrgency = itemsLeft <= threshold && itemsLeft > 0;
  const isSoldOut = itemsLeft === 0;

  if (isSoldOut) {
    return (
      <div className="bg-neutral-100 border border-neutral-300 rounded-none p-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-neutral-600" />
        <span className="text-sm font-semibold text-neutral-600">Rupture de stock</span>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-none p-3 ${
        showUrgency
          ? 'bg-red-50 border-red-300'
          : 'bg-green-50 border-green-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {showUrgency && <AlertCircle className="w-5 h-5 text-red-600" />}
        <span
          className={`text-sm font-bold ${
            showUrgency ? 'text-red-700' : 'text-green-700'
          }`}
        >
          {showUrgency ? `⚠ Seulement ${itemsLeft} en stock` : `✓ ${itemsLeft} en stock`}
        </span>
      </div>

      {showUrgency && (
        <p className="text-xs text-red-600 ml-7">
          {itemsLeft === 1
            ? 'Dernier article disponible'
            : `${threshold - itemsLeft + 1} personnes regardent cet article`}
        </p>
      )}

      {totalSold > 0 && (
        <p className="text-xs text-neutral-600 mt-2">
          {totalSold} vendus ce mois
        </p>
      )}
    </div>
  );
}
