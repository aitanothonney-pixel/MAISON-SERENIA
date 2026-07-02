'use client';

import Link from 'next/link';

interface LogoProps {
  color?: 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
}

const SIZES = {
  sm: { box: 'w-6 h-6', mono: 'text-[9px]', word: 'text-[11px]', tracking: '0.2em' },
  md: { box: 'w-8 h-8', mono: 'text-[10px]', word: 'text-sm lg:text-[15px]', tracking: '0.24em' },
  lg: { box: 'w-9 h-9', mono: 'text-[11px]', word: 'text-lg', tracking: '0.26em' },
} as const;

export function Logo({ color = 'black', size = 'md', href = '/', onClick, className = '' }: LogoProps) {
  const s = SIZES[size];
  const isWhite = color === 'white';

  return (
    <Link href={href} onClick={onClick} className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Monogram */}
      <span
        className={`relative flex items-center justify-center shrink-0 ${s.box} border transition-colors duration-300 ${
          isWhite ? 'border-white/60' : 'border-black/80'
        }`}
      >
        <span className={`absolute inset-[2.5px] border ${isWhite ? 'border-white/25' : 'border-black/20'}`} />
        <span
          className={`relative italic font-bold ${s.mono} ${isWhite ? 'text-white' : 'text-black'}`}
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
        >
          MS
        </span>
      </span>

      {/* Wordmark */}
      <span
        className={`font-bold uppercase whitespace-nowrap transition-colors duration-300 ${s.word} ${
          isWhite ? 'text-white' : 'text-black'
        }`}
        style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', letterSpacing: s.tracking }}
      >
        Maison Serenia
      </span>
    </Link>
  );
}
