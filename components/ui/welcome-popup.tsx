'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Sparkles } from 'lucide-react';
import { brevoIdentify } from '@/lib/brevoTracking';

const GOLD_GRADIENT = 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)';
export const WELCOME_CODE = 'MAISON SERENIA 10%';

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Ne s'affiche pas si déjà vu ou déjà inscrit
    try {
      const seen = localStorage.getItem('welcome-popup-seen');
      const already = localStorage.getItem('welcome-discount');
      if (seen || already) return;
    } catch { /* ignore */ }

    let shown = false;
    const trigger = () => {
      if (shown) return;
      // Apparait dès que l'utilisateur commence à défiler pour découvrir le site
      if (window.scrollY > 350) {
        shown = true;
        setVisible(true);
        window.removeEventListener('scroll', trigger);
      }
    };
    window.addEventListener('scroll', trigger, { passive: true });
    // Filet de sécurité : si le visiteur ne défile pas, on affiche après 12 s
    const fallback = setTimeout(() => { if (!shown) { shown = true; setVisible(true); window.removeEventListener('scroll', trigger); } }, 12000);
    return () => { window.removeEventListener('scroll', trigger); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const close = () => {
    try { localStorage.setItem('welcome-popup-seen', '1'); } catch { /* ignore */ }
    setVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    try {
      localStorage.setItem('welcome-email', email);
      localStorage.setItem('welcome-discount', WELCOME_CODE);
      localStorage.setItem('welcome-popup-seen', '1');
      // Prévenir le panier (même onglet) que la remise est active
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
    // Envoi de l'email dans la newsletter (Brevo) — sans bloquer l'affichage
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'popup-bienvenue' }),
    }).catch(() => { /* silencieux : ne gêne pas le visiteur */ });
    // Lie ce visiteur à son email dans le suivi Brevo (panier abandonné)
    brevoIdentify(email);
    setDone(true);
  };

  const copyCode = () => {
    try { navigator.clipboard?.writeText(WELCOME_CODE); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden"
          >
            {/* Fine bordure dorée en haut */}
            <div className="h-1 w-full" style={{ background: GOLD_GRADIENT }} />

            <button
              onClick={close}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-black transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {!done ? (
              <div className="px-8 py-10 text-center">
                <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold px-3 py-1.5 mb-6" style={{ color: '#A07840', border: '1px solid rgba(201,169,110,0.4)' }}>
                  <Sparkles className="w-3 h-3" /> Offre de bienvenue
                </div>

                <h2 className="text-3xl font-serif text-black leading-tight mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  −10% sur votre<br />première commande
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-7 max-w-xs mx-auto">
                  Inscrivez-vous à la newsletter Maison Serenia et recevez immédiatement votre code de réduction de 10%.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full border border-neutral-300 px-4 py-3.5 text-sm text-center outline-none focus:border-[#C9A96E] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 text-white text-[11px] font-semibold tracking-[0.25em] uppercase transition-transform hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)' }}
                  >
                    Je profite des −10%
                  </button>
                </form>

                <button onClick={close} className="mt-4 text-[11px] text-neutral-400 hover:text-black transition-colors underline underline-offset-2">
                  Non merci, je paie plein tarif
                </button>
              </div>
            ) : (
              <div className="px-8 py-10 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-[#C9A96E]/30"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <Check className="w-7 h-7 text-white" strokeWidth={1.6} />
                </motion.div>

                <p className="text-[10px] tracking-[0.35em] uppercase text-[#A07840] mb-3">Offre activée</p>
                <h2 className="text-[26px] leading-tight font-serif text-black mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Bienvenue chez<br />Maison Serenia
                </h2>
                <p className="text-sm text-neutral-500 mb-7 max-w-xs mx-auto leading-relaxed">
                  Votre remise de bienvenue vous attend — elle s&apos;appliquera automatiquement au panier.
                </p>

                {/* Carte code — présentation raffinée */}
                <div className="relative mb-7">
                  <div className="absolute inset-0" style={{ background: GOLD_GRADIENT, opacity: 0.08 }} />
                  <div className="relative border border-[#C9A96E]/50 px-5 py-5">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="h-px w-6 bg-[#C9A96E]/50" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#A07840]">−10 % · Votre code</span>
                      <span className="h-px w-6 bg-[#C9A96E]/50" />
                    </div>
                    <p className="text-xl font-semibold tracking-[0.22em] text-black mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {WELCOME_CODE}
                    </p>
                    <button
                      onClick={copyCode}
                      className={`inline-flex items-center gap-2 px-5 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                        copied ? 'bg-[#A07840] text-white' : 'border border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {copied ? <><Check className="w-3.5 h-3.5" /> Code copié</> : <><Copy className="w-3.5 h-3.5" /> Copier le code</>}
                    </button>
                  </div>
                </div>

                <button
                  onClick={close}
                  className="w-full py-3.5 bg-black text-white text-[11px] font-semibold tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors"
                >
                  Découvrir la boutique
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
