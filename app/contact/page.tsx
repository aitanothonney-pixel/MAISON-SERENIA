'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, MessageCircle, ChevronDown, CheckCircle } from 'lucide-react';

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

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour à l'accueil
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nous contacter
            </h1>
          </div>
          <p className="text-neutral-500 text-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Une question, un projet, ou simplement envie d'échanger — nous sommes là.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Form — spans 2 cols */}
          <div className="md:col-span-2">
            <h2
              className="text-3xl font-bold text-black mb-8"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Envoyez-nous un message
            </h2>

            {submitted ? (
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-10 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                <p
                  className="text-lg font-semibold text-black mb-2"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Message envoyé
                </p>
                <p className="text-neutral-500 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Nous vous répondrons dans les 48 heures ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                      Nom complet *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Marie Dupont"
                      value={form.nom}
                      onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                      Adresse e-mail *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="vous@exemple.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Sujet *
                  </label>
                  <select
                    required
                    value={form.sujet}
                    onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="commande">Suivi de commande</option>
                    <option value="produit">Question produit</option>
                    <option value="retour">Retour / remboursement</option>
                    <option value="conseil">Conseil décoration</option>
                    <option value="partenariat">Partenariat / presse</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Décrivez votre demande…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
            )}

            {/* FAQ rapide */}
            <div className="mt-16">
              <h2
                className="text-3xl font-bold text-black mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Questions rapides
              </h2>
              <div className="space-y-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="border border-neutral-200">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-semibold text-black text-sm">{item.q}</span>
                      <ChevronDown
                        className="w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200"
                        style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed border-t border-neutral-100 pt-4">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aside */}
          <aside className="space-y-8" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <div>
              <h3
                className="text-xl font-bold text-black mb-5"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Informations
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">E-mail</p>
                    <a
                      href="mailto:contact@maison-serenia.fr"
                      className="text-black text-sm hover:underline"
                    >
                      contact@maison-serenia.fr
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">Délai de réponse</p>
                    <p className="text-black text-sm font-semibold">48 heures ouvrées</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">Langues</p>
                    <p className="text-black text-sm">Français · English</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 p-6">
              <p
                className="text-white font-bold mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Horaires du service client
              </p>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Lundi – Vendredi<br />
                9h00 – 18h00<br />
                <span className="text-neutral-500">(Heure de Paris)</span>
              </p>
            </div>

            <div className="border border-neutral-200 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Consultez aussi</p>
              <div className="space-y-2">
                <Link href="/faq" className="block text-black text-sm hover:underline">→ FAQ complète</Link>
                <Link href="/livraison" className="block text-black text-sm hover:underline">→ Livraison & Délais</Link>
                <Link href="/retours" className="block text-black text-sm hover:underline">→ Retours & Remboursements</Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
