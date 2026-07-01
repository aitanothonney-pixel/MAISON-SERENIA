'use client';

export function AssuranceBar() {
  return (
    <section className="w-full bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-3 gap-0 divide-x divide-neutral-200">

          {/* Livraison rapide */}
          <div className="flex flex-col items-center text-center px-6">
            <div className="mb-5">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <rect x="2" y="10" width="20" height="16" />
                <path d="M22 14 H30 L32 18 V26 H22 Z" />
                <circle cx="9" cy="28" r="3" />
                <circle cx="27" cy="28" r="3" />
                <path d="M6 28 H2 V26" />
                <path d="M12 28 H22" />
                <path d="M30 28 H32 V26" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-1.5">Livraison soignée</h3>
            <p className="text-[11px] text-neutral-500 font-light">8–15 jours ouvrés</p>
          </div>

          {/* Paiement sécurisé */}
          <div className="flex flex-col items-center text-center px-6">
            <div className="mb-5">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <rect x="7" y="15" width="20" height="16" />
                <path d="M11 15 V10 A6 6 0 0 1 23 10 V15" />
                <circle cx="17" cy="23" r="2" />
                <path d="M17 25 V28" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-1.5">Paiement sécurisé</h3>
            <p className="text-[11px] text-neutral-500 font-light">SSL 256-bit</p>
          </div>

          {/* Retours faciles */}
          <div className="flex flex-col items-center text-center px-6">
            <div className="mb-5">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                <path d="M6 17 A11 11 0 1 0 9 9" />
                <path d="M3 6 L9 9 L6 15 Z" />
              </svg>
            </div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-1.5">Retours 30 jours</h3>
            <p className="text-[11px] text-neutral-500 font-light">Satisfait ou remboursé</p>
          </div>

        </div>
      </div>
    </section>
  );
}
