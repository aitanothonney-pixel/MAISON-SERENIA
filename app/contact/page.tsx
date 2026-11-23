'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, ChevronDown, Clock, Mail, MessageCircle } from 'lucide-react';
import { EASE, Mots, Rise } from '@/components/a-propos/motion-kit';

const FAQ_ITEMS = [
  {
    q: 'Quel est le délai de réponse habituel ?',
    a: 'Nous répondons à toutes les demandes dans un délai maximum de 48 heures ouvrées, généralement bien plus tôt.',
  },
  {
    q: 'Puis-je modifier ou annuler ma commande ?',
    a: "Oui, tant que la commande n'a pas été expédiée. Contactez-nous rapidement avec votre numéro de commande.",
  },
  {
    q: "Proposez-vous des conseils en décoration d'intérieur ?",
    a: 'Absolument. Notre équipe peut vous accompagner dans la sélection de pièces adaptées à votre espace. Mentionnez-le dans votre message.',
  },
];

const SUJETS = [
  { valeur: 'commande', libelle: 'Suivi de commande' },
  { valeur: 'produit', libelle: 'Question produit' },
  { valeur: 'retour', libelle: 'Retour / remboursement' },
  { valeur: 'conseil', libelle: 'Conseil décoration' },
  { valeur: 'partenariat', libelle: 'Partenariat / presse' },
  { valeur: 'autre', libelle: 'Autre' },
];

const LIENS = [
  { href: '/faq', libelle: 'FAQ complète' },
  { href: '/livraison', libelle: 'Livraison & Délais' },
  { href: '/retours', libelle: 'Retours & Remboursements' },
];

const KICKER = 'text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]';
const ETIQUETTE = 'mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52]';
const ETIQUETTE_COURTE = 'mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52]';
const CHAMP =
  'w-full border-0 border-b border-[#D8C9B5] bg-transparent px-0 py-3 text-[16px] text-[#221607] placeholder:text-[#A68A6D]/70 outline-none transition-colors duration-500 focus:border-[#221607]';
