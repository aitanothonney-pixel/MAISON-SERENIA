import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, Heart, Leaf, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notre Histoire | MAISON SERENIA',
  description: "Découvrez MAISON SERENIA, boutique de sélection design basée à Genève : mobilier sculptural, pièces de collection et décoration contemporaine.",
};

export default function AProposPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-neutral-100 bg-neutral-950 py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-10"
          >
            ← Retour à l'accueil
          </Link>
          <p
            className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-4"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Fondée en 2024
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Notre Histoire
          </h1>
          <p
            className="text-neutral-400 text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            MAISON SERENIA est née d'une conviction simple : chaque intérieur mérite des pièces au design fort, choisies avec soin et rendues accessibles.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Brand story */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <h2
              className="text-3xl font-bold text-black mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Une passion pour le design
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Fondée en 2024 à Genève, MAISON SERENIA s'est donné pour mission de rendre le design d'exception accessible. Nous parcourons les tendances déco pour vous proposer une sélection resserrée de pièces sculpturales, de collection et de décoration contemporaine.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Notre approche est simple : sélectionner des pièces au caractère affirmé, aux lignes qui traversent les saisons, et les livrer chez vous avec le plus grand soin.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Notre nom, SERENIA, évoque la sérénité que peut procurer un intérieur soigné. C'est cette émotion que nous cherchons à créer pour chacun de nos clients.
            </p>
          </div>
          <div className="bg-neutral-950 p-10 flex flex-col justify-center min-h-[300px]">
            <div
              className="text-6xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              2024
            </div>
            <div className="w-12 h-px bg-white mb-6" />
            <p className="text-neutral-400 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Année de fondation, à Genève. Depuis, nous sélectionnons avec soin des pièces design pour aider chacun à composer un intérieur qui lui ressemble.
            </p>
          </div>
        </section>

        {/* 3 value columns */}
        <section className="border-t border-neutral-100 pt-16">
          <h2
            className="text-3xl font-bold text-black mb-10 text-center"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Nos valeurs
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Qualité Exceptionnelle',
                desc: "Chaque article est sélectionné selon des critères rigoureux de matière, de finition et de durabilité. Nous ne compromettrons jamais sur l'excellence.",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Design Affirmé',
                desc: "Nos collections épousent les tendances contemporaines tout en misant sur des formes qui durent. Des pièces au caractère fort, choisies pour leur style.",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Service Personnalisé',
                desc: 'De la sélection à la livraison, chaque interaction est pensée pour vous. Notre équipe est disponible pour vous guider avec attention.',
              },
            ].map((val, i) => (
              <div
                key={i}
                className="group border border-neutral-200 p-7 hover:border-black hover:shadow-lg transition-all"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <div className="w-12 h-12 bg-neutral-100 group-hover:bg-black rounded-full flex items-center justify-center mb-5 transition-colors">
                  <span className="text-black group-hover:text-white transition-colors">{val.icon}</span>
                </div>
                <h3
                  className="font-bold text-black text-lg mb-3"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {val.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Engagements */}
        <section className="border-t border-neutral-100 pt-16 bg-neutral-50 -mx-6 px-6 py-14">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold text-black mb-10"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Nos engagements
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Leaf className="w-4 h-4" />,
                  title: 'Sélection responsable',
                  desc: 'Nous privilégions des pièces pensées pour durer, à contre-courant du mobilier jetable, pour éviter le gaspillage.',
                },
                {
                  icon: <Star className="w-4 h-4" />,
                  title: 'Transparence',
                  desc: "Tarifs clairs, informations produit détaillées, conditions de retour explicites — aucune mauvaise surprise.",
                },
                {
                  icon: <Heart className="w-4 h-4" />,
                  title: 'Satisfaction garantie',
                  desc: 'Politique de retour 30 jours sans condition, service client réactif, remboursement rapide.',
                },
                {
                  icon: <Award className="w-4 h-4" />,
                  title: 'Pièces qui durent',
                  desc: 'Nous privilégions des designs intemporels plutôt que des tendances éphémères, pour un intérieur qui évolue avec vous.',
                },
              ].map((eng, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white border border-neutral-200 p-5"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
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

        {/* CTA */}
        <section className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-neutral-500 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Vous souhaitez en savoir plus ou collaborer avec nous ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-black text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
          >
            Nous écrire
          </Link>
        </section>

      </div>
    </main>
  );
}
