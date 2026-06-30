'use client';

import { Gift, Zap, Star } from 'lucide-react';

interface LoyaltyTier {
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
}

const tiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    color: 'orange',
    benefits: ['1 point = 1€ dépensé', 'Accès aux ventes privées'],
  },
  {
    name: 'Argent',
    minPoints: 500,
    color: 'gray',
    benefits: ['1 point = 1.2€ dépensé', 'Livraison gratuite', 'Anniversaire: 50 points bonus'],
  },
  {
    name: 'Or',
    minPoints: 2000,
    color: 'yellow',
    benefits: ['1 point = 1.5€ dépensé', 'Livraison prioritaire', 'Support VIP 24/7', 'Remise -5% toujours'],
  },
];

interface LoyaltyProgramProps {
  userPoints?: number;
  userTier?: 'bronze' | 'argent' | 'or';
}

export function LoyaltyProgram({
  userPoints = 0,
  userTier = 'bronze',
}: LoyaltyProgramProps) {
  const currentTierIdx = tiers.findIndex((t) => t.name.toLowerCase() === userTier);
  const currentTier = tiers[currentTierIdx] || tiers[0];
  const nextTier = tiers[currentTierIdx + 1];
  const pointsToNextTier = nextTier
    ? nextTier.minPoints - userPoints
    : null;

  return (
    <section className="py-12 bg-gradient-to-br from-neutral-900 to-black text-white rounded-none p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Vos Points
          </p>
          <p className="text-4xl font-bold">{userPoints.toLocaleString('fr-FR')}</p>
          <p className="text-sm text-neutral-300 mt-1">
            {pointsToNextTier && `${pointsToNextTier} points jusqu'à ${nextTier?.name}`}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Votre Statut
          </p>
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold">{currentTier.name}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Avantage Principal
          </p>
          <p className="text-lg font-semibold">{currentTier.benefits[0]}</p>
        </div>
      </div>

      {pointsToNextTier && (
        <div className="mb-8">
          <div className="flex items-end gap-2 mb-2">
            <p className="text-sm text-neutral-300">Progression vers {nextTier?.name}</p>
            <p className="text-xs text-neutral-400">
              {(((nextTier?.minPoints || 0) - pointsToNextTier) / (nextTier?.minPoints || 1) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="w-full bg-neutral-700 rounded-none h-2">
            <div
              className="bg-yellow-400 h-2 rounded-none transition-all duration-500"
              style={{
                width: `${(((nextTier?.minPoints || 0) - pointsToNextTier) / (nextTier?.minPoints || 1) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`p-4 rounded-none border transition-all ${
              tier.name.toLowerCase() === userTier
                ? 'bg-white/10 border-yellow-400'
                : 'bg-white/5 border-neutral-700'
            }`}
          >
            <p className="font-semibold mb-3">{tier.name}</p>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {tier.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
