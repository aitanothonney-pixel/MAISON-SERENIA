export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h1 className="text-4xl font-serif font-bold mb-8">Politique de Confidentialité</h1>

        <div className="space-y-8 text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">1. Collecte de données</h2>
            <p>
              MAISON SERENIA collecte les données personnelles suivantes lorsque vous :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>Créez un compte sur le site</li>
              <li>Effectuez un achat</li>
              <li>Vous inscrivez à notre newsletter</li>
              <li>Nous contactez via le formulaire de contact</li>
              <li>Naviguez sur le site (données de navigation)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">2. Données collectées</h2>
            <p>
              Les données collectées comprennent : nom, adresse email, numéro de téléphone, adresse de livraison,
              données de paiement, données de navigation, adresse IP, cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">3. Utilisation des données</h2>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>Traiter vos commandes et livraisons</li>
              <li>Assurer la sécurité des transactions</li>
              <li>Améliorer l&apos;expérience utilisateur</li>
              <li>Envoyer des newsletters (si consentement donné)</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles sont partagées uniquement avec :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>Les prestataires de livraison (pour l&apos;expédition)</li>
              <li>Les processeurs de paiement (pour les transactions sécurisées)</li>
              <li>Les autorités légales (si légalement requis)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Sécurité des données</h2>
            <p>
              Vos données sont protégées par un chiffrement SSL 256-bit et stockées sur des serveurs sécurisés.
              Nous mettons en œuvre des mesures techniques et organisationnelles pour prévenir tout accès non autorisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. Cookies</h2>
            <p>
              Le site utilise des cookies pour améliorer votre expérience. Vous pouvez refuser les cookies
              via les paramètres de votre navigateur. Certains cookies sont essentiels au fonctionnement du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Droits RGPD</h2>
            <p>
              Conformément au RGPD, vous disposez du droit d&apos;accès, de rectification, de suppression,
              de limitation et de portabilité de vos données. Pour exercer ces droits, contactez-nous à
              <strong> maisonserenia@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">8. Durée de conservation</h2>
            <p>
              Les données sont conservées pour la durée nécessaire à l&apos;exécution du contrat et au respect
              des obligations légales. Les données de newsletter sont conservées jusqu&apos;à votre désinscription.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">9. Newsletter</h2>
            <p>
              L&apos;inscription à la newsletter est optionnelle et basée sur le consentement. Vous pouvez vous
              désinscrire à tout moment en cliquant sur le lien de désinscription dans chaque email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">10. Contact</h2>
            <p>
              Pour toute question concernant vos données personnelles, contactez-nous à
              <strong> maisonserenia@gmail.com</strong> ou via le formulaire de contact du site.
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
