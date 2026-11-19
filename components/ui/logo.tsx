'use client';

import Link from 'next/link';

interface LogoProps {
  color?: 'black' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const SIZES = {
  sm: { box: 'w-7 h-7', mono: 'text-[10px]', word: 'text-[12px]', tracking: '0.32em', lead: '' },
  md: { box: 'w-9 h-9', mono: 'text-[11px]', word: 'text-sm lg:text-base', tracking: '0.36em', lead: '' },
  lg: { box: 'w-10 h-10', mono: 'text-xs', word: 'text-xl', tracking: '0.4em', lead: '' },
  xl: { box: 'w-[58px] h-[58px]', mono: 'text-[15px]', word: 'text-[clamp(16px,1.44vw,24px)]', tracking: '0.38em', lead: 'ml-3' },
} as const;

export function Logo({ color = 'black', size = 'md', href = '/', onClick, className = '' }: LogoProps) {
  const s = SIZES[size];
  const isWhite = color === 'white';

  return (
    <Link href={href} onClick={onClick} className={`inline-flex items-center gap-3 ${className}`}>
      {/* Monogram — diamond crest */}
      <span
        className={`relative flex items-center justify-center shrink-0 ${s.box} rotate-45 border transition-colors duration-300 ${
          isWhite ? 'border-white/70' : 'border-black'
        }`}
      >
        <span className={`absolute inset-[3px] border ${isWhite ? 'border-white/30' : 'border-black/25'}`} />
        <span
          className={`relative -rotate-45 font-semibold ${s.mono} ${isWhite ? 'text-white' : 'text-black'}`}
          style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)', letterSpacing: '0.05em' }}
        >
          MS
        </span>
      </span>

      {/* Wordmark */}
      <span
        className={`whitespace-nowrap transition-colors duration-300 ${s.word} ${s.lead} ${isWhite ? 'text-white' : 'text-black'}`}
        style={{ fontFamily: 'var(--font-italiana, Georgia, serif)', letterSpacing: s.tracking }}
      >
        MAISON SERENIA
      </span>
    </Link>
  );
}
