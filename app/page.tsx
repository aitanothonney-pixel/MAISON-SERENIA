'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronRight, Share2, Heart, Globe,
  Search, X, Star, Minus, Plus, Trash2,
} from 'lucide-react';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { ProductCard as ColorSelectorCard } from '@/components/ui/product-card';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { products, getVariantGroup } from '@/lib/products';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

function FadeInSection({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────


// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ hasBar, onWishlistOpen, onCartOpen }: { hasBar: boolean; onWishlistOpen: () => void; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (hasBar ? 80 : 40));
    window.addEventListener('scroll', onScroll);
    const t = setTimeout(() => setMounted(true), 800);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [hasBar]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQ('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen]);

  const navItems = [
    { label: 'Salon', href: '#section-salon' },
    { label: 'Bureau', href: '#section-bureau' },
    { label: 'Figurines', href: '#section-figurines' },
    { label: 'Été', href: '#section-ete' },
  ];

  return (
    <header
      ref={searchRef}
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${hasBar ? 'top-8' : 'top-0'} ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent'
      }`}
    >
      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-3 items-center h-16 lg:h-[68px]">
        {/* Left — Desktop nav */}
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
        {/* Mobile burger — left on mobile */}
        <div className="lg:hidden flex items-center">
          <button
            className="p-2 flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
            <span className={`block w-5 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-black' : 'bg-white'}`} />
          </button>
        </div>

        {/* Center — Logo */}
        <div className="flex justify-center">
          <a
            href="#"
            className={`text-base lg:text-lg font-bold tracking-[0.22em] uppercase transition-colors duration-300 shrink-0 ${
              scrolled ? 'text-black' : 'text-white'
            }`}
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          >
            MAISON SERENIA
          </a>
        </div>

        {/* Right — Icons */}
        <div className="flex items-center gap-1 justify-end">
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
          <button onClick={onWishlistOpen} className="relative p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block" aria-label="Favoris">
            <Heart className={`w-5 h-5 transition-all ${mounted && wishCount > 0 ? 'fill-red-500 text-red-500' : scrolled ? 'text-black' : 'text-white'}`} />
            {mounted && wishCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {wishCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button onClick={onCartOpen} className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Panier">
            <ShoppingBag className={`w-5 h-5 ${scrolled ? 'text-black' : 'text-white'}`} />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-black text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
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

              {/* Quick pills */}
              {!searchQ && (
                <div className="flex flex-wrap gap-2 mt-3 mb-1">
                  {['Canapé', 'Fauteuil', 'Bubble', 'Figurine', 'Bureau'].map((s) => (
                    <button key={s} onClick={() => setSearchQ(s)} className="text-xs border border-neutral-200 rounded-full px-3 py-1 hover:border-black hover:text-black transition-colors text-neutral-500">{s}</button>
                  ))}
                </div>
              )}

              {/* Live suggestions — always show all products, highlight matches */}
              {(() => {
                const q = searchQ.toLowerCase().trim();
                const isMatch = (p: typeof products[0]) => {
                  if (!q) return false;
                  const name = p.name.toLowerCase();
                  const cat = p.category.toLowerCase();
                  // Match if query is a substring of the name or category
                  if (name.includes(q) || cat.includes(q)) return true;
                  // Also match each word of the query against the name
                  return q.split(' ').every((word) => name.includes(word) || cat.includes(word));
                };
                const hasQuery = q.length >= 1;
                const sorted = hasQuery
                  ? [...products].sort((a, b) => (isMatch(b) ? 1 : 0) - (isMatch(a) ? 1 : 0))
                  : products;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mt-3 space-y-1 max-h-80 overflow-y-auto"
                  >
                    {sorted.map((p) => {
                      const matched = hasQuery && isMatch(p);
                      const dimmed = hasQuery && !matched;
                      const promoPrice = p.name.includes('Bubble') ? Math.round(p.price * 0.7) : p.price;
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={() => { setSearchOpen(false); setSearchQ(''); }}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${matched ? 'bg-neutral-50 ring-1 ring-black/10' : 'hover:bg-neutral-50'} ${dimmed ? 'opacity-30' : 'opacity-100'}`}
                        >
                          <div className={`w-12 h-12 rounded-lg overflow-hidden bg-white border flex-shrink-0 flex items-center justify-center transition-all ${matched ? 'border-neutral-300' : 'border-neutral-100'} ${p.name.includes('Bubble') || p.category === 'Figurines' ? 'p-1' : ''}`}>
                            <img src={p.images[0]} alt={p.name} className={`w-full h-full ${p.name.includes('Bubble') || p.category === 'Figurines' ? 'object-contain' : 'object-cover'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate group-hover:underline ${matched ? 'font-bold text-black' : 'font-semibold text-black'}`}>{p.name}</p>
                            <p className="text-xs text-neutral-400">{p.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0 flex flex-col items-end gap-0.5">
                            {p.name.includes('Bubble') && (
                              <span className="bg-black text-white text-xs font-bold tracking-widest uppercase px-2.5 py-1">−30%</span>
                            )}
                            <p className="text-sm font-bold text-black font-price">{promoPrice.toLocaleString('fr-FR')} €</p>
                            {p.name.includes('Bubble') && <p className="text-[10px] text-neutral-400 line-through font-price">{p.price.toLocaleString('fr-FR')} €</p>}
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                );
              })()}
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



// ─── Full-width Promo Banner ──────────────────────────────────────────────────

function PromoBanner() {
  const [lightbox, setLightbox] = useState(false);

  return (
    <FadeInSection>
      <section className="w-full overflow-hidden relative">
        <div className="relative h-56 md:h-72">
          {/* Clickable background image */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            aria-label="Voir la photo en grand"
          >
            <Image
              src="https://i.ibb.co/j9h5SNVC/IMG-2392.jpg"
              alt="Promo bannière"
              fill
              className="object-cover object-[center_70%]"
            />
          </button>
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 pointer-events-none">
            <p className="text-xs tracking-[0.35em] uppercase mb-3 text-white/60">Édition limitée</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Jusqu&apos;à −30% sur<br className="hidden md:block" /> la collection Salon
            </h2>
            <p className="text-white/70 text-sm mb-7 max-w-md">
              Offre valable seulement 3 semaines — dans la limite des stocks disponibles.
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
            <a
              href="#bubble-promo"
              className="pointer-events-auto bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-none hover:bg-neutral-100 transition-colors"
            >
              Voir les produits en promotion
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <motion.img
              src="https://i.ibb.co/j9h5SNVC/IMG-2392.jpg"
              alt="Promo bannière"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[95vw] max-h-[95vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeInSection>
  );
}

// ─── Bubble Promo Carousel ────────────────────────────────────────────────────

const bubblePromoProducts = [2, 10, 6, 13, 8, 22, 12, 7, 9];

function BubblePromoCarousel() {
  const items = products.filter((p) => bubblePromoProducts.includes(p.id))
    .sort((a, b) => bubblePromoProducts.indexOf(a.id) - bubblePromoProducts.indexOf(b.id));
  const { isWished, toggle } = useWishlist();
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
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2 text-neutral-400">Offre limitée · −30%</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Collection Bubble en promotion</h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => scroll('left')}
              animate={{ opacity: canLeft ? 1 : 0.25, scale: canLeft ? 1 : 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-9 h-9 border border-neutral-300 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
              aria-label="Précédent"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              animate={{ opacity: canRight ? 1 : 0.25, scale: canRight ? 1 : 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-9 h-9 border border-neutral-300 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
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
            <div key={product.id} className="group flex-shrink-0 w-64 md:w-72 snap-start">
              <Link href={`/products/${product.id}`}>
              <div className="relative overflow-hidden bg-neutral-50 mb-3 border border-neutral-100 transition-shadow duration-300 flex items-center justify-center" style={{ height: '200px' }}>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={300}
                  className={`w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-105 ${product.images[1] ? 'group-hover:opacity-0' : ''}`}
                />
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                  −30%
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                  className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                </button>
              </div>
              <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-black font-bold text-base font-price">{Math.round(product.price * 0.7).toLocaleString('fr-FR')} €</span>
                <span className="text-neutral-400 line-through text-xs font-price">{product.price.toLocaleString('fr-FR')} €</span>
              </div>
            </Link>
            </div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Bestsellers Section ──────────────────────────────────────────────────────

const bestsellerIds = [8, 22, 2, 10];

function BestsellersSection({ onToutVoir }: { onToutVoir: () => void }) {
  const bestsellers = bestsellerIds.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const { isWished, toggle } = useWishlist();

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
          <button onClick={onToutVoir} className="hidden sm:flex items-center gap-1 text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors border-b border-neutral-200 pb-0.5">
            Tout voir <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product, index) => (
            <div
              key={product.id}
              className="group overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className={`relative aspect-[4/3] overflow-hidden bg-white mb-3 ${product.name.includes('Bubble') ? 'p-3' : ''}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`transition-transform duration-600 group-hover:scale-105 ${product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                      Best-seller
                    </div>
                    <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                      −30%
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                    className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />)}
                  <span className="text-[10px] text-neutral-400 ml-1">(4,9)</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-black mb-0.5">{product.name}</h3>
                <p className="text-neutral-500 text-xs mb-1 line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-black font-bold text-base font-price">{Math.round(product.price * 0.7).toLocaleString('fr-FR')} €</p>
                  <p className="text-neutral-400 line-through text-xs font-price">{product.price.toLocaleString('fr-FR')} €</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Product Card (with optional badge) ──────────────────────────────────────

const newProductIds: number[] = [];
const saleProductIds: number[] = [];
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
  const isNew = newProductIds.includes(product.id);
  const isSale = saleProductIds.includes(product.id);
  const isBubble = bubbleProductIds.includes(product.id);
  const { isWished, toggle } = useWishlist();

  return (
    <div className="group relative bg-white overflow-hidden transition-all duration-500">
      <Link href={`/products/${product.id}`}>
        <div className={`relative overflow-hidden bg-white aspect-[4/3] ${product.name.includes('Bubble') || product.category === 'Figurines' || product.category === 'Été' ? 'p-4' : ''}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            style={isBubble ? { transform: product.id === 12 ? 'scale(1.3)' : [7, 8, 9, 10, 13].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' } : product.id === 34 ? { transform: 'scale(1.35)', transformOrigin: 'center center' } : undefined}
            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${isBubble && product.images[1] ? 'group-hover:opacity-0' : ''} ${product.category === 'Figurines' || product.category === 'Été' ? 'object-contain' : product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
          />
          {isBubble && product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              width={600}
              height={450}
              style={{ transform: product.id === 12 ? 'scale(1.3)' : [7, 8, 9, 10, 13].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' }}
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 object-contain"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isBubble ? (
              <span className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                −30%
              </span>
            ) : (
              <>
                {isNew && (
                  <span className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                    Nouveau
                  </span>
                )}
                {isSale && (
                  <span className="bg-white text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border border-neutral-200">
                    −20%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            className={`absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
          </button>

          {/* Quick view overlay — thin bottom bar */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="block w-full text-center bg-black text-white text-[9px] tracking-widest uppercase py-2.5">
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
              <span className="text-black font-bold text-base font-price">
                {isBubble ? Math.round(product.price * 0.7).toLocaleString('fr-FR') : product.price.toLocaleString('fr-FR')} €
              </span>
              {isBubble && (
                <span className="text-neutral-400 line-through text-xs font-price">
                  {product.price.toLocaleString('fr-FR')} €
                </span>
              )}
              {isSale && !isBubble && (
                <span className="text-neutral-400 line-through text-xs font-price">
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
    </div>
  );
}

// ─── Product Filter Bar ───────────────────────────────────────────────────────

const filterCategories = ['Tous', 'Salon', 'Bureau', 'Figurines', 'Bubble', 'Été'];

function ProductFilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-0 border-b border-neutral-100 mb-12">
      {filterCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-[11px] tracking-[0.25em] uppercase px-6 py-4 border-b-2 transition-all duration-200 -mb-px ${
            active === cat
              ? 'border-black text-black font-semibold'
              : 'border-transparent text-neutral-400 hover:text-black hover:border-neutral-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ─── Interior Showcase ────────────────────────────────────────────────────────

function InteriorShowcaseSection({ onCategoryClick }: { onCategoryClick: (cat: string, section: string) => void }) {
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
            {/* Salon */}
            <button onClick={() => onCategoryClick('Salon', 'section-salon')} className="col-span-2 row-span-2 relative overflow-hidden rounded-xl group cursor-pointer text-left">
              <img
                src="https://i.ibb.co/j9h5SNVC/IMG-2392.jpg"
                alt="Salon MAISON SERENIA"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/70" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs tracking-widest uppercase opacity-70">Collection</p>
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Salon</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white/20 backdrop-blur-sm border border-white/40 text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  Voir la collection →
                </span>
              </div>
            </button>

            {/* Figurines */}
            <button onClick={() => onCategoryClick('Figurines', 'section-figurines')} className="relative overflow-hidden rounded-xl group cursor-pointer">
              <img
                src="https://i.ibb.co/hxfV4W3d/IMG-0663.jpg"
                alt="Figurines"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-all duration-300 group-hover:from-black/60" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Figurines</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded-full translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  Voir →
                </span>
              </div>
            </button>

            {/* Bureau */}
            <button onClick={() => onCategoryClick('Bureau', 'section-bureau')} className="relative overflow-hidden rounded-xl group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80"
                alt="Bureau"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-all duration-300 group-hover:from-black/60" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Bureau</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded-full translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  Voir →
                </span>
              </div>
            </button>
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
    image: '', name: 'Sophie Marchand', role: 'Cliente vérifiée',
  },
  {
    text: "J'ai craqué pour le Canapé Bubble violet spécial et je ne le regrette pas une seconde. La couleur est encore plus intense en vrai, et on s'y enfonce comme dans un nuage.",
    image: '', name: 'Thomas Lefebvre', role: 'Client vérifié',
  },
  {
    text: "La Figurine KAWS câlin est absolument magnifique. Le niveau de détail est impressionnant, c'est une vraie pièce d'art. Je l'ai posée sur mon bureau et tout le monde la remarque.",
    image: '', name: 'Léa Fontaine', role: 'Cliente vérifiée',
  },
  {
    text: "Le Fauteuil Bubble bleu est exactement ce qu'il me fallait pour apporter du caractère à mon intérieur. La texture maille 3D est unique, je n'ai jamais vu ça ailleurs.",
    image: '', name: 'Camille Rousseau', role: 'Cliente vérifiée',
  },
  {
    text: "La Figurine KAWS brun monde est simplement splendide. La finition est irréprochable et l'emballage était parfait. Un cadeau idéal pour les amateurs de streetwear.",
    image: '', name: 'Hugo Blanc', role: 'Client vérifié',
  },
  {
    text: "Livraison soignée, montage facile, et le Canapé Bubble blanc est tout simplement magnifique. Il a complètement transformé mon salon. Mes amis sont jaloux !",
    image: '', name: 'Antoine Dubois', role: 'Client vérifié',
  },
  {
    text: "Le Bearbrick x Bape est incroyable. La collaboration est iconique et la qualité de la figurine est au niveau du prix. Je collectionne depuis des années et c'est une des meilleures pièces de ma collection.",
    image: '', name: 'Romain Vidal', role: 'Client vérifié',
  },
  {
    text: "Le Fauteuil Bubble rouge est une déclaration artistique à lui seul. Il donne une âme à toute la pièce. Je suis fan de la collection Bubble, je vais sûrement en commander un deuxième.",
    image: '', name: 'Isabelle Fontaine', role: 'Cliente vérifiée',
  },
  {
    text: "La Figurine Kaws noir 28 cm est arrivée parfaitement emballée. La qualité du vinyle est top, les finitions sont nettes. Je recommande MAISON SERENIA les yeux fermés.",
    image: '', name: 'Clémence Garnier', role: 'Cliente vérifiée',
  },
  {
    text: "J'ai hésité longtemps entre le vert et l'orange, j'ai finalement pris le Fauteuil Bubble vert. La teinte pistache est parfaite avec ma déco naturelle. Un coup de cœur absolu.",
    image: '', name: 'Marie-Claire Petit', role: 'Cliente vérifiée',
  },
  {
    text: "Le Bearbrick x Bape rose est une rareté. Je cherchais cette colorway depuis longtemps, super content de l'avoir trouvée ici. Livraison rapide et emballage impeccable.",
    image: '', name: 'Maxime Renard', role: 'Client vérifié',
  },
  {
    text: "Le Canapé Bubble bleu est monumental. Sa présence dans mon loft est impressionnante. La qualité de fabrication est au rendez-vous, chaque détail est soigné.",
    image: '', name: 'Julien Bernard', role: 'Client vérifié',
  },
  {
    text: "La Figurine KAWS gris monde est une merveille de précision. Les détails du globe terrestre sont parfaitement reproduits. Une pièce collector qui a toute sa place dans mon salon.",
    image: '', name: 'Aurélie Simon', role: 'Cliente vérifiée',
  },
  {
    text: "Le Fauteuil Bubble orange illumine mon bureau à la maison. Je travaille en souriant depuis qu'il est là. MAISON SERENIA crée des pièces vraiment uniques.",
    image: '', name: 'Nathalie Girard', role: 'Cliente vérifiée',
  },
  {
    text: "Le Bearbrick x Bape noir est impressionnant en vrai. La colorway est parfaite et la qualité est irréprochable. Je l'ai mis en vitrine et c'est la première chose que les gens remarquent.",
    image: '', name: 'Lucas Moreau', role: 'Client vérifié',
  },
  {
    text: "Commandé le Canapé Bubble rouge pour ma salle de réception. Nos clients le remarquent immédiatement, c'est devenu la pièce signature de notre espace. Bravo MAISON SERENIA.",
    image: '', name: 'Pierre Morel', role: 'Client vérifié',
  },
  {
    text: "La Figurine Kaws 28 cm est tout simplement parfaite. Le noir mat est élégant, la pose est emblématique. Un must-have pour tout fan de KAWS.",
    image: '', name: 'Sara Dupont', role: 'Cliente vérifiée',
  },
];



// ── Section Été ───────────────────────────────────────────────────────────────

function SummerProductsSection() {
  const allSummer = products.filter(p => p.category === 'Été');
  const seenGroups = new Set<number>();
  const summerProducts = allSummer.filter(p => {
    const group = getVariantGroup(p.id);
    if (!group) return true;
    const firstId = group[0].productId;
    if (seenGroups.has(firstId)) return false;
    seenGroups.add(firstId);
    return p.id === firstId;
  });
  const { isWished, toggle } = useWishlist();

  return (
    <FadeInSection>
      <section id="section-ete" className="py-14 max-w-7xl mx-auto px-6 lg:px-10 scroll-mt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">Collection Saisonnière</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Nos Produits Été</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {summerProducts.map((product, index) => (
            <div
              key={product.id}
              className="group overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-white mb-3 p-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-600 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                    className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />)}
                  <Star className="w-2.5 h-2.5 text-neutral-300" />
                  <span className="text-[10px] text-neutral-400 ml-1">(4,0)</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-black mb-0.5">{product.name}</h3>
                <p className="text-neutral-500 text-xs mb-1 line-clamp-1">{product.description}</p>
                <p className="text-black font-bold text-base font-price">{product.price.toFixed(2)} CHF</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </FadeInSection>
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
          <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
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
          </div>

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
      {/* Top bar */}
      <div className="h-px w-full bg-neutral-800" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-[0.2em] uppercase mb-4 text-white" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              MAISON SERENIA
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              L&apos;art de vivre à la française. Des pièces intemporelles, conçues pour durer et sublimer votre intérieur.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Salon', filter: 'Salon', section: 'section-salon' },
                { label: 'Figurines', filter: 'Figurines', section: 'section-figurines' },
                { label: 'Bureau', filter: 'Bureau', section: 'section-bureau' },
                { label: 'Été', filter: 'Été', section: 'section-ete' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={`#${item.section}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.filter !== 'Figurines' && item.filter !== 'Été') {
                        // Need to reach setActiveFilter — use hash to trigger it
                        window.location.hash = item.section;
                      }
                      setTimeout(() => document.getElementById(item.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" /> {item.label}
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
  const { isWished, toggle } = useWishlist();
  const figurines = products
    .filter((p) => p.category === 'Figurines')
    .sort((a, b) => b.id - a.id);

  return (
    <FadeInSection>
      <section id="section-figurines" className="py-16 max-w-7xl mx-auto px-6 lg:px-10 scroll-mt-20">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 text-neutral-400">Collection</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            Figurines
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {figurines.map((product, index) => (
            <div
              key={product.id}
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-white border border-neutral-100 mb-3 transition-shadow duration-300">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`object-contain transition-all duration-700 group-hover:scale-105 ${product.id === 34 ? 'p-1 scale-[1.35]' : 'p-4'}`}
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                    className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="block w-full text-center bg-black text-white text-[9px] tracking-widest uppercase py-2.5">
                      Voir le produit
                    </span>
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
                <p className="text-black font-bold text-base font-price">{product.price.toLocaleString('fr-FR')} €</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Wishlist Drawer ──────────────────────────────────────────────────────────

function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { ids, toggle } = useWishlist();
  const wishedProducts = products.filter((p) => ids.includes(p.id));
  const isBubble = (id: number) => [2, 6, 7, 8, 9, 10, 12, 13, 22].includes(id);

  useEffect(() => {
    if (open) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${sw}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <span className="font-serif font-semibold text-lg">Favoris</span>
                {ids.length > 0 && (
                  <span className="text-xs text-neutral-400 tracking-widest uppercase">{ids.length} article{ids.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {wishedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Heart className="w-12 h-12 text-neutral-200" />
                  <p className="font-serif text-lg text-neutral-400">Aucun favori pour l'instant</p>
                  <p className="text-sm text-neutral-300">Cliquez sur le cœur d'un produit pour l'ajouter ici.</p>
                  <button onClick={onClose} className="mt-4 text-xs tracking-widest uppercase border border-black px-6 py-3 rounded-none hover:bg-black hover:text-white transition-all duration-300">
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishedProducts.map((product) => {
                    const price = isBubble(product.id) ? Math.round(product.price * 0.7) : product.price;
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-3 border border-neutral-100 hover:border-neutral-200 transition-colors"
                      >
                        <Link href={`/products/${product.id}`} onClick={onClose} className="shrink-0 w-20 h-20 bg-neutral-50 overflow-hidden flex items-center justify-center">
                          <img src={product.images[0]} alt={product.name} className={`w-full h-full ${isBubble(product.id) ? 'object-contain p-2' : 'object-cover'}`} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${product.id}`} onClick={onClose}>
                            <p className="font-serif font-semibold text-sm text-black leading-snug line-clamp-2 hover:underline">{product.name}</p>
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">{product.category}</p>
                          <p className="font-bold text-sm text-black mt-1 font-price">{price.toLocaleString('fr-FR')} €</p>
                        </div>
                        <button
                          onClick={() => toggle(product.id)}
                          className="shrink-0 p-2 rounded-full hover:bg-red-50 transition-colors group"
                          aria-label="Retirer des favoris"
                        >
                          <Heart className="w-4 h-4 fill-red-400 text-red-400 group-hover:fill-red-600 group-hover:text-red-600 transition-colors" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty } = useCart();
  const [selected, setSelected] = useState<number[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const isBubble = (id: number) => [2, 6, 7, 8, 9, 10, 12, 13, 22].includes(id);

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return null;
    const price = isBubble(product.id) ? Math.round(product.price * 0.7) : product.price;
    return { ...item, product, price };
  }).filter(Boolean) as { id: number; qty: number; product: typeof products[0]; price: number }[];

  useEffect(() => {
    if (open) {
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${sw}px`;
      setSelected(items.map((x) => x.id));
      setCheckoutStep('cart');
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open, items]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectedItems = cartProducts.filter((x) => selected.includes(x.id));
  const total = selectedItems.reduce((sum, x) => sum + x.price * x.qty, 0);
  const totalQty = selectedItems.reduce((sum, x) => sum + x.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-serif font-semibold text-lg">Panier</span>
                {items.length > 0 && (
                  <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, x) => s + x.qty, 0)}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="w-12 h-12 text-neutral-200" />
                  <p className="font-serif text-lg text-neutral-400">Votre panier est vide</p>
                  <p className="text-sm text-neutral-300">Ajoutez des produits pour commencer.</p>
                  <button onClick={() => { onClose(); setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300); }} className="mt-4 text-xs tracking-widest uppercase border border-black px-6 py-3 rounded-none hover:bg-black hover:text-white transition-all duration-300">
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartProducts.map(({ id, qty, product, price }) => (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-start gap-3 p-3 border transition-all duration-200 cursor-pointer ${
                        selected.includes(id) ? 'border-black bg-neutral-50' : 'border-neutral-100 bg-white'
                      }`}
                      onClick={() => toggleSelect(id)}
                    >
                      {/* Checkbox */}
                      <div className={`mt-1 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        selected.includes(id) ? 'border-black bg-black' : 'border-neutral-300'
                      }`}>
                        {selected.includes(id) && <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>

                      {/* Image */}
                      <div className="shrink-0 w-20 h-20 bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <img src={product.images[0]} alt={product.name} className={`w-full h-full ${isBubble(id) ? 'object-contain p-2' : 'object-cover'}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <p className="font-serif font-semibold text-sm leading-snug line-clamp-2">{product.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{product.category}</p>
                        <p className="font-bold text-sm text-black mt-1 font-price">{price.toLocaleString('fr-FR')} €</p>
                        {/* Qty */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(id, qty - 1)}
                            className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center hover:border-black transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-5 text-center">{qty}</span>
                          <button
                            onClick={() => updateQty(id, qty + 1)}
                            className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center hover:border-black transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(id); }}
                        className="shrink-0 mt-1 p-1.5 rounded-full hover:bg-red-50 transition-colors text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
                {/* Select all */}
                <button
                  onClick={() => setSelected(selected.length === cartProducts.length ? [] : cartProducts.map(x => x.id))}
                  className="text-xs text-neutral-400 hover:text-black transition-colors tracking-widest uppercase"
                >
                  {selected.length === cartProducts.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Total ({totalQty} article{totalQty > 1 ? 's' : ''})</span>
                  <span className="font-price font-bold text-xl">{total.toLocaleString('fr-FR')} €</span>
                </div>
                <p className="text-[10px] text-neutral-400 -mt-2">* TVA comprise</p>

                {/* Checkout CTA */}
                <button
                  disabled={selectedItems.length === 0}
                  className="w-full bg-black text-white py-4 rounded-none font-bold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CONTINUER ({totalQty})
                </button>

                {/* PayPal + Apple Pay */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 border border-neutral-200 py-3 hover:border-neutral-400 transition-colors">
                    <svg viewBox="0 0 80 24" fill="none" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30.6 5.6H24c-.4 0-.7.3-.8.7l-2.4 15.2c0 .3.2.5.5.5h3.2c.4 0 .7-.3.8-.7l.6-4c.1-.4.4-.7.8-.7H29c3.4 0 5.3-1.6 5.8-4.8.2-1.4 0-2.5-.6-3.3-.7-.8-1.9-1.2-3.6-1.2Zm.6 4.7c-.3 1.8-1.7 1.8-3 1.8h-.8l.5-3.3h.9c.9 0 1.8 0 2.2.5.3.3.3.7.2 1Zm14.5 0h-3.3c-.3 0-.6.2-.7.5l-.2.9-.3-.4c-.8-1.2-2.7-1.6-4.6-1.6-4.3 0-8 3.3-8.7 7.9-.4 2.3.2 4.5 1.5 6 1.2 1.4 3 2 5 2 3.5 0 5.4-2.2 5.4-2.2l-.2.9c0 .3.2.5.5.5h3c.4 0 .7-.3.8-.7l1.8-11.3c0-.2-.2-.5-.5-.5Zm-4.7 7.6c-.4 2.2-2.1 3.7-4.4 3.7-1.1 0-2-.4-2.6-1-.6-.7-.8-1.6-.6-2.7.3-2.1 2.1-3.7 4.3-3.7 1.1 0 2 .3 2.6 1 .6.7.9 1.6.7 2.7Zm19.9-7.6h-3.3c-.3 0-.6.2-.8.4l-4.8 7-2-6.7c-.1-.4-.5-.7-.9-.7h-3.2c-.3 0-.5.3-.4.6l3.8 11.2-3.6 5c-.2.3 0 .7.3.7h3.3c.3 0 .6-.1.8-.4l11.5-16.6c.2-.2 0-.5-.3-.5h-.4Z" fill="#003087"/>
                      <path d="M69 5.6h-6.6c-.4 0-.7.3-.8.7l-2.4 15.2c0 .3.2.5.5.5h3.5c.3 0 .5-.2.6-.5l.7-4.2c.1-.4.4-.7.8-.7h2.1c3.4 0 5.3-1.6 5.8-4.8.2-1.4 0-2.5-.6-3.3-.7-.8-1.9-1.2-3.6-1.2l.5.3Zm.6 4.7c-.3 1.8-1.7 1.8-3 1.8h-.8l.5-3.3h.9c.9 0 1.8 0 2.2.5.3.3.3.7.2 1Zm14.5 0h-3.3c-.3 0-.6.2-.7.5l-.2.9-.3-.4c-.8-1.2-2.7-1.6-4.6-1.6-4.3 0-8 3.3-8.7 7.9-.4 2.3.2 4.5 1.5 6 1.2 1.4 3 2 5 2 3.5 0 5.4-2.2 5.4-2.2l-.2.9c0 .3.2.5.5.5h3c.4 0 .7-.3.8-.7l1.8-11.3c0-.2-.2-.5-.5-.5Zm-4.7 7.6c-.4 2.2-2.1 3.7-4.4 3.7-1.1 0-2-.4-2.6-1-.6-.7-.8-1.6-.6-2.7.3-2.1 2.1-3.7 4.3-3.7 1.1 0 2 .3 2.6 1 .6.7.9 1.6.7 2.7Z" fill="#009CDE"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-black py-3 hover:bg-neutral-800 transition-colors">
                    <svg viewBox="0 0 40 16" fill="none" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.4 3.8c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.3-.7 2.1.8.1 1.5-.4 2-1ZM8 4.9c-1.1-.1-2 .6-2.5.6S4.2 4.9 3.3 4.9c-1.1 0-2.2.7-2.7 1.7-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.7.8 0 1.1-.5 2.1-.5 1 0 1.2.5 2.1.5.9 0 1.5-.8 2.1-1.7.6-.9.9-1.8.9-1.8S8.9 10.7 8.9 8.9c0-1.6 1.3-2.3 1.3-2.3S9.5 4.9 8 4.9ZM16.5 2.1h-2.4c-.1 0-.3.1-.3.3v10.8c0 .2.1.3.3.3h1.2c.2 0 .3-.1.3-.3V9.8h1.1c2 0 3.3-1 3.3-3 0-1.9-1.3-2.7-3.5-2.7Zm.2 4.5h-.9V3.4h.9c1.1 0 1.7.5 1.7 1.6 0 1.1-.6 1.6-1.7 1.6ZM22.7 6.9c-.7 0-1.1.3-1.4.8l-.3-1.2v-.1h-.9c-.1 0-.2.1-.2.2v6.3c0 .1.1.2.2.2h1.1c.1 0 .2-.1.2-.2V10.7c.3.4.8.7 1.4.7 1.3 0 2.1-1.1 2.1-2.7-.1-1.5-.9-1.8-2.2-1.8Zm-.3 3.9c-.7 0-1.1-.5-1.1-1.3 0-.8.4-1.3 1.1-1.3.6 0 1 .5 1 1.3 0 .8-.4 1.3-1 1.3ZM29.4 5.8l-3 6.9h-.9l1.1-2.4-1.9-4.5h1l1.4 3.4 1.3-3.4h1Z" fill="white"/>
                    </svg>
                    <span className="text-white text-xs font-medium">Pay</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [sortBy, setSortBy] = useState('recommandes');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flashCat, setFlashCat] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#section-salon') setActiveFilter('Salon');
      else if (hash === '#section-bureau') setActiveFilter('Bureau');
      else if (hash === '#section-figurines') setActiveFilter('Figurines');
      else if (hash === '#tous' || hash === '') setActiveFilter('Tous');
      if (hash === '#tous') {
        setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    // Handle initial hash on page load
    if (window.location.hash === '#tous') {
      setActiveFilter('Tous');
      setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }

    // Ouvrir le tiroir wishlist si ?wishlist=open dans l'URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('wishlist') === 'open') {
      setWishlistOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const shuffledAll = useMemo(() => {
    const arr = [...products.filter(p => p.category !== 'Été')];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseProducts = activeFilter === 'Tous'
    ? shuffledAll
    : activeFilter === 'Bubble'
      ? products.filter((p) => p.name.includes('Bubble'))
      : activeFilter === 'Été'
        ? (() => {
            const seenGroups = new Set<number>();
            return products.filter(p => {
              if (p.category !== 'Été') return false;
              const grp = getVariantGroup(p.id);
              if (grp) {
                const firstId = grp[0].productId;
                if (seenGroups.has(firstId)) return false;
                seenGroups.add(firstId);
                return p.id === firstId;
              }
              return true;
            });
          })()
        : products.filter((p) => p.category === activeFilter && p.category !== 'Été');

  const filteredProducts = [...baseProducts].sort((a, b) => {
    if (sortBy === 'prix-asc') return a.price - b.price;
    if (sortBy === 'prix-desc') return b.price - a.price;
    if (sortBy === 'nouveautes') return b.id - a.id;
    return 0;
  });

  return (
    <div className="bg-white">
      <Navbar hasBar={false} onWishlistOpen={() => setWishlistOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Category flash transition */}
      <AnimatePresence>
        {flashCat && (
          <motion.div
            key={flashCat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-white pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="text-neutral-300 text-xs tracking-[0.5em] uppercase mb-4">Collection</p>
              <p
                className="text-black text-6xl md:text-8xl tracking-tight"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontWeight: 300, fontStyle: 'italic' }}
              >{flashCat}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
          {/* Hero Section */}
          <section
            className="relative flex flex-col items-center justify-center min-h-screen bg-white bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://i.ibb.co/j9h5SNVC/IMG-2392.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Subtle overlay for text contrast */}
            <div className="absolute inset-0 bg-white/20" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center relative z-10"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-black tracking-widest uppercase mb-2"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', letterSpacing: '0.15em' }}
              >
                MAISON
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-black tracking-widest uppercase mb-8"
                style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', letterSpacing: '0.15em' }}
              >
                SERENIA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xs tracking-[0.4em] uppercase text-neutral-400 mb-4"
              >
                Collection 2026
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-[10px] tracking-[0.3em] uppercase text-neutral-300 font-medium"
              >
                Défiler pour découvrir
              </motion.p>
            </motion.div>
          </section>

          {/* Section Été */}
          <SummerProductsSection />

          {/* Bestsellers / Coups de cœur */}
          <BestsellersSection onToutVoir={() => {
            setActiveFilter('Bubble');
            setSortBy('recommandes');
            setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
          }} />


          {/* Promo full-width banner */}
          <PromoBanner />

          {/* Bubble Promo Carousel */}
          <BubblePromoCarousel />

          {/* Products Grid with filter */}
          <section id="section-salon" className="py-16 scroll-mt-20">
            <div id="section-bureau" />
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <FadeInSection>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-2 text-neutral-400">Sélection</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                      Nos Pièces Signatures
                    </h2>
                    <p className="text-neutral-500 mt-2 max-w-lg text-sm">
                      {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs border border-neutral-200 px-4 py-2.5 text-neutral-500 outline-none hover:border-neutral-400 transition-colors cursor-pointer self-start md:self-end"
                  >
                    <option value="recommandes">Trier : Recommandés</option>
                    <option value="prix-asc">Prix croissant</option>
                    <option value="prix-desc">Prix décroissant</option>
                    <option value="nouveautes">Nouveautés</option>
                  </select>
                </div>
                <ProductFilterBar active={activeFilter} onChange={setActiveFilter} />
              </FadeInSection>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeFilter}-${sortBy}`}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                  }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 40, scale: 0.92 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                      }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
      </motion.div>

      {/* ── Blog/Gallery Section ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-4">Inspiration</p>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-wide mb-3" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              Découvrez notre univers
            </h2>
            <div className="divider-gold w-16 mx-auto" />
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
            {/* Paysage large */}
            <div className="lg:col-span-2 row-span-1 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop"
                alt="Blog image 1"
                width={800}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Portrait */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=600&fit=crop"
                alt="Blog image 2"
                width={400}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Carré */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"
                alt="Blog image 3"
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Portrait */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=600&fit=crop"
                alt="Blog image 4"
                width={400}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Carré */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1564157191865-71ceaafce078?w=400&h=400&fit=crop"
                alt="Blog image 5"
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Paysage */}
            <div className="lg:col-span-2 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop"
                alt="Blog image 6"
                width={800}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Portrait */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop"
                alt="Blog image 7"
                width={400}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Paysage large */}
            <div className="lg:col-span-3 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1000&h=400&fit=crop"
                alt="Blog image 8"
                width={1000}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Carré */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1574394615383-655b15b41beb?w=400&h=400&fit=crop"
                alt="Blog image 9"
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Carré */}
            <div className="overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1457361552529-c4a2c6b1d0d5?w=400&h=400&fit=crop"
                alt="Blog image 10"
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Paysage */}
            <div className="lg:col-span-2 overflow-hidden bg-neutral-100">
              <Image
                src="https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=400&fit=crop"
                alt="Blog image 11"
                width={800}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      <TestimonialsSection />
      <Footer />
    </div>
  );
}
