import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | MAISON SERENIA',
  description: "Comment MAISON SERENIA collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Politique de confidentialité
            </h1>
          </div>
          <p className="text-neutral-500 text-lg max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
          </p>
        </div>
      </section>

      <div
        className="max-w-4xl mx-auto px-6 py-16 space-y-12 text-neutral-700 leading-relaxed"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        <Section title="1. Données que nous collectons">
          <p>Dans le cadre de votre navigation et de vos commandes, nous pouvons collecter :</p>
          <ul className="mt-3 space-y-1 list-disc pl-5">
            <li>Vos informations d&apos;identité et de contact (nom, prénom, e-mail, adresse) ;</li>
            <li>Vos informations de livraison et de facturation ;</li>
            <li>L&apos;historique de vos commandes et de vos échanges avec notre service client ;</li>
            <li>Des données techniques (cookies, adresse IP, type de navigateur) à des fins de bon fonctionnement du site.</li>
          </ul>
          <p className="mt-3">
            Les paiements sont traités de manière sécurisée par notre prestataire <strong>Stripe</strong> ;
            nous n&apos;avons jamais accès aux données complètes de votre carte bancaire.
          </p>
        </Section>

        <Section title="2. Utilisation de vos données">
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-3 space-y-1 list-disc pl-5">
            <li>traiter et livrer vos commandes ;</li>
            <li>vous informer du suivi de votre commande ;</li>
            <li>répondre à vos demandes auprès du service client ;</li>
            <li>vous envoyer, avec votre consentement, nos actualités et offres ;</li>
            <li>améliorer notre site et prévenir la fraude.</li>
          </ul>
        </Section>

        <Section title="3. Partage des données">
          <p>
            Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec les prestataires
            nécessaires à l&apos;exécution de votre commande (transporteurs, prestataire de paiement Stripe,
            hébergeur) et dans le strict cadre de leur mission.
          </p>
        </Section>

        <Section title="4. Durée de conservation">
          <p>
            Vos données sont conservées pendant la durée nécessaire aux finalités décrites ci-dessus, puis
            archivées ou supprimées conformément aux obligations légales applicables.
          </p>
        </Section>

        <Section title="5. Vos droits">
          <p>
            Conformément à la réglementation applicable (notamment le RGPD), vous disposez d&apos;un droit
            d&apos;accès, de rectification, de suppression, de limitation et d&apos;opposition au traitement de
            vos données, ainsi que d&apos;un droit à la portabilité. Vous pouvez exercer ces droits à tout
            moment via notre{' '}
            <Link href="/contact" className="text-black underline hover:no-underline">
              page contact
            </Link>
            .
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Notre site utilise des cookies pour assurer son bon fonctionnement, mémoriser votre panier et
            mesurer son audience. Vous pouvez accepter ou refuser les cookies non essentiels via la bannière
            affichée lors de votre première visite.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Pour toute question relative à vos données personnelles, écrivez-nous à{' '}
            <strong>maisonserenia@gmail.com</strong> ou via notre{' '}
            <Link href="/contact" className="text-black underline hover:no-underline">
              page contact
            </Link>
            .
          </p>
        </Section>

        <p className="text-xs text-neutral-400 pt-8 border-t border-neutral-100">
          Dernière mise à jour : 24 juillet 2026
        </p>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-2xl font-bold text-black mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