const LIEN_DISCRET = 'text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52] transition-colors hover:text-[#221607]';
const PICTO = 'flex h-11 w-11 shrink-0 items-center justify-center border border-[#A68A6D]/50 text-[#221607]';

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setSubmitted(true);
      } else {
        setError(data?.message || "L'envoi a échoué. Réessayez ou écrivez-nous directement à maisonserenia@gmail.com.");
      }
    } catch {
      setError("Erreur de connexion. Réessayez ou écrivez-nous à maisonserenia@gmail.com.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Link href="/" className={LIEN_DISCRET}>
          ← Retour à l’accueil
        </Link>
      </div>

      {/* En-tête */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-24 md:pt-28">
        <Rise>
          <p className={KICKER}>Contact</p>
        </Rise>
        <h1 className="pdp-display mt-6 text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[104px]">
          <Mots texte="Nous contacter" />
        </h1>
        <Rise delay={0.25}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-[#4D4842]">
            Une question, un projet, ou simplement envie d’échanger — nous sommes là.
          </p>
        </Rise>
      </section>

      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-32 md:grid-cols-12 md:gap-12">
        {/* Formulaire et questions rapides */}
        <div className="md:col-span-7">
          <Rise>
            <div className="bg-white p-8 shadow-[0_24px_60px_-34px_rgba(34,22,7,0.4)] md:p-12">
              <p className={KICKER}>Écrivez-nous</p>
              <h2 className="pdp-display mt-4 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[38px]">
                Envoyez-nous un message
              </h2>

              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="merci"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="mt-12 py-6 text-center"
                  >
                    <CheckCircle className="mx-auto mb-6 h-10 w-10 text-[#7F6A52]" strokeWidth={1.2} />
                    <p className="pdp-display text-2xl font-semibold tracking-[-0.02em]">Message envoyé</p>
                    <p className="mt-3 text-[#4D4842]">Nous vous répondrons dans les 48 heures ouvrées.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="formulaire"
                    onSubmit={handleSubmit}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-12 space-y-10"
                  >
                    <div className="grid gap-10 sm:grid-cols-2">
                      <Rise y={24} delay={0.05}>
                        <label htmlFor="contact-nom" className={ETIQUETTE}>
                          Nom complet *
                        </label>
                        <input
                          id="contact-nom"
                          required
                          type="text"
                          placeholder="Marie Dupont"
                          value={form.nom}
                          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                          className={CHAMP}
                        />
                      </Rise>
                      <Rise y={24} delay={0.1}>
                        <label htmlFor="contact-email" className={ETIQUETTE}>
                          Adresse e-mail *
                        </label>
                        <input
                          id="contact-email"
                          required
                          type="email"
                          placeholder="vous@exemple.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className={CHAMP}
                        />
                      </Rise>
                    </div>

                    <Rise y={24} delay={0.15}>
                      <label htmlFor="contact-sujet" className={ETIQUETTE}>
                        Sujet *
                      </label>
                      <div className="relative">
                        <select
                          id="contact-sujet"
                          required
                          value={form.sujet}
                          onChange={(e) => setForm((f) => ({ ...f, sujet: e.target.value }))}
                          className={`${CHAMP} cursor-pointer appearance-none pr-8`}
                        >
                          <option value="">Choisissez un sujet</option>
                          {SUJETS.map((s) => (
                            <option key={s.valeur} value={s.valeur}>
                              {s.libelle}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F6A52]"
                          strokeWidth={1.4}
                        />
                      </div>
                    </Rise>

                    <Rise y={24} delay={0.2}>
                      <label htmlFor="contact-message" className={ETIQUETTE}>
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        placeholder="Décrivez votre demande…"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className={`${CHAMP} resize-none`}
                      />
                    </Rise>

                    <Rise y={24} delay={0.25}>
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={sending}
                          className="inline-flex items-center justify-center bg-[#221607] px-10 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-transform duration-500 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          {sending ? 'Envoi en cours…' : 'Envoyer le message'}
                        </button>
                        {error && <p className="text-sm text-red-700">{error}</p>}
                      </div>
                    </Rise>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Rise>

          {/* Questions rapides */}
          <Rise>
            <h2 className="pdp-display mt-28 text-[30px] font-semibold leading-tight tracking-[-0.02em] md:text-[38px]">
              Questions rapides
            </h2>
          </Rise>
          <div className="mt-10 divide-y divide-[#D8C9B5] border-y border-[#D8C9B5]">
            {FAQ_ITEMS.map((item, i) => {
              const ouvert = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(ouvert ? null : i)}
                    aria-expanded={ouvert}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="pdp-display text-lg font-semibold tracking-[-0.01em] md:text-xl">{item.q}</span>
                    <motion.span
                      animate={{ rotate: ouvert ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#D8C9B5] text-[#7F6A52]"
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={1.4} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {ouvert && (
                      <motion.div
                        key="reponse"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-[#4D4842]">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations */}
        <aside className="space-y-12 md:col-span-4 md:col-start-9">
          <Rise>
            <div>
              <p className={KICKER}>Informations</p>
              <ul className="mt-8 space-y-8">
                <li className="flex items-start gap-5">
                  <span className={PICTO}>
                    <Mail className="h-4 w-4" strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className={ETIQUETTE_COURTE}>E-mail</p>
                    <a href="mailto:maisonserenia@gmail.com" className="text-[17px] underline-offset-4 hover:underline">
                      maisonserenia@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <span className={PICTO}>
                    <Clock className="h-4 w-4" strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className={ETIQUETTE_COURTE}>Délai de réponse</p>
                    <p className="text-[17px]">48 heures ouvrées</p>
                  </div>
                </li>
                <li className="flex items-start gap-5">
                  <span className={PICTO}>
                    <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className={ETIQUETTE_COURTE}>Langues</p>
                    <p className="text-[17px]">Français · English</p>
                  </div>
                </li>
              </ul>
            </div>
          </Rise>

          <Rise delay={0.1}>
            <div className="bg-[#221607] p-8 text-[#F6F2EB]">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#D8C9B5]">Horaires du service client</p>
              <p className="pdp-display mt-5 text-2xl font-semibold tracking-[-0.02em]">Lundi – Vendredi</p>
              <p className="mt-2 text-[#D8C9B5]">9h00 – 18h00</p>
              <p className="mt-1 text-sm text-[#A68A6D]">Heure de Genève</p>
            </div>
          </Rise>

          <Rise delay={0.2}>
            <div className="border border-[#D8C9B5] bg-white/60 p-8">
              <p className={KICKER}>Consultez aussi</p>
              <ul className="mt-6 divide-y divide-[#D8C9B5]">
                {LIENS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group flex items-center justify-between py-4 text-[16px]">
                      <span className="underline-offset-4 group-hover:underline">{l.libelle}</span>
                      <ArrowUpRight
                        className="h-4 w-4 text-[#7F6A52] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.4}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        </aside>
      </div>
    </main>
  );
}
