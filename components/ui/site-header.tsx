'use client';

// En-tête de la boutique (ligne unique sur ordinateur, menu sur téléphone) et tiroir des favoris.
// Partagé par l'accueil et la page « Mon Intérieur IA » pour un rendu identique.
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, ArrowRight, Clock, Heart, ShoppingBag, ChevronRight, ChevronDown, Gift, Sparkles, Award, TrendingUp, Home as HomeIcon, Truck, Shield, CreditCard, User } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ConnexionPanel } from '@/components/ui/connexion-panel';
import { formatPrice, useCurrency } from '@/lib/currency';
import { products, nice99 } from '@/lib/products';
import { categoryToSlug } from '@/lib/collections';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';

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
    'Salon': { desc: 'Canapés & Fauteuils Bubble', section: 'section-salon', imgId: 87 },
    'Meubles': { desc: 'Meubles & pièces d\'intérieur', section: 'section-bureau', imgId: 77 },
    'Décorations': { desc: 'Tableaux & pièces déco', section: 'section-figurines', imgId: 103 },
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
      img: '/catalog/BVT612D7.jpg',
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
                <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-3 focus-within:border-[#A68A6D] transition-colors">
                  <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                  <input
                    type="text"
                    value={menuQ}
                    onChange={(e) => setMenuQ(e.target.value)}
                    placeholder="Rechercher un produit…"
                    className="w-full text-sm outline-none bg-transparent text-black placeholder:text-neutral-500"
                  />
                  {menuQ && (
                    <button onClick={() => setMenuQ('')} aria-label="Effacer">
                      <X className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  )}
                </div>
                {menuMatches.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {menuMatches.map((p) => {
                      const promo = p.name.includes('Bubble') ? nice99(Math.round(p.price * 0.7)) : p.price;
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 shrink-0 flex items-center justify-center overflow-hidden">
                            <Image src={p.images[0]} alt={p.name} width={40} height={40} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate">{p.name}</p>
                            <p className="text-[10px] text-neutral-500">{p.category}</p>
                          </div>
                          <p className="text-sm font-bold text-black shrink-0">{formatPrice(promo, cur)}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {menuQ.trim().length >= 1 && menuMatches.length === 0 && (
                  <p className="text-xs text-neutral-500 mt-3">Aucun produit trouvé.</p>
                )}
              </div>
              {/* ACCUEIL */}
              <div className="px-6 py-5 border-b border-neutral-100">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-4 group"
                >
                  <span className="relative w-11 h-11 rounded-full border border-[#A68A6D]/50 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-[#A68A6D]">
                    <HomeIcon className="w-4 h-4 text-black" strokeWidth={1.4} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-semibold text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                      Accueil
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">Retour à la page principale</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors shrink-0" />
                </Link>
              </div>

              {/* NOTRE HISTOIRE */}
              <div className="px-6 py-5 border-b border-neutral-100">
                <Link
                  href="/a-propos"
                  onClick={onClose}
                  className="flex items-center gap-4 group"
                >
                  <span className="relative w-11 h-11 rounded-full border border-[#A68A6D]/50 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-[#A68A6D]">
                    <Award className="w-4 h-4 text-black" strokeWidth={1.4} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-semibold text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                      Notre Histoire
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">L&apos;esprit MAISON SERENIA</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors shrink-0" />
                </Link>
              </div>

              {/* MON INTÉRIEUR IA */}
              <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-[#A68A6D]/10 to-transparent">
                <Link href="/mon-interieur-ia" onClick={onClose} className="flex items-center gap-4 group">
                  <span className="relative w-11 h-11 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#A68A6D]" strokeWidth={1.6} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-semibold text-black leading-tight group-hover:underline" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                      Créez votre projet intérieur
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">Votre conseiller déco personnalisé</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors shrink-0" />
                </Link>
              </div>

              {/* NOS COLLECTIONS */}
              <div className="px-6 py-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-500 mb-4">Nos collections</p>
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
                          <Image
                            src={c.img}
                            alt={c.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-semibold text-black leading-tight" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>{c.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{c.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#7F6A52] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #A68A6D, #7F6A52)' }}>
                      <Gift className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#D8C9B5] mb-1">Offre exclusive</p>
                      <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                        Packs &amp; Ensembles
                      </h3>
                      <p className="text-sm text-white/70 mt-1.5 leading-relaxed">Jusqu&apos;à {formatPrice(200, cur)} d&apos;économies sur nos ensembles</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* AIDE & SERVICES */}
              <div className="px-6 py-6 border-b border-neutral-100">
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-500 mb-4">Aide &amp; Services</p>
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
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-500 mb-4">Informations</p>
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
              <p className="text-[11px] text-neutral-500 mt-1.5">© 2026 Maison Serenia</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function SiteHeader({ onWishlistOpen, onCartOpen, onSectionNav }: { onWishlistOpen: () => void; onCartOpen: () => void; onSectionNav: (section: string, filter?: string) => void }) {
  const cur = useCurrency();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [langOpen, setLangOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [lang, setLang] = useState('FR');

  useEffect(() => {
    // Lecture de la langue choisie (store client) au montage — motif légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const l = localStorage.getItem('mss-lang'); if (l) setLang(l); } catch { /* ignore */ }
  }, []);
  const chooseLang = (l: string) => {
    setLang(l);
    setLangOpen(false);
    try { localStorage.setItem('mss-lang', l); } catch { /* ignore */ }
  };


  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recent-searches') || '[]');
      // Lecture des recherches récentes (store client) au montage — motif légitime.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

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

  const navLinks = [
    { label: 'Salon', href: '/collections/salon' },
    { label: 'Meubles', href: '/collections/meubles' },
    { label: 'Décorations', href: '/collections/figurines' },
    { label: 'Luminaires', href: '/collections/figurines?g=Luminaires' },
    { label: 'Tableaux', href: '/collections/figurines?g=Tableaux' },
    { label: 'Bubble', href: '/collections/bubble' },
    { label: 'Notre Histoire', href: '/a-propos' },
    { label: 'Mon Intérieur IA', href: '/mon-interieur-ia' },
  ];

  return (
    <>
    <header className="relative z-40 bg-white shadow-sm">
      {/* Ligne 1 — barre d'arguments et langue */}
      <div className="bg-[#f4f2ee] border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-9 flex items-center justify-between text-[12px] text-neutral-700" style={{ fontFamily: 'var(--font-jost, sans-serif)' }}>
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#8A6A35]" strokeWidth={1.5} /> Livraison offerte</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#8A6A35]" strokeWidth={1.5} /> Qualité vérifiée</span>
            <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#8A6A35]" strokeWidth={1.5} /> Paiement facile</span>
          </div>
          <span className="md:hidden flex items-center gap-2"><Truck className="w-4 h-4 text-[#8A6A35]" strokeWidth={1.5} /> Livraison offerte dès 40 CHF</span>
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1 hover:text-black transition-colors"
              aria-label="Langue"
            >
              {lang} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-[61] bg-white border border-neutral-200 shadow-lg min-w-[140px] py-1">
                  {[{ c: 'FR', n: 'Français' }, { c: 'EN', n: 'English' }, { c: 'DE', n: 'Deutsch' }].map((o) => (
                    <button
                      key={o.c}
                      onClick={() => chooseLang(o.c)}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-neutral-50 transition-colors flex items-center justify-between ${o.c === lang ? 'text-black font-semibold' : 'text-neutral-600'}`}
                    >
                      {o.n} <span className="text-[11px] text-neutral-500">{o.c}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ligne 2 — logo, recherche et icônes */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[70px] flex items-center gap-4 lg:gap-8">
        <Logo
          color="black"
          size="md"
          className="shrink-0"
          onClick={(e) => { if (typeof window !== 'undefined' && window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
        />

        {/* Recherche : barre complète sur ordinateur ; sur téléphone, icône ci-dessous */}
        <button
          onClick={() => setSearchFocused(true)}
          className="hidden md:flex flex-1 max-w-2xl items-stretch h-11 border border-neutral-300 hover:border-neutral-400 transition-colors group"
          aria-label="Rechercher"
        >
          <span className="flex-1 flex items-center px-4 text-left text-sm text-neutral-500" style={{ fontFamily: 'var(--font-jost, sans-serif)' }}>Que recherchez-vous ?</span>
          <span className="w-12 bg-black flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
            <Search className="w-4 h-4 text-white" />
          </span>
        </button>

        <div className="flex items-center gap-3 lg:gap-4 shrink-0 ml-auto">
          <button onClick={() => setSearchFocused(true)} className="md:hidden flex items-center justify-center text-neutral-700 hover:text-black transition-colors" aria-label="Rechercher">
            <Search className="w-[22px] h-[22px]" strokeWidth={1.4} />
          </button>

          <div className="relative hidden sm:flex">
            <button
              type="button"
              onClick={() => setLoginOpen((o) => !o)}
              aria-label="Se connecter"
              aria-expanded={loginOpen}
              className="flex flex-col items-center text-neutral-700 hover:text-black transition-colors"
            >
              <User className="w-[22px] h-[22px]" strokeWidth={1.4} />
            </button>
            <AnimatePresence>
              {loginOpen && <ConnexionPanel onClose={() => setLoginOpen(false)} />}
            </AnimatePresence>
          </div>

          <button onClick={onWishlistOpen} className="relative flex items-center justify-center text-neutral-700 hover:text-black transition-colors" aria-label="Favoris">
            <Heart className={`w-[22px] h-[22px] ${mounted && wishCount > 0 ? 'fill-[#C9A96E] text-[#C9A96E]' : ''}`} strokeWidth={1.4} />
            {mounted && wishCount > 0 && (
              <span className="absolute -top-2 -right-2 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}>{wishCount}</span>
            )}
          </button>

          <button onClick={onCartOpen} className="relative flex items-center justify-center text-neutral-700 hover:text-black transition-colors" aria-label="Panier">
            <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.4} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Ligne 3 — menu et catégories */}
      <nav className="border-t border-neutral-200 bg-white" aria-label="Navigation principale">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-11 flex items-center gap-5 overflow-x-auto scrollbar-hide" style={{ fontFamily: 'var(--font-jost, sans-serif)' }}>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 text-[13px] text-black shrink-0 pr-1" aria-label="Menu">
            <span className="flex flex-col gap-[3px]">
              <span className="block w-4 h-[1.5px] bg-black" />
              <span className="block w-4 h-[1.5px] bg-black" />
              <span className="block w-4 h-[1.5px] bg-black" />
            </span>
            <span className="hidden sm:inline uppercase tracking-[0.15em] text-[12px]">Menu</span>
          </button>
          <div className="flex flex-1 items-center gap-5 lg:gap-6 md:justify-between overflow-x-auto scrollbar-hide">
            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} className="text-[14px] text-neutral-700 hover:text-[#A68A6D] whitespace-nowrap shrink-0 transition-colors duration-500 ease-out">
                {l.label}
              </Link>
            ))}
            <Link href="/promotions" className="text-[14px] text-red-600 hover:text-[#A68A6D] whitespace-nowrap shrink-0 font-medium transition-colors duration-500 ease-out">Promotions</Link>
          </div>
        </div>
      </nav>
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
                className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-black transition-colors justify-self-end"
                aria-label="Fermer la recherche"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-20">
            {/* Big search input */}
            <div className="relative border-b-2 border-neutral-900 mb-3 transition-colors focus-within:border-[#A68A6D]">
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                  aria-label="Effacer"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              ) : (
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 text-neutral-300 pointer-events-none" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 mb-12">Appuyez sur <span className="font-medium text-neutral-500">Échap</span> ou « Retour » pour revenir à la boutique.</p>

            {/* ── Idle state (no query) ── */}
            {!searchQ && (
              <div className="space-y-12">
                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500">
                        <Clock className="w-3.5 h-3.5" /> Recherches récentes
                      </p>
                      <button onClick={clearRecentSearches} className="text-[11px] text-neutral-500 hover:text-black transition-colors">Effacer</button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSearchQ(s)}
                          className="flex items-center gap-2 text-sm bg-neutral-100 rounded-full px-4 py-2 hover:bg-neutral-200 transition-colors text-neutral-700"
                        >
                          <Search className="w-3.5 h-3.5 text-neutral-500" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular searches */}
                <div>
                  <p className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">
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
                        className="text-[11px] tracking-[0.18em] uppercase font-medium border border-neutral-200 px-4 py-2.5 text-neutral-600 hover:border-[#A68A6D] hover:text-[#7F6A52] hover:bg-[#7F6A52]/5 transition-all duration-200"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collections shortcuts */}
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">Explorer les collections</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      // Salon : Canapé d'angle 3 places crème
                      { slug: 'salon', label: 'Salon', cat: null, id: 87, img: null, fit: 'cover', position: 'center' },
                      // Meubles : image personnalisée
                      { slug: 'meubles', label: 'Meubles', cat: 'Meubles', id: null, img: '/catalog/WpP25YqM.png', fit: 'cover', position: 'center 32%' },
                      // Décorations : tableau abstrait
                      { slug: 'figurines', label: 'Décorations', cat: null, id: 103, img: null, fit: 'cover', position: 'center' },
                      // Bubble : image personnalisée
                      { slug: 'bubble', label: 'Bubble', cat: null, id: 10, img: '/catalog/BVT612D7.jpg', fit: 'cover', position: 'center' },
                    ].map((c) => {
                      const rep = c.id != null
                        ? products.find((p) => p.id === c.id)
                        : products.find((p) => p.category === c.cat);
                      const imgSrc = c.img ?? rep?.images[0];
                      const isContain = c.fit === 'contain';
                      return (
                        <Link
                          key={c.slug}
                          href={`/collections/${c.slug}`}
                          onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                          className="group relative aspect-[4/5] overflow-hidden bg-white"
                        >
                          {imgSrc && (
                            <Image
                              src={imgSrc}
                              alt={c.label}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className={`transition-transform duration-700 group-hover:scale-105 ${isContain ? 'object-contain scale-125' : 'object-cover'}`}
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
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">Nos suggestions</p>
                  {(() => {
                    const suggestionIds = [112, 77, 105, 100, 126, 110, 113, 83, 109, 95, 78, 107, 87, 79, 108];
                    const all = suggestionIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
                    return (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-6">
                          {all.map((prod) => {
                            const promoPrice = prod.name.includes('Bubble') ? nice99(Math.round(prod.price * 0.7)) : prod.price;
                            return (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.id}`}
                                onClick={() => { setSearchFocused(false); setSearchQ(''); }}
                                className="group"
                              >
                                <div className="relative aspect-square overflow-hidden bg-white mb-2">
                                  <Image src={prod.images[0]} alt={prod.name} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <p className="text-[13px] font-semibold text-black leading-tight truncate group-hover:underline">{prod.name}</p>
                                <p className="text-xs text-neutral-500 price-luxe mt-0.5">{formatPrice(promoPrice, cur)}</p>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
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
                    <p className="font-serif text-2xl text-black mb-2" style={{ fontFamily: 'var(--font-pdp-inter-tight)' }}>Aucun résultat</p>
                    <p className="text-sm text-neutral-500">Rien ne correspond à « {searchQ} ». Essayez un autre mot-clé.</p>
                  </div>
                );
              }
              return (
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-5">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {results.slice(0, 30).map((p) => {
                      const promoPrice = p.name.includes('Bubble') ? nice99(Math.round(p.price * 0.7)) : p.price;
                      const contain = p.name.includes('Bubble') || p.category === 'Décorations' || p.category === 'Été';
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={() => { saveSearch(searchQ); setSearchFocused(false); setSearchQ(''); }}
                          className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-neutral-50 transition-colors group"
                        >
                          <div className={`w-16 h-16 overflow-hidden bg-white border border-neutral-100 flex-shrink-0 flex items-center justify-center ${contain ? 'p-1.5' : ''}`}>
                            <Image src={p.images[0]} alt={p.name} width={64} height={64} className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate group-hover:underline">{p.name}</p>
                            <p className="text-[11px] tracking-wide uppercase text-neutral-500 mt-0.5">{p.category}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <p className="text-sm font-bold text-black price-luxe">{formatPrice(promoPrice, cur)}</p>
                            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#A68A6D] transition-colors" />
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

// ─── Wishlist Drawer ──────────────────────────────────────────────────────────

export function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#7F6A52] mb-1">Ma sélection</p>
                  <h2 className="font-serif text-xl text-black leading-none" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                    Favoris {ids.length > 0 && <span className="text-neutral-500 text-base">({ids.length})</span>}
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
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-1" style={{ background: 'linear-gradient(135deg, #F6F2EB 0%, #F6F2EB 100%)' }}>
                    <Heart className="w-7 h-7 text-[#A68A6D]" strokeWidth={1.4} />
                  </div>
                  <p className="font-serif text-lg text-black" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>Votre liste de favoris est vide</p>
                  <p className="text-sm text-neutral-500 max-w-[240px]">Ajoutez vos coups de cœur en cliquant sur le cœur d&apos;un produit.</p>
                  <button onClick={onClose} className="mt-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-neutral-800 transition-colors">
                    Parcourir la boutique
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishedProducts.map((product) => {
                    const price = isBubble(product.id) ? nice99(Math.round(product.price * 0.7)) : product.price;
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
                          <Image src={product.images[0]} alt={product.name} width={80} height={80} className={`w-full h-full ${isBubble(product.id) ? 'object-contain p-2' : 'object-cover'}`} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${product.id}`} onClick={onClose}>
                            <p className="font-serif font-semibold text-sm text-black leading-snug line-clamp-2 hover:underline">{product.name}</p>
                          </Link>
                          <p className="text-xs text-neutral-500 mt-0.5">{product.category}</p>
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
