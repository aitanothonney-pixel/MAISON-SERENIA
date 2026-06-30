'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 erreurs à éviter lors du choix d\'un canapé',
    excerpt: 'Guide complet pour choisir le canapé parfait adapté à votre espace et votre style de vie.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
    date: '28 juin 2026',
    readTime: '5 min',
    category: 'Guide',
    slug: 'erreurs-choix-canape',
  },
  {
    id: '2',
    title: 'Comment créer un salon cosy : conseils de designer',
    excerpt: 'Transformez votre salon en un espace chaleureux et accueillant avec nos conseils d\'expert en décoration.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    date: '25 juin 2026',
    readTime: '7 min',
    category: 'Décoration',
    slug: 'salon-cosy-conseils',
  },
  {
    id: '3',
    title: 'Guide d\'entretien : préserver vos meubles plus longtemps',
    excerpt: 'Conseils pratiques pour nettoyer, protéger et entretenir votre mobilier afin qu\'il dure dans le temps.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    date: '22 juin 2026',
    readTime: '4 min',
    category: 'Entretien',
    slug: 'guide-entretien-mobilier',
  },
];

export function BlogSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
              Blog & Guides
            </h2>
            <p className="text-neutral-600 mt-2">Conseils, tendances et guides pour votre intérieur</p>
          </div>
          <Link
            href="/blog"
            className="text-black font-semibold hover:opacity-60 transition-opacity flex items-center gap-2"
          >
            Tous les articles →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative mb-5 bg-neutral-200 rounded-none overflow-hidden aspect-video h-48 flex-shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                {/* Category & Meta */}
                <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                  <span className="inline-block bg-neutral-200 text-black px-3 py-1 rounded-none font-semibold">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </div>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-black mb-2 group-hover:opacity-60 transition-opacity line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-neutral-600 mb-4 flex-grow line-clamp-2">
                  {post.excerpt}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-black font-semibold text-sm pt-4 border-t border-neutral-200">
                  Lire l&apos;article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 bg-white rounded-none border border-neutral-200 text-center">
          <h3 className="text-2xl font-serif font-bold text-black mb-3">
            Ne manquez aucun conseil
          </h3>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Recevez nos guides, tendances et conseils d&apos;expert directement dans votre boîte mail.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-none focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <button className="px-6 py-3 bg-black text-white font-semibold rounded-none hover:bg-neutral-900 transition-colors whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
