import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aperçus · Notre histoire',
  robots: { index: false, follow: false },
};

const VERSIONS = [
  { slug: 'a', nom: 'A · Éditorial', description: 'Hero noir, texte en colonnes, citation sur fond beige, grilles à filets dorés.' },
  { slug: 'b', nom: 'B · Lumière', description: 'Fond beige, grands titres centrés, photo pleine largeur, valeurs en liste numérotée.' },
  { slug: 'c', nom: 'C · Fiche produit', description: 'Mise en page en lignes comme les fiches produit, photo en cadre beige, bouton anthracite.' },
  { slug: 'd', nom: 'D · Manifeste', description: 'Titres très grands, photo pleine largeur avec carte beige, bandeaux dorés.' },
  { slug: 'e', nom: 'E · Cinéma', description: 'Défilement cinématographique : la photo change à chaque chapitre, la citation s’éclaire mot à mot.' },
  { slug: 'f', nom: 'F · Matière', description: 'Titres révélés par masque, photos en parallaxe, ligne dorée qui se dessine au défilement.' },
  { slug: 'g', nom: 'G · Lumière', description: 'La page passe de la nuit au jour en défilant ; le pointeur éclaire le titre et la photo Bubble.' },
  { slug: 'h', nom: 'H · Modulable', description: 'Des blocs éparpillés s’assemblent en grille au défilement, avec des ressorts.' },
  { slug: 'i', nom: 'I · Pas à pas', description: 'Une bande horizontale épinglée, pilotée par le défilement vertical. Version verticale si « réduire les mouvements » est activé.' },
];

export default function VersionsIndex() {
  return (
    <main className="mx-auto max-w-4xl bg-white px-6 py-24 text-[#34322F]">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7F6A52]">Aperçus · non publiés</p>
      <h1 className="pdp-display mt-4 text-[44px] font-semibold tracking-[-0.03em] text-black">Notre histoire : quatre versions</h1>
      <ul className="mt-12 divide-y divide-[#E6DFD3] border-y border-[#E6DFD3]">
        {VERSIONS.map((v) => (
          <li key={v.slug}>
            <Link href={`/a-propos/versions/${v.slug}`} className="flex items-center justify-between gap-6 py-6 transition-colors hover:text-[#7F6A52]">
              <span>
                <span className="pdp-display block text-2xl font-semibold tracking-[-0.02em] text-black">{v.nom}</span>
                <span className="mt-1 block text-sm text-[#4D4842]">{v.description}</span>
              </span>
              <span aria-hidden="true" className="text-xl">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
