'use client';

import { useEffect, useState } from 'react';
import { promoEndTimestamp } from '@/lib/promotions';

// Compte à rebours réel : rendu uniquement si une date de fin future est configurée
// (lib/promotions.ts). Aucun réarmement : une fois la date passée, le bloc disparaît.
// Le premier rendu ne contient rien, pour éviter un écart d'hydratation serveur/navigateur.
export function PromoCountdown({ endsAt, className = '' }: { endsAt: string | null; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;
  const end = promoEndTimestamp(endsAt, now);
  if (end === null) return null;

  const diff = end - now;
  const parts = [
    { value: Math.floor(diff / 86_400_000), label: 'Jours' },
    { value: Math.floor((diff / 3_600_000) % 24), label: 'Heures' },
    { value: Math.floor((diff / 60_000) % 60), label: 'Min' },
    { value: Math.floor((diff / 1000) % 60), label: 'Sec' },
  ];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={className}>
      <p className="text-[11px] tracking-[0.4em] uppercase text-[#D8C9B5] mb-4">Offre se termine dans</p>
      <div className="flex gap-3 md:gap-5 mb-10" role="timer">
        {parts.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm border-2 border-[#A68A6D] px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[90px] shadow-2xl"
          >
            <span
              className="text-white text-3xl md:text-5xl font-bold leading-none tabular-nums"
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
            >
              {pad(value)}
            </span>
            <span className="text-[9px] md:text-[10px] text-[#D8C9B5] uppercase tracking-[0.25em] mt-2 md:mt-3">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
