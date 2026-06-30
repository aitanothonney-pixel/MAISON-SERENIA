export default function CGVPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h1 className="text-4xl font-serif font-bold mb-8">Conditions Générales de Vente</h1>

        <div className="space-y-8 text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente régissent l&apos;utilisation du site MAISON SERENIA
              et la vente de meubles et de décoration maison par voie électronique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">2. Produits et prix</h2>
            <p>
              Les produits offerts à la vente sont ceux figurant sur le site. Les prix sont exprimés en euros
              TTC (toutes taxes comprises) et sont susceptibles de modification sans préavis. Les prix affichés
              sont valables jusqu&apos;à la finalisation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">3. Commande et acceptation</h2>
            <p>
              Toute commande passée sur le site constitue une offre d&apos;achat de la part du client. MAISON SERENIA
              se réserve le droit d&apos;accepter ou de refuser toute commande. La commande est considérée comme
              acceptée dès la confirmation écrite envoyée au client par email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Délais de livraison</h2>
            <p>
              Les délais de livraison sont estimés à titre informatif et ne constituent pas une obligation.
              En général, les commandes sont expédiées sous 24 heures et livrées dans un délai de 8 à 15 jours
              ouvrés pour l&apos;Europe. Des délais supplémentaires peuvent s&apos;appliquer selon les congés
              et la destination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Paiement</h2>
            <p>
              Les paiements sont acceptés par carte bancaire (Visa, Mastercard), PayPal, TWINT, Apple Pay et
              Google Pay. Les données de paiement sont sécurisées par chiffrement SSL 256-bit. Le client n&apos;est
              débité que lors de la confirmation de sa commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. Droit de rétractation (Retours)</h2>
            <p>
              Le client dispose d&apos;un délai de 30 jours à compter de la réception du produit pour exercer
              son droit de rétractation sans justification. Le produit doit être retourné dans son état original,
              non endommagé et avec tous ses accessoires.
            </p>
            <p className="mt-4">
              Les frais de retour sont à la charge du client, sauf en cas de défaut de fabrication ou d&apos;erreur
              de livraison. Un remboursement sera effectué dans les 14 jours suivant la réception de l&apos;article retourné.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Responsabilité</h2>
            <p>
              MAISON SERENIA ne peut être tenu responsable des dommages indirects, des pertes de données ou des
              manques à gagner résultant de l&apos;utilisation du site ou des produits. La responsabilité est
              limitée au montant de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">8. Propriété intellectuelle</h2>
            <p>
              Tous les éléments du site (textes, images, logos, etc.) sont protégés par les droits d&apos;auteur
              et la propriété intellectuelle. Leur reproduction est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">9. Droit applicable</h2>
            <p>
              Les présentes Conditions Générales de Vente sont régies par la loi suisse et les lois européennes
              applicables. Toute contestation sera soumise aux juridictions compétentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">10. Contact</h2>
            <p>
              Pour toute question concernant les Conditions Générales de Vente, veuillez nous contacter à
              <strong> contact@maisonserenia.ch</strong> ou via le formulaire de contact sur le site.
            </p>
          </section>

          <div className="text-xs text-neutral-500 pt-8 border-t">
            <p>Dernière mise à jour : 30 juin 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
