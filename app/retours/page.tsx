export default function RetoursPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h1 className="text-4xl font-serif font-bold mb-8">Politique de Retours</h1>

        <div className="space-y-8 text-neutral-700 leading-relaxed">
          <section className="bg-neutral-50 border-l-4 border-black p-6">
            <h2 className="text-lg font-semibold text-black mb-2">✓ Satisfait ou remboursé 30 jours</h2>
            <p>
              Vous disposez de 30 jours à compter de la réception de votre commande pour retourner un article
              sans justification et obtenir un remboursement complet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">1. Conditions de retour</h2>
            <p>
              Pour que votre retour soit accepté, le produit doit :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>Être dans son état original, non endommagé par votre utilisation</li>
              <li>Inclure tous les accessoires, emballages et documentation</li>
              <li>Accompagné du numéro de commande</li>
              <li>Être retourné dans les 30 jours suivant la réception</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">2. Procédure de retour</h2>
            <p>
              Pour retourner un article :
            </p>
            <ol className="list-decimal list-inside mt-3 space-y-3 ml-2">
              <li><strong>Contactez-nous</strong> à <span className="font-mono text-sm">returns@maisonserenia.ch</span> avec votre numéro de commande</li>
              <li><strong>Attendez la confirmation</strong> avec les instructions d&apos;expédition</li>
              <li><strong>Emballez l&apos;article</strong> soigneusement avec tous les accessoires</li>
              <li><strong>Livrez le colis</strong> à l&apos;adresse indiquée (sans assurance requise)</li>
              <li><strong>Recevez votre remboursement</strong> dans les 14 jours après réception</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">3. Frais de retour</h2>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Retour gratuit si :</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Défaut de fabrication ou vice caché</li>
                  <li>Erreur de notre part (mauvais produit)</li>
                  <li>Produit endommagé à la livraison</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">Frais à votre charge si :</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Changement d&apos;avis (frais de retour réduits : 5-10€)</li>
                  <li>Retour pour utilisation ou non-conformité au-delà de 30 jours</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Remboursement</h2>
            <p>
              Le remboursement est crédité sur votre compte initial (carte bancaire, PayPal, etc.) dans les 14 jours
              suivant la réception et la vérification de l&apos;article retourné. Il peut falloir quelques jours supplémentaires
              pour que le montant soit visible sur votre compte, selon votre banque.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Exceptions aux retours</h2>
            <p>
              Les articles suivants ne peuvent pas être retournés ou remboursés :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>Articles endommagés par une utilisation abusive</li>
              <li>Articles retournés après 30 jours</li>
              <li>Articles sans accessoires ou emballage d&apos;origine</li>
              <li>Articles achetés en soldes ou en promotion (selon mention spécifique)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. Échanges</h2>
            <p>
              Vous souhaitez un échange plutôt qu&apos;un remboursement ? Pas de problème ! Une fois votre retour
              reçu et accepté, nous vous enverrons gratuitement le produit de remplacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Défauts et réclamations</h2>
            <p>
              Si vous recevez un produit défectueux ou endommagé, veuillez nous le signaler dans les 48 heures
              suivant la réception avec des photos. Nous vous proposerons un remboursement ou un remplacement gratuit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">8. Contact pour les retours</h2>
            <div className="bg-neutral-50 p-6 rounded-none">
              <p className="mb-3"><strong>Email :</strong> <span className="font-mono">returns@maisonserenia.ch</span></p>
              <p className="mb-3"><strong>Téléphone :</strong> +41 xx xxx xx xx (lun-ven 9h-17h CET)</p>
              <p><strong>Formulaire :</strong> Utilisez le formulaire de contact sur notre site</p>
            </div>
          </section>

          <div className="text-xs text-neutral-500 pt-8 border-t">
            <p>Dernière mise à jour : 30 juin 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
