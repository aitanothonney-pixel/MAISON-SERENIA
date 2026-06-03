'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { products, getVariantGroup } from '@/lib/products';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === Number(id));

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-serif mb-4">Produit introuvable</p>
          <Link href="/" className="text-sm underline">Retour à l&apos;accueil</Link>
        </div>
      </div>
    );
  }

  const variants = getVariantGroup(product.id);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const accordions = [
    {
      title: 'Détails du produit',
      content: (
        <ul className="space-y-2 text-sm text-neutral-600">
          {product.details.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Livraison',
      content: (
        <div className="text-sm text-neutral-600 space-y-2">
          <p>Livraison en blanc à domicile, installation comprise. Délai : 3 à 6 semaines selon disponibilité.</p>
        </div>
      ),
    },
    {
      title: 'Entretien',
      content: (
        <div className="text-sm text-neutral-600 space-y-2">
          <p>Nettoyage à sec recommandé pour les tissus. Éviter l&apos;exposition prolongée au soleil direct.</p>
          <p>Pour les bois massifs, un entretien à l&apos;huile de lin tous les 12 mois prolonge la beauté naturelle de la pièce.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <Link href="/" className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            MAISON SERENIA
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">{product.name}</span>
          </nav>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className={product.category === 'Figurines' ? 'object-contain p-6' : 'object-cover'}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-200 ${
                      selectedImage === i
                        ? 'ring-2 ring-black ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} vue ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:pt-4">
              {/* Category */}
              <p className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-3">{product.category}</p>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-black text-black" />
                ))}
                <span className="text-xs text-neutral-400 ml-2">(24 avis)</span>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-black mb-6">
                {product.price.toLocaleString('fr-FR')} €
              </p>

              {/* Color variants */}
              {variants && (
                <div className="mb-8">
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
                    Couleur — <span className="text-black font-medium">{variants.find(v => v.productId === product.id)?.color}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    {variants.map((v) => (
                      <button
                        key={v.productId}
                        onClick={() => router.push(`/products/${v.productId}`)}
                        title={v.color}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          v.productId === product.id
                            ? 'border-black scale-110 shadow-md'
                            : 'border-neutral-200 hover:border-neutral-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.colorHex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed mb-8 text-sm">
                {product.description}
              </p>

              {/* Specs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="text-xs border border-neutral-200 rounded-full px-4 py-1.5 text-neutral-500">
                  📐 {product.dimensions}
                </span>
                <span className="text-xs border border-neutral-200 rounded-full px-4 py-1.5 text-neutral-500">
                  🪵 {product.material}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-10">
                <button
                  onClick={() => setAdded(true)}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all duration-300 ${
                    added
                      ? 'bg-neutral-800 text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                </button>
                <button
                  onClick={() => setWished(!wished)}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-widest uppercase border transition-all duration-300 flex items-center justify-center gap-2 ${
                    wished
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white text-black hover:border-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wished ? 'fill-white' : ''}`} />
                  {wished ? 'Dans vos souhaits' : 'Ajouter à la liste de souhaits'}
                </button>
              </div>

              {/* Accordions */}
              <div className="divide-y divide-neutral-100">
                {accordions.map((acc, i) => (
                  <div key={i}>
                    <button
                      className="w-full flex items-center justify-between py-4 text-sm font-semibold tracking-wide text-left"
                      onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    >
                      {acc.title}
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                          openAccordion === i ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4">{acc.content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl font-serif font-bold mb-10">Vous aimerez aussi</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group">
                    <div className="aspect-square overflow-hidden rounded-xl bg-neutral-50 mb-3">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-semibold text-sm text-black group-hover:underline">{p.name}</p>
                    <p className="text-neutral-500 text-sm mt-0.5">{p.price.toLocaleString('fr-FR')} €</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back button */}
          <div className="mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
