'use client';

import { Leaf, Droplet, RotateCcw, Zap } from 'lucide-react';

interface SustainabilityBadgeProps {
  ecoPoints?: number; // 0-100
  materials?: string[];
  certifications?: string[];
  carbonNeutral?: boolean;
  recyclingCompatible?: boolean;
  compact?: boolean;
}

const iconMap = {
  eco: Leaf,
  water: Droplet,
  recycle: RotateCcw,
  energy: Zap,
};

export function SustainabilityBadge({
  ecoPoints = 75,
  materials = ['Velours Coton Bio', 'Structure Contreplaqué FSC'],
  certifications = ['OEKO-TEX Standard 100', 'Commerce Équitable'],
  carbonNeutral = false,
  recyclingCompatible = true,
  compact = false,
}: SustainabilityBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-none p-3 w-fit">
        <Leaf className="w-5 h-5 text-green-700 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-900">Produit Durable</p>
          <p className="text-xs text-green-700">{ecoPoints}/100 score écologique</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-none p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Engagement Durable
          </h3>
          <p className="text-sm text-green-700 mt-1">
            Conception responsable & matériaux éco-certifiés
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-700">{ecoPoints}</p>
          <p className="text-xs text-green-600">Score écologique</p>
        </div>
      </div>

      {materials.length > 0 && (
        <div className="mb-4 pb-4 border-b border-green-200">
          <p className="text-xs font-semibold uppercase text-green-900 mb-2">
            Matériaux
          </p>
          <ul className="space-y-1">
            {materials.map((material, i) => (
              <li key={i} className="text-sm text-green-800 flex gap-2">
                <span className="text-green-600">✓</span>
                {material}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        {recyclingCompatible && (
          <div className="flex items-center gap-2 text-sm text-green-800">
            <RotateCcw className="w-4 h-4 text-green-600" />
            <span>100% Recyclable</span>
          </div>
        )}
        {carbonNeutral && (
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Zap className="w-4 h-4 text-green-600" />
            <span>Neutre en carbone</span>
          </div>
        )}
      </div>

      {certifications.length > 0 && (
        <div className="pt-2 border-t border-green-200">
          <p className="text-xs font-semibold uppercase text-green-900 mb-2">
            Certifications
          </p>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, i) => (
              <span
                key={i}
                className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
