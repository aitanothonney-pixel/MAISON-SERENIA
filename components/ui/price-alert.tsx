'use client';

import { Bell, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface PriceAlertProps {
  currentPrice: number;
  productName: string;
  productId: string;
  targetPrice?: number;
}

export function PriceAlert({
  currentPrice,
  productName,
  productId,
  targetPrice,
}: PriceAlertProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setShowForm(false);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-none p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-none bg-green-200 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="font-semibold text-green-900">Alerte activée!</p>
          <p className="text-sm text-green-700">Vous serez notifié si le prix baisse</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="bg-blue-50 border border-blue-300 rounded-none p-4">
        <div className="flex items-start gap-3 mb-3">
          <TrendingDown className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Alerte baisse de prix</p>
            <p className="text-sm text-blue-700">Recevez une notification si le prix diminue</p>
          </div>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full px-3 py-2 border border-blue-300 rounded-none text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubscribe}
            disabled={!email.includes('@')}
            className="flex-1 bg-blue-600 text-white py-2 rounded-none font-semibold hover:bg-blue-700 transition-colors disabled:bg-neutral-300"
          >
            Activer l'alerte
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-none font-semibold hover:bg-blue-200 transition-colors"
          >
            Annuler
          </button>
        </div>

        {targetPrice && (
          <p className="text-xs text-blue-600 mt-2">
            Nous vous notifierons si le prix atteint {targetPrice.toLocaleString('fr-FR')}€
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full bg-neutral-50 border border-neutral-300 text-black py-3 rounded-none font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
    >
      <TrendingDown className="w-5 h-5" />
      Alerte baisse de prix
    </button>
  );
}
