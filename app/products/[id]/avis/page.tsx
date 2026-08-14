import Link from 'next/link';
import { Price } from '@/lib/currency';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { products } from '@/lib/products';
import { buildReviewStats, buildAllReviews } from '@/lib/reviews';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === Number(id));
  if (!product) return { title: 'Avis | Maison Serenia' };
  return {
    title: `Avis clients — ${product.name} | Maison Serenia`,
    description: `Découvrez tous les avis vérifiés de nos clients sur ${product.name}.`,
  };
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-[#C9A96E]' : 'text-neutral-300'}
          fill={i < rating ? '#C9A96E' : 'none'}
          strokeWidth={i < rating ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export default async function AvisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Produit introuvable.</p>
          <Link href="/" className="text-black underline">Retour à l&apos;accueil</Link>
        </div>
      </main>
    );
  }

  const stats = buildReviewStats(productId);
  const reviews = buildAllReviews(productId, product.category, product.name);

  const breakdown = [
    { star: 5, count: stats.five },
    { star: 4, count: stats.four },
    { star: 3, count: stats.three },
    { star: 2, count: stats.two },
    { star: 1, count: stats.one },
  ];

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Hero */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href={`/products/${productId}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mb-8"
          >
            ← Retour au produit
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-24 h-24 bg-white border border-neutral-100 shrink-0">
              <Image src={product.images[0]} alt={product.name} fill sizes="120px" className="object-contain p-2" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-2">Avis vérifiés</p>
              <h1
                className="text-3xl md:text-4xl font-bold text-black"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {product.name}
              </h1>
              <span className="block w-10 h-px mt-3" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary */}
        <div className="border border-neutral-100 bg-neutral-50/50 p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center shrink-0">
            <p className="text-5xl font-serif font-bold text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
              {stats.avg}
            </p>
            <div className="flex justify-center mt-2">
              <Stars rating={Math.round(stats.avg)} size={16} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">{stats.total} avis vérifiés</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {breakdown.map(({ star, count }) => {
              const pct = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="text-neutral-500 w-8 shrink-0 flex items-center gap-0.5">{star}<Star size={11} className="text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} /></span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A96E]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-neutral-400 w-8 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All reviews */}
        <h2 className="text-xl font-serif font-bold text-black mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          Tous les avis <span className="text-neutral-400 font-normal">({reviews.length})</span>
        </h2>

        <div className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="border border-neutral-100 px-5 py-5 hover:border-neutral-200 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-sm text-black">{r.name}</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Achat vérifié</span>
                </div>
                <span className="text-xs text-neutral-400 shrink-0">{r.date}</span>
              </div>
              <div className="mb-2"><Stars rating={r.rating} /></div>
              <p className="text-sm text-neutral-600 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/products/${productId}`}
            className="inline-flex items-center gap-2 bg-black text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
          >
            Retour au produit
          </Link>
        </div>
      </div>
    </main>
  );
}
