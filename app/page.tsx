'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronRight, Share2, Heart, Globe,
  Search, X, Star, ArrowLeft, ArrowRight, Clock, TrendingUp,
  Truck, Shield, RotateCcw, ArrowUp, Home as HomeIcon, Gift,
} from 'lucide-react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { motion as motionLib } from 'motion/react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { products, getVariantGroup, collapseVariantDuplicates } from '@/lib/products';
import { categoryToSlug } from '@/lib/collections';
import { BUNDLES, BUNDLE_PRICE } from '@/lib/bundles';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';
import { Logo } from '@/components/ui/logo';
import { useAnnouncementBarVisible } from '@/components/ui/announcement-bar';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { formatPrice, useCurrency } from '@/lib/currency';
import { WELCOME_CODE } from '@/components/ui/welcome-popup';

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

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

function ScrollProgressBar() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollPercent(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        backgroundColor: '#C9A96E',
        width: scrollPercent + '%',
        zIndex: 9999,
        transition: 'width 0.1s linear',
      }}
    />
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-50 bottom-20 right-4 md:bottom-8 md:right-8 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-700 transition-colors shadow-lg"
          aria-label="Retour en haut"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────


// ─── Side Menu Drawer ─────────────────────────────────────────────────────────

function SideMenuDrawer({ open, onClose, onSectionNav }: { open: boolean; onClose: () => void; onSectionNav: (section: string, filter?: string) => void }) {
  const cur = useCurrency();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const goToSection = (section: string, filter?: string) => {
    onClose();
    onSectionNav(section, filter);
  };

  const [menuQ, setMenuQ] = useState('');
  const menuMatches = (() => {
    const q = menuQ.toLowerCase().trim();
    if (q.length < 1) return [];
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      return name.includes(q) || cat.includes(q) || q.split(' ').every((w) => name.includes(w) || cat.includes(w));
    }).slice(0, 8);
  })();

  // Métadonnées connues par catégorie — toute nouvelle catégorie ajoutée au
  // catalogue apparaît automatiquement ici avec des valeurs par défaut.
  const categoryMeta: Record<string, { name?: string; desc: string; section: string; imgId?: number }> = {
    'Salon': { desc: 'Canapés & Fauteuils Bubble', section: 'section-salon', imgId: 10 },
    'Meubles': { desc: 'Meubles & pièces d\'intérieur', section: 'section-bureau' },
    'Décorations': { desc: 'Sculptures KAWS Collector', section: 'section-figurines', imgId: 34 },
  };

  const categoryOrder = ['Salon', 'Meubles', 'Décorations'];
  const orderedCategories = [...new Set(products.map((p) => p.category))].sort(
    (a, b) => {
      const ia = categoryOrder.indexOf(a);
      const ib = categoryOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    },
  );

  const collections = [
    ...orderedCategories.map((cat) => {
      const meta = categoryMeta[cat];
      const count = products.filter((p) => p.category === cat).length;
      return {
        name: meta?.name ?? cat,
        desc: `${meta?.desc ?? 'Nouvelle collection'} · ${count} pièce${count > 1 ? 's' : ''}`,
        section: meta?.section ?? 'section-salon',
        filter: cat,
        slug: categoryToSlug(cat),
        img: (meta?.imgId ? products.find((p) => p.id === meta.imgId) : products.find((p) => p.category === cat))?.images[0] ?? '',
      };
    }),
    {
      name: 'Collection Bubble',
      desc: 'La collection signature · −30%',
      section: 'section-salon',
      filter: 'Bubble',
      slug: 'bubble',
      img: products.find((p) => p.id === 22)?.images[0] ?? '',
    },
  ];

  const services = [
    { label: 'Contactez-nous', href: '/contact' },
    { label: 'Suivi de commande', href: '/livraison' },
    { label: 'Questions fréquentes', href: '/faq' },
    { label: 'Retours & Échanges', href: '/retours' },
    { label: 'À propos de nous', href: '/a-propos' },
  ];

  const informations = [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
    { label: 'Conditions générales de vente', href: '/cgv' },
    { label: 'Gestion des cookies', href: '/confidentialite' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[80]"
          />
          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 left-0 h-full w-[92vw] max-w-md bg-white z-[90] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 flex-shrink-0">
              <Logo color="black" size="sm" onClick={onClose} />
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500 hover:text-black transition-colors"
              >
                Fermer <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* RECHERCHE */}
              <div className="px-6 py-5 border-b border-neutral-100">
                <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-3 focus-within:border-[#C9A96E] transition-colors">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={menuQ}
                    onChange={(e) => setMenuQ(e.target.value)}
                    placeholder="Rechercher un produit…"
                    className="w-full text-sm outline-none bg-transparent text-black placeholder:text-neutral-400"
                  />
                  {menuQ && (
                    <button onClick={() => setMenuQ('')} aria-label="Effacer">
                      <X className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  )}
                </div>
                {menuMatches.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {menuMatches.map((p) => {
                      const promo = p.name.includes('Bubble') ? Math.round(p.price * 0.7) : p.price;
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 shrink-0 flex items-center justify-center overflow-hidden">
                            <img loading="lazy" decoding="async" src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate">{p.name}</p>
                            <p className="text-[10px] text-neutral-400">{p.category}</p>
                          </div>
                          <p className="text-sm font-bold text-black shrink-0">{formatPrice(promo, cur)}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {menuQ.trim().length >= 1 && menuMatches.length === 0 && (
                  <p className="text-xs text-neutral-400 mt-3">Aucun produit trouvé.</p>
                )}
              </div>
              {/* ACCUEIL */}
              <div className="px-6 py-5 border-b border-neutral-100">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-4 group"
                >
                  <span className="relative w-11 h-11 rounded-full border border-[#C9A96E]/50 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-[#C9A96E]">
                    <HomeIcon className="w-4 h-4 text-black" strokeWidth={1.4} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-semibold text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                      Accueil
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">Retour à la page principale</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors shrink-0" />
                </Link>
              </div>

              {/* NOS COLLECTIONS */}
              <div className="px-6 py-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Nos collections</p>
                <div className="flex flex-col gap-1">
                  {collections.map((c) => (
                    <Link
                      key={c.name}
                      href={`/collections/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 group text-left w-full rounded-xl px-2 -mx-2 py-2 hover:bg-[#FAF7F1] transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {c.img ? (
                          <img
                            src={c.img}
                            alt={c.name}
                            className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-semibold text-black leading-tight" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>{c.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{c.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#A07840] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* OFFRE EXCLUSIVE — promo card */}
              <div className="px-6 py-5 border-b border-neutral-100">
                <button
                  onClick={() => goToSection('section-packs')}
                  className="relative block w-full text-left p-5 overflow-hidden text-white transition-transform hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, #2a2521 0%, #17130f 100%)' }}
                >
                  <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.35), transparent 70%)' }} />
                  <div className="relative flex items-start gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)' }}>
                      <Gift className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#E8D5B0] mb-1">Offre exclusive</p>
                      <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                        Packs &amp; Ensembles
                      </h3>
                      <p className="text-sm text-white/70 mt-1.5 leading-relaxed">Jusqu&apos;à {formatPrice(200, cur)} d&apos;économies sur nos ensembles</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* AIDE & SERVICES */}
              <div className="px-6 py-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Aide &amp; Services</p>
                <div className="flex flex-col">
                  {services.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      onClick={onClose}
                      className="text-sm text-black py-2 hover:opacity-60 transition-opacity"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* INFORMATIONS */}
              <div className="px-6 py-6">
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Informations</p>
                <div className="flex flex-col">
                  {informations.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      onClick={onClose}
                      className="text-sm text-black py-2 hover:opacity-60 transition-opacity"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex-shrink-0">
              <p className="text-xs text-neutral-600 flex items-center gap-2">
                <span aria-hidden>🚚</span>
                <span>Livraison offerte dès {formatPrice(40, cur)} · Suisse</span>
              </p>
              <p className="text-[11px] text-neutral-400 mt-1.5">© 2026 Maison Serenia</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ hasBar, onWishlistOpen, onCartOpen, onSectionNav }: { hasBar: boolean; onWishlistOpen: () => void; onCartOpen: () => void; onSectionNav: (section: string, filter?: string) => void }) {
  const cur = useCurrency();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recent-searches') || '[]');
      if (Array.isArray(stored)) setRecentSearches(stored);
    } catch { /* ignore */ }
  }, []);

  const saveSearch = (term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    setRecentSearches((prev) => {
      const next = [t, ...prev.filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, 6);
      try { localStorage.setItem('recent-searches', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try { localStorage.removeItem('recent-searches'); } catch { /* ignore */ }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (hasBar ? 76 : 40));
    window.addEventListener('scroll', onScroll);
    const t = setTimeout(() => setMounted(true), 800);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [hasBar]);

  useEffect(() => {
    if (!searchFocused) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchFocused(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [searchFocused]);

  const hoverBg = scrolled ? 'hover:bg-black/5' : 'hover:bg-white/15';
  const textColor = scrolled ? 'text-black' : 'text-white';
  const iconColor = scrolled ? 'text-black' : 'text-white';

  return (
    <>
    <header
      className={`fixed left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${hasBar ? 'top-10' : 'top-0'} ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-3 items-center h-16 lg:h-[68px]">
        {/* LEFT — Menu + Search */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Menu button (all breakpoints) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex items-center gap-2 px-2.5 py-2 transition-colors ${hoverBg}`}
            aria-label="Menu"
          >
            <span className="flex flex-col gap-[3px]">
              <span className={`block w-4 h-[1.5px] ${scrolled ? 'bg-black' : 'bg-white'}`} />
              <span className={`block w-4 h-[1.5px] ${scrolled ? 'bg-black' : 'bg-white'}`} />
              <span className={`block w-4 h-[1.5px] ${scrolled ? 'bg-black' : 'bg-white'}`} />
            </span>
            <span className={`hidden sm:inline text-[11px] tracking-[0.3em] uppercase ${textColor}`} style={{ fontFamily: 'var(--font-jost, sans-serif)', fontWeight: 400 }}>Menu</span>
          </button>

          {/* Search trigger — opens full-screen search overlay */}
          <button
            onClick={() => setSearchFocused(true)}
            className={`hidden lg:flex items-center gap-2 px-3 py-2 border transition-colors ${
              scrolled
                ? 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-400'
                : 'border-white/25 bg-white/5 hover:bg-white/10 text-white/60'
            }`}
            aria-label="Rechercher"
          >
            <Search className={`w-4 h-4 ${scrolled ? 'text-neutral-400' : 'text-white/70'}`} />
            <span className="w-52 xl:w-64 text-xs text-left tracking-wide" style={{ fontFamily: 'var(--font-jost, sans-serif)' }}>Que recherchez-vous ?</span>
          </button>
        </div>

        {/* CENTER — Logo */}
        <div className="flex justify-center">
          <Logo color={scrolled ? 'black' : 'white'} size="md" />
        </div>

        {/* RIGHT — CONTACTEZ-NOUS + user + cart */}
        <div className="flex items-center gap-1 justify-end">
          <Link
            href="/contact"
            className={`hidden lg:inline-block text-[11px] tracking-[0.3em] uppercase px-3 py-2 transition-colors ${textColor} ${hoverBg}`}
            style={{ fontFamily: 'var(--font-jost, sans-serif)', fontWeight: 400 }}
          >
            Contactez-nous
          </Link>

          {/* Favoris (opens wishlist) */}
          <button
            onClick={onWishlistOpen}
            className={`relative w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
              scrolled ? 'border-black/15 hover:border-black' : 'border-white/30 hover:border-white'
            }`}
            aria-label="Favoris"
          >
            <Heart className={`w-4 h-4 transition-colors ${mounted && wishCount > 0 ? 'fill-[#C9A96E] text-[#C9A96E]' : iconColor}`} strokeWidth={1.3} />
            {mounted && wishCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}
              >
                {wishCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className={`relative w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
              scrolled ? 'border-black/15 hover:border-black' : 'border-white/30 hover:border-white'
            }`}
            aria-label="Panier"
          >
            <ShoppingBag className={`w-4 h-4 ${iconColor}`} strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

    {/* Full-screen search overlay */}
    <AnimatePresence>
      {searchFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto"
        >
          {/* Sticky top bar — easy back */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-neutral-100">
            <div className="max-w-4xl mx-auto px-5 md:px-8 h-16 grid grid-cols-3 items-center">
              <button
                onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                className="group flex items-center gap-2.5 py-2 -ml-1 pr-1 justify-self-start"
                aria-label="Retour à la boutique"
              >
                <span className="relative w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 overflow-hidden transition-colors duration-300 group-hover:border-black">
                  <span className="absolute inset-0 bg-black scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out" />
                  <ArrowLeft className="relative w-4 h-4 text-black group-hover:text-white transition-all duration-300 group-hover:-translate-x-0.5" strokeWidth={1.5} />
                </span>
                <span className="hidden sm:inline text-[10px] tracking-[0.3em] uppercase font-semibold text-neutral-500 group-hover:text-black transition-colors duration-300">Retour</span>
              </button>
              <div className="justify-self-center">
                <Logo color="black" size="sm" />
              </div>
              <button
                onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-black transition-colors justify-self-end"
                aria-label="Fermer la recherche"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-20">
            {/* Big search input */}
            <div className="relative border-b-2 border-neutral-900 mb-3 transition-colors focus-within:border-[#C9A96E]">
              <input
                type="text"
                autoFocus
                placeholder="Rechercher un meuble, une pièce…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveSearch(searchQ); }}
                className="w-full text-xl md:text-3xl font-light tracking-tight py-4 pr-14 outline-none bg-transparent text-black placeholder:text-neutral-300 placeholder:font-light"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              />
              {searchQ ? (
                <button
                  onClick={() => setSearchQ('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
                  aria-label="Effacer"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              ) : (
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 text-neutral-300 pointer-events-none" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mb-12">Appuyez sur <span className="font-medium text-neutral-500">Échap</span> ou « Retour » pour revenir à la boutique.</p>

            {/* ── Idle state (no query) ── */}
            {!searchQ && (
              <div className="space-y-12">
                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-400">
                        <Clock className="w-3.5 h-3.5" /> Recherches récentes
                      </p>
                      <button onClick={clearRecentSearches} className="text-[11px] text-neutral-400 hover:text-black transition-colors">Effacer</button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSearchQ(s)}
                          className="flex items-center gap-2 text-sm bg-neutral-100 rounded-full px-4 py-2 hover:bg-neutral-200 transition-colors text-neutral-700"
                        >
                          <Search className="w-3.5 h-3.5 text-neutral-400" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular searches */}
                <div>
                  <p className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-4">
                    <TrendingUp className="w-3.5 h-3.5" /> Recherches populaires
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: 'Canapé', q: 'Canapé' },
                      { label: 'Meuble TV', q: 'Meuble TV' },
                      { label: 'Table', q: 'Table' },
                      { label: 'Commode', q: 'Commode' },
                      { label: 'Bubble', q: 'Bubble' },
                      { label: 'Tableaux', q: 'Tableau' },
                    ].map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSearchQ(s.q)}
                        className="text-[11px] tracking-[0.18em] uppercase font-medium border border-neutral-200 px-4 py-2.5 text-neutral-600 hover:border-[#C9A96E] hover:text-[#8a6d38] hover:bg-[#C9A96E]/5 transition-all duration-200"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collections shortcuts */}
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-4">Explorer les collections</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      // Meubles : scène d'intérieur — plein cadre
                      { slug: 'meubles', label: 'Meubles', cat: 'Meubles', id: null, fit: 'cover', position: 'center' },
                      // Salon : Canapé d'angle 3 places crème
                      { slug: 'salon', label: 'Salon', cat: null, id: 87, fit: 'cover', position: 'center' },
                      // Bubble : Canapé Bubble blanc mis en avant
                      { slug: 'bubble', label: 'Bubble', cat: null, id: 10, fit: 'cover', position: 'center' },
                      // Décorations : Bearbrick x Bape noir (figurine haute → contain)
                      { slug: 'figurines', label: 'Décorations', cat: null, id: 38, fit: 'contain', position: 'center' },
                    ].map((c) => {
                      const rep = c.id != null
                        ? products.find((p) => p.id === c.id)
                        : products.find((p) => p.category === c.cat);
                      const isContain = c.fit === 'contain';
                      return (
                        <Link
                          key={c.slug}
                          href={`/collections/${c.slug}`}
                          onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                          className="group relative aspect-[4/5] overflow-hidden bg-white"
                        >
                          {rep && (
                            <img
                              src={rep.images[0]}
                              alt={c.label}
                              className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${isContain ? 'object-contain scale-125' : 'object-cover'}`}
                              style={{ objectPosition: c.position }}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                            <span className="text-white text-xs tracking-[0.15em] uppercase font-medium drop-shadow">{c.label}</span>
                            <ArrowRight className="w-4 h-4 text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-4">Nos suggestions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-6">
                    {[61, 63, 74, 71, 35, 68].map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 6).map((p) => {
                      const prod = p!;
                      const promoPrice = prod.name.includes('Bubble') ? Math.round(prod.price * 0.7) : prod.price;
                      const contain = prod.name.includes('Bubble') || prod.category === 'Décorations' || prod.category === 'Été';
                      return (
                        <Link
                          key={prod.id}
                          href={`/products/${prod.id}`}
                          onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                          className="group"
                        >
                          <div className={`relative aspect-square overflow-hidden bg-white mb-2 ${contain ? 'p-3' : ''}`}>
                            <img loading="lazy" decoding="async" src={prod.images[0]} alt={prod.name} className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${contain ? 'object-contain' : 'object-cover'}`} />
                          </div>
                          <p className="text-[13px] font-semibold text-black leading-tight truncate group-hover:underline">{prod.name}</p>
                          <p className="text-xs text-neutral-500 price-luxe mt-0.5">{formatPrice(promoPrice, cur)}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Results ── */}
            {(() => {
              const q = searchQ.toLowerCase().trim();
              if (q.length < 1) return null;
              const isMatch = (p: typeof products[0]) => {
                const name = p.name.toLowerCase();
                const cat = p.category.toLowerCase();
                if (name.includes(q) || cat.includes(q)) return true;
                return q.split(' ').every((word) => name.includes(word) || cat.includes(word));
              };
              const results = products.filter(isMatch);
              if (results.length === 0) {
                return (
                  <div className="text-center py-16">
                    <p className="font-serif text-2xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Aucun résultat</p>
                    <p className="text-sm text-neutral-400">Rien ne correspond à « {searchQ} ». Essayez un autre mot-clé.</p>
                  </div>
                );
              }
              return (
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 mb-5">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {results.slice(0, 30).map((p) => {
                      const promoPrice = p.name.includes('Bubble') ? Math.round(p.price * 0.7) : p.price;
                      const contain = p.name.includes('Bubble') || p.category === 'Décorations' || p.category === 'Été';
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={() => { saveSearch(searchQ); setSearchFocused(false); setSearchQ(''); }}
                          className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-neutral-50 transition-colors group"
                        >
                          <div className={`w-16 h-16 overflow-hidden bg-white border border-neutral-100 flex-shrink-0 flex items-center justify-center ${contain ? 'p-1.5' : ''}`}>
                            <img loading="lazy" decoding="async" src={p.images[0]} alt={p.name} className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate group-hover:underline">{p.name}</p>
                            <p className="text-[11px] tracking-wide uppercase text-neutral-400 mt-0.5">{p.category}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <p className="text-sm font-bold text-black price-luxe">{formatPrice(promoPrice, cur)}</p>
                            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#C9A96E] transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <SideMenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSectionNav={onSectionNav} />
    </>
  );
}

// ─── Category Quick Nav ───────────────────────────────────────────────────────



// ─── Full-width Promo Banner ──────────────────────────────────────────────────

function PromoBanner() {
  const [lightbox, setLightbox] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Durée de l'offre : 2 jours et 34 minutes à partir de la première visite du client.
    const DURATION = (2 * 24 * 60 + 34) * 60 * 1000; // ms
    let deadline = Number(localStorage.getItem('promo-deadline'));
    if (!deadline || Number.isNaN(deadline)) {
      deadline = Date.now() + DURATION;
      localStorage.setItem('promo-deadline', String(deadline));
    }
    const calc = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <FadeInSection>
      <section className="w-full overflow-hidden relative">
        <div className="relative min-h-[560px] md:min-h-[600px] py-14 md:py-16">
          {/* Clickable background image */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            aria-label="Voir la photo en grand"
          >
            <Image
              src="https://i.ibb.co/RkJCsW7S/IMG-0935.jpg"
              alt="Collection Salon Bubble en promotion"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </button>
          <div className="absolute inset-0 bg-black/65 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-6 pointer-events-none h-full">
            <p className="text-xs tracking-[0.35em] uppercase mb-3 text-[#C9A96E]">Édition limitée</p>
            <h2 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
              Jusqu&apos;à −30% sur<br className="hidden md:block" /> la collection Bubble
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-md">
              Offre à durée limitée — dans la limite des stocks disponibles.
            </p>

            {/* Countdown — grande visibilité */}
            <p className="text-[11px] tracking-[0.4em] uppercase text-[#C9A96E] mb-4">Offre se termine dans</p>
            <div className="flex gap-3 md:gap-5 mb-10">
              {[
                { value: pad(timeLeft.days), label: 'Jours' },
                { value: pad(timeLeft.hours), label: 'Heures' },
                { value: pad(timeLeft.minutes), label: 'Min' },
                { value: pad(timeLeft.seconds), label: 'Sec' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm border-2 border-[#C9A96E] px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[90px] shadow-2xl"
                >
                  <span
                    className="text-white text-3xl md:text-5xl font-bold leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
                  >
                    {value}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-[#C9A96E] uppercase tracking-[0.25em] mt-2 md:mt-3">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/promotions"
              className="pointer-events-auto bg-white text-black text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-none hover:bg-[#C9A96E] hover:text-white transition-colors"
            >
              Voir les produits en promotion
            </Link>
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
              src="https://i.ibb.co/RkJCsW7S/IMG-0935.jpg"
              alt="Collection Salon Bubble en promotion"
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
  const cur = useCurrency();
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
            <h2 className="text-2xl md:text-3xl font-semibold text-black" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>Collection Bubble en promotion</h2>
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
              <div className="relative overflow-hidden bg-white mb-3 border border-neutral-100 transition-shadow duration-300 flex items-center justify-center" style={{ height: '200px' }}>
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
                <span className="text-black font-bold text-sm price-luxe">{formatPrice(Math.round(product.price * 0.7), cur)}</span>
                <span className="text-neutral-400 line-through text-xs price-luxe">{formatPrice(product.price, cur)}</span>
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

const bestsellerIds = [81, 83, 77, 38];

function BestsellersSection({ onToutVoir }: { onToutVoir: () => void }) {
  const cur = useCurrency();
  const bestsellers = bestsellerIds.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const { isWished, toggle } = useWishlist();

  return (
    <FadeInSection>
      <section className="py-14 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#A07840] mb-2">Top ventes</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-black" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
              Coups de cœur
            </h2>
            <span className="block w-10 h-px mt-3" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
          </div>
          <button onClick={onToutVoir} className="hidden sm:flex items-center gap-1 text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors border-b border-neutral-200 pb-0.5">
            Tout voir <ChevronRight className="w-3 h-3" />
          </button>
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
                <div className={`relative aspect-[4/3] overflow-hidden bg-white mb-3 ${product.name.includes('Bubble') || product.category === 'Décorations' ? 'p-3' : ''}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`transition-transform duration-600 group-hover:scale-105 ${product.images[1] ? 'group-hover:opacity-0' : ''} ${product.name.includes('Bubble') || product.category === 'Décorations' ? 'object-contain' : 'object-cover'}`}
                  />
                  {product.images[1] && (
                    <Image
                      src={product.images[1]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${product.name.includes('Bubble') || product.category === 'Décorations' ? 'object-contain' : 'object-cover'}`}
                    />
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                      Best-seller
                    </div>
                    {product.name.includes('Bubble') && (
                      <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                        −30%
                      </div>
                    )}
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
                  <span className="text-[10px] text-neutral-400 ml-1">(4,3)</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-black mb-0.5">{product.name}</h3>
                <p className="text-neutral-500 text-xs mb-1 line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-2">
                  {product.name.includes('Bubble') ? (
                    <>
                      <p className="text-black font-bold text-sm price-luxe">{formatPrice(Math.round(product.price * 0.7), cur)}</p>
                      <p className="text-neutral-400 line-through text-xs price-luxe">{formatPrice(product.price, cur)}</p>
                    </>
                  ) : (
                    <p className="text-black font-bold text-sm price-luxe">{formatPrice(product.price, cur)}</p>
                  )}
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
  const cur = useCurrency();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isNew = newProductIds.includes(product.id);
  const isSale = saleProductIds.includes(product.id);
  const isBubble = bubbleProductIds.includes(product.id);
  const { isWished, toggle } = useWishlist();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative bg-white overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500"
    >
      <Link href={`/products/${product.id}`}>
        <div className={`relative overflow-hidden bg-white aspect-[4/3] ${product.name.includes('Bubble') || product.category === 'Décorations' || product.category === 'Été' ? 'p-4' : ''}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            style={isBubble ? { transform: product.id === 12 ? 'scale(1.3)' : [7, 8, 9, 10, 13].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' } : product.id === 34 ? { transform: 'scale(1.35)', transformOrigin: 'center center' } : undefined}
            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${product.images[1] ? 'group-hover:opacity-0' : ''} ${product.category === 'Décorations' || product.category === 'Été' ? 'object-contain' : product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              width={600}
              height={450}
              style={isBubble ? { transform: product.id === 12 ? 'scale(1.3)' : [7, 8, 9, 10, 13].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' } : undefined}
              className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${product.category === 'Décorations' || product.category === 'Été' || product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
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
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">{product.category}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
              <span className="text-[10px] text-neutral-400 tabular-nums">{(4.6 + (product.id % 4) * 0.1).toFixed(1)}</span>
            </div>
          </div>
          <h3 className="font-serif font-semibold text-black text-sm mb-1 leading-snug">{product.name}</h3>
          <p className="text-neutral-400 text-[11px] mb-3 line-clamp-1">{product.description}</p>
          <div className="h-px bg-neutral-100 mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm price-luxe">
                {formatPrice(isBubble ? Math.round(product.price * 0.7) : product.price, cur)}
              </span>
              {isBubble && (
                <span className="text-neutral-400 line-through text-xs price-luxe">
                  {formatPrice(product.price, cur)}
                </span>
              )}
              {isSale && !isBubble && (
                <span className="text-neutral-400 line-through text-xs price-luxe">
                  {formatPrice(Math.round(product.price * 1.25), cur)}
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

const filterCategories = ['Meubles', 'Salon', 'Bubble', 'Décorations'];

function ProductFilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-0 border-b border-neutral-100 mb-12 overflow-x-auto scrollbar-hide">
      {filterCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 text-[11px] tracking-[0.25em] uppercase px-4 sm:px-6 py-4 border-b-2 transition-all duration-200 -mb-px whitespace-nowrap ${
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

            {/* Décorations */}
            <button onClick={() => onCategoryClick('Décorations', 'section-figurines')} className="relative overflow-hidden rounded-xl group cursor-pointer">
              <img
                src="https://i.ibb.co/hxfV4W3d/IMG-0663.jpg"
                alt="Décorations"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-all duration-300 group-hover:from-black/60" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Décorations</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded-full translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  Voir →
                </span>
              </div>
            </button>

            {/* Meubles */}
            <button onClick={() => onCategoryClick('Meubles', 'section-bureau')} className="relative overflow-hidden rounded-xl group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80"
                alt="Meubles"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-all duration-300 group-hover:from-black/60" />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Meubles</div>
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

// ─── Shop by Category (bloc catégories bien visible, style meublier) ──────────

function ShopByCategory() {
  const tiles = [
    {
      slug: 'salon',
      label: 'Salon',
      desc: 'Canapés & fauteuils',
      img: 'https://i.ibb.co/MxPD6Ykm/Capture-d-e-cran-2026-08-06-a-01-52-14.png',
      big: true,
    },
    {
      slug: 'meubles',
      label: 'Meubles',
      desc: 'Tables, TV, rangements',
      img: 'https://i.ibb.co/SD1GmP8Z/Capture-d-e-cran-2026-08-06-a-01-08-32.png',
      big: false,
    },
    {
      slug: 'figurines',
      label: 'Décorations',
      desc: 'Pièces & objets déco',
      img: 'https://i.ibb.co/MXbJ1Ss/Capture-d-e-cran-2026-07-23-a-21-55-49.png',
      big: false,
    },
  ];

  return (
    <FadeInSection>
      <section className="py-14 md:py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A07840] mb-2">Notre univers</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-black" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
            Acheter par catégorie
          </h2>
          <span className="block w-10 h-px mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[232px]">
          {tiles.map((t) => (
            <Link
              key={t.slug}
              href={`/collections/${t.slug}`}
              className={`relative overflow-hidden rounded-2xl group text-left block ${t.big ? 'col-span-2 row-span-2' : 'col-span-1'}`}
            >
              <img
                src={t.img}
                alt={t.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/80" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className={`font-semibold ${t.big ? 'text-2xl md:text-3xl' : 'text-lg'}`} style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  {t.label}
                </p>
                <p className="text-white/75 text-xs md:text-sm mt-0.5">{t.desc}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold tracking-widest uppercase text-white/90 group-hover:text-[#E8D5B0] transition-colors">
                  Découvrir <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
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
    text: "La Figurine KAWS gris monde est simplement splendide. La finition est irréprochable et l'emballage était parfait. Un cadeau idéal pour les amateurs de streetwear.",
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


// ─── Bundles Section (Canapé + Fauteuil) ─────────────────────────────────────

function BundlesSection({ onCartOpen }: { onCartOpen: () => void }) {
  const cur = useCurrency();
  const { addItem } = useCart();
  const [addedKey, setAddedKey] = useState<string | null>(null);

  const bundles = BUNDLES;

  const handleBuy = (canapeId: number, fauteuilId: number, figurineId: number) => {
    addItem(canapeId);
    addItem(fauteuilId);
    addItem(figurineId);
    onCartOpen();
  };

  const handleAdd = (slug: string, canapeId: number, fauteuilId: number, figurineId: number) => {
    addItem(canapeId);
    addItem(fauteuilId);
    addItem(figurineId);
    setAddedKey(slug);
    setTimeout(() => setAddedKey((k) => (k === slug ? null : k)), 2000);
  };

  return (
    <FadeInSection>
      <section id="section-packs" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">Économisez plus</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-black" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
              Nos ensembles Bubble
            </h2>
            <p className="text-neutral-500 text-sm mt-3 max-w-md mx-auto">
              Le canapé et son fauteuil assortis — pensés ensemble, sublimés en couple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map(({ slug, canapeId, fauteuilId, figurineId, rabais }, index) => {
              const key = slug;
              const canape = products.find((p) => p.id === canapeId)!;
              const fauteuil = products.find((p) => p.id === fauteuilId)!;
              const figurine = products.find((p) => p.id === figurineId)!;
              const canapePromo = Math.round(canape.price * 0.7);
              const fauteuilPromo = Math.round(fauteuil.price * 0.7);
              const sum = canapePromo + fauteuilPromo + figurine.price;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-neutral-200 p-6 lg:p-7 flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="relative">
                      <Link href={`/products/${canapeId}`} className="flex items-center gap-4 group">
                        <div className="w-28 h-28 bg-white flex items-center justify-center flex-shrink-0">
                          <Image
                            src={canape.images[0]}
                            alt={canape.name}
                            width={140}
                            height={140}
                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-semibold text-black leading-snug group-hover:underline">{canape.name}</h3>
                          <p className="text-neutral-500 text-sm mt-1 price-luxe">{formatPrice(canapePromo, cur)}</p>
                        </div>
                      </Link>
                      <div className="flex justify-center my-3">
                        <span className="text-neutral-300 text-2xl leading-none">+</span>
                      </div>
                      <Link href={`/products/${fauteuilId}`} className="flex items-center gap-4 group">
                        <div className="w-28 h-28 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Image
                            src={fauteuil.images[0]}
                            alt={fauteuil.name}
                            width={140}
                            height={140}
                            style={fauteuilId === 2 ? { transform: 'scale(1.25)', transformOrigin: 'center center' } : undefined}
                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-semibold text-black leading-snug group-hover:underline">{fauteuil.name}</h3>
                          <p className="text-neutral-500 text-sm mt-1 price-luxe">{formatPrice(fauteuilPromo, cur)}</p>
                        </div>
                      </Link>
                      <div className="flex justify-center my-3">
                        <span className="text-neutral-300 text-2xl leading-none">+</span>
                      </div>
                      <Link href={`/products/${figurineId}`} className="flex items-center gap-4 group">
                        <div className="relative w-28 h-28 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Image
                            src={figurine.images[0]}
                            alt={figurine.name}
                            width={140}
                            height={140}
                            style={{ transform: 'scale(1.15)', transformOrigin: 'center center' }}
                            className="object-contain transition-transform duration-300 group-hover:scale-[1.22]"
                          />
                          <span className="absolute top-1 left-1 bg-black text-white text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5">
                            Offerte
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-semibold text-black leading-snug group-hover:underline">{figurine.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-neutral-400 line-through text-sm price-luxe">{formatPrice(figurine.price, cur)}</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Offerte</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="h-px bg-neutral-200 my-6" />

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">Prix du bundle</p>
                    <p className="text-neutral-400 line-through text-sm price-luxe">{formatPrice(sum, cur)}</p>
                  </div>
                  <p className="text-4xl font-bold text-black mb-5 leading-none price-luxe">
                    {formatPrice(BUNDLE_PRICE, cur)}
                  </p>

                  <div className="flex justify-center mb-3">
                    <span className="inline-block bg-neutral-100 text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 text-black font-semibold">
                      Rabais de {formatPrice(rabais, cur)}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6 text-center">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}
                    >
                      <Gift className="w-3 h-3 text-white" strokeWidth={2} />
                    </span>
                    <p className="text-[11px] tracking-wide text-neutral-600">
                      <span className="font-semibold text-black">{figurine.name}</span> offerte avec cet ensemble
                    </p>
                  </div>

                  <button
                    onClick={() => handleBuy(canapeId, fauteuilId, figurineId)}
                    className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-neutral-800 transition-colors"
                  >
                    Acheter cet ensemble
                  </button>
                  <button
                    onClick={() => handleAdd(slug, canapeId, fauteuilId, figurineId)}
                    className={`w-full text-xs font-bold tracking-widest uppercase py-3.5 mt-2.5 border transition-colors ${addedKey === slug ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-black text-black hover:bg-black hover:text-white'}`}
                  >
                    {addedKey === slug ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                  </button>
                  <Link
                    href={`/packs/${slug}`}
                    className="block w-full text-center border border-black text-black text-xs font-bold tracking-widest uppercase py-3.5 mt-2.5 hover:bg-black hover:text-white transition-colors"
                  >
                    Voir le pack
                  </Link>
                  <p className="text-[10px] text-neutral-400 text-center mt-3 tracking-wide">
                    Livraison gratuite à partir de {formatPrice(40, cur)}
                  </p>
                </motion.div>
              );
            })}
          </div>
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
          <motionLib.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border border-black text-black py-1 px-4 text-xs tracking-[0.2em] uppercase">
                Témoignages
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-5 text-center uppercase" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)', letterSpacing: '0.12em', fontWeight: 500 }}>
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

// ─── Trust Strip ─────────────────────────────────────────────────────────────

function TrustStrip() {
  const cur = useCurrency();
  const items = [
    { Icon: Truck, title: 'Livraison Offerte', subtitle: `dès ${formatPrice(40, cur)}` },
    { Icon: Shield, title: 'Paiement Sécurisé', subtitle: 'SSL 256-bit' },
    { Icon: RotateCcw, title: 'Retours Gratuits', subtitle: '30 jours' },
    { Icon: Star, title: '4.3/5', subtitle: '+1 200 clients' },
  ];
  return (
    <FadeInSection>
      <div className="w-full" style={{ background: '#f9f9f9' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
          {items.map(({ Icon, title, subtitle }) => (
            <div key={title} className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center group">
              <div className="relative w-12 h-12 rounded-full border border-[#C9A96E]/50 flex items-center justify-center transition-colors duration-300 group-hover:border-[#C9A96E]">
                <div className="absolute inset-1 rounded-full border border-neutral-200" />
                <Icon size={18} className="text-black relative" strokeWidth={1.2} />
              </div>
              <p className="text-xs font-bold tracking-wide text-black uppercase">{title}</p>
              {title === '4.3/5' ? (
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={11} className="text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
                  ))}
                  <span className="text-[10px] text-neutral-500 tracking-wide ml-1.5">{subtitle}</span>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 tracking-wide">{subtitle}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      localStorage.setItem('welcome-email', email);
      localStorage.setItem('welcome-discount', WELCOME_CODE);
      localStorage.setItem('welcome-popup-seen', '1');
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-white py-20 px-6 border-y border-neutral-100">
      <div className="max-w-2xl mx-auto text-center">
        <FadeInSection>
          <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold px-3 py-1.5 mb-6 text-[#A07840] bg-white/60" style={{ border: '1px solid rgba(160,120,64,0.3)' }}>
            <Gift className="w-3 h-3" /> −10% offerts à l&apos;inscription
          </div>
          <h2
            className="text-3xl md:text-4xl text-black mb-4"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            Restez informé de nos nouveautés
          </h2>
          <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
            Inscrivez-vous et recevez <span className="text-black font-medium">−10% sur votre première commande</span>, ainsi qu&apos;un accès en avant-première à nos nouvelles pièces et offres réservées aux membres.
          </p>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <p className="text-black text-base font-medium mb-4">Bienvenue&nbsp;! 🎉 Votre réduction est activée.</p>
              <div className="flex items-center justify-center gap-3 border-2 border-dashed border-[#C9A96E] bg-[#C9A96E]/10 px-4 py-3">
                <span className="text-lg font-bold tracking-[0.15em] text-[#A07840]">{WELCOME_CODE}</span>
                <span className="text-[11px] uppercase tracking-widest text-neutral-500">−10%</span>
              </div>
              <p className="text-neutral-500 text-[11px] mt-3">Le code s&apos;applique automatiquement dans votre panier.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex items-stretch border border-neutral-300 bg-white focus-within:border-black transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  className="flex-1 min-w-0 bg-transparent text-black placeholder-neutral-400 px-4 py-3.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-black text-white text-[11px] font-semibold tracking-[0.18em] uppercase px-5 sm:px-7 hover:bg-neutral-800 transition-colors whitespace-nowrap"
                >
                  Obtenir −10%
                </button>
              </div>
            </form>
          )}
          <p className="text-neutral-500 text-[11px] mt-4 tracking-wide">Pas de spam · Désabonnement en 1 clic</p>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Cookie Banner ────────────────────────────────────────────────────────────

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent');
    if (!stored) setVisible(true);
  }, []);

  const handleChoice = (choice: 'accepted' | 'refused') => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black shadow-lg border-t border-neutral-800"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
            <p className="text-sm text-neutral-300 text-center sm:text-left">
              Nous utilisons des cookies pour améliorer votre expérience.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => handleChoice('refused')}
                className="text-sm px-5 py-2 border border-white text-white rounded hover:bg-white/10 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="text-sm px-5 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer({ onSectionNav }: { onSectionNav: (section: string, filter?: string) => void }) {
  return (
    <footer className="bg-white text-neutral-500 border-t border-neutral-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo color="black" size="md" />
            </div>
            <p className="text-sm leading-relaxed mb-1 text-neutral-600">Mobilier & pièces d&apos;exception.</p>
            <p className="text-sm mb-5 text-neutral-500">Genève, Suisse 🇨🇭</p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/serenia_officiel" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-500 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@serenia_officiel" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-neutral-500 hover:text-black transition-colors text-sm font-medium tracking-wider">
                TikTok
              </a>
            </div>
          </div>

          {/* Col 2 — Nos Collections */}
          <div>
            <h4 className="text-black text-xs font-semibold tracking-[0.2em] uppercase mb-4">Nos Collections</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Salon', section: 'section-salon', filter: 'Salon' },
                { label: 'Meubles', section: 'section-bureau', filter: 'Meubles' },
                { label: 'Décorations', section: 'section-figurines', filter: 'Décorations' },
                { label: 'Promotions', section: 'section-salon', filter: 'Bubble' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onSectionNav(item.section, item.filter)}
                    className="text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Service Client */}
          <div>
            <h4 className="text-black text-xs font-semibold tracking-[0.2em] uppercase mb-4">Service Client</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Livraison', href: '/livraison' },
                { label: 'Retours & échanges', href: '/retours' },
                { label: 'Questions fréquentes', href: '/faq' },
                { label: 'Nous contacter', href: '/contact' },
                { label: 'À propos', href: '/a-propos' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-neutral-500 hover:text-black transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Informations */}
          <div>
            <h4 className="text-black text-xs font-semibold tracking-[0.2em] uppercase mb-4">Informations</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Mentions légales', href: '/mentions-legales' },
                { label: 'Conditions générales', href: '/cgv' },
                { label: 'Confidentialité', href: '/confidentialite' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-neutral-500 hover:text-black transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500">
              <Truck className="w-4 h-4 text-[#A07840]" strokeWidth={1.5} />
              Livraison offerte dès 40 CHF
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © 2026 Maison Serenia · Genève, Suisse
          </p>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {/* Visa */}
            <div className="h-7 w-11 rounded border border-neutral-200 bg-white flex items-center justify-center">
              <span className="text-[#1A1F71] text-[13px] font-bold italic tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>VISA</span>
            </div>
            {/* Mastercard */}
            <div className="h-7 w-11 rounded border border-neutral-200 bg-white flex items-center justify-center">
              <span className="relative inline-block w-6 h-4">
                <span className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#EB001B]" />
                <span className="absolute right-0 top-0 w-4 h-4 rounded-full bg-[#F79E1B] mix-blend-multiply" />
              </span>
            </div>
            {/* PayPal */}
            <div className="h-7 px-2.5 rounded border border-neutral-200 bg-white flex items-center justify-center">
              <span className="text-[12px] font-bold italic" style={{ fontFamily: 'Arial, sans-serif' }}>
                <span className="text-[#003087]">Pay</span><span className="text-[#009CDE]">Pal</span>
              </span>
            </div>
            {/* Apple Pay */}
            <div className="h-7 px-2.5 rounded bg-black flex items-center justify-center gap-0.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="white"><path d="M17 13.5c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.4-2c.7-1.1 1-2.2 1-2.3-.1 0-2.3-.9-2.3-3.2Zm-2-6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.4-.8 2.3.9.1 1.7-.4 2.2-1Z"/></svg>
              <span className="text-white text-[12px] font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>Pay</span>
            </div>
            {/* Amex */}
            <div className="h-7 w-11 rounded bg-[#2E77BC] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Décorations Section ────────────────────────────────────────────────────────

function DécorationsSection() {
  const cur = useCurrency();
  const { isWished, toggle } = useWishlist();
  const figurines = products
    .filter((p) => p.category === 'Décorations')
    .sort((a, b) => b.id - a.id);

  return (
    <FadeInSection>
      <section id="section-figurines" className="py-16 max-w-7xl mx-auto px-6 lg:px-10 scroll-mt-20">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 text-neutral-400">Collection</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            Décorations
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
                <div className="relative aspect-[4/3] overflow-hidden bg-white border border-neutral-100 mb-3 transition-shadow duration-300">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                <p className="text-black font-bold text-sm price-luxe">{formatPrice(product.price, cur)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

// ─── Wishlist Drawer ──────────────────────────────────────────────────────────

function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cur = useCurrency();
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
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#A07840] mb-1">Ma sélection</p>
                  <h2 className="font-serif text-xl text-black leading-none" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                    Favoris {ids.length > 0 && <span className="text-neutral-400 text-base">({ids.length})</span>}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 hover:bg-neutral-100 transition-colors" aria-label="Fermer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {wishedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-1" style={{ background: 'linear-gradient(135deg, #F5F1EA 0%, #EDE4D3 100%)' }}>
                    <Heart className="w-7 h-7 text-[#C9A96E]" strokeWidth={1.4} />
                  </div>
                  <p className="font-serif text-lg text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Votre liste de favoris est vide</p>
                  <p className="text-sm text-neutral-400 max-w-[240px]">Ajoutez vos coups de cœur en cliquant sur le cœur d&apos;un produit.</p>
                  <button onClick={onClose} className="mt-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-neutral-800 transition-colors">
                    Parcourir la boutique
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
                        <Link href={`/products/${product.id}`} onClick={onClose} className="shrink-0 w-20 h-20 bg-white border border-neutral-100 overflow-hidden flex items-center justify-center">
                          <img loading="lazy" decoding="async" src={product.images[0]} alt={product.name} className={`w-full h-full ${isBubble(product.id) ? 'object-contain p-2' : 'object-cover'}`} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${product.id}`} onClick={onClose}>
                            <p className="font-serif font-semibold text-sm text-black leading-snug line-clamp-2 hover:underline">{product.name}</p>
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">{product.category}</p>
                          <p className="font-bold text-sm text-black mt-1 price-luxe">{formatPrice(price, cur)}</p>
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

export default function Home() {
  const cur = useCurrency();
  const [activeFilter, setActiveFilter] = useState('Meubles');
  const [sortBy, setSortBy] = useState('recommandes');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flashCat, setFlashCat] = useState<string | null>(null);
  const barVisible = useAnnouncementBarVisible();

  const handleSectionNav = (section: string, filter?: string) => {
    if (filter) setActiveFilter(filter);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#section-salon') setActiveFilter('Salon');
      else if (hash === '#section-bureau') setActiveFilter('Meubles');
      else if (hash === '#section-figurines') setActiveFilter('Décorations');
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

  const curatedAll = useMemo(() => {
    // Classement curé : best-sellers d'abord, puis Salon, Meubles, Décorations.
    const categoryRank: Record<string, number> = { Salon: 0, Meubles: 1, Décorations: 2 };
    return collapseVariantDuplicates(products.filter(p => p.category !== 'Été')).sort((a, b) => {
      const aBest = bestsellerIds.indexOf(a.id);
      const bBest = bestsellerIds.indexOf(b.id);
      if (aBest !== -1 || bBest !== -1) {
        if (aBest === -1) return 1;
        if (bBest === -1) return -1;
        return aBest - bBest;
      }
      const ra = categoryRank[a.category] ?? 9;
      const rb = categoryRank[b.category] ?? 9;
      if (ra !== rb) return ra - rb;
      return a.id - b.id;
    });
  }, []);

  const baseProducts = activeFilter === 'Tous'
    ? curatedAll
    : activeFilter === 'Bubble'
      ? products.filter((p) => p.name.includes('Bubble'))
      : (() => {
            const list = collapseVariantDuplicates(products.filter((p) => p.category === activeFilter));
            // Dans le Salon, on affiche les produits Bubble en dernier
            if (activeFilter === 'Salon') {
              return list.sort((a, b) => {
                const aB = a.name.includes('Bubble') ? 1 : 0;
                const bB = b.name.includes('Bubble') ? 1 : 0;
                if (aB !== bB) return aB - bB;
                return a.id - b.id;
              });
            }
            // Dans les Décorations, on affiche les figurines (KAWS, Bearbrick) en dernier
            if (activeFilter === 'Décorations') {
              const isFig = (n: string) => n.includes('KAWS') || n.includes('Bearbrick') || n.includes('Figurine');
              return list.sort((a, b) => {
                const aF = isFig(a.name) ? 1 : 0;
                const bF = isFig(b.name) ? 1 : 0;
                if (aF !== bF) return aF - bF;
                return a.id - b.id;
              });
            }
            return list;
          })();

  const filteredProducts = [...baseProducts].sort((a, b) => {
    if (sortBy === 'prix-asc') return a.price - b.price;
    if (sortBy === 'prix-desc') return b.price - a.price;
    if (sortBy === 'nouveautes') return b.id - a.id;
    return 0;
  });

  // Onglet "Tous" : on limite l'aperçu à 16 produits (le reste via "Voir plus")
  const ALL_PREVIEW_LIMIT = 16;
  const showViewMore = activeFilter === 'Tous' && filteredProducts.length > ALL_PREVIEW_LIMIT;
  const displayedProducts = activeFilter === 'Tous'
    ? filteredProducts.slice(0, ALL_PREVIEW_LIMIT)
    : filteredProducts;

  return (
    <div className="bg-white">
      <ScrollProgressBar />
      <BackToTop />
      <Navbar hasBar={barVisible} onWishlistOpen={() => setWishlistOpen(true)} onCartOpen={() => setCartOpen(true)} onSectionNav={handleSectionNav} />
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

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://i.ibb.co/WW4mTJDL/Capture-d-e-cran-2026-08-18-a-19-25-58.png"
            alt="Salon d'exception signé Maison Serenia"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
        >
          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#E8D5B0] mb-6">
            Collection 2026 · Mobilier d&apos;exception
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.95]"
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', letterSpacing: '0.12em' }}
          >
            Maison Serenia
          </h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 h-px w-28 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
          />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              href="/collections/salon"
              className="bg-white text-black text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-[#C9A96E] hover:text-white transition-colors duration-300"
            >
              Découvrir la collection Salon
            </Link>
            <a
              href="#bubble-promo"
              className="border border-white/60 text-white text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              Voir les promotions
            </a>
          </div>

          {/* Micro-réassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-10 text-white/80"
          >
            <span className="flex items-center gap-1.5 text-[11px] tracking-wide">
              <span className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
                ))}
              </span>
              <span className="font-medium">4,3/5</span>
              <span className="text-white/50">· +1 200 clients</span>
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/25" />
            <span className="flex items-center gap-1.5 text-[11px] tracking-wide"><Truck className="w-3.5 h-3.5 text-[#C9A96E]" strokeWidth={1.5} /> Livraison offerte dès {formatPrice(40, cur)}</span>
            <span className="hidden sm:block w-px h-3 bg-white/25" />
            <span className="flex items-center gap-1.5 text-[11px] tracking-wide"><Shield className="w-3.5 h-3.5 text-[#C9A96E]" strokeWidth={1.5} /> Paiement sécurisé</span>
            <span className="hidden md:block w-px h-3 bg-white/25" />
            <span className="hidden md:flex items-center gap-1.5 text-[11px] tracking-wide"><RotateCcw className="w-3.5 h-3.5 text-[#C9A96E]" strokeWidth={1.5} /> Retours 30 jours</span>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">Défiler pour découvrir</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight className="w-4 h-4 text-white/60 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Acheter par catégorie — bien visible, style meublier */}
      <ShopByCategory />

      <div className="w-full">
          {/* Promotions mises en avant */}
          <PromoBanner />

          {/* Bande de réassurance — sous la bannière promo */}
          <TrustStrip />

          {/* Bubble Promo Carousel */}
          <BubblePromoCarousel />

          {/* Bestsellers / Coups de cœur */}
          <BestsellersSection onToutVoir={() => {
            setActiveFilter('Bubble');
            setSortBy('recommandes');
            setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
          }} />

          {/* Products Grid with filter */}
          <section id="section-salon" className="py-16 scroll-mt-20">
            <div id="section-bureau" className="scroll-mt-20" />
            <div id="section-figurines" className="scroll-mt-20" />
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <FadeInSection>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-2 text-[#A07840]">Sélection</p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-black" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
                      Nos Pièces Signatures
                    </h2>
                    <span className="block w-10 h-px mt-3 mb-2" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
                    <p className="text-neutral-500 max-w-lg text-sm">
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
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
                >
                  {displayedProducts.map((product, index) => (
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

              {showViewMore && (
                <div className="flex justify-center mt-12">
                  <Link
                    href="/produits"
                    className="inline-flex items-center gap-2 border border-black text-black text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Voir plus de produits
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>

      </div>


      <BundlesSection onCartOpen={() => setCartOpen(true)} />
      <NewsletterSection />
      <Footer onSectionNav={handleSectionNav} />
      <CookieBanner />
    </div>
  );
}
