import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoCarte, InfoConsultez, InfoDerniereMaj, InfoEntete, InfoSection } from '@/components/ui/info-kit';

export const metadata: Metadata = {
  alternates: { canonical: 'https://maison-serenia.com/cgv' },
  title: 'Conditions Générales de Vente | MAISON SERENIA',
  description: "Conditions générales de vente applicables aux commandes passées sur MAISON SERENIA.",
};

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-[#F6F2EB] text-[#221607]">
      <InfoEntete kicker="Légal" titre="Conditions Générales de Vente" intro="Les présentes conditions régissent les ventes conclues sur le site maison-serenia.com." />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <InfoCarte>
            <div className="space-y-16">
              <InfoSection titre="1. Objet">
                <p>
                  Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations des parties
                  dans le cadre de la vente en ligne des produits proposés par MAISON SERENIA. Toute commande implique
                  l&apos;acceptation pleine et entière des présentes CGV.
                </p>
              </InfoSection>

              <InfoSection titre="2. Produits">
                <p>
                  Les produits proposés sont décrits et présentés avec la plus grande exactitude possible. De légères
                  variations de teinte ou d&apos;aspect peuvent survenir, notamment selon les réglages de votre écran,
                  sans que la responsabilité de MAISON SERENIA puisse être engagée.
                </p>
              </InfoSection>

              <InfoSection titre="3. Prix">
                <p>
                  Les prix sont indiqués en euros (€) ou en francs suisses (CHF), toutes taxes comprises le cas
                  échéant. MAISON SERENIA se réserve le droit de modifier ses prix à tout moment ; les produits sont
                  facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
                </p>
              </InfoSection>

              <InfoSection titre="4. Commande">
                <p>
                  La commande est validée après confirmation du paiement. Un e-mail de confirmation récapitulant la
                  commande vous est adressé. MAISON SERENIA se réserve le droit d&apos;annuler ou de refuser toute
                  commande en cas de litige, de non-paiement ou de motif légitime.
                </p>
              </InfoSection>

              <InfoSection titre="5. Paiement">
                <p>
                  Le paiement s&apos;effectue en ligne de manière sécurisée via notre prestataire <strong>Stripe</strong>.
                  Les moyens de paiement acceptés sont indiqués lors de la commande. La commande est traitée après
                  confirmation du paiement.
                </p>
              </InfoSection>

              <InfoSection titre="6. Livraison">
                <p>
                  Les modalités, délais et frais de livraison sont détaillés sur notre page{' '}
                  <Link href="/livraison">
                    Livraison &amp; Délais
                  </Link>
                  . Les délais sont donnés à titre indicatif ; un retard de livraison ne peut donner lieu à
                  l&apos;annulation de la commande ni au versement de dommages et intérêts.
                </p>
              </InfoSection>

              <InfoSection titre="7. Droit de rétractation et retours">
                <p>
                  Conformément à la réglementation applicable, vous disposez d&apos;un délai de <strong>30 jours</strong>{' '}
                  pour retourner un article. Les modalités sont précisées sur notre page{' '}
                  <Link href="/retours">
                    Retours &amp; Remboursements
                  </Link>
                  . Le produit doit être retourné dans son état et son emballage d&apos;origine.
                </p>
              </InfoSection>

              <InfoSection titre="8. Garanties">
                <p>
                  Les produits bénéficient des garanties légales de conformité et contre les vices cachés. En cas de
                  produit défectueux ou non conforme, contactez notre service client pour obtenir un échange ou un
                  remboursement.
                </p>
              </InfoSection>

              <InfoSection titre="9. Responsabilité">
                <p>
                  MAISON SERENIA ne saurait être tenue responsable des dommages résultant d&apos;une mauvaise
                  utilisation des produits ou d&apos;un cas de force majeure.
                </p>
              </InfoSection>

              <InfoSection titre="10. Droit applicable et litiges">
                <p>
                  Les présentes CGV sont soumises au droit applicable au lieu d&apos;établissement de l&apos;éditeur.
                  En cas de litige, une solution amiable sera recherchée en priorité avant toute action judiciaire.
                  Pour toute réclamation, contactez-nous via notre{' '}
                  <Link href="/contact">
                    page contact
                  </Link>
                  .
                </p>
              </InfoSection>
            </div>

            <InfoDerniereMaj texte="Dernière mise à jour : 7 août 2026" />
          </InfoCarte>
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <InfoConsultez />
        </aside>
      </div>
    </main>
  );
}
