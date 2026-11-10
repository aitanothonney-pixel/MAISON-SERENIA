import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, Heart, Leaf, Award, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notre Histoire | MAISON SERENIA',
  description:
    "L'histoire de MAISON SERENIA, maison de design fondée à Genève : une sélection de mobilier sculptural et de pièces d'exception, pour composer un intérieur serein et plein de caractère.",
};

export default function AProposPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-black py-28">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-10"
          >
            ← Retour à l&apos;accueil
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E] mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Genève · Depuis 2024
          </p>
          <h1
            className="text-5xl md:text-7xl font-normal text-white leading-[1.1] mb-7"
            style={{ fontFamily: 'var(--font-italiana, Georgia, serif)' }}
          >
            L&apos;art de vivre,<br />en toute sérénité.
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            MAISON SERENIA est née d&apos;une conviction : un intérieur au design fort ne devrait pas être un privilège. Voici notre histoire.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-24" style={{ fontFamily: 'var(--font-dm-sans)' }}>

        {/* ─── Le récit ──────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A07840]">Notre histoire</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Tout commence à Genève
          </h2>
          <div className="space-y-5 text-neutral-600 leading-relaxed text-[17px] max-w-2xl">
            <p>
              MAISON SERENIA voit le jour en 2024, à Genève, d&apos;une frustration simple : les plus belles pièces de design — celles qui transforment une pièce en un lieu où l&apos;on se sent bien — restaient trop souvent inaccessibles, réservées à quelques intérieurs d&apos;exception.
            </p>
            <p>
              Nous avons voulu changer cela. Non pas en produisant toujours plus, mais en <span className="text-black font-medium">choisissant mieux</span>. Nous parcourons les ateliers, les tendances et les savoir-faire pour composer une sélection resserrée : des pièces sculpturales, au caractère affirmé, pensées pour traverser les années plutôt que les saisons.
            </p>
            <p>
              Notre nom dit déjà l&apos;essentiel. <span className="text-black font-medium">SERENIA</span>, c&apos;est la sérénité — cette sensation rare d&apos;un intérieur juste, apaisé, qui vous ressemble. Et <span className="text-black font-medium">MAISON</span>, parce que nous ne vendons pas des objets : nous aidons à bâtir un foyer.
            </p>
          </div>
        </section>

        {/* ─── Manifeste / citation ──────────────────────────────────────── */}
        <section className="relative bg-neutral-950 text-white px-8 md:px-14 py-14 overflow-hidden">
          <Quote className="w-10 h-10 text-[#C9A96E] mb-6" strokeWidth={1.2} />
          <p
            className="text-2xl md:text-[32px] leading-snug font-medium max-w-2xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            « Un bel objet ne se contente pas de remplir une pièce. Il la rend vivante, et un peu plus sereine chaque jour. »
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-neutral-400">La maison Serenia</p>
        </section>

        {/* ─── La signature : Bubble ─────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-14 items-center border-t border-neutral-100 pt-20">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A07840]">Notre signature</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              La collection Bubble
            </h2>
            <p className="text-neutral-600 leading-relaxed text-[17px]">
              Si une pièce devait résumer notre maison, ce serait elle. Avec ses formes rondes et enveloppantes, la collection Bubble incarne tout ce que nous aimons : l&apos;audace du design, le confort absolu, et cette présence sculpturale qui attire le regard dès qu&apos;on entre dans la pièce.
            </p>
            <p className="text-neutral-600 leading-relaxed text-[17px]">
              Déclinée en une palette de couleurs franches, elle est devenue l&apos;emblème de MAISON SERENIA — la preuve qu&apos;un meuble peut être une œuvre.
            </p>
            <Link
              href="/collections/bubble"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-black border-b-2 border-[#C9A96E] pb-1 hover:gap-3 transition-all"
            >
              Découvrir la collection →
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
            {/* Visuel signature (image locale du catalogue) */}
            <img src="/catalog/j9h5SNVC.jpg" alt="Collection Bubble — MAISON SERENIA" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* ─── Valeurs ───────────────────────────────────────────────────── */}
        <section className="border-t border-neutral-100 pt-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A07840] mb-3">Ce qui nous guide</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
              Nos valeurs
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Qualité exigeante',
                desc: "Chaque pièce est sélectionnée selon des critères stricts de matière, de finition et de durabilité. Jamais de compromis sur l'essentiel.",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Design affirmé',
                desc: 'Des formes qui durent plutôt que des modes qui passent. Nous choisissons le caractère, l’allure et l’émotion.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Service attentionné',
                desc: 'De la sélection à la livraison, chaque détail est pensé pour vous. Une équipe disponible, à l’écoute, humaine.',
              },
            ].map((val, i) => (
              <div
                key={i}
                className="group border border-neutral-200 p-7 hover:border-black hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-neutral-100 group-hover:bg-black rounded-full flex items-center justify-center mb-5 transition-colors">
                  <span className="text-black group-hover:text-white transition-colors">{val.icon}</span>
                </div>
                <h3 className="font-bold text-black text-lg mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {val.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Engagements ───────────────────────────────────────────────── */}
        <section className="bg-neutral-50 -mx-6 px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
              Nos engagements
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <Leaf className="w-4 h-4" />, title: 'Sélection responsable', desc: 'Des pièces pensées pour durer, à contre-courant du mobilier jetable.' },
                { icon: <Star className="w-4 h-4" />, title: 'Transparence totale', desc: 'Tarifs clairs, fiches détaillées, conditions de retour explicites. Aucune surprise.' },
                { icon: <Heart className="w-4 h-4" />, title: 'Satisfaction garantie', desc: 'Retour sous 30 jours, service client réactif, remboursement rapide.' },
                { icon: <Award className="w-4 h-4" />, title: 'Des pièces qui durent', desc: 'Des designs intemporels pour un intérieur qui évolue avec vous.' },
              ].map((eng, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border border-neutral-200 p-5">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white">{eng.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm mb-1">{eng.title}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed">{eng.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
            Composez l&apos;intérieur qui vous ressemble
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Parcourez notre sélection et laissez entrer la sérénité chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
            >
              Découvrir nos pièces
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-black text-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-colors"
            >
              Nous écrire
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
