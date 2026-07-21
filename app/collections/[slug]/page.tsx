import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollectionMeta, getCollectionProducts } from '@/lib/collections';

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

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour à l&apos;accueil
          </Link>
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
            {items.map((product) => {
              const isBubble = product.name.includes('Bubble');
              const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;
              const contain = isBubble || product.category === 'Figurines' || product.category === 'Été';
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group block">
                  <div className={`relative aspect-[4/3] overflow-hidden bg-white mb-3 ${contain ? 'p-4' : ''}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className={`transition-transform duration-700 group-hover:scale-105 ${contain ? 'object-contain' : 'object-cover'}`}
                    />
                    {isBubble && (
                      <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                        −30%
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-1">{product.category}</p>
                  <h2 className="font-serif font-bold text-sm text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-sm font-semibold text-black">{promoPrice.toLocaleString('fr-FR')} €</span>
                    {isBubble && (
                      <span className="text-xs text-neutral-400 line-through">{product.price.toLocaleString('fr-FR')} €</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
