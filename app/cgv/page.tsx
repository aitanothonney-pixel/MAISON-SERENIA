import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | MAISON SERENIA',
  description: "Conditions générales de vente applicables aux commandes passées sur MAISON SERENIA.",
};

export default function CGVPage() {
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
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-black"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Conditions Générales de Vente
            </h1>
          </div>
          <p className="text-neutral-500 text-lg max-w-xl" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Les présentes conditions régissent les ventes conclues sur le site maison-serenia.com.
          </p>
        </div>
      </section>

      <div
        className="max-w-4xl mx-auto px-6 py-16 space-y-12 text-neutral-700 leading-relaxed"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        <Section title="1. Objet">
          <p>
            Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations des parties
            dans le cadre de la vente en ligne des produits proposés par MAISON SERENIA. Toute commande implique
            l&apos;acceptation pleine et entière des présentes CGV.
          </p>
        </Section>

        <Section title="2. Produits">
          <p>
            Les produits proposés sont décrits et présentés avec la plus grande exactitude possible. De légères
            variations de teinte ou d&apos;aspect peuvent survenir, notamment selon les réglages de votre écran,
            sans que la responsabilité de MAISON SERENIA puisse être engagée.
          </p>
        </Section>

        <Section title="3. Prix">
          <p>
            Les prix sont indiqués en euros (€) ou en francs suisses (CHF), toutes taxes comprises le cas
            échéant. MAISON SERENIA se réserve le droit de modifier ses prix à tout moment ; les produits sont
            facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>
        </Section>

        <Section title="4. Commande">
          <p>
            La commande est validée après confirmation du paiement. Un e-mail de confirmation récapitulant la
            commande vous est adressé. MAISON SERENIA se réserve le droit d&apos;annuler ou de refuser toute
            commande en cas de litige, de non-paiement ou de motif légitime.
          </p>
        </Section>

        <Section title="5. Paiement">
          <p>
            Le paiement s&apos;effectue en ligne de manière sécurisée via notre prestataire <strong>Stripe</strong>.
            Les moyens de paiement acceptés sont indiqués lors de la commande. La commande est traitée après
            confirmation du paiement.
          </p>
        </Section>

        <Section title="6. Livraison">
          <p>
            Les modalités, délais et frais de livraison sont détaillés sur notre page{' '}
            <Link href="/livraison" className="text-black underline hover:no-underline">
              Livraison &amp; Délais
            </Link>
            . Les délais sont donnés à titre indicatif ; un retard de livraison ne peut donner lieu à
            l&apos;annulation de la commande ni au versement de dommages et intérêts.
          </p>
        </Section>

        <Section title="7. Droit de rétractation et retours">
          <p>
            Conformément à la réglementation applicable, vous disposez d&apos;un délai de <strong>30 jours</strong>{' '}
            pour retourner un article. Les modalités sont précisées sur notre page{' '}
            <Link href="/retours" className="text-black underline hover:no-underline">
              Retours &amp; Remboursements
            </Link>
            . Le produit doit être retourné dans son état et son emballage d&apos;origine.
          </p>
        </Section>

        <Section title="8. Garanties">
          <p>
            Les produits bénéficient des garanties légales de conformité et contre les vices cachés. En cas de
            produit défectueux ou non conforme, contactez notre service client pour obtenir un échange ou un
            remboursement.
          </p>
        </Section>

        <Section title="9. Responsabilité">
          <p>
            MAISON SERENIA ne saurait être tenue responsable des dommages résultant d&apos;une mauvaise
            utilisation des produits ou d&apos;un cas de force majeure.
          </p>
        </Section>

        <Section title="10. Droit applicable et litiges">
          <p>
            Les présentes CGV sont soumises au droit applicable au lieu d&apos;établissement de l&apos;éditeur.
            En cas de litige, une solution amiable sera recherchée en priorité avant toute action judiciaire.
            Pour toute réclamation, contactez-nous via notre{' '}
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
