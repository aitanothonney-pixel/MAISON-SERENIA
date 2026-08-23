'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';

export default function RetoursPage() {
  const [form, setForm] = useState({ order: '', email: '', reason: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Retours & Remboursements
            </h1>
          </div>

          {/* Satisfied guarantee badge */}
          <div className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 mt-2">
            <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
            <p className="font-semibold text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Satisfait ou remboursé — 30 jours
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* 3-step process */}
        <section>
          <h2
            className="text-3xl font-bold text-black mb-10"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Comment effectuer un retour ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Mail className="w-5 h-5" />,
                title: 'Faites votre demande',
                desc: 'Remplissez le formulaire ci-dessous ou contactez-nous par e-mail avec votre numéro de commande.',
              },
              {
                step: '02',
                icon: <Package className="w-5 h-5" />,
                title: "Renvoyez l'article",
                desc: "Emballez soigneusement l'article dans son emballage d'origine et déposez-le dans un point de dépôt ou un bureau de poste.",
              },
              {
                step: '03',
                icon: <CheckCircle className="w-5 h-5" />,
                title: 'Remboursement sous 5j',
                desc: 'Dès réception et vérification du colis, nous procédons au remboursement intégral sous 5 jours ouvrés.',
              },
            ].map((step, i) => (
              <div key={i} className="relative" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <div className="text-7xl font-bold text-neutral-100 absolute -top-4 -left-2 select-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {step.step}
                </div>
                <div className="relative z-10 pt-8">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-4">
                    <span className="text-white">{step.icon}</span>
                  </div>
                  <h3 className="font-semibold text-black mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <ArrowRight className="hidden sm:block absolute top-12 -right-5 w-4 h-4 text-neutral-300" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Conditions */}
        <section className="border-t border-neutral-100 pt-16">
          <h2
            className="text-3xl font-bold text-black mb-8"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Conditions de retour
          </h2>
          <div className="grid sm:grid-cols-2 gap-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <div>
              <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Articles acceptés
              </h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                {[
                  "Article non utilisé, dans son état d'origine",
                  "Étiquettes et emballages d'origine conservés",
                  'Retour dans les 30 jours suivant la réception',
                  'Tous les articles de la commande inclus',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-500" /> Articles non éligibles
              </h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                {[
                  'Articles personnalisés ou sur-mesure',
                  'Produits ouverts ou utilisés (cosmétique / bougie)',
                  'Linge de maison après lavage',
                  'Articles soldés marqués "Vente définitive"',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-xs text-neutral-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Les frais de retour sont à la charge du client sauf en cas d'erreur de notre part ou d'article défectueux.
          </p>
        </section>

        {/* Contact form */}
        <section className="border-t border-neutral-100 pt-16">
          <h2
            className="text-3xl font-bold text-black mb-8"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Initier un retour
          </h2>

          {submitted ? (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-10 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <p
                className="text-lg font-semibold text-black mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Demande reçue
              </p>
              <p className="text-neutral-500 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Nous vous répondrons dans les 48 heures ouvrées avec les instructions de retour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Numéro de commande *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="MS-XXXX"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
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
                  Motif du retour *
                </label>
                <select
                  required
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                >
                  <option value="">Sélectionnez un motif</option>
                  <option value="defect">Article défectueux</option>
                  <option value="wrong">Article incorrect reçu</option>
                  <option value="change">Changement d'avis</option>
                  <option value="size">Taille / dimensions non conformes</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Détails supplémentaires
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez le problème rencontré…"
                  value={form.details}
                  onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
              >
                Soumettre la demande
              </button>
            </form>
          )}
        </section>

      </div>
    </main>
  );
}
