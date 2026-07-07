import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Package, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Livraison & Délais | MAISON SERENIA',
  description: 'Informations sur nos modes de livraison, délais et suivi de commande.',
};

export default function LivraisonPage() {
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
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Livraison & Délais
            </h1>
          </div>
          <p
            className="text-neutral-500 text-lg max-w-xl"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            Nous expédions chaque commande avec le plus grand soin, pour que vos pièces arrivent en parfait état.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Suivi */}
        <section>
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Package className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2
                className="text-3xl font-bold text-black mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Suivi de commande
              </h2>
              <p className="text-neutral-600 mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Dès l'expédition de votre colis, vous recevrez un e-mail contenant votre numéro de suivi. Vous pouvez à tout moment suivre l'acheminement de votre commande directement sur le site du transporteur.
              </p>
              <ul className="space-y-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {[
                  'Confirmation de commande immédiate par e-mail',
                  "Notification d'expédition avec numéro de suivi",
                  'Livraison avec signature pour les articles premium',
                  'Support disponible 7j/7 en cas de problème',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-700">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Mobilier */}
        <section className="border-t border-neutral-100 pt-16">
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2
                className="text-3xl font-bold text-black mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Livraison mobilier
              </h2>
              <p className="text-neutral-600 mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Les pièces de mobilier (canapés, tables, armoires…) sont acheminées par un transporteur spécialisé équipé pour manipuler des articles volumineux et fragiles.
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: <Truck className="w-4 h-4" />,
                    title: 'Livraison en pièce',
                    desc: "Le transporteur monte les articles jusqu'à la pièce de votre choix et procède à l'installation si vous le souhaitez.",
                  },
                  {
                    icon: <Package className="w-4 h-4" />,
                    title: 'Emballage renforcé',
                    desc: 'Chaque meuble est protégé par un double emballage sur mesure pour garantir un arrivage impeccable.',
                  },
                  {
                    icon: <MapPin className="w-4 h-4" />,
                    title: 'Zone de livraison',
                    desc: 'France métropolitaine uniquement pour le mobilier. Délai : 7 à 21 jours ouvrés selon disponibilité.',
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 rounded-lg p-5 hover:border-black transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                        {card.icon}
                      </div>
                      <p className="font-semibold text-black text-sm">{card.title}</p>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-neutral-100 pt-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-neutral-500 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Une question sur votre livraison ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-black text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
          >
            Nous contacter
          </Link>
        </section>

      </div>
    </main>
  );
}
