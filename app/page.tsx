'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronRight, Share2, Heart, Globe,
  Search, X, Star,
} from 'lucide-react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion as motionLib } from 'motion/react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { products } from '@/lib/products';
import { ZoomParallax } from '@/components/ui/zoom-parallax';

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────


// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ hasBar }: { hasBar: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (hasBar ? 80 : 40));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasBar]);

  const navItems = [
    { label: 'Salon', href: '#section-salon' },
    { label: 'Bureau', href: '#section-bureau' },
    { label: 'Figurines', href: '#section-figurines' },
    { label: 'Inspirations', href: '#section-inspirations' },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${hasBar ? 'top-8' : 'top-0'} ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent'
      }`}
    >
      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-[68px]">
        {/* Logo */}
        <a
          href="#"
          className={`text-base lg:text-lg font-bold tracking-[0.22em] uppercase transition-colors duration-300 shrink-0 ${
            scrolled ? 'text-black' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
        >
          MAISON SERENIA
        </a>

        {/* Desktop nav — categories */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-[11px] tracking-widest uppercase transition-colors duration-300 hover:opacity-60 whitespace-nowrap ${
                scrolled ? 'text-black' : 'text-white/90'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1">
          {/* Search toggle */}
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Rechercher"
          >
            {searchOpen
              ? <X className={`w-5 h-5 ${scrolled ? 'text-black' : 'text-white'}`} />
              : <Search className={`w-5 h-5 ${scrolled ? 'text-black' : 'text-white'}`} />}
          </button>

          {/* Wishlist */}
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block" aria-label="Favoris">
            <Heart className={`w-5 h-5 ${scrolled ? 'text-black' : 'text-white'}`} />
          </button>

          {/* Cart */}
          <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Panier">
            <ShoppingBag className={`w-5 h-5 ${scrolled ? 'text-black' : 'text-white'}`} />
          </button>

          {/* Burger */}
          <button
            className="lg:hidden p-2 flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
          </button>
        </div>
      </div>

      {/* Search bar drop-down */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white border-t border-neutral-100"
          >
            <div className="max-w-2xl mx-auto px-6 py-4">
              <div className="flex items-center gap-3 border-b border-black pb-2">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Rechercher un meuble, une collection…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="flex-1 text-sm outline-none placeholder:text-neutral-300 text-black"
                />
                {searchQ && (
                  <button onClick={() => setSearchQ('')}><X className="w-4 h-4 text-neutral-400" /></button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Canapé', 'Lit', 'Table', 'Fauteuil'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSearchQ(s)}
                    className="text-xs border border-neutral-200 rounded-full px-3 py-1 hover:border-black hover:text-black transition-colors text-neutral-500"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-t border-neutral-100 px-6 py-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm tracking-widest uppercase text-black hover:opacity-60 flex items-center justify-between">
                {item.label} <ChevronRight className="w-4 h-4 text-neutral-300" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Category Quick Nav ───────────────────────────────────────────────────────

const categoryNav = [
  { label: 'Salon', image: 'https://i.ibb.co/wZRJYt6F/IMG-5364.jpg', href: '#section-salon' },
  { label: 'Figurines', image: 'https://i.ibb.co/rfHJgML3/IMG-0625.jpg', href: '#section-figurines' },
  { label: 'Bureau', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', href: '#section-bureau' },
];

function CategoryQuickNav() {
  return (
    <FadeInSection>
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-xl font-serif font-bold text-black mb-8 tracking-tight">
          Parcourir par univers
        </h2>
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categoryNav.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white relative border border-neutral-100">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={400}
                  height={300}
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${cat.label === 'Figurines' ? 'object-contain p-4' : 'object-cover'}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 rounded-2xl" />
              </div>
              <span className="text-[11px] tracking-widest uppercase text-neutral-600 group-hover:text-black transition-colors font-medium text-center">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}


// ─── Full-width Promo Banner ──────────────────────────────────────────────────

function PromoBanner() {
  return (
    <FadeInSection>
      <section className="mx-6 lg:mx-10 my-6 rounded-3xl overflow-hidden relative">
        <div className="relative h-56 md:h-72">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
            alt="Promo bannière"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <p className="text-xs tracking-[0.35em] uppercase mb-3 text-white/60">Édition limitée</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Jusqu&apos;à −30% sur<br className="hidden md:block" /> la collection Salon
            </h2>
            <p className="text-white/70 text-sm mb-7 max-w-md">
              Offre valable seulement 3 semaines — dans la limite des stocks disponibles.
            </p>
            <a
              href="#bubble-promo"
              className="bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Voir les produits en promotion
            </a>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Bubble Promo Carousel ────────────────────────────────────────────────────

const bubblePromoProducts = [2, 10, 6, 13, 8, 22, 12, 7, 9];

function BubblePromoCarousel() {
  const items = products.filter((p) => bubblePromoProducts.includes(p.id))
    .sort((a, b) => bubblePromoProducts.indexOf(a.id) - bubblePromoProducts.indexOf(b.id));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  return (
    <FadeInSection>
      <section id="bubble-promo" className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">Offre limitée · −30%</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Collection Bubble en promotion</h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => scroll('left')}
              animate={{ opacity: canLeft ? 1 : 0.25, scale: canLeft ? 1 : 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200"
              aria-label="Précédent"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              animate={{ opacity: canRight ? 1 : 0.25, scale: canRight ? 1 : 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-5 overflow-x-auto px-6 lg:px-10 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex-shrink-0 w-56 md:w-64 snap-start"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white p-3 mb-3 shadow-sm border border-neutral-100 group-hover:shadow-md transition-shadow duration-300">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full">
                  −30%
                </div>
              </div>
              <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-black font-bold text-sm">{Math.round(product.price * 0.7).toLocaleString('fr-FR')} €</span>
                <span className="text-neutral-400 line-through text-xs">{product.price.toLocaleString('fr-FR')} €</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Bestsellers Section ──────────────────────────────────────────────────────

const bestsellerIds = [2, 10, 6, 13];

function BestsellersSection() {
  const bestsellers = products.filter((p) => bestsellerIds.includes(p.id));

  return (
    <FadeInSection>
      <section className="py-14 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">Top ventes</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">
              Coups de cœur
            </h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1 text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors border-b border-neutral-200 pb-0.5">
            Tout voir <ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-3 ${product.name.includes('Bubble') ? 'p-3' : ''}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`transition-transform duration-600 group-hover:scale-105 ${product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      Best-seller
                    </div>
                    <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                      −30%
                    </div>
                  </div>
                  <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                    <Heart className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />)}
                  <span className="text-[10px] text-neutral-400 ml-1">(4,9)</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-black mb-0.5">{product.name}</h3>
                <p className="text-neutral-500 text-xs mb-1 line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-black font-bold text-sm">{Math.round(product.price * 0.7).toLocaleString('fr-FR')} €</p>
                  <p className="text-neutral-400 line-through text-xs">{product.price.toLocaleString('fr-FR')} €</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Product Card (with optional badge) ──────────────────────────────────────

const newProductIds = [5, 17, 21, 25, 29];
const saleProductIds = [4, 14, 19, 23, 27];
const bubbleProductIds = [2, 6, 7, 8, 9, 10, 12, 13, 22];

interface ProductPreview {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

function ProductCard({ product, index }: { product: ProductPreview; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isNew = newProductIds.includes(product.id);
  const isSale = saleProductIds.includes(product.id);
  const isBubble = bubbleProductIds.includes(product.id);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-transparent hover:border-neutral-200 transition-all duration-500 shadow-sm hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`}>
        <div className={`relative overflow-hidden aspect-[4/3] bg-white ${product.name.includes('Bubble') ? 'p-3' : ''}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isBubble ? (
              <span className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                −30%
              </span>
            ) : (
              <>
                {isNew && (
                  <span className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    Nouveau
                  </span>
                )}
                {isSale && (
                  <span className="bg-white text-black text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-neutral-200">
                    −20%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Wishlist */}
          <button className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <Heart className="w-3.5 h-3.5 text-black" />
          </button>

          {/* Quick view overlay */}
          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="block w-full text-center bg-white text-black text-[10px] font-bold tracking-widest uppercase py-3 rounded-xl shadow-sm">
              Voir le produit
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-0.5">{product.category}</p>
          <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
          <p className="text-neutral-400 text-[11px] mb-2.5 line-clamp-1">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm">
                {isBubble ? Math.round(product.price * 0.7).toLocaleString('fr-FR') : product.price.toLocaleString('fr-FR')} €
              </span>
              {isBubble && (
                <span className="text-neutral-400 line-through text-xs">
                  {product.price.toLocaleString('fr-FR')} €
                </span>
              )}
              {isSale && !isBubble && (
                <span className="text-neutral-400 line-through text-xs">
                  {Math.round(product.price * 1.25).toLocaleString('fr-FR')} €
                </span>
              )}
            </div>
            <span className="text-[9px] font-semibold tracking-wider uppercase text-neutral-300 group-hover:text-black transition-colors">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Product Filter Bar ───────────────────────────────────────────────────────

const filterCategories = ['Tous', 'Salon', 'Bureau'];

function ProductFilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-10">
      {filterCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 font-medium ${
            active === cat
              ? 'bg-black text-white border-black'
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-black'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ─── Interior Showcase ────────────────────────────────────────────────────────

function InteriorShowcaseSection() {
  return (
    <FadeInSection>
      <div className="flex flex-col overflow-hidden bg-white">
        <ContainerScroll
          titleComponent={
            <div className="mb-8">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-neutral-400">L&apos;art de vivre</p>
              <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                Des intérieurs qui vous <br />
                <span className="italic">ressemblent</span>
              </h2>
              <p className="mt-4 text-neutral-500 max-w-xl mx-auto text-base">
                Chaque pièce est pensée pour s&apos;intégrer harmonieusement dans votre espace de vie.
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full w-full">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                alt="Salon MAISON SERENIA"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs tracking-widest uppercase opacity-70">Collection</p>
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Salon Contemporain</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"
                alt="Figurines"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Figurines</div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80"
                alt="Salle à manger"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Salle à manger</div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </FadeInSection>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "Le Fauteuil Bubble blanc est une vraie sculpture vivante. Il trône au centre de mon salon et tout le monde me demande où je l'ai trouvé. Confort incroyable, qualité irréprochable.",
    image: '',
    name: 'Sophie Marchand', role: 'Cliente vérifiée',
  },
  {
    text: "J'ai craqué pour le Canapé Bubble violet spécial et je ne le regrette pas une seconde. La couleur est encore plus intense en vrai, et on s'y enfonce comme dans un nuage.",
    image: '',
    name: 'Thomas Lefebvre', role: 'Client vérifié',
  },
  {
    text: "Le Fauteuil Bubble bleu est exactement ce qu'il me fallait pour apporter du caractère à mon intérieur. La texture maille 3D est unique, je n'ai jamais vu ça ailleurs.",
    image: '',
    name: 'Camille Rousseau', role: 'Cliente vérifiée',
  },
  {
    text: "Livraison soignée, montage facile, et le Canapé Bubble blanc est tout simplement magnifique. Il a complètement transformé mon salon. Mes amis sont jaloux !",
    image: '',
    name: 'Antoine Dubois', role: 'Client vérifié',
  },
  {
    text: "Le Fauteuil Bubble rouge est une déclaration artistique à lui seul. Il donne une âme à toute la pièce. Je suis fan de la collection Bubble, je vais sûrement en commander un deuxième.",
    image: '',
    name: 'Isabelle Fontaine', role: 'Cliente vérifiée',
  },
  {
    text: "J'ai hésité longtemps entre le vert et l'orange, j'ai finalement pris le Fauteuil Bubble vert. La teinte pistache est parfaite avec ma déco naturelle. Un coup de cœur absolu.",
    image: '',
    name: 'Marie-Claire Petit', role: 'Cliente vérifiée',
  },
  {
    text: "Le Canapé Bubble bleu est monumental. Sa présence dans mon loft est impressionnante. La qualité de fabrication est au rendez-vous, chaque détail est soigné.",
    image: '',
    name: 'Julien Bernard', role: 'Client vérifié',
  },
  {
    text: "Le Fauteuil Bubble orange illumine mon bureau à la maison. Je travaille en souriant depuis qu'il est là. MAISON SERENIA crée des pièces vraiment uniques.",
    image: '',
    name: 'Nathalie Girard', role: 'Cliente vérifiée',
  },
  {
    text: "Commandé le Canapé Bubble rouge pour ma salle de réception. Nos clients le remarquent immédiatement, c'est devenu la pièce signature de notre espace. Bravo MAISON SERENIA.",
    image: '',
    name: 'Pierre Morel', role: 'Client vérifié',
  },
];


// ─── Zoom Parallax Inspirations ───────────────────────────────────────────────

const parallaxImages = [
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80', alt: 'Salon contemporain' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80', alt: 'Canapé élégant' },
  { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', alt: 'Figurines' },
  { src: 'https://i.ibb.co/BVT612D7/IMG-2481.jpg', alt: 'Salle à manger' },
  { src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80', alt: 'Bibliothèque' },
  { src: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80', alt: 'Fauteuil design' },
  { src: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80', alt: 'Terrasse luxe' },
];

function InspirationsParallaxSection() {
  return (
    <section id="section-inspirations" className="scroll-mt-20">
      <FadeInSection>
        <div className="text-center py-16 px-6">
          <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">Galerie</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-black leading-tight">
            Inspirations
          </h2>
          <p className="mt-4 text-neutral-400 text-sm max-w-md mx-auto">
            Laissez-vous porter par nos univers. Faites défiler pour explorer.
          </p>
        </div>
      </FadeInSection>
      <ZoomParallax images={parallaxImages} />
    </section>
  );
}

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

function TestimonialsSection() {
  return (
    <FadeInSection>
      <section className="bg-white py-20">
        <div className="container z-10 mx-auto">
          <motionLib.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border border-black text-black py-1 px-4 rounded-full text-xs tracking-[0.2em] uppercase">
                Témoignages
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-5 text-center" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              Ce que disent nos clients
            </h2>
            <p className="text-center mt-5 text-neutral-500 text-sm">
              Des dizaine de clients satisfaits font confiance à MAISON SERENIA pour sublimer leur intérieur.
            </p>
          </motionLib.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}


// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-black text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              MAISON SERENIA
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              L&apos;art de vivre à la française. Des pièces intemporelles, conçues pour durer et sublimer votre intérieur.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Heart className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              {['Salon', 'Figurines', 'Salle à manger', 'Bureau', 'Terrasse', 'Luminaires'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trouvez nous sur */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Trouvez nous sur</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Instagram — @serenia_officiel', href: 'https://www.instagram.com/serenia_officiel' },
                { label: 'TikTok — @serenia_officiel', href: 'https://www.tiktok.com/@serenia_officiel' },
                { label: 'Facebook', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2026 MAISON SERENIA. Tous droits réservés.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Visa */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#1A1F71"/>
              <path d="M19.5 22H16.6L18.4 10H21.3L19.5 22Z" fill="white"/>
              <path d="M29.7 10.3C29.1 10.1 28.1 9.9 26.9 9.9C24 9.9 21.9 11.4 21.9 13.6C21.9 15.2 23.4 16.1 24.5 16.6C25.6 17.1 26 17.5 26 18C26 18.8 25 19.1 24.1 19.1C22.8 19.1 22.1 18.9 21 18.4L20.6 18.2L20.1 21C20.8 21.3 22.1 21.6 23.4 21.6C26.5 21.6 28.5 20.1 28.5 17.7C28.5 16.4 27.7 15.4 25.9 14.6C24.9 14.1 24.3 13.8 24.3 13.2C24.3 12.7 24.9 12.2 26.1 12.2C27.1 12.2 27.8 12.4 28.4 12.6L28.7 12.7L29.7 10.3Z" fill="white"/>
              <path d="M33.4 17.7L34.5 14.7C34.5 14.7 34.8 13.9 35 13.4L35.2 14.6L35.9 17.7H33.4ZM38 10H35.7C35 10 34.4 10.2 34.1 10.9L29.7 22H32.8L33.4 20.3H37.1L37.5 22H40.2L38 10Z" fill="white"/>
              <path d="M14.4 10L11.5 18.2L11.2 16.7C10.6 14.8 8.8 12.7 6.8 11.7L9.5 22H12.6L17.5 10H14.4Z" fill="white"/>
              <path d="M8.5 10H3.8L3.7 10.3C7.3 11.2 9.8 13.3 10.8 16L9.8 11C9.6 10.3 9.1 10 8.5 10Z" fill="#F9A51A"/>
            </svg>
            {/* Mastercard */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#252525"/>
              <circle cx="18" cy="16" r="8" fill="#EB001B"/>
              <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
              <path d="M24 9.8A8 8 0 0 1 27.5 16 8 8 0 0 1 24 22.2 8 8 0 0 1 20.5 16 8 8 0 0 1 24 9.8Z" fill="#FF5F00"/>
            </svg>
            {/* PayPal */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
              <path d="M32.3 11.2c.1-.7 0-1.2-.4-1.7-.5-.5-1.3-.8-2.4-.8h-4.1c-.3 0-.5.2-.6.5l-1.7 10.8c0 .2.1.4.3.4h2.4l.6-3.8v.1c.1-.3.3-.5.6-.5h1.3c2.5 0 4.5-1 5-4 .2-.8.1-1.5-.1-2Z" fill="#009EE3"/>
              <path d="M19.3 11.2c.1-.7 0-1.2-.4-1.7C18.4 9 17.6 8.7 16.5 8.7h-4.1c-.3 0-.5.2-.6.5L10.1 20c0 .2.1.4.3.4H13l.7-4.4.6-3.8c.1-.3.3-.5.6-.5H16c2.1 0 3.7-.9 4.2-3.2.3-1 .1-1.7 0-2.1.3.2.8.5 1 .8Z" fill="#113984"/>
              <path d="M20.3 13.3c-.1.4-.3.8-.5 1.1-.7 1.7-2.3 2.3-4.5 2.3h-1.1c-.3 0-.5.2-.6.5l-.7 4.4-.2 1.2c0 .2.1.3.3.3h2.4c.3 0 .5-.2.5-.4v-.1l.4-2.7v-.1c0-.3.2-.4.5-.4h.3c2.1 0 3.8-.9 4.2-3.4.2-1 .1-1.9-.5-2.5-.2-.1-.3-.2-.5-.2Z" fill="#009EE3"/>
            </svg>
            {/* Apple Pay */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#000"/>
              <path d="M17.3 12.1c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.3-.7 2.1.8.1 1.5-.4 2-1ZM18 13.2c-1.1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.7 1.7-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.7.8 0 1.1-.5 2.1-.5 1 0 1.2.5 2.1.5.9 0 1.5-.8 2.1-1.7.6-.9.9-1.8.9-1.8s-1.7-.7-1.7-2.5c0-1.6 1.3-2.3 1.3-2.3s-.7-1.7-2.3-1.7ZM26.8 10.4h-2.4c-.1 0-.3.1-.3.3v10.8c0 .2.1.3.3.3h1.2c.2 0 .3-.1.3-.3v-3.4h1.1c2 0 3.3-1 3.3-3 0-1.9-1.3-2.7-3.5-2.7Zm.2 4.5h-.9v-3.2h.9c1.1 0 1.7.5 1.7 1.6 0 1.1-.6 1.6-1.7 1.6ZM33 16.2c-.7 0-1.1.3-1.4.8l-.3-1.2v-.1h-.9c-.1 0-.2.1-.2.2v6.3c0 .1.1.2.2.2h1.1c.1 0 .2-.1.2-.2V20c.3.4.8.7 1.4.7 1.3 0 2.1-1.1 2.1-2.7-.1-1.5-.9-1.8-2.2-1.8Zm-.3 3.9c-.7 0-1.1-.5-1.1-1.3 0-.8.4-1.3 1.1-1.3.6 0 1 .5 1 1.3 0 .8-.4 1.3-1 1.3Z" fill="white"/>
            </svg>
            {/* Google Pay */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
              <path d="M23.5 16.7v2.9h-.9v-7.2h2.5c.6 0 1.2.2 1.6.6.4.4.7.9.7 1.5s-.2 1.1-.7 1.5c-.4.4-1 .6-1.6.6l-1.6.1Zm0-3.5v2.7h1.6c.4 0 .7-.1.9-.4.3-.2.4-.5.4-.9s-.1-.7-.4-.9c-.3-.2-.6-.4-.9-.4l-1.6-.1ZM29 15c.7 0 1.2.2 1.6.5.4.3.6.8.6 1.4v2.9H30v-.7h-.1c-.4.5-.9.8-1.5.8-.5 0-1-.2-1.4-.5-.4-.3-.5-.7-.5-1.2 0-.5.2-.9.5-1.2.4-.3.9-.4 1.5-.4.5 0 1 .1 1.3.3v-.2c0-.3-.1-.6-.4-.8-.3-.2-.6-.3-.9-.3-.5 0-.9.2-1.2.6l-.8-.5c.5-.7 1.2-1 2-.7Zm-1.2 3.5c0 .2.1.4.3.5.2.1.4.2.6.2.3 0 .7-.1.9-.4.3-.3.4-.6.4-.9-.3-.2-.6-.3-1.1-.3-.3 0-.6.1-.8.3-.2.1-.3.4-.3.6ZM35.7 15.1l-3 6.9h-.9l1.1-2.4-1.9-4.5h1l1.4 3.4 1.3-3.4h1Z" fill="#3C4043"/>
              <path d="M20.1 16.3c0-.3 0-.5-.1-.8h-3.7v1.5h2.1c-.1.5-.4.9-.8 1.2v1h1.3c.7-.7 1.2-1.7 1.2-2.9Z" fill="#4285F4"/>
              <path d="M16.3 20.2c1.1 0 2-.4 2.7-1l-1.3-1c-.4.3-.9.4-1.4.4-1 0-1.9-.7-2.2-1.7h-1.3v1c.7 1.4 2.1 2.3 3.5 2.3Z" fill="#34A853"/>
              <path d="M14.1 16.9c-.2-.5-.2-1 0-1.5v-1h-1.3c-.6 1.2-.6 2.6 0 3.8l1.3-1.3Z" fill="#FBBC04"/>
              <path d="M16.3 13.7c.6 0 1.1.2 1.5.6l1.1-1.1c-.7-.7-1.6-1-2.6-1-1.4 0-2.8.9-3.5 2.3l1.3 1c.3-1 1.2-1.8 2.2-1.8Z" fill="#EA4335"/>
            </svg>
            {/* Amex */}
            <svg viewBox="0 0 48 32" className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#2557D6"/>
              <path d="M8 14l-1.5 4h3L8 14ZM9.5 20H6.5l-.5 1.5H4l3-8h2l3 8h-2l-.5-1.5ZM14.5 12.5l1.5 4 1.5-4H20v8h-2v-5.5l-1.5 4h-1l-1.5-4V20.5h-2v-8h2.5ZM24 12.5v8h-2v-8h2ZM27.5 12.5l3 5v-5h2v8h-2l-3-5v5h-2v-8h2ZM37 17.5v1.5h4v1.5h-4v.5h4v1.5h-6v-8h6v1.5h-4v1.5h4v.5h-4Z" fill="white"/>
            </svg>
            {/* Klarna */}
            <div className="h-7 px-3 rounded flex items-center justify-center bg-[#FFB3C7] opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-black text-[11px] font-bold tracking-tight">Klarna</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Figurines Section ────────────────────────────────────────────────────────

function FigurinesSection() {
  const figurines = products
    .filter((p) => p.category === 'Figurines')
    .sort((a, b) => b.id - a.id);

  return (
    <FadeInSection>
      <section id="section-figurines" className="py-16 max-w-7xl mx-auto px-6 lg:px-10 scroll-mt-20">
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2 text-neutral-400">Collection</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            Figurines
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {figurines.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-neutral-100 mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`transition-transform duration-500 group-hover:scale-105 ${product.id === 33 ? 'object-cover object-center scale-110' : 'object-contain p-4'}`}
                  />
                  <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="block w-full text-center bg-black text-white text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-xl">
                      Voir le produit
                    </span>
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
                <p className="text-black font-bold text-sm">{product.price.toLocaleString('fr-FR')} €</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('Tous');

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#section-salon') setActiveFilter('Salon');
      else if (hash === '#section-bureau') setActiveFilter('Bureau');
      else if (hash === '#section-salon' || hash === '') setActiveFilter('Tous');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const filteredProducts = activeFilter === 'Tous'
    ? products.filter((p) => p.category !== 'Figurines')
    : products.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-white">
      <Navbar hasBar={false} />

      {/* Hero */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
        title="MAISON SERENIA"
        date="Collection 2026"
        scrollToExpand="Défiler pour découvrir"
        textBlend={true}
      >
        <div className="w-full">
          {/* Tagline */}
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.4em] uppercase mb-4 text-neutral-400">L&apos;art de vivre à la française</p>
              <h2 className="text-3xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                Mobilier d&apos;exception,<br />intérieurs sublimés
              </h2>
              <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed text-sm">
                MAISON SERENIA crée des espaces de vie où le raffinement rencontre le confort.
              </p>
            </div>
          </FadeInSection>

          {/* Bestsellers / Coups de cœur */}
          <BestsellersSection />


          {/* Promo full-width banner */}
          <PromoBanner />

          {/* Bubble Promo Carousel */}
          <BubblePromoCarousel />

          {/* Category Quick Nav */}
          <CategoryQuickNav />

          {/* Products Grid with filter */}
          <section id="section-salon" className="py-16 scroll-mt-20">
            <div id="section-bureau" />
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <FadeInSection>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="text-xs tracking-[0.4em] uppercase mb-2 text-neutral-400">Sélection</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                      Nos Pièces Signatures
                    </h2>
                    <p className="text-neutral-500 mt-2 max-w-lg text-sm">
                      {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  {/* Sort (decorative) */}
                  <select className="text-xs border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-500 outline-none hover:border-neutral-400 transition-colors cursor-pointer self-start md:self-end">
                    <option>Trier : Recommandés</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                    <option>Nouveautés</option>
                  </select>
                </div>
                <ProductFilterBar active={activeFilter} onChange={setActiveFilter} />
              </FadeInSection>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
          {/* Figurines Section */}
          <FigurinesSection />

        </div>
      </ScrollExpandMedia>

      <InteriorShowcaseSection />
      <InspirationsParallaxSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
