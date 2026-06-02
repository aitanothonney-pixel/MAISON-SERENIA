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
import { MinimalistHero } from '@/components/ui/minimalist-hero';
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

const promoMessages = [
  '✦  Nouveautés Collection Automne — Découvrez nos dernières pièces  ✦',
  '✦  Paiement en 3× sans frais disponible  ✦  Service client disponible 6j/7  ✦',
];

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % promoMessages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-black text-white text-xs py-2.5 px-4 flex items-center justify-center relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="tracking-widest text-center pr-6"
        >
          {promoMessages[msgIndex]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

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
    { label: 'Salon', href: '#' },
    { label: 'Chambre', href: '#' },
    { label: 'Salle à manger', href: '#' },
    { label: 'Bureau', href: '#' },
    { label: 'Terrasse', href: '#' },
    { label: 'Inspirations', href: '#' },
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
                {['Canapé', 'Lit', 'Table', 'Fauteuil', 'Lampe'].map((s) => (
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

// ─── Trust Strip ──────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = [
    { icon: <Star className="w-4 h-4" />, text: '4,9/5 — +2 400 avis clients' },
    { icon: <Star className="w-4 h-4" />, text: 'Paiement en 3× sans frais' },
    { icon: <Star className="w-4 h-4" />, text: 'Fait avec passion' },
  ];

  return (
    <div className="bg-neutral-50 border-y border-neutral-100 py-3 overflow-hidden">
      <div className="flex items-center justify-center gap-0">
        {/* Static on lg, scroll animation on sm */}
        <div className="hidden lg:flex items-center gap-0 w-full max-w-7xl mx-auto px-6 justify-between">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-neutral-500 whitespace-nowrap">
              {item.icon}
              <span>{item.text}</span>
              {i < items.length - 1 && <span className="ml-6 text-neutral-200">|</span>}
            </div>
          ))}
        </div>
        {/* Mobile marquee */}
        <div className="lg:hidden relative overflow-hidden w-full">
          <motion.div
            animate={{ x: '-50%' }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap w-max"
          >
            {[...items, ...items].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-neutral-500">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Quick Nav ───────────────────────────────────────────────────────

const categoryNav = [
  { label: 'Salon', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { label: 'Chambre', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80' },
  { label: 'Salle à manger', image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&q=80' },
  { label: 'Bureau', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80' },
  { label: 'Terrasse', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80' },
  { label: 'Luminaires', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=80' },
];

function CategoryQuickNav() {
  return (
    <FadeInSection>
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-xl font-serif font-bold text-black mb-8 tracking-tight">
          Parcourir par univers
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
          {categoryNav.map((cat) => (
            <a
              key={cat.label}
              href="#"
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 relative">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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

// ─── Bestsellers Section ──────────────────────────────────────────────────────

const bestsellerIds = [1, 3, 6, 9];

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
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 mb-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  {/* Bestseller badge */}
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    Best-seller
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
                <p className="text-black font-bold text-sm">{product.price.toLocaleString('fr-FR')} €</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Product Card (with optional badge) ──────────────────────────────────────

const newProductIds = [2, 5, 7, 13, 17, 21, 25, 29];
const saleProductIds = [4, 8, 14, 19, 23, 27];

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-transparent hover:border-neutral-200 transition-all duration-500 shadow-sm hover:shadow-lg"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
                {product.price.toLocaleString('fr-FR')} €
              </span>
              {isSale && (
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

const filterCategories = ['Tous', 'Salon', 'Chambre', 'Salle à manger', 'Bureau', 'Terrasse'];

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
                alt="Chambre"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Chambre</div>
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
    text: "Le canapé Élysée est d'une qualité exceptionnelle. Le tissu est doux, les coussins gardent leur forme après des mois d'utilisation. Un achat que je ne regrette absolument pas.",
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    name: 'Sophie Marchand', role: 'Cliente vérifiée',
  },
  {
    text: 'La table à manger Opéra en chêne massif est tout simplement magnifique. Le bois est chaleureux, les finitions sont parfaites. Ma salle à manger a été transformée.',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'Thomas Lefebvre', role: 'Client vérifié',
  },
  {
    text: "Livraison rapide, emballage soigné, et le fauteuil Rivoli est encore plus beau en vrai qu'en photo. MAISON SERENIA a un sens du détail remarquable.",
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: 'Camille Rousseau', role: 'Cliente vérifiée',
  },
  {
    text: "J'ai commandé l'ensemble chambre — lit Vendôme, chevets et commode. L'harmonie des pièces est parfaite, et la qualité justifie amplement le prix. Je recommande vivement.",
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    name: 'Antoine Dubois', role: 'Client vérifié',
  },
  {
    text: "Le service client est au top. J'avais une question sur les dimensions du buffet, ils ont répondu en moins d'une heure avec des photos supplémentaires. Impeccable.",
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    name: 'Isabelle Fontaine', role: 'Cliente vérifiée',
  },
  {
    text: 'Ma bibliothèque Haussmann est arrivée parfaitement assemblée. Les étagères sont robustes et le bois sent bon. Je suis conquise.',
    image: 'https://randomuser.me/api/portraits/women/66.jpg',
    name: 'Marie-Claire Petit', role: 'Cliente vérifiée',
  },
  {
    text: "Le lampadaire Molière en laiton est une vraie pièce de décoration. La lumière qu'il diffuse est douce et chaleureuse. Mes invités le remarquent à chaque visite.",
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
    name: 'Julien Bernard', role: 'Client vérifié',
  },
  {
    text: 'Excellent rapport qualité-prix sur la table basse Concorde en marbre. Elle est lourde (signe de qualité !), facile à nettoyer et sublime mon salon.',
    image: 'https://randomuser.me/api/portraits/women/88.jpg',
    name: 'Nathalie Girard', role: 'Cliente vérifiée',
  },
  {
    text: "Les chaises Palais Royal sont stables, confortables et résistantes. Après un an d'usage quotidien, elles sont comme neuves. Une belle réussite.",
    image: 'https://randomuser.me/api/portraits/men/99.jpg',
    name: 'Pierre Morel', role: 'Client vérifié',
  },
];

// ─── Brand Story (MinimalistHero) ─────────────────────────────────────────────

function BrandStorySection() {
  const navLinks = [
    { label: 'Collections', href: '#' },
    { label: 'Nouveautés', href: '#' },
    { label: 'Inspirations', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const socialLinks = [
    { icon: Share2, href: '#' },
    { icon: Heart, href: '#' },
    { icon: Globe, href: '#' },
  ];

  return (
    <FadeInSection>
      <div className="border-t border-neutral-100">
        <MinimalistHero
          logoText="MAISON SERENIA"
          navLinks={navLinks}
          mainText="Chaque meuble que nous créons est pensé pour traverser les années sans perdre son élégance. Un savoir-faire artisanal, des matières nobles, une âme intemporelle."
          readMoreLink="#"
          imageSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
          imageAlt="Canapé MAISON SERENIA"
          overlayText={{ part1: 'l\'art', part2: 'du beau.' }}
          socialLinks={socialLinks}
          locationText="Paris, France"
          className="bg-white"
        />
      </div>
    </FadeInSection>
  );
}

// ─── Zoom Parallax Inspirations ───────────────────────────────────────────────

const parallaxImages = [
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80', alt: 'Salon contemporain' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80', alt: 'Canapé élégant' },
  { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', alt: 'Chambre raffinée' },
  { src: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200&q=80', alt: 'Salle à manger' },
  { src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80', alt: 'Bibliothèque' },
  { src: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80', alt: 'Fauteuil design' },
  { src: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80', alt: 'Terrasse luxe' },
];

function InspirationsParallaxSection() {
  return (
    <section>
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

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <FadeInSection>
      <section className="py-28 bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/40">Newsletter</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            L&apos;art de vivre, chaque semaine
          </h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
            Recevez nos nouvelles collections, nos conseils déco exclusifs et nos offres privilèges directement dans votre boîte mail.
          </p>
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-semibold text-lg">
              Merci ! Vous êtes désormais inscrit(e) à notre newsletter.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-5 py-3 rounded-xl text-sm focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-100 text-black font-semibold px-6 py-3 rounded-xl text-sm tracking-wider uppercase transition-colors duration-300"
              >
                S&apos;inscrire
              </button>
            </form>
          )}
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
              {['Salon', 'Chambre', 'Salle à manger', 'Bureau', 'Terrasse', 'Luminaires'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              {['À Propos', 'Nos Showrooms', 'Presse', 'Carrières', 'Blog', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2024 MAISON SERENIA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [showBar, setShowBar] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filteredProducts = activeFilter === 'Tous'
    ? products
    : products.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-white">
      {/* Announcement bar (fixed top) */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ height: 'auto' }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
          >
            <AnnouncementBar onDismiss={() => setShowBar(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar hasBar={showBar} />

      {/* Hero */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
        title="MAISON SERENIA"
        date="Collection 2024"
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

          {/* Trust strip */}
          <TrustStrip />

          {/* Bestsellers / Coups de cœur */}
          <BestsellersSection />

          {/* Category Quick Nav */}
          <CategoryQuickNav />

          {/* Products Grid with filter */}
          <section className="py-16">
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
        </div>
      </ScrollExpandMedia>

      <InteriorShowcaseSection />
      <BrandStorySection />
      <InspirationsParallaxSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
