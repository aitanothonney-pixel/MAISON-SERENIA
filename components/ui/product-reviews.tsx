'use client';

import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    name: 'Marie D.',
    rating: 5,
    text: 'Absolument magnifique ! Le produit est conforme aux photos. L\'emballage était impeccable et la livraison très rapide. Je recommande vivement !',
    date: '28 juin 2026',
    verified: true,
  },
  {
    name: 'Jean-Pierre L.',
    rating: 5,
    text: 'Excellent rapport qualité-prix. Vraiment satisfait de mon achat. C\'est du solide, très bien fini. Merci MAISON SERENIA !',
    date: '25 juin 2026',
    verified: true,
  },
  {
    name: 'Sophie M.',
    rating: 4,
    text: 'Très bien. Légèrement différent de ce que j\'attendais mais au final c\'est super. Le service client a été très réactif.',
    date: '22 juin 2026',
    verified: true,
  },
];

interface ProductReviewsProps {
  averageRating?: number;
  totalReviews?: number;
}

export function ProductReviews({ averageRating = 4.8, totalReviews = 147 }: ProductReviewsProps) {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-serif font-bold text-black mb-8">Avis de nos clients</h2>

      {/* Rating summary */}
      <div className="mb-8 p-6 bg-neutral-50 rounded-none border border-neutral-200">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-4xl font-serif font-bold text-black">{averageRating}</p>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-neutral-600 mt-2">{totalReviews} avis vérifiés</p>
          </div>

          {/* Rating bars */}
          <div className="flex-1 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = [107, 30, 8, 2, 0][5 - rating];
              const percentage = (count / totalReviews) * 100;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-600 w-6">{rating}★</span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {sampleReviews.map((review, idx) => (
          <div key={idx} className="p-4 border border-neutral-200 rounded-none">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-black text-sm">{review.name}</p>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-none">
                      Achat vérifié
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-neutral-500">{review.date}</span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>

      {/* CTA to see more */}
      <div className="mt-8 text-center">
        <button className="text-sm font-semibold text-black hover:opacity-60 transition-opacity">
          Voir tous les avis →
        </button>
      </div>
    </section>
  );
}
