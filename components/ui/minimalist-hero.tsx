'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export function MinimalistHeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10%' });

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-white flex items-center justify-center overflow-hidden px-6 md:px-16 py-20"
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <div className="relative w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

        {/* LEFT — description */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.6 }}
          className="order-2 md:order-1 text-center md:text-left"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-5">
            Collection 2026
          </p>
          <p className="text-sm leading-relaxed text-neutral-500 max-w-xs mb-6">
            Chaque pièce MAISON SERENIA est conçue pour transcender le quotidien — où la forme rencontre le confort absolu.
          </p>
          <a
            href="#section-salon"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-black border-b border-black pb-0.5 hover:gap-4 transition-all duration-300"
          >
            Découvrir <span>→</span>
          </a>
        </motion.div>

        {/* CENTER — image on circle */}
        <div className="order-1 md:order-2 flex justify-center items-center relative">
          {/* Outer ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.1 }}
            className="absolute w-[320px] h-[320px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] rounded-full border border-neutral-100"
          />
          {/* Inner circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] rounded-full bg-neutral-50"
          />
          {/* Rotating text ring */}
          <motion.div
            initial={{ opacity: 0, rotate: -30 }}
            animate={inView ? { opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
            className="absolute w-[300px] h-[300px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_18s_linear_infinite] opacity-20">
              <defs>
                <path id="circle-path" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
              </defs>
              <text fontSize="7" letterSpacing="4" fill="currentColor">
                <textPath href="#circle-path">MAISON SERENIA · COLLECTION 2026 · MOBILIER D'EXCEPTION · </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Product image — clickable */}
          <Link href="/products/22" className="relative z-10 group">
            <motion.img
              src="https://i.ibb.co/zH4qtJVB/IMG-2511.jpg"
              alt="Canapé Bubble rouge MAISON SERENIA"
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1.1, ease, delay: 0.35 }}
              className="w-64 md:w-72 lg:w-80 h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.1 }}
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase text-neutral-400 whitespace-nowrap group-hover:text-black transition-colors duration-300"
            >
              Voir le produit →
            </motion.span>
          </Link>
        </div>

        {/* RIGHT — big display text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.7 }}
          className="order-3 text-center md:text-right"
        >
          <h2
            className="text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black leading-[0.88] tracking-tight text-black select-none"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            l&apos;art<br />
            <span className="text-neutral-200">de</span><br />
            vivre.
          </h2>
        </motion.div>

      </div>

      {/* Bottom divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease, delay: 1 }}
        style={{ transformOrigin: 'left' }}
        className="absolute bottom-10 left-6 right-6 md:left-16 md:right-16 h-px bg-neutral-100"
      />
    </section>
  );
}
