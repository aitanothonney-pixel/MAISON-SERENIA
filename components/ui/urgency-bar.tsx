'use client';

import { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';

interface UrgencyBarProps {
  show?: boolean;
  offerText?: string;
  deadline?: Date;
}

export function UrgencyBar({
  show = true,
  offerText = "⚡ Commandez avant 18h pour expédition aujourd'hui",
  deadline,
}: UrgencyBarProps) {
  const [visible, setVisible] = useState(show);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setVisible(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-900">{offerText}</span>
          {timeLeft && (
            <span className="ml-4 text-xs font-mono bg-amber-100 text-amber-800 px-2.5 py-1 rounded">
              {timeLeft}
            </span>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-amber-600 hover:text-amber-700 transition-colors p-1"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
