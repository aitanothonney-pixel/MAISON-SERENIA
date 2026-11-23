import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoCarte, InfoConsultez, InfoDerniereMaj, InfoEntete, InfoSection } from '@/components/ui/info-kit';

export const metadata: Metadata = {
  alternates: { canonical: 'https://maison-serenia.com/confidentialite' },
  title: 'Politique de confidentialité | MAISON SERENIA',
  description: "Comment MAISON SERENIA collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <InfoEntete kicker="Légal" titre="Politique de confidentialité" intro="Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée." />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <InfoCarte>
            <div className="space-y-16">
              <InfoSection titre="1. Données que nous collectons">
                <p>Dans le cadre de votre navigation et de vos commandes, nous pouvons collecter :</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-[#A68A6D]">
                  <li>Vos informations d&apos;identité et de contact (nom, prénom, e-mail, adresse) ;</li>
                  <li>Vos informations de livraison et de facturation ;</li>
                  <li>L&apos;historique de vos commandes et de vos échanges avec notre service client ;</li>
                  <li>Des données techniques (cookies, adresse IP, type de navigateur) à des fins de bon fonctionnement du site.</li>
                </ul>
                <p className="mt-3">
                  Les paiements sont traités de manière sécurisée par notre prestataire <strong>Stripe</strong> ;
                  nous n&apos;avons jamais accès aux données complètes de votre carte bancaire.
                </p>
              </InfoSection>

              <InfoSection titre="2. Utilisation de vos données">
                <p>Vos données sont utilisées pour :</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-[#A68A6D]">
                  <li>traiter et livrer vos commandes ;</li>
                  <li>vous informer du suivi de votre commande ;</li>
                  <li>répondre à vos demandes auprès du service client ;</li>
                  <li>vous envoyer, avec votre consentement, nos actualités et offres ;</li>
                  <li>améliorer notre site et prévenir la fraude.</li>
                </ul>
              </InfoSection>

              <InfoSection titre="3. Partage des données">
                <p>
                  Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec les prestataires
                  nécessaires à l&apos;exécution de votre commande (transporteurs, prestataire de paiement Stripe,
                  hébergeur) et dans le strict cadre de leur mission.
                </p>
              </InfoSection>

              <InfoSection titre="4. Durée de conservation">
                <p>
                  Vos données sont conservées pendant la durée nécessaire aux finalités décrites ci-dessus, puis
                  archivées ou supprimées conformément aux obligations légales applicables.
                </p>
              </InfoSection>

              <InfoSection titre="5. Vos droits">
                <p>
                  Conformément à la réglementation applicable (notamment le RGPD), vous disposez d&apos;un droit
                  d&apos;accès, de rectification, de suppression, de limitation et d&apos;opposition au traitement de
                  vos données, ainsi que d&apos;un droit à la portabilité. Vous pouvez exercer ces droits à tout
                  moment via notre{' '}
                  <Link href="/contact">
                    page contact
                  </Link>
                  .
                </p>
              </InfoSection>

              <InfoSection titre="6. Cookies">
                <p>
                  Notre site utilise des cookies pour assurer son bon fonctionnement, mémoriser votre panier et
                  mesurer son audience. Vous pouvez accepter ou refuser les cookies non essentiels via la bannière
                  affichée lors de votre première visite.
                </p>
              </InfoSection>

              <InfoSection titre="7. Contact">
                <p>
                  Pour toute question relative à vos données personnelles, écrivez-nous à{' '}
                  <strong>maisonserenia@gmail.com</strong> ou via notre{' '}
                  <Link href="/contact">
                    page contact
                  </Link>
                  .
                </p>
              </InfoSection>
            </div>

            <InfoDerniereMaj texte="Dernière mise à jour : 24 juillet 2026" />
          </InfoCarte>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <InfoConsultez />
        </aside>
      </div>
    </main>
  );
}
