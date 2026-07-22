import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { products, getVariantGroup } from '@/lib/products';

export const metadata = {
  title: 'Tous nos produits | Maison Serenia',
  description: "Découvrez l'intégralité du catalogue Maison Serenia : mobilier Bubble, figurines de collection et accessoires.",
};

const bubbleName = (name: string) => name.includes('Bubble');

export default function ProduitsPage() {
  // Catalogue complet, classé par catégorie.
  // Les accessoires Été à variantes (bracelet, ventilateur) sont regroupés en un seul produit.
  const seenGroups = new Set<number>();
  const deduped = products.filter((p) => {
    if (p.category === 'Été') {
      const grp = getVariantGroup(p.id);
      if (grp) {
        const first = grp[0].productId;
        if (seenGroups.has(first)) return false;
        seenGroups.add(first);
        return p.id === first;
      }
    }
    return true;
  });

  const order: Record<string, number> = { Salon: 0, Bureau: 1, Figurines: 2, 'Été': 3 };
  const items = deduped.sort((a, b) => {
    const ra = order[a.category] ?? 9;
    const rb = order[b.category] ?? 9;
    if (ra !== rb) return ra - rb;
    return a.id - b.id;
  });

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
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-3">Catalogue complet</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
            Tous nos produits
          </h1>
          <span className="block w-12 h-px mt-4 mb-5" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
          <p className="text-neutral-500 max-w-xl leading-relaxed">
            L&apos;intégralité de nos collections : mobilier Bubble, pièces de collection et accessoires.
          </p>
          <p className="text-xs text-neutral-400 mt-4">{items.length} produits</p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((product) => {
            const isBubble = bubbleName(product.name);
            const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;
            const contain = isBubble || product.category === 'Figurines' || product.category === 'Été';
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group block border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500">
                <div className={`relative aspect-[4/3] overflow-hidden bg-neutral-50 ${contain ? 'p-4' : ''}`}>
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
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">{product.category}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
                      <span className="text-[10px] text-neutral-400 tabular-nums">{(4.6 + (product.id % 4) * 0.1).toFixed(1)}</span>
                    </div>
                  </div>
                  <h2 className="font-serif font-semibold text-black text-sm leading-snug group-hover:underline" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {product.name}
                  </h2>
                  <div className="h-px bg-neutral-100 my-3" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-black">{promoPrice.toLocaleString('fr-FR')} €</span>
                    {isBubble && (
                      <span className="text-xs text-neutral-400 line-through">{product.price.toLocaleString('fr-FR')} €</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
