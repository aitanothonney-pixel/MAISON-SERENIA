import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoDerniereMaj, InfoEntete, InfoSection } from '@/components/ui/info-kit';

export const metadata: Metadata = {
  alternates: { canonical: 'https://maison-serenia.com/mentions-legales' },
  title: 'Mentions légales | MAISON SERENIA',
  description: "Mentions légales du site MAISON SERENIA : éditeur, hébergeur et informations réglementaires.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <InfoEntete titre="Mentions légales" intro="Informations légales relatives à l'éditeur et à l'hébergement du site." />

      <div className="mx-auto max-w-5xl px-6 pb-32">
        <InfoSection titre="Éditeur du site">
          <p>Le site <strong>maison-serenia.com</strong> est édité par :</p>
          <ul className="mt-3 space-y-1">
            <li>Responsable de la publication : <strong>Louis Loffet</strong></li>
            <li>Statut : <strong>Particulier</strong></li>
            <li>Adresse : <strong>Rue de la Synagogue 35, 1204 Genève, Suisse</strong></li>
            <li>Numéro d&apos;immatriculation : <strong>—</strong></li>
            <li>E-mail : <strong>maisonserenia@gmail.com</strong></li>
          </ul>
        </InfoSection>

        <InfoSection titre="Hébergement">
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1">
            <li>Vercel Inc.</li>
            <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
            <li>vercel.com</li>
          </ul>
        </InfoSection>

        <InfoSection titre="Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus présents sur le site (textes, images, logos, éléments graphiques,
            mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction,
            représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
          </p>
        </InfoSection>

        <InfoSection titre="Responsabilité">
          <p>
            L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site,
            sans toutefois garantir qu&apos;elles soient exemptes d&apos;erreurs. Les informations sont fournies
            à titre indicatif et sont susceptibles d&apos;évoluer. L&apos;éditeur ne saurait être tenu responsable
            de l&apos;utilisation faite de ces informations.
          </p>
        </InfoSection>

        <InfoSection titre="Données personnelles">
          <p>
            Le traitement des données personnelles est décrit dans notre{' '}
            <Link href="/confidentialite">
              Politique de confidentialité
            </Link>
            . Conformément à la réglementation applicable, vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression de vos données.
          </p>
        </InfoSection>

        <InfoSection titre="Contact">
          <p>
            Pour toute question relative au site, vous pouvez nous écrire via notre{' '}
            <Link href="/contact">
              page contact
            </Link>
            .
          </p>
        </InfoSection>

        <InfoDerniereMaj texte="Dernière mise à jour : 24 juillet 2026" />
      </div>
    </main>
  );
}
