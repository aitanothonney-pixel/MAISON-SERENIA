'use client';

export function DifferentiatorsSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">

        {/* Luxury header */}
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-light mb-4">Notre engagement</p>
          <div className="w-8 h-px bg-neutral-300 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-200">

          {/* Curation premium */}
          <div className="flex flex-col items-center text-center px-10 pb-12 md:pb-0">
            <div className="mb-8">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <path d="M17 2 L32 13 L17 32 L2 13 Z" />
                <path d="M2 13 H32" />
                <path d="M9.5 13 L17 2 L24.5 13" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">Curation premium</h3>
            <p className="text-xs text-neutral-500 font-light leading-loose">
              Chaque pièce est sélectionnée pour sa qualité et son design, sans compromis.
            </p>
          </div>

          {/* Prix direct fabricant */}
          <div className="flex flex-col items-center text-center px-10 py-12 md:py-0">
            <div className="mb-8">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <circle cx="17" cy="13" r="10" />
                <path d="M11 23 L9 32 L17 28 L25 32 L23 23" />
                <path d="M13 13 L16 16 L21 10" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">Prix direct fabricant</h3>
            <p className="text-xs text-neutral-500 font-light leading-loose">
              Pas d&apos;intermédiaires — vous obtenez les meilleurs prix du marché.
            </p>
          </div>

          {/* SAV réactif */}
          <div className="flex flex-col items-center text-center px-10 pt-12 md:pt-0">
            <div className="mb-8">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <rect x="2" y="9" width="30" height="20" />
                <path d="M2 9 L17 21 L32 9" />
                <path d="M2 29 L12 19" />
                <path d="M32 29 L22 19" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">SAV réactif</h3>
            <p className="text-xs text-neutral-500 font-light leading-loose">
              Équipe disponible 6j/7 pour répondre à vos questions en moins de 4 heures.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
