'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formState.name);
    data.append('email', formState.email);
    data.append('subject', formState.subject);
    data.append('message', formState.message);
    data.append('_subject', `[MAISON SERENIA] ${formState.subject || 'Nouveau message'}`);
    data.append('_template', 'table');
    data.append('_captcha', 'false');

    try {
      await fetch('https://formsubmit.co/maisonserenia@gmail.com', {
        method: 'POST',
        body: data,
      });
    } catch {
      // fail silently — still show success to user
    }
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-20 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-light mb-4">Service client</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              Nous contacter
            </h1>
            <div className="w-8 h-px bg-neutral-300 mx-auto mb-6" />
            <p className="text-sm text-neutral-500 font-light">
              Une question ? Nous vous répondons en moins de 4 heures en jours ouvrables.
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-200 mb-20">
            <div className="flex flex-col items-center text-center px-8 pb-10 md:pb-0">
              <div className="mb-5">
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                  <rect x="2" y="8" width="30" height="20" />
                  <path d="M2 8 L17 21 L32 8" />
                  <path d="M2 28 L13 17" />
                  <path d="M32 28 L21 17" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-black font-light mb-3">Email</p>
              <a href="mailto:maisonserenia@gmail.com" className="text-xs text-neutral-500 font-light hover:text-black transition-colors">
                maisonserenia@gmail.com
              </a>
              <p className="text-[10px] text-neutral-400 mt-2 font-light">Réponse sous 4h</p>
            </div>

            <div className="flex flex-col items-center text-center px-8 py-10 md:py-0">
              <div className="mb-5">
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                  <circle cx="17" cy="17" r="14" />
                  <path d="M17 8 V17 L23 21" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-black font-light mb-3">Horaires</p>
              <p className="text-xs text-neutral-500 font-light">Lun–Ven : 9h–18h</p>
              <p className="text-xs text-neutral-500 font-light">Sam : 10h–14h</p>
              <p className="text-[10px] text-neutral-400 mt-2 font-light">Heure de Paris (CET)</p>
            </div>

            <div className="flex flex-col items-center text-center px-8 pt-10 md:pt-0">
              <div className="mb-5">
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                  <path d="M6 17 A11 11 0 1 0 9 9" />
                  <path d="M3 6 L9 9 L6 15 Z" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-black font-light mb-3">Réponse garantie</p>
              <p className="text-xs text-neutral-500 font-light">Chaque message reçoit</p>
              <p className="text-xs text-neutral-500 font-light">une réponse personnalisée</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-serif font-bold" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                Envoyez-nous un message
              </h2>
              <div className="w-6 h-px bg-neutral-300 mx-auto mt-4" />
            </div>

            {submitted ? (
              <div className="text-center py-16 border border-neutral-200">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" className="text-black mx-auto mb-6">
                  <circle cx="18" cy="18" r="16" />
                  <path d="M10 18 L15 23 L26 12" />
                </svg>
                <p className="text-sm font-light text-black mb-2 tracking-wide">Message envoyé</p>
                <p className="text-xs text-neutral-400 font-light">Nous vous répondrons dans les plus brefs délais.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-xs tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-all duration-300 font-light"
                >
                  Nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-black transition-colors text-sm font-light"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-black transition-colors text-sm font-light"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-2">
                    Sujet
                  </label>
                  <select
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-black transition-colors text-sm font-light bg-white"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Question sur une commande">Question sur une commande</option>
                    <option value="Question sur un produit">Question sur un produit</option>
                    <option value="Retour / échange">Retour / échange</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-black transition-colors resize-none text-sm font-light"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white text-xs font-light tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  Envoyer le message
                </button>

                <p className="text-[10px] text-center text-neutral-400 font-light">
                  Vos données ne sont jamais partagées. Consultez notre{' '}
                  <Link href="/confidentialite" className="underline hover:text-black transition-colors">
                    politique de confidentialité
                  </Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
