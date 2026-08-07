import Link from 'next/link';
import { Price } from '@/lib/currency';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { products } from '@/lib/products';
import { BUNDLES, getBundleDetail } from '@/lib/bundles';

export const metadata = {
  title: 'Promotions | Maison Serenia',
  description: 'Découvrez tous les produits en promotion — jusqu’à −30% sur la collection Bubble.',
};

export default function PromotionsPage() {
  // Produits en promotion : toute la collection Bubble (−30%)
  const items = products.filter((p) => p.name.includes('Bubble'));

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
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-3">Édition limitée</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
            Nos promotions
          </h1>
          <span className="block w-12 h-px mt-4 mb-5" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
          <p className="text-neutral-500 max-w-xl leading-relaxed">
            Jusqu&apos;à −30% sur la collection Salon Bubble — dans la limite des stocks disponibles.
          </p>
          <p className="text-xs text-neutral-400 mt-4">{items.length} produit{items.length > 1 ? 's' : ''} en promotion</p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {items.map((product) => {
            const promoPrice = Math.round(product.price * 0.7);
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-white mb-3 p-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                    −30%
                  </div>
                </div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-1">{product.category}</p>
                <h2 className="font-serif font-bold text-sm text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-sm font-semibold text-black"><Price value={promoPrice} /></span>
                  <span className="text-xs text-neutral-400 line-through"><Price value={product.price} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ensembles */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-2">Économisez plus</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
              Nos ensembles Bubble
            </h2>
            <span className="block w-10 h-px mt-3 mx-auto" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
            <p className="text-neutral-500 text-sm mt-4 max-w-md mx-auto">
              Le canapé et son fauteuil assortis, avec une figurine offerte — le meilleur prix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLES.map((b) => {
              const detail = getBundleDetail(b.slug);
              if (!detail) return null;
              const { canape, fauteuil, figurine, sum, price } = detail;
              return (
                <div key={b.slug} className="bg-white border border-neutral-200 p-6 flex flex-col">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4">Ensemble {b.color}</p>
                  <div className="flex items-center gap-3 mb-5">
                    {[canape, fauteuil, figurine].map((p) => (
                      <div key={p.id} className="relative w-16 h-16 bg-neutral-50 shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill sizes="120px" className="object-contain p-1" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}><Price value={price} /></span>
                    <span className="text-sm text-neutral-400 line-through"><Price value={sum} /></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 mb-5">
                    <Gift className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span><span className="font-semibold text-black">{figurine.name}</span> offerte · −{b.rabais}€</span>
                  </div>
                  <Link
                    href={`/packs/${b.slug}`}
                    className="mt-auto block w-full text-center bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 hover:bg-neutral-800 transition-colors"
                  >
                    Voir le pack
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
