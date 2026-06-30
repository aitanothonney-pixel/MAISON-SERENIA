'use client';

import { Lock, RotateCcw, Truck } from 'lucide-react';

interface TrustBadgesProps {
  className?: string;
  layout?: 'row' | 'column';
}

export function TrustBadges({ className = '', layout = 'row' }: TrustBadgesProps) {
  const badges = [
    { icon: Lock, text: 'Paiement sécurisé' },
    { icon: RotateCcw, text: 'Retours 30 jours' },
    { icon: Truck, text: 'Livraison suivie' },
  ];

  return (
    <div
      className={`flex ${layout === 'row' ? 'flex-row gap-6' : 'flex-col gap-4'} items-center justify-center text-center ${className}`}
    >
      {badges.map(({ icon: Icon, text }, i) => (
        <div key={i} className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-neutral-600" />
          <span className="text-xs text-neutral-600 font-medium">{text}</span>
        </div>
      ))}
    </div>
  );
}
