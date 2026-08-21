import Link from 'next/link';
import { Price } from '@/lib/currency';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BUNDLES, getBundleDetail } from '@/lib/bundles';
import { products } from '@/lib/products';
import { PackCheckout } from './pack-checkout';

export function generateStaticParams() {
  return BUNDLES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getBundleDetail(slug);
  if (!detail) return { title: 'Pack | Maison Serenia' };
  return {
    title: `Ensemble Bubble ${detail.bundle.color} | Maison Serenia`,
    description: `Canapé et fauteuil Bubble ${detail.bundle.color.toLowerCase()} assortis, avec un tableau (50×70 cm) offert. Économisez ${detail.sum - detail.price} CHF.`,
  };
}

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getBundleDetail(slug);
  if (!detail) notFound();

  const { bundle, canape, fauteuil, gift, canapePromo, fauteuilPromo, sum, price } = detail;

  const elements = [
    { product: canape, price: canapePromo, offert: false, id: canape.id },
    { product: fauteuil, price: fauteuilPromo, offert: false, id: fauteuil.id },
  ];

  // Tableaux disponibles pour le cadeau offert (au choix du client)
  const tableaux = products
    .filter((p) => p.name.includes('Tableau'))
    .map((p) => ({ id: p.id, name: p.name, image: p.images[0] }));

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/#section-packs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour aux ensembles
          </Link>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-3">Offre exclusive · Rabais <Price value={sum - price} /></p>
          <h1 className="text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ensemble Bubble {bundle.color}
          </h1>
          <span className="block w-12 h-px mt-4 mb-5" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
          <p className="text-neutral-500 max-w-xl leading-relaxed">
            Le canapé et son fauteuil Bubble {bundle.color.toLowerCase()} assortis, pensés ensemble.
            Un tableau (50×70 cm) au choix est offert avec cet ensemble.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        {/* Éléments du pack */}
        <div>
          <h2 className="text-xl font-serif font-bold text-black mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Les éléments du pack
          </h2>
          <div className="space-y-4">
            {elements.map(({ product, price: p, offert, id }) => (
              <Link
                key={id}
                href={`/products/${id}`}
                className="flex items-center gap-5 border border-neutral-100 p-4 hover:border-neutral-300 transition-colors group"
              >
                <div className="relative w-28 h-28 bg-white shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                  {offert && (
                    <span className="absolute top-1 left-1 bg-black text-white text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5">
                      Offerte
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-1">{product.category}</p>
                  <h3 className="font-serif font-bold text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {offert ? (
                      <>
                        <span className="text-sm text-neutral-400 line-through"><Price value={p} /></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Offerte</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-black"><Price value={p} /></span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Récapitulatif */}
        <aside className="lg:sticky lg:top-8 h-fit border border-neutral-200 p-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-1">Prix du pack</p>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-4xl font-bold text-black leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
              <Price value={price} />
            </span>
            <span className="text-sm text-neutral-400 line-through"><Price value={sum} /></span>
          </div>
          <div className="flex mb-5 mt-3">
            <span className="inline-block bg-neutral-100 text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 text-black font-semibold">
              Vous économisez <Price value={sum - price} />
            </span>
          </div>

          <PackCheckout
            ids={[canape.id, fauteuil.id]}
            tableaux={tableaux}
            defaultGiftId={gift.id}
            giftSize="50×70 cm"
            giftPrice={60}
          />

          <p className="text-[10px] text-neutral-400 text-center mt-3 tracking-wide">
            Livraison gratuite à partir de <Price value={40} />
          </p>
        </aside>
      </div>
    </main>
  );
}
