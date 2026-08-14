import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollectionMeta, getCollectionProducts } from '@/lib/collections';
import { CollectionCard } from './collection-card';

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCollectionMeta(slug);
  if (!meta) return { title: 'Collection | Maison Serenia' };
  return {
    title: `${meta.label} | Maison Serenia`,
    description: meta.description,
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
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100">
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
                    active ? 'text-black border-black' : 'text-neutral-400 border-transparent hover:text-black'
                  }`}
                >
                  {shortLabel(c.label)}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-neutral-100 bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-3">{meta.kicker}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
            {meta.label}
          </h1>
          <span className="block w-12 h-px mt-4 mb-5" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
          <p className="text-neutral-500 max-w-xl leading-relaxed">{meta.description}</p>
          <p className="text-xs text-neutral-400 mt-4">{items.length} pièce{items.length > 1 ? 's' : ''}</p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        {items.length === 0 ? (
          <p className="text-neutral-500 text-center py-20">Aucun produit dans cette collection pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {items.map((product) => (
              <CollectionCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
