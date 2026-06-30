'use client';

import { Sparkles } from 'lucide-react';

interface LimitedEditionBadgeProps {
  edition: string; // e.g., "1/50"
  releaseDate?: string;
  collaborator?: string;
  exclusive?: boolean;
  preOrder?: boolean;
}

export function LimitedEditionBadge({
  edition,
  releaseDate,
  collaborator,
  exclusive = false,
  preOrder = false,
}: LimitedEditionBadgeProps) {
  if (exclusive) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-bold">Collection Exclusive</span>
      </div>
    );
  }

  if (preOrder) {
    return (
      <div className="bg-amber-100 border border-amber-400 text-amber-900 px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
        <Sparkles className="w-4 h-4" />
        <div>
          <span className="text-sm font-bold">Précommande</span>
          {releaseDate && (
            <p className="text-xs text-amber-800">Disponible le {releaseDate}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg p-3">
      <div className="flex items-start gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900">Édition Limitée</p>
          <p className="text-sm text-amber-800">{edition}</p>
        </div>
      </div>

      {collaborator && (
        <p className="text-xs text-amber-700 ml-7 mb-2">
          En collaboration avec <span className="font-semibold">{collaborator}</span>
        </p>
      )}

      <p className="text-xs text-amber-600 ml-7">
        Une pièce unique pour les collectionneurs
      </p>
    </div>
  );
}
