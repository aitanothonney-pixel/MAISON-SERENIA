'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface DealCountdownProps {
  endTime: Date;
  dealName?: string;
  discount?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function DealCountdown({
  endTime,
  dealName = 'Offre limitée',
  discount = 30,
}: DealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (isExpired) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5" />
        <span className="font-bold text-sm">{dealName}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { value: timeLeft.days, label: 'j' },
          { value: timeLeft.hours, label: 'h' },
          { value: timeLeft.minutes, label: 'm' },
          { value: timeLeft.seconds, label: 's' },
        ].map((item, i) => (
          <div key={i} className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-2xl font-bold">
              {String(item.value).padStart(2, '0')}
            </p>
            <p className="text-xs text-white/80 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold">−{discount}% en stock limité</p>
        <p className="text-xs text-white/70 mt-1">
          Dépêchez-vous, offre expire bientôt!
        </p>
      </div>
    </div>
  );
}
