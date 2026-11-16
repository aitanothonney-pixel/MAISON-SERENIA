import Link from 'next/link';
import { Price } from '@/lib/currency';
import Image from 'next/image';
import { ArrowRight, Gift } from 'lucide-react';
import { products, nice99 } from '@/lib/products';
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
      {/* Hero — bannière Black Friday avec la photo de la bannière Mon Intérieur IA */}
      <section className="relative overflow-hidden bg-black text-white min-h-[620px] md:min-h-[680px] flex flex-col justify-end">
        <Image
          src="/catalog/99H4L0sP.jpg"
          alt="Salon avec canapé Bubble rouge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.78) 55%, rgba(0,0,0,0.5) 100%)' }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-22 pt-24 pb-16 md:pb-[72px]">
          <div className="max-w-[720px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors mb-10"
            >
              ← Retour à l&apos;accueil
            </Link>
            <p className="text-[11px] tracking-[0.5em] uppercase text-[#C9A96E] mb-3">Black Friday</p>
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/80 mb-1">Jusqu&apos;à</p>
            <p
              className="text-[96px] md:text-[136px] leading-none font-semibold text-[#C9A96E]"
              style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}
            >
              −30%
            </p>
            <h1
              className="mt-6 text-2xl md:text-4xl font-semibold leading-tight"
              style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}
            >
              PROFITEZ DÈS MAINTENANT DE NOS OFFRES SUR LE BLACK FRIDAY
            </h1>
            <p className="mt-5 max-w-[520px] text-neutral-200 text-[15px] md:text-base leading-[1.7]">
              Sur toute la collection Salon Bubble, dans la limite des stocks disponibles.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href="#promo-grid"
                className="group inline-flex items-center gap-3 bg-white text-black px-9 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-white transition-colors"
              >
                Voir les produits <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#C9A96E]">
                {items.length} produit{items.length > 1 ? 's' : ''} en promotion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="promo-grid" className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {items.map((product) => {
            const promoPrice = nice99(Math.round(product.price * 0.7));
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
              Le canapé et son fauteuil assortis, avec un tableau (50×70 cm) offert — le meilleur prix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLES.map((b) => {
              const detail = getBundleDetail(b.slug);
              if (!detail) return null;
              const { canape, fauteuil, gift, sum, price } = detail;
              return (
                <div key={b.slug} className="bg-white border border-neutral-200 p-6 flex flex-col">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4">Ensemble {b.color}</p>
                  <div className="flex items-center gap-3 mb-5">
                    {[canape, fauteuil, gift].map((p) => (
                      <div key={p.id} className="relative w-16 h-16 bg-white shrink-0">
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
                    <span><span className="font-semibold text-black">{gift.name}</span> (50×70) offert · −<Price value={sum - price} /></span>
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
