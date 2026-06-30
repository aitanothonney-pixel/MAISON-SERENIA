export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h1 className="text-4xl font-serif font-bold mb-8">Mentions Légales</h1>

        <div className="space-y-8 text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">1. Éditeur du site</h2>
            <div className="bg-neutral-50 p-6 rounded-none space-y-2">
              <p><strong>Raison sociale :</strong> MAISON SERENIA SARL</p>
              <p><strong>Forme juridique :</strong> SARL</p>
              <p><strong>Adresse :</strong> [Adresse complète]</p>
              <p><strong>Email :</strong> contact@maisonserenia.ch</p>
              <p><strong>Numéro TVA :</strong> CHE xxx.xxx.xxx</p>
              <p><strong>Capital social :</strong> [Montant]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">2. Directeur de publication</h2>
            <p>
              Le directeur de la publication est [Nom et prénom], en sa qualité de responsable du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">3. Hébergeur du site</h2>
            <div className="bg-neutral-50 p-6 rounded-none space-y-2">
              <p><strong>Nom :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave, Walnut, CA 91789, États-Unis</p>
              <p><strong>Site web :</strong> www.vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus du site (textes, images, vidéos, logos, marques) sont protégés
              par les droits d&apos;auteur, les droits de marque et la propriété intellectuelle. Toute reproduction,
              adaptation ou diffusion sans consentement préalable écrit est interdite et peut donner lieu à des poursuites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Responsabilité</h2>
            <p>
              MAISON SERENIA fait tous les efforts raisonnables pour maintenir l&apos;exactitude et la disponibilité
              des informations sur le site. Cependant, nous ne garantissons pas que les informations sont sans erreurs,
              exactes ou à jour. Nous ne sommes pas responsables des dommages directs ou indirects résultant de l&apos;utilisation
              du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. Accès au site</h2>
            <p>
              L&apos;accès au site est gratuit et libre. Cependant, MAISON SERENIA se réserve le droit de refuser
              l&apos;accès à tout utilisateur ne respectant pas les présentes conditions, sans obligation de préavis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Limitations de responsabilité</h2>
            <p>
              MAISON SERENIA ne peut être tenu responsable :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li>De toute interruption ou dysfonctionnement du site</li>
              <li>De toute perte de données ou dommages au système de l&apos;utilisateur</li>
              <li>De l&apos;accès ou l&apos;utilisation de contenus externes liés depuis le site</li>
              <li>De toute action ou inaction suite à une erreur d&apos;affichage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">8. Liens externes</h2>
            <p>
              Le site peut contenir des liens vers des sites externes. MAISON SERENIA n&apos;est pas responsable
              du contenu, de l&apos;exactitude ou des pratiques de ces sites tiers. La inclusion d&apos;un lien ne
              constitue pas une approbation ou un parrainage du site lié.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">9. Données personnelles</h2>
            <p>
              Le traitement des données personnelles est conforme à la Politique de Confidentialité et au Règlement
              Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">10. Droit applicable et juridiction</h2>
            <p>
              Les présentes Mentions Légales sont régies par le droit suisse. Tout différend relatif à l&apos;utilisation
              du site sera soumis aux juridictions compétentes de Suisse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">11. Modification des conditions</h2>
            <p>
              MAISON SERENIA se réserve le droit de modifier les présentes Mentions Légales à tout moment.
              Les modifications entrent en vigueur dès leur publication sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">12. Contact</h2>
            <p>
              Pour toute question, réclamation ou demande concernant ces Mentions Légales, veuillez nous contacter à
              <strong> contact@maisonserenia.ch</strong>.
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
