'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface Influencer {
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  picks: {
    productId: string | number;
    productName: string;
    productImage: string;
    caption: string;
  }[];
}

interface InfluencerPicksProps {
  influencers?: Influencer[];
}

const defaultInfluencers: Influencer[] = [
  {
    name: 'Marie Dubois',
    handle: '@interiors_by_marie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    followers: '45k',
    picks: [
      {
        productId: 2,
        productName: 'Canapé Bubble',
        productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        caption: 'Le coup de cœur de mon salon! Les couleurs sont divines.',
      },
    ],
  },
  {
    name: 'François Leroy',
    handle: '@designerliving',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    followers: '32k',
    picks: [
      {
        productId: 5,
        productName: 'Fauteuil Lounge',
        productImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e262?w=400&h=400&fit=crop',
        caption: 'Confortable et intemporel. Un classique moderne parfait.',
      },
    ],
  },
  {
    name: 'Sophie Martin',
    handle: '@minimalist.home',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    followers: '28k',
    picks: [
      {
        productId: 3,
        productName: 'Table Basse Design',
        productImage: 'https://images.unsplash.com/photo-1581980694727-d671642e6267?w=400&h=400&fit=crop',
        caption: 'Minimaliste et élégant. Complète parfaitement mon espace.',
      },
    ],
  },
];

export function InfluencerPicks({ influencers = defaultInfluencers }: InfluencerPicksProps) {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  return (
    <section className="py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-3">
          Coup de cœur des influenceurs
        </h2>
        <p className="text-neutral-600">
          Les produits favoris des plus grandes voix du design d'intérieur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {influencers.map((influencer, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Influencer Header */}
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={influencer.avatar}
                  alt={influencer.name}
                  width={60}
                  height={60}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-black">{influencer.name}</p>
                  <p className="text-xs text-neutral-500">
                    {influencer.handle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-600">
                {influencer.followers} followers
              </p>
            </div>

            {/* Picks */}
            <div className="p-6 space-y-4">
              {influencer.picks.map((pick) => (
                <div key={pick.productId} className="space-y-3">
                  {/* Product Image */}
                  <Link href={`/products/${pick.productId}`}>
                    <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group cursor-pointer">
                      <Image
                        src={pick.productImage}
                        alt={pick.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(`${idx}-${pick.productId}`);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            liked.has(`${idx}-${pick.productId}`)
                              ? 'fill-red-500 text-red-500'
                              : 'text-neutral-400'
                          }`}
                        />
                      </button>
                    </div>
                  </Link>

                  {/* Caption and Product */}
                  <div>
                    <p className="text-sm text-neutral-600 italic mb-2">
                      "{pick.caption}"
                    </p>
                    <Link
                      href={`/products/${pick.productId}`}
                      className="text-sm font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      {pick.productName} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Follow CTA */}
            <div className="px-6 py-4 border-t border-neutral-100">
              <button className="w-full py-2 text-sm font-semibold border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Suivre
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
