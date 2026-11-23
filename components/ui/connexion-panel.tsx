'use client';

// « Se connecter » : depuis l'en-tête, le visiteur laisse son adresse e-mail pour être recontacté.
// L'adresse est transmise à la boîte de la boutique (route /api/connexion), comme le formulaire de contact.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur';

export function ConnexionPanel({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [etat, setEtat] = useState<Etat>('repos');
  const [message, setMessage] = useState('');
  const champRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    champRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat === 'envoi') return;
    setEtat('envoi');
    setMessage('');
    try {
      const res = await fetch('/api/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setEtat('ok');
      } else {
        setEtat('erreur');
        setMessage(data?.message || 'L’envoi a échoué. Réessayez ou écrivez-nous à maisonserenia@gmail.com.');
      }
    } catch {
      setEtat('erreur');
      setMessage('Erreur de connexion. Réessayez.');
    }
  }

  return (
    <>
      {/* Clic à l'extérieur : fermeture */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} aria-hidden="true" />
      <motion.div
        role="dialog"
        aria-label="Se connecter"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-full z-[61] mt-3 w-[min(340px,calc(100vw-2rem))] border border-[#D8C9B5] bg-white p-6 shadow-[0_24px_60px_-34px_rgba(34,22,7,0.4)]"
        style={{ fontFamily: 'var(--font-jost, sans-serif)' }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7F6A52]">Mon compte</p>
        <h2 className="mb-4 mt-2 text-2xl leading-none text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
          Se connecter
        </h2>

        {etat === 'ok' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <p className="text-sm leading-relaxed text-black">Merci. Nous vous recontactons très prochainement.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-black"
            >
              Fermer
            </button>
          </motion.div>
        ) : (
          <form onSubmit={envoyer} className="space-y-5">
            <p className="text-sm leading-relaxed text-neutral-600">
              Laissez votre adresse e-mail : nous vous recontactons pour votre accès.
            </p>
            <div>
              <label htmlFor="connexion-email" className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Adresse e-mail
              </label>
              <input
                id="connexion-email"
                ref={champRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full border border-neutral-300 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              />
            </div>
            {etat === 'erreur' && <p className="text-xs text-red-700">{message}</p>}
            <button
              type="submit"
              disabled={etat === 'envoi'}
              className="w-full bg-black py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
            >
              {etat === 'envoi' ? 'Envoi en cours…' : 'Se connecter'}
            </button>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              Votre adresse sert uniquement à vous recontacter.{' '}
              <Link href="/confidentialite" onClick={onClose} className="underline underline-offset-2 hover:text-black">
                Politique de confidentialité
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </>
  );
}
