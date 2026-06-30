'use client';

import { Share2, Users, Gift, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ReferralProgramProps {
  referralCode?: string;
  referralBonus?: number;
  friendBonus?: number;
  referralCount?: number;
  totalEarnings?: number;
}

export function ReferralProgram({
  referralCode = 'SERENIA2024',
  referralBonus = 50,
  friendBonus = 30,
  referralCount = 5,
  totalEarnings = 250,
}: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `https://maisonserenia.ch?ref=${referralCode}`;

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-8 h-8 text-purple-700" />
          <h2 className="text-3xl font-serif font-bold text-black">
            Programme de Parrainage
          </h2>
        </div>

        <p className="text-neutral-700 mb-8">
          Gagnez des crédits en invitant vos amis à découvrir Maison Serenia
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">
              Amis invités
            </p>
            <p className="text-3xl font-bold text-black">{referralCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">
              Gains totaux
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {totalEarnings.toLocaleString('fr-FR')}€
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
            <p className="text-xs text-purple-600 uppercase font-semibold mb-1">
              Prochaine récompense
            </p>
            <p className="text-3xl font-bold text-pink-600">
              +{(referralBonus * 2).toLocaleString('fr-FR')}€
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg p-6 border border-purple-200 mb-8">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            Comment ça marche?
          </h3>
          <ol className="space-y-3 text-sm text-neutral-700">
            <li className="flex gap-3">
              <span className="font-bold text-purple-700 flex-shrink-0">1.</span>
              <span>Partagez votre code <span className="font-mono font-bold text-black">{referralCode}</span></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-700 flex-shrink-0">2.</span>
              <span>Vos amis achètent avec ce code</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-700 flex-shrink-0">3.</span>
              <span>Vous gagnez <span className="font-bold text-purple-700">{referralBonus}€</span> en crédits</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-700 flex-shrink-0">4.</span>
              <span>Votre ami reçoit <span className="font-bold text-pink-600">{friendBonus}€</span> de réduction</span>
            </li>
          </ol>
        </div>

        {/* Copy code */}
        <button
          onClick={handleCopy}
          className="w-full bg-white border-2 border-purple-700 text-black py-4 rounded-lg font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 mb-4 group"
        >
          <div className="bg-purple-100 p-2 rounded group-hover:bg-purple-200 transition-colors">
            {copied ? (
              <Check className="w-5 h-5 text-purple-700" />
            ) : (
              <Copy className="w-5 h-5 text-purple-700" />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs text-neutral-600">Mon code de parrainage</p>
            <p className="font-mono text-lg">{referralCode}</p>
          </div>
        </button>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Partager sur Facebook
          </button>
          <button className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors">
            Partager sur X
          </button>
        </div>

        {/* More rewards */}
        <div className="mt-8 pt-8 border-t border-purple-200">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600" />
            Paliers de récompenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { threshold: 3, reward: 100 },
              { threshold: 10, reward: 300 },
              { threshold: 20, reward: 700 },
            ].map((tier) => (
              <div
                key={tier.threshold}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center"
              >
                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">
                  {tier.threshold} amis invités
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  +{tier.reward.toLocaleString('fr-FR')}€
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
