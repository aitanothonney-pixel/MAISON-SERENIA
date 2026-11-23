import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollectionMeta, getCollectionProducts } from '@/lib/collections';
import { CollectionGrid } from './collection-grid';
import { CollectionIntro } from '@/components/ui/collection-intro';

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCollectionMeta(slug);
  if (!meta) return { title: 'Collection | Maison Serenia' };
  const url = `https://maison-serenia.com/collections/${meta.slug}`;
  return {
    title: `${meta.label} | Maison Serenia`,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${meta.label} | Maison Serenia`,
      description: meta.description,
      type: 'website',
      url,
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCollectionMeta(slug);
  if (!meta) notFound();

  const items = getCollectionProducts(slug);

  const shortLabel = (label: string) => label.replace('Collection ', '');

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Barre de navigation entre collections (collante) */}
      <nav className="relative bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="text-[13px] tracking-wide text-neutral-500 hover:text-black transition-colors whitespace-nowrap">
            ← Accueil
          </Link>
          <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
            {COLLECTIONS.map((c) => {
              const active = c.slug === slug;
              return (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className={`text-[12px] tracking-[0.15em] uppercase whitespace-nowrap py-1 border-b-2 transition-colors ${
                    active ? 'text-black border-black' : 'text-neutral-500 border-transparent hover:text-black'
                  }`}
                >
                  {shortLabel(c.label)}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Intro de catégorie : éditoriale et animée (« Vous êtes dans la catégorie ») */}
      <CollectionIntro
        eyebrow={slug === 'bubble' ? meta.kicker : 'Vous êtes dans la catégorie'}
        title={meta.label}
        tagline={meta.tagline}
        description={meta.description}
        count={items.length}
      />

      {/* Grid */}
      <section id="collection-produits" className="max-w-7xl mx-auto px-6 lg:px-10 py-14 scroll-mt-24">
        {items.length === 0 ? (
          <p className="text-neutral-500 text-center py-20">Aucun produit dans cette collection pour le moment.</p>
        ) : (
          <CollectionGrid items={items} />
        )}
      </section>
    </main>
  );
}
