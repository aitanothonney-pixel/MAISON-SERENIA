import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions légales | MAISON SERENIA',
  description: "Mentions légales du site MAISON SERENIA : éditeur, hébergeur et informations réglementaires.",
};

export default function MentionsLegalesPage() {
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
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Mentions légales
            </h1>
          </div>
          <p className="text-neutral-500 text-lg max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Informations légales relatives à l&apos;éditeur et à l&apos;hébergement du site.
          </p>
        </div>
      </section>

      <div
        className="max-w-4xl mx-auto px-6 py-16 space-y-12 text-neutral-700 leading-relaxed"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        <Section title="Hébergement">
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1">
            <li>Vercel Inc.</li>
            <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
            <li>vercel.com</li>
          </ul>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus présents sur le site (textes, images, logos, éléments graphiques,
            mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction,
            représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
          </p>
        </Section>

        <Section title="Responsabilité">
          <p>
            L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site,
            sans toutefois garantir qu&apos;elles soient exemptes d&apos;erreurs. Les informations sont fournies
            à titre indicatif et sont susceptibles d&apos;évoluer. L&apos;éditeur ne saurait être tenu responsable
            de l&apos;utilisation faite de ces informations.
          </p>
        </Section>

        <Section title="Données personnelles">
          <p>
            Le traitement des données personnelles est décrit dans notre{' '}
            <Link href="/confidentialite" className="text-black underline hover:no-underline">
              Politique de confidentialité
            </Link>
            . Conformément à la réglementation applicable, vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression de vos données.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Pour toute question relative au site, vous pouvez nous écrire via notre{' '}
            <Link href="/contact" className="text-black underline hover:no-underline">
              page contact
            </Link>
            .
          </p>
        </Section>

        <p className="text-xs text-neutral-400 pt-8 border-t border-neutral-100">
          Dernière mise à jour : [À COMPLÉTER — date]
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
