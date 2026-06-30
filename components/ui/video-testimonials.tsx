'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  thumbnail: string;
  videoUrl: string;
  rating: number;
  quote: string;
}

const testimonials: VideoTestimonial[] = [
  {
    id: '1',
    name: 'Claire Beaumont',
    role: 'Architecte d\'intérieur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 5,
    quote: 'Le canapé Bubble a complètement transformé ma vision pour ce projet. Qualité exceptionnelle!',
  },
  {
    id: '2',
    name: 'Thomas Deschamps',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 5,
    quote: 'Maison Serenia me fait confiance pour tous mes projets. Leur sélection est incomparable.',
  },
  {
    id: '3',
    name: 'Sophie Leclerc',
    role: 'Propriétaire de boutique',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e262?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    rating: 5,
    quote: 'Le meilleur service client et les meilleurs produits. Recommandé à tous mes clients!',
  },
];

export function VideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const testimonial = testimonials[currentIndex];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPlaying(false);
  };

  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-12">
        Témoignages vidéo
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video */}
        <div className="relative bg-black rounded-none overflow-hidden aspect-video flex items-center justify-center group">
          {!isPlaying ? (
            <>
              <Image
                src={testimonial.thumbnail}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
              >
                <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center">
                  <Play className="w-8 h-8 text-black fill-black ml-1" />
                </div>
              </button>
            </>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={testimonial.videoUrl}
              title={testimonial.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl md:text-2xl font-serif text-black mb-6">
            "{testimonial.quote}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={60}
              height={60}
              className="w-14 h-14 rounded-none object-cover"
            />
            <div>
              <p className="font-bold text-black">{testimonial.name}</p>
              <p className="text-sm text-neutral-600">{testimonial.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTestimonial}
              className="p-2 border border-neutral-300 rounded-none hover:bg-neutral-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`h-2 rounded-none transition-all ${
                    idx === currentIndex ? 'w-8 bg-black' : 'w-2 bg-neutral-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 border border-neutral-300 rounded-none hover:bg-neutral-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
