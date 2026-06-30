'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  avatar: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  photos: string[];
  helpful: number;
}

const sampleReviews: Review[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    date: '28 juin 2026',
    rating: 5,
    title: 'Absolument magnifique!',
    text: 'J\'ai acheté ce canapé il y a 3 mois et je l\'adore tous les jours. La qualité du velours est exceptionnelle, très doux et résistant. Les coussins sont confortables et le design époustouflant. Vraiment recommandé!',
    photos: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    ],
    helpful: 47,
  },
  {
    id: '2',
    name: 'Jean-Pierre Lemoine',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    date: '25 juin 2026',
    rating: 5,
    title: 'Excellent rapport qualité-prix',
    text: 'Livraison rapide et bien emballé. Le canapé est magnifique chez moi et vraiment confortable. Les dimensions sont exactes comme indiqué. Top!',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    ],
    helpful: 32,
  },
  {
    id: '3',
    name: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    date: '20 juin 2026',
    rating: 4,
    title: 'Très satisfaite',
    text: 'Produit de très bonne qualité. Légèrement différent de ce que j\'attendais mais au final c\'est mieux! Le service client a été très réactif pour mes questions.',
    photos: [
      'https://images.unsplash.com/photo-1567016501409-5a1a32fcd39f?w=400&h=300&fit=crop',
    ],
    helpful: 28,
  },
];

export function UserReviewsWithPhotos() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({});

  const review = sampleReviews[currentReviewIndex];
  const photoIndex = currentPhotoIndex[review.id] || 0;

  const goToReview = (index: number) => {
    setCurrentReviewIndex(index);
    setCurrentPhotoIndex({});
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [review.id]: ((prev[review.id] || 0) + 1) % review.photos.length,
    }));
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [review.id]: ((prev[review.id] || 0) - 1 + review.photos.length) % review.photos.length,
    }));
  };

  return (
    <section className="py-16">
      <h2 className="text-2xl font-serif font-bold text-black mb-8">Avis avec photos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photos carousel */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="relative bg-neutral-100 rounded-xl overflow-hidden aspect-square">
            {review.photos.length > 0 && (
              <>
                <Image
                  src={review.photos[photoIndex]}
                  alt={`Photo ${photoIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {review.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Photo dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {review.photos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setCurrentPhotoIndex((prev) => ({
                              ...prev,
                              [review.id]: idx,
                            }))
                          }
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === photoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Photo count */}
          <p className="text-xs text-neutral-500 mt-3 text-center">
            Photo {photoIndex + 1} / {review.photos.length}
          </p>
        </div>

        {/* Review content */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <Image
              src={review.avatar}
              alt={review.name}
              width={50}
              height={50}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-black">{review.name}</h3>
              <p className="text-xs text-neutral-500">{review.date}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
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
            <span className="font-semibold text-black">{review.title}</span>
          </div>

          {/* Text */}
          <p className="text-neutral-700 leading-relaxed mb-6">{review.text}</p>

          {/* Helpful */}
          <button className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors">
            <ThumbsUp className="w-4 h-4" />
            Utile ({review.helpful})
          </button>
        </div>
      </div>

      {/* Review carousel indicators */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {sampleReviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToReview(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentReviewIndex ? 'w-8 bg-black' : 'w-2 bg-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => goToReview((currentReviewIndex - 1 + sampleReviews.length) % sampleReviews.length)}
          className="px-6 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          ← Précédent
        </button>
        <span className="text-sm text-neutral-600">
          {currentReviewIndex + 1} / {sampleReviews.length}
        </span>
        <button
          onClick={() => goToReview((currentReviewIndex + 1) % sampleReviews.length)}
          className="px-6 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Suivant →
        </button>
      </div>
    </section>
  );
}
