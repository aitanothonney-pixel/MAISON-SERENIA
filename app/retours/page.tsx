'use client';

import { useState } from 'react';
import { CheckCircle, ChevronDown, Mail, Package, RotateCcw } from 'lucide-react';
import { Rise } from '@/components/a-propos/motion-kit';
import { InfoEntete, InfoSection } from '@/components/ui/info-kit';

const ETAPES = [
  {
    step: '01',
    icon: Mail,
    title: 'Faites votre demande',
    desc: 'Remplissez le formulaire ci-dessous ou contactez-nous par e-mail avec votre numéro de commande.',
  },
  {
    step: '02',
    icon: Package,
    title: "Renvoyez l'article",
    desc: "Emballez soigneusement l'article dans son emballage d'origine et déposez-le dans un point de dépôt ou un bureau de poste.",
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Remboursement sous 5j',
    desc: 'Dès réception et vérification du colis, nous procédons au remboursement intégral sous 5 jours ouvrés.',
  },
];

const ACCEPTES = [
  "Article non utilisé, dans son état d'origine",
  "Étiquettes et emballages d'origine conservés",
  'Retour dans les 30 jours suivant la réception',
  'Tous les articles de la commande inclus',
];

const NON_ELIGIBLES = [
  'Articles personnalisés ou sur-mesure',
  'Produits ouverts ou utilisés (cosmétique / bougie)',
  'Linge de maison après lavage',
  'Articles soldés marqués "Vente définitive"',
];

const ETIQUETTE = 'mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52]';
const CHAMP =
  'w-full border-0 border-b border-[#D8C9B5] bg-transparent px-0 py-3 text-[16px] text-[#221607] placeholder:text-[#A68A6D]/70 outline-none transition-colors duration-500 focus:border-[#221607]';

export default function RetoursPage() {
  const [form, setForm] = useState({ order: '', email: '', reason: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <InfoEntete titre="Retours & Remboursements">
        <div className="inline-flex items-center gap-3 bg-[#221607] px-6 py-4 text-[#F6F2EB]">
          <CheckCircle className="h-5 w-5 shrink-0" strokeWidth={1.4} />
          <p className="text-sm font-medium uppercase tracking-[0.12em]">Satisfait ou remboursé — 30 jours</p>
        </div>
      </InfoEntete>

      <div className="mx-auto max-w-5xl px-6 pb-32">
        {/* Trois étapes */}
        <InfoSection titre="Comment effectuer un retour ?">
          <div className="grid gap-10 sm:grid-cols-3">
            {ETAPES.map((etape, i) => (
              <Rise key={etape.step} delay={i * 0.1}>
                <p className="pdp-display text-6xl font-semibold leading-none text-[#D8C9B5]">{etape.step}</p>
                <span className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#221607] text-[#F6F2EB]">
                  <etape.icon className="h-4 w-4" strokeWidth={1.4} />
                </span>
                <h3 className="pdp-display mt-6 text-lg font-semibold tracking-[-0.01em]">{etape.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4D4842]">{etape.desc}</p>
              </Rise>
            ))}
          </div>
        </InfoSection>

        {/* Conditions */}
        <InfoSection titre="Conditions de retour">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="pdp-display flex items-center gap-3 text-lg font-semibold">
                <CheckCircle className="h-4 w-4 text-[#7F6A52]" strokeWidth={1.4} /> Articles acceptés
              </h3>
              <ul className="mt-5 space-y-3">
                {ACCEPTES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-[#4D4842]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#7F6A52]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="pdp-display flex items-center gap-3 text-lg font-semibold">
                <RotateCcw className="h-4 w-4 text-[#7F6A52]" strokeWidth={1.4} /> Articles non éligibles
              </h3>
              <ul className="mt-5 space-y-3">
                {NON_ELIGIBLES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-[#4D4842]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#7F6A52]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 text-sm text-[#7F6A52]">
            Les frais de retour sont à la charge du client sauf en cas d&apos;erreur de notre part ou d&apos;article défectueux.
          </p>
        </InfoSection>

        {/* Formulaire */}
        <InfoSection titre="Initier un retour">
          {submitted ? (
            <Rise>
              <div className="bg-white p-10 text-center shadow-[0_24px_60px_-34px_rgba(34,22,7,0.4)]">
                <CheckCircle className="mx-auto mb-6 h-10 w-10 text-[#7F6A52]" strokeWidth={1.2} />
                <p className="pdp-display text-2xl font-semibold tracking-[-0.02em]">Demande reçue</p>
                <p className="mt-3 text-[#4D4842]">Nous vous répondrons dans les 48 heures ouvrées avec les instructions de retour.</p>
              </div>
            </Rise>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid gap-10 sm:grid-cols-2">
                <Rise y={24}>
                  <label htmlFor="retour-commande" className={ETIQUETTE}>Numéro de commande *</label>
                  <input
                    id="retour-commande"
                    required
                    type="text"
                    placeholder="MS-XXXX"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                    className={CHAMP}
                  />
                </Rise>
                <Rise y={24} delay={0.08}>
                  <label htmlFor="retour-email" className={ETIQUETTE}>Adresse e-mail *</label>
                  <input
                    id="retour-email"
                    required
                    type="email"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={CHAMP}
                  />
                </Rise>
              </div>
              <Rise y={24} delay={0.12}>
                <label htmlFor="retour-motif" className={ETIQUETTE}>Motif du retour *</label>
                <div className="relative">
                  <select
                    id="retour-motif"
                    aria-label="Motif du retour"
                    required
                    value={form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    className={`${CHAMP} cursor-pointer appearance-none pr-8`}
                  >
                    <option value="">Sélectionnez un motif</option>
                    <option value="defect">Article défectueux</option>
                    <option value="wrong">Article incorrect reçu</option>
                    <option value="change">Changement d&apos;avis</option>
                    <option value="size">Taille / dimensions non conformes</option>
                    <option value="other">Autre</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F6A52]"
                    strokeWidth={1.4}
                  />
                </div>
              </Rise>
              <Rise y={24} delay={0.16}>
                <label htmlFor="retour-details" className={ETIQUETTE}>Détails supplémentaires</label>
                <textarea
                  id="retour-details"
                  rows={4}
                  placeholder="Décrivez le problème rencontré…"
                  value={form.details}
                  onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                  className={`${CHAMP} resize-none`}
                />
              </Rise>
              <Rise y={24} delay={0.2}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-[#221607] px-10 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-transform duration-500 hover:-translate-y-0.5"
                >
                  Soumettre la demande
                </button>
              </Rise>
            </form>
          )}
        </InfoSection>
      </div>
    </main>
  );
}
