'use client';

import { useState } from 'react';
import { ChevronRight, Palette, Ruler } from 'lucide-react';

interface Recommendation {
  color: string;
  size: string;
  reason: string;
}

interface SizeColorFinderProps {
  productName?: string;
}

export function SizeColorFinder({ productName = 'ce produit' }: SizeColorFinderProps) {
  const [step, setStep] = useState<'idle' | 'question1' | 'question2' | 'result'>('idle');
  const [spaceSize, setSpaceSize] = useState<'petit' | 'moyen' | 'grand' | null>(null);
  const [style, setStyle] = useState<'minimaliste' | 'cosy' | 'moderne' | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleStart = () => {
    setStep('question1');
    setSpaceSize(null);
    setStyle(null);
  };

  const handleSpaceSize = (size: 'petit' | 'moyen' | 'grand') => {
    setSpaceSize(size);
    setStep('question2');
  };

  const handleStyle = (selectedStyle: 'minimaliste' | 'cosy' | 'moderne') => {
    setStyle(selectedStyle);
    generateRecommendation(spaceSize, selectedStyle);
  };

  const generateRecommendation = (
    space: 'petit' | 'moyen' | 'grand' | null,
    selectedStyle: 'minimaliste' | 'cosy' | 'moderne'
  ) => {
    let rec: Recommendation;

    if (space === 'petit' && selectedStyle === 'minimaliste') {
      rec = {
        color: 'Blanc / Gris clair',
        size: 'Compact',
        reason: 'Maximise l\'espace visuel dans les petits intérieurs minimalistes',
      };
    } else if (space === 'petit' && selectedStyle === 'cosy') {
      rec = {
        color: 'Taupe / Beige chaud',
        size: 'Compact',
        reason: 'Crée une ambiance intime sans surcharger l\'espace',
      };
    } else if (space === 'petit' && selectedStyle === 'moderne') {
      rec = {
        color: 'Noir / Anthracite',
        size: 'Compact',
        reason: 'Style épuré et contrasté pour petits espaces modernes',
      };
    } else if (space === 'moyen' && selectedStyle === 'minimaliste') {
      rec = {
        color: 'Gris / Crème',
        size: 'Standard',
        reason: 'Équilibre minimaliste avec proportions standard',
      };
    } else if (space === 'moyen' && selectedStyle === 'cosy') {
      rec = {
        color: 'Terracotta / Ocre',
        size: 'Standard',
        reason: 'Crée une atmosphère chaleureuse et accueillante',
      };
    } else if (space === 'moyen' && selectedStyle === 'moderne') {
      rec = {
        color: 'Bleu marine / Gris',
        size: 'Standard',
        reason: 'Tendance moderne avec couleurs intemporelles',
      };
    } else if (space === 'grand' && selectedStyle === 'minimaliste') {
      rec = {
        color: 'Blanc / Gris très clair',
        size: 'XL',
        reason: 'Exploite pleinement l\'espace avec minimalisme épuré',
      };
    } else if (space === 'grand' && selectedStyle === 'cosy') {
      rec = {
        color: 'Velours profond / Bordeaux',
        size: 'XL',
        reason: 'Confortable et luxueux pour grands espaces',
      };
    } else {
      rec = {
        color: 'Noir / Gris anthracite',
        size: 'XL',
        reason: 'Impact contemporain dans grands espaces modernes',
      };
    }

    setRecommendation(rec);
    setStep('result');
  };

  if (step === 'idle') {
    return (
      <button
        onClick={handleStart}
        className="w-full bg-purple-50 border border-purple-200 text-black py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 group"
      >
        <Palette className="w-5 h-5" />
        Trouver ma taille et couleur idéales
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  if (step === 'question1') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="font-semibold text-black mb-4">Quelle est la taille de votre espace?</p>
        <div className="space-y-2">
          {[
            { id: 'petit', label: 'Petit (studio/petit salon)' },
            { id: 'moyen', label: 'Moyen (salon standard)' },
            { id: 'grand', label: 'Grand (spacieux/open space)' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSpaceSize(opt.id as 'petit' | 'moyen' | 'grand')}
              className="w-full p-3 bg-white border border-purple-200 rounded-lg text-left font-medium text-black hover:bg-purple-100 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'question2') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="font-semibold text-black mb-4">Quel style préférez-vous?</p>
        <div className="space-y-2">
          {[
            { id: 'minimaliste', label: '✓ Minimaliste' },
            { id: 'cosy', label: '🏠 Cosy' },
            { id: 'moderne', label: '⚡ Moderne' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleStyle(opt.id as 'minimaliste' | 'cosy' | 'moderne')}
              className="w-full p-3 bg-white border border-purple-200 rounded-lg text-left font-medium text-black hover:bg-purple-100 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'result' && recommendation) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-purple-700" />
          <p className="font-bold text-black">Votre recommandation</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Couleur idéale</p>
            <p className="text-lg font-bold text-black">{recommendation.color}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Format recommandé</p>
            <p className="text-lg font-bold text-black">{recommendation.size}</p>
          </div>
        </div>

        <p className="text-sm text-purple-700 bg-white rounded-lg p-3 mb-4">
          💡 {recommendation.reason}
        </p>

        <button
          onClick={() => setStep('idle')}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-colors"
        >
          Découvrir ce produit
        </button>
      </div>
    );
  }

  return null;
}
