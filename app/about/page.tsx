import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero section */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-serif font-bold mb-6">
              À propos de MAISON SERENIA
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              L&apos;art de vivre à la française rencontré avec la praticité moderne.
              Une sélection curatée de meubles et décoration pour transformer votre intérieur.
            </p>
          </div>

          {/* Histoire */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Notre histoire</h2>
            <div className="space-y-6 text-neutral-700 leading-relaxed">
              <p>
                MAISON SERENIA est née en 2024 de la passion de créer des espaces de vie
                authentiques et accessibles. Nous croyons que chacun mérite un intérieur
                qui lui ressemble, sans compromettre sur la qualité.
              </p>
              <p>
                Notre mission : démocratiser l&apos;accès à des meubles design et durables
                en éliminant les intermédiaires. Directement des meilleurs fabricants à votre maison.
              </p>
            </div>
          </section>

          {/* Valeurs */}
          <section className="mb-16 bg-neutral-50 p-8 rounded-none">
            <h2 className="text-3xl font-serif font-bold mb-8">Nos valeurs</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Qualité sans compromis',
                  description: 'Chaque produit est sélectionné pour sa durabilité et son design.',
                },
                {
                  title: 'Transparence totale',
                  description: 'Prix justes, délais honnêtes, pas de frais cachés.',
                },
                {
                  title: 'Service client réactif',
                  description: 'Disponible 6j/7 pour répondre à vos questions en moins de 4 heures.',
                },
                {
                  title: 'Engagement durable',
                  description: 'Sélection responsable avec emballage écologique autant que possible.',
                },
              ].map((value, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-black shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-black mb-1">{value.title}</h3>
                    <p className="text-neutral-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chiffres */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8">En chiffres</h2>
            <div className="grid grid-cols-3 gap-8">
              {[
                { number: '5000+', label: 'Clients satisfaits' },
                { number: '500+', label: 'Produits disponibles' },
                { number: '99%', label: 'Taux de satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-serif font-bold text-black mb-2">{stat.number}</p>
                  <p className="text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Équipe */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8">Notre équipe</h2>
            <p className="text-neutral-700 leading-relaxed mb-8">
              Une équipe passionnée par le design, la décoration et le service client.
              Chaque membre apporte son expertise pour vous offrir la meilleure expérience possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Fondateur & CEO', role: 'Vision & Stratégie' },
                { name: 'Responsable Produits', role: 'Curation & Qualité' },
                { name: 'Responsable Service Client', role: 'SAV & Satisfaction' },
              ].map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-neutral-200 rounded-none" />
                  <h3 className="font-semibold text-black mb-1">{member.name}</h3>
                  <p className="text-xs text-neutral-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Vous avez des questions ?</h2>
            <p className="text-neutral-600 mb-6">Nous sommes ici pour vous aider.</p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-none hover:bg-neutral-900 transition-colors"
            >
              Nous contacter
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
