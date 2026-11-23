'use client';

import { useEffect, useState, useMemo } from 'react';
import { BLACK_FRIDAY_PROMO } from '@/lib/promotions';
import { SiteHeader, WishlistDrawer } from '@/components/ui/site-header';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Heart, X, ArrowRight, Truck, Shield, ArrowUp, Gift } from 'lucide-react';
import { products, collapseVariantDuplicates, nice99 } from '@/lib/products';
import { BUNDLES, BUNDLE_PRICE } from '@/lib/bundles';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';
import { useAnnouncementBarVisible } from '@/components/ui/announcement-bar';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { formatPrice, useCurrency } from '@/lib/currency';
import { WELCOME_CODE } from '@/components/ui/welcome-popup';
import { heroMarcellus, heroRaleway } from '@/lib/hero-fonts';

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────

// Sans animation : titres et textes s'affichent immédiatement, sans fondu au défilement.
function FadeInSection({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
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
        backgroundColor: '#A68A6D',
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


// ─── Category Quick Nav ───────────────────────────────────────────────────────



// ─── Bubble : promotion Black Friday (section noire, grille de cartes) ───────

// Photo d'ambiance du bandeau Bubble. Pour la changer : remplacer public/catalog/bubble-ambiance.webp (même nom).
const BUBBLE_HERO_IMAGE = '/catalog/bubble-ambiance.webp';

function BubblePromoSection() {
  return (
    <section id="bubble-promo" className="scroll-mt-24 overflow-hidden bg-[#D4BDAA] text-[#221607]">
      {/* Bloc photo : même taille et même mise en page que « Mon Intérieur IA » */}
      <div className="relative mx-auto max-w-[1672px] flex flex-col lg:block lg:h-[772px]">
        <div className="relative z-10 px-6 pt-7 pb-3 sm:pt-10 sm:pb-12 lg:absolute lg:left-[5.1%] lg:top-0 lg:w-[600px] lg:px-0 lg:pt-[88px] lg:pb-0">
          <p className="text-[9px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#3E2F1B] lg:text-[#EADBC8]">Collection Bubble</p>
          <span aria-hidden="true" className="block mt-2 sm:mt-7 w-[57px] h-px bg-[#3E2F1B]/60 lg:bg-[#EADBC8]/60" />
          <h2 className="mt-5 sm:mt-8 text-[34px] sm:text-[44px] lg:text-[66px] leading-[1.2] sm:leading-[1.02] lg:leading-[1.1] text-[#221607] lg:text-[#FBF7F2]" style={{ fontFamily: 'var(--font-pdp-inter-tight)' }}>
            Les produits Bubble à {BLACK_FRIDAY_PROMO.bubbleDiscountLabel}
          </h2>
          <p className="mt-3 sm:mt-7 lg:mt-[31px] max-w-[290px] sm:max-w-[470px] text-[13px] leading-[1.3] sm:text-[16px] sm:leading-[1.6] lg:text-[19px] lg:leading-[1.6] text-[#1D120C] lg:text-[#F1E8DC]">
            Canapés et fauteuils de la collection Bubble, en promotion pendant le Black Friday.
          </p>
          <Link href="/collections/bubble" className="mt-5 sm:mt-10 lg:mt-[51px] inline-flex w-auto sm:w-[380px] items-center justify-between gap-3 whitespace-nowrap bg-[#6A513A] px-4 py-2 sm:px-10 sm:py-5 text-[12px] sm:text-[15px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-white hover:bg-[#5A4430] transition-colors duration-500 ease-out lg:bg-[#F6F3F2] lg:text-[#221607] lg:hover:bg-[#F6F3F2] lg:hover:text-[#A68A6D]">
            Voir la collection <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.4} />
          </Link>
        </div>
        <div className="relative w-full aspect-[1672/941] lg:absolute lg:inset-y-0 lg:left-[calc(50%_-_50vw)] lg:right-[calc(50%_-_50vw)] lg:w-auto lg:aspect-auto">
          <Image src={BUBBLE_HERO_IMAGE} alt="Salon avec les canapés et fauteuils Bubble" fill sizes="100vw" className="object-cover object-[50%_100%]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-[-2px] h-[calc(35%+2px)] bg-gradient-to-b from-[#D4BDAA] to-transparent lg:hidden" />
          <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden lg:block w-full bg-[linear-gradient(to_right,rgba(34,22,7,0.88)_0%,rgba(34,22,7,0.62)_38%,rgba(34,22,7,0)_68%)]" />
        </div>
      </div>
    </section>
  );
}

// ─── Bestsellers Section ──────────────────────────────────────────────────────

const bestsellerIds = [100, 135, 140, 103];

function BestsellersSection({ onToutVoir }: { onToutVoir: () => void }) {
  const cur = useCurrency();
  const bestsellers = bestsellerIds.map(id => products.find(p => p.id === id)!).filter(Boolean);
  const { isWished, toggle } = useWishlist();

  return (
    <>
      <section className="py-14 max-w-7xl mx-auto px-6 lg:px-10">
        <FadeInSection>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#7F6A52] mb-2">Notre sélection</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-black" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                Coups de cœur
              </h2>
              <span className="block w-10 h-px mt-3" style={{ background: 'linear-gradient(90deg, #A68A6D, #D8C9B5)' }} />
            </div>
            <button onClick={onToutVoir} className="hidden sm:flex items-center gap-1 text-xs tracking-widest uppercase text-neutral-500 hover:text-black transition-colors border-b border-neutral-200 pb-0.5">
              Tout voir <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </FadeInSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product) => (
            <div
              key={product.id}
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
                      Coup de cœur
                    </div>
                    {product.name.includes('Bubble') && (
                      <div className="bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                        −30%
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                    aria-label="Ajouter aux favoris" aria-pressed={isWished(product.id)} className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                  </button>
                </div>
                <h3 className="titre-produit text-black mb-0.5">{product.name}</h3>
                <p className="text-neutral-500 text-xs mb-1 line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-2">
                  {product.name.includes('Bubble') ? (
                    <>
                      <p className="text-black font-bold text-sm price-luxe">{formatPrice(nice99(Math.round(product.price * 0.7)), cur)}</p>
                      <p className="text-neutral-500 line-through text-xs price-luxe">{formatPrice(product.price, cur)}</p>
                    </>
                  ) : (
                    <p className="text-black font-bold text-sm price-luxe">{formatPrice(product.price, cur)}</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
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

function ProductCard({ product }: { product: ProductPreview }) {
  const cur = useCurrency();
  const isNew = newProductIds.includes(product.id);
  const isSale = saleProductIds.includes(product.id);
  const isBubble = bubbleProductIds.includes(product.id);
  const { isWished, toggle } = useWishlist();

  return (
    <div
      className="group relative bg-white overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] transition-all duration-500"
    >
      <Link href={`/products/${product.id}`}>
        <div className={`relative overflow-hidden bg-white aspect-[4/3] ${product.name.includes('Bubble') || product.category === 'Décorations' || product.category === 'Été' ? 'p-4' : ''}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={450}
            style={isBubble ? { transform: [10, 12, 13, 22].includes(product.id) ? 'none' : [7, 8, 9, 10].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' } : product.id === 34 ? { transform: 'scale(1.35)', transformOrigin: 'center center' } : undefined}
            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${product.images[1] ? 'group-hover:opacity-0' : ''} ${product.category === 'Décorations' || product.category === 'Été' ? 'object-contain' : product.name.includes('Bubble') ? 'object-contain' : 'object-cover'}`}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              width={600}
              height={450}
              style={isBubble ? { transform: [10, 12, 13, 22].includes(product.id) ? 'none' : [7, 8, 9, 10].includes(product.id) ? 'scale(1.2)' : 'scale(1.1)', transformOrigin: 'center center' } : undefined}
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
            aria-label="Ajouter aux favoris" aria-pressed={isWished(product.id)} className={`absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 transition-all duration-300 hover:bg-white ${isWished(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
            <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-500">{product.category}</p>
          </div>
          <h3 className="titre-produit text-black mb-1">{product.name}</h3>
          <p className="text-neutral-500 text-[11px] mb-3 line-clamp-1">{product.description}</p>
          <div className="h-px bg-neutral-100 mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm price-luxe">
                {formatPrice(isBubble ? nice99(Math.round(product.price * 0.7)) : product.price, cur)}
              </span>
              {isBubble && (
                <span className="text-neutral-500 line-through text-xs price-luxe">
                  {formatPrice(product.price, cur)}
                </span>
              )}
              {isSale && !isBubble && (
                <span className="text-neutral-500 line-through text-xs price-luxe">
                  {formatPrice(Math.round(product.price * 1.25), cur)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-600 group-hover:text-black transition-colors">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Product Filter Bar ───────────────────────────────────────────────────────

const filterCategories = ['Salon', 'Meubles', 'Décorations', 'Bubble'];

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
              : 'border-transparent text-neutral-500 hover:text-black hover:border-neutral-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ─── Acheter par catégorie (« Notre univers ») : liste éditoriale ─────────────

const CATEGORY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ShopByCategory() {
  const tiles = [
    { slug: 'salon', label: 'Salon', desc: 'Canapés & fauteuils' },
    { slug: 'meubles', label: 'Meubles', desc: 'Tables, TV, rangements' },
    { slug: 'figurines', label: 'Décorations', desc: 'Pièces & objets déco' },
  ];
  // Rangée mise en avant au survol ou au clavier
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-[#F6F2EB] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">Notre univers</p>
          <h2 className="pdp-display mt-5 text-4xl font-semibold tracking-[-0.03em] text-[#221607] md:text-6xl">
            Acheter par catégorie
          </h2>
        </header>

        <div onMouseLeave={() => setActive(null)}>
          {tiles.map((t, i) => {
            const on = active === i;
            const dim = active !== null && !on;
            return (
              <motion.div key={t.slug} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="relative">
                <motion.span
                  aria-hidden
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 1.8, ease: CATEGORY_EASE, delay: i * 0.15 } },
                  }}
                  className="absolute left-0 top-0 block h-px w-full origin-left bg-[#D8C9B5]"
                />
                <Link
                  href={`/collections/${t.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="grid grid-cols-[1fr_auto] items-center gap-6 py-10 md:grid-cols-[120px_1fr_auto] md:py-12"
                  style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <span className="hidden text-sm tracking-[0.2em] text-[#A68A6D] md:block" style={{ fontFamily: 'var(--font-cinzel, Georgia, serif)' }}>
                    N° {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <motion.span
                      animate={{ x: on ? 36 : 0 }}
                      transition={{ duration: 1.1, ease: CATEGORY_EASE }}
                      className="pdp-display block text-[52px] font-semibold leading-[0.95] tracking-[-0.045em] text-[#221607] md:text-[104px]"
                    >
                      {t.label}
                    </motion.span>
                    <motion.span
                      animate={{ x: on ? 36 : 0 }}
                      transition={{ duration: 1.1, ease: CATEGORY_EASE }}
                      className="mt-3 block text-[15px] text-[#4D4842]"
                    >
                      {t.desc}
                    </motion.span>
                  </span>
                  <motion.span
                    animate={{ x: on ? 6 : 0 }}
                    transition={{ duration: 1.1, ease: CATEGORY_EASE }}
                    className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[#221607]"
                  >
                    <span className="hidden md:inline">Découvrir</span>
                    <ChevronRight className="h-4 w-4" strokeWidth={1.4} />
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
          <span className="block h-px w-full bg-[#D8C9B5]" />
        </div>
      </div>
    </section>
  );
}

// ─── Bundles Section (Canapé + Fauteuil) ─────────────────────────────────────

const BUNDLE_LEGENDE = 'text-[10px] font-medium uppercase tracking-[0.25em] text-[#7F6A52]';

// Photos des ensembles rognées au produit : le canapé et le fauteuil sont affichés à la même hauteur (même échelle)
const BUNDLE_VISUALS: Record<string, { canape: { src: string; w: number; h: number }; fauteuil: { src: string; w: number; h: number } }> = {
  blanc: {
    canape: { src: '/catalog/bundles/canape-blanc.webp', w: 1456, h: 600 },
    fauteuil: { src: '/catalog/bundles/fauteuil-blanc.webp', w: 794, h: 600 },
  },
  bleu: {
    canape: { src: '/catalog/bundles/canape-bleu.webp', w: 1372, h: 600 },
    fauteuil: { src: '/catalog/bundles/fauteuil-bleu.webp', w: 759, h: 600 },
  },
  rouge: {
    canape: { src: '/catalog/bundles/canape-rouge.webp', w: 1453, h: 600 },
    fauteuil: { src: '/catalog/bundles/fauteuil-rouge.webp', w: 790, h: 600 },
  },
};
const GIFT_PRICE = 60;
const GIFT_SIZE = '50×70 cm';

function BundlesSection({ onCartOpen }: { onCartOpen: () => void }) {
  const cur = useCurrency();
  const { addItem } = useCart();
  const tableaux = products.filter((p) => p.name.includes('Tableau'));
  const [activeSlug, setActiveSlug] = useState<string>(BUNDLES[0].slug);
  const [selectedTableau, setSelectedTableau] = useState<number>(tableaux[0]?.id ?? 103);
  const [offerOn, setOfferOn] = useState(true);
  const [giftLightbox, setGiftLightbox] = useState(false);
  const [added, setAdded] = useState(false);

  const bundle = BUNDLES.find((b) => b.slug === activeSlug) ?? BUNDLES[0];
  const visual = BUNDLE_VISUALS[bundle.slug];
  const canape = products.find((p) => p.id === bundle.canapeId)!;
  const fauteuil = products.find((p) => p.id === bundle.fauteuilId)!;
  const gift = products.find((p) => p.id === selectedTableau)!;
  const canapePromo = nice99(Math.round(canape.price * 0.7));
  const fauteuilPromo = nice99(Math.round(fauteuil.price * 0.7));
  const sum = canapePromo + fauteuilPromo + (offerOn ? GIFT_PRICE : 0);
  const economie = Math.max(0, sum - BUNDLE_PRICE);

  const addBundle = (open: boolean) => {
    addItem(bundle.canapeId);
    addItem(bundle.fauteuilId);
    if (offerOn) addItem(selectedTableau, GIFT_SIZE);
    if (open) onCartOpen();
    else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <>
      <section id="section-packs" className="scroll-mt-20 bg-[#F6F2EB] py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* En-tête */}
          <div className="mb-14 text-center">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">
              Notre nouvelle offre · {BUNDLES.length} ensembles au choix
            </p>
            <h2 className="pdp-display text-4xl font-semibold tracking-[-0.03em] text-[#221607] md:text-6xl">
              Nos ensembles Bubble
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-[17px] leading-relaxed text-[#4D4842]">
              Le canapé et son fauteuil assortis — avec un tableau offert au choix (taille 50×70 cm).
            </p>
          </div>

          {/* Choix de l'ensemble : les coloris sont visibles d'un coup d'œil */}
          <div className="mb-12 grid grid-cols-3 gap-3 md:gap-5">
            {BUNDLES.map((b) => {
              const on = b.slug === bundle.slug;
              return (
                <button
                  key={b.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActiveSlug(b.slug)}
                  className={`group flex flex-col items-start gap-3 border px-3 py-4 text-left transition-all duration-500 md:flex-row md:items-center md:gap-5 md:px-7 md:py-6 ${
                    on
                      ? 'border-[#221607] bg-white shadow-[0_24px_50px_-30px_rgba(34,22,7,0.5)]'
                      : 'border-[#D8C9B5] hover:border-[#221607]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="pdp-display block text-[17px] font-semibold tracking-[-0.02em] text-[#221607] md:text-3xl">
                      {b.color}
                    </span>
                    <span className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-[#7F6A52] md:block md:text-xs">
                      Canapé + fauteuil
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={bundle.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-14 lg:grid-cols-12 lg:gap-16"
            >
              {/* Vitrine : canapé et fauteuil à la même échelle, dans un cadre fin (proposition 3) */}
              <div className="lg:col-span-8">
                {/* Déclenchement sur le conteneur : le cadre et le reflet démarrent masqués, donc invisibles pour l'observateur */}
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative overflow-hidden bg-white px-7 pb-7 pt-12 md:px-[52px] md:pb-[30px] md:pt-[50px]"
                >
                  {/* Cadre fin qui se dessine à l'arrivée */}
                  <motion.span
                    aria-hidden
                    variants={{
                      hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
                      show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.8, ease: CATEGORY_EASE, delay: 0.1 } },
                    }}
                    className="pointer-events-none absolute inset-[14px] border border-[#E6DCCD]"
                  />
                  {/* Reflet doré qui traverse la vitrine */}
                  <motion.span
                    aria-hidden
                    variants={{
                      hidden: { x: '-100%' },
                      show: { x: '100%', transition: { duration: 2.2, ease: CATEGORY_EASE, delay: 0.35 } },
                    }}
                    className="pointer-events-none absolute inset-0"
                    style={{ background: 'linear-gradient(100deg, transparent 35%, rgba(166,138,109,0.16) 50%, transparent 65%)' }}
                  />

                  <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-6">
                    <motion.div
                      variants={{
                        hidden: { x: -90, opacity: 0 },
                        show: { x: 0, opacity: 1, transition: { duration: 1.6, ease: CATEGORY_EASE, delay: 0.15 } },
                      }}
                      whileHover={{ y: -6 }}
                      className="flex flex-col items-center text-center"
                    >
                      <Link href={`/products/${bundle.canapeId}`} className="group block">
                        <Image
                          src={visual.canape.src}
                          alt={canape.name}
                          width={visual.canape.w}
                          height={visual.canape.h}
                          className="h-[118px] w-auto transition-transform duration-700 group-hover:scale-[1.03] md:h-[180px]"
                        />
                      </Link>
                      <p className={`mt-6 ${BUNDLE_LEGENDE}`}>Canapé 3 places</p>
                      <p className="titre-produit mt-2 text-black">{canape.name}</p>
                      <p className="price-luxe mt-1.5 text-[15px] text-[#221607]">{formatPrice(canapePromo, cur)}</p>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { x: 90, opacity: 0 },
                        show: { x: 0, opacity: 1, transition: { duration: 1.6, ease: CATEGORY_EASE, delay: 0.3 } },
                      }}
                      whileHover={{ y: -6 }}
                      className="flex flex-col items-center text-center"
                    >
                      <Link href={`/products/${bundle.fauteuilId}`} className="group block">
                        <Image
                          src={visual.fauteuil.src}
                          alt={fauteuil.name}
                          width={visual.fauteuil.w}
                          height={visual.fauteuil.h}
                          className="h-[118px] w-auto transition-transform duration-700 group-hover:scale-[1.03] md:h-[180px]"
                        />
                      </Link>
                      <p className={`mt-6 ${BUNDLE_LEGENDE}`}>Fauteuil</p>
                      <p className="titre-produit mt-2 text-black">{fauteuil.name}</p>
                      <p className="price-luxe mt-1.5 text-[15px] text-[#221607]">{formatPrice(fauteuilPromo, cur)}</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Choix du tableau offert */}
                <div className="mt-7">
                  <p className={`mb-3 ${BUNDLE_LEGENDE}`}>Votre tableau</p>
                  <div className={`flex items-center gap-5 transition-opacity duration-300 ${offerOn ? 'opacity-100' : 'opacity-40'}`}>
                    <button
                      type="button"
                      onClick={() => setGiftLightbox(true)}
                      title="Voir le tableau en grand"
                      aria-label="Voir le tableau en grand"
                      className="relative h-24 w-[72px] shrink-0 cursor-zoom-in overflow-hidden border border-[#E6DCCD] bg-white"
                    >
                      <Image src={gift.images[0]} alt={gift.name} fill sizes="72px" className="object-cover transition-transform duration-500 hover:scale-105" />
                    </button>
                    <select
                      aria-label="Choisir le tableau offert"
                      value={selectedTableau}
                      onChange={(e) => setSelectedTableau(Number(e.target.value))}
                      disabled={!offerOn}
                      className="flex-1 cursor-pointer border-0 border-b border-[#D8C9B5] bg-transparent py-2.5 text-[15px] text-[#221607] outline-none focus:border-[#221607] disabled:cursor-not-allowed"
                    >
                      {tableaux.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <label className="mt-4 flex cursor-pointer select-none items-center gap-3 text-[13px] text-[#4D4842]">
                    <input
                      type="checkbox"
                      checked={offerOn}
                      onChange={(e) => setOfferOn(e.target.checked)}
                      aria-label="Ajouter le tableau offert au panier"
                      className="h-4 w-4 accent-[#221607]"
                    />
                    Ajouter le tableau offert (50×70 cm), gratuit
                  </label>
                </div>
              </div>

              {/* Détail et achat */}
              <div className="lg:col-span-4">
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#7F6A52]">
                  Ensemble Bubble · {bundle.color}
                </p>
                <h3 className="pdp-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-[#221607] md:text-5xl">
                  Canapé et fauteuil assortis
                </h3>
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#4D4842]">
                  Deux pièces sculpturales dans un même coloris, pour un salon complet. Un tableau offert au choix.
                </p>

                <ul className="mt-9 border-t border-[#D8C9B5]">
                  <li className="flex items-center justify-between gap-4 border-b border-[#D8C9B5] py-4">
                    <span className="titre-produit text-black">{canape.name}</span>
                    <span className="price-luxe text-[15px] text-[#221607]">{formatPrice(canapePromo, cur)}</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 border-b border-[#D8C9B5] py-4">
                    <span className="titre-produit text-black">{fauteuil.name}</span>
                    <span className="price-luxe text-[15px] text-[#221607]">{formatPrice(fauteuilPromo, cur)}</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 border-b border-[#D8C9B5] py-4">
                    <span className="titre-produit text-black">Tableau offert · 50×70 cm</span>
                    {offerOn ? (
                      <span className="flex items-center gap-3">
                        <s className="price-luxe text-sm text-[#8A8178]">{formatPrice(GIFT_PRICE, cur)}</s>
                        <span className={BUNDLE_LEGENDE}>Offert</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#8A8178]">Non ajouté</span>
                    )}
                  </li>
                </ul>

                {/* Prix */}
                <div className="mt-10 border-t border-[#D8C9B5] pt-8">
                  <p className={BUNDLE_LEGENDE}>Prix de l’ensemble</p>
                  <p className="price-luxe mt-3 text-5xl leading-none text-[#221607]">{formatPrice(BUNDLE_PRICE, cur)}</p>
                  <p className="mt-4 text-[13px] text-[#7F6A52]">
                    Au lieu de <s className="text-[#8A8178]">{formatPrice(sum, cur)}</s> · vous économisez {formatPrice(economie, cur)}
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => addBundle(true)}
                    className="w-full bg-[#221607] py-5 text-[13px] font-medium uppercase tracking-[0.12em] text-[#F6F2EB] transition-transform duration-500 hover:-translate-y-0.5"
                  >
                    Acheter cet ensemble
                  </button>
                  <button
                    type="button"
                    onClick={() => addBundle(false)}
                    className={`w-full border py-4 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 ${
                      added
                        ? 'border-[#221607] bg-[#221607] text-[#F6F2EB]'
                        : 'border-[#221607] text-[#221607] hover:bg-[#221607] hover:text-[#F6F2EB]'
                    }`}
                  >
                    {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                  </button>
                </div>
                <p className="mt-4 text-center text-[11px] tracking-wide text-[#7F6A52]">
                  Livraison gratuite à partir de {formatPrice(40, cur)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Agrandissement du tableau, hors de l'animation pour rester plein écran */}
      {giftLightbox && (
        <div
          onClick={() => setGiftLightbox(false)}
          className="fixed inset-0 z-[130] flex cursor-zoom-out items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setGiftLightbox(false)}
            aria-label="Fermer"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl text-center">
            <Image src={gift.images[0]} alt={gift.name} width={900} height={1200} className="mx-auto h-auto max-h-[80vh] w-full object-contain shadow-2xl" />
            <p className="mt-4 text-sm tracking-wide text-white">{gift.name} · 50×70 cm</p>
          </div>
        </div>
      )}
    </>
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
          <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase font-semibold px-3 py-1.5 mb-6 text-[#7F6A52] bg-white/60" style={{ border: '1px solid rgba(160,120,64,0.3)' }}>
            <Gift className="w-3 h-3" /> −10% offerts à l&apos;inscription
          </div>
          <h2
            className="text-3xl md:text-4xl text-black mb-4"
            style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)', fontStyle: 'italic', fontWeight: 400 }}
          >
            Restez informé de nos nouveautés
          </h2>
          <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
            Inscrivez-vous et recevez <span className="text-black font-medium">−10% sur votre première commande</span>, ainsi qu&apos;un accès en avant-première à nos nouvelles pièces et offres réservées aux membres.
          </p>
          {submitted ? (
            <div
              className="max-w-md mx-auto"
            >
              <p className="text-black text-base font-medium mb-4">Bienvenue&nbsp;! 🎉 Votre réduction est activée.</p>
              <div className="flex items-center justify-center gap-3 border-2 border-dashed border-[#A68A6D] bg-[#7F6A52]/10 px-4 py-3">
                <span className="text-lg font-bold tracking-[0.15em] text-[#7F6A52]">{WELCOME_CODE}</span>
                <span className="text-[11px] uppercase tracking-widest text-neutral-500">−10%</span>
              </div>
              <p className="text-neutral-500 text-[11px] mt-3">Le code s&apos;applique automatiquement dans votre panier.</p>
            </div>
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

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

export default function Home() {
  const cur = useCurrency();
  const [activeFilter, setActiveFilter] = useState('Salon');
  const [visibleCount, setVisibleCount] = useState(12);
  // Réinitialise l'affichage à 12 produits quand on change d'onglet — motif légitime.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setVisibleCount(12); }, [activeFilter]);
  const [sortBy, setSortBy] = useState('recommandes');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flashCat] = useState<string | null>(null);
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
      // Applique le filtre depuis le hash d'URL initial — motif légitime.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            // Le Salon exclut les produits Bubble (ils sont uniquement dans la section Bubble)
            const list = collapseVariantDuplicates(
              products.filter((p) => p.category === activeFilter && (activeFilter !== 'Salon' || !p.name.includes('Bubble'))),
            );
            // Dans le Salon : ordre prioritaire choisi, puis le reste
            if (activeFilter === 'Salon') {
              const PRIORITY = [100, 102, 101, 87, 88, 94, 89];
              const rank = (p: typeof products[number]) => {
                const i = PRIORITY.indexOf(p.id);
                if (i !== -1) return i;                       // 0..5 : ordre prioritaire
                if (p.name.includes('Canapé')) return 100;    // autres canapés ensuite
                return 200;                                    // meubles (TV…) en dernier
              };
              return list.sort((a, b) => {
                const ra = rank(a), rb = rank(b);
                if (ra !== rb) return ra - rb;
                return a.id - b.id;
              });
            }
            // Meubles : ordre prioritaire, puis le reste, puis certains forcés en fin
            if (activeFilter === 'Meubles') {
              const PRIORITY = [77, 83, 78, 79, 81, 84, 75, 76];
              const LAST = [68, 66, 82]; // forcés tout à la fin, dans cet ordre
              const rank = (id: number) => {
                const i = PRIORITY.indexOf(id);
                if (i !== -1) return i;
                const l = LAST.indexOf(id);
                if (l !== -1) return 1000 + l;
                return 500;
              };
              return list.sort((a, b) => {
                const ra = rank(a.id), rb = rank(b.id);
                if (ra !== rb) return ra - rb;
                return a.id - b.id;
              });
            }
            // Dans les Décorations : luminaires en premier, puis tableaux, figurines en dernier
            if (activeFilter === 'Décorations') {
              const rank = (n: string) => {
                const l = n.toLowerCase();
                if (l.includes('lampe') || l.includes('lustre') || l.includes('suspendue') || l.includes('luminaire')) return 0;
                if (n.includes('Tableau')) return 1;
                if (n.includes('KAWS') || n.includes('Bearbrick') || n.includes('Figurine')) return 3;
                return 2;
              };
              return list.sort((a, b) => {
                const ra = rank(a.name), rb = rank(b.name);
                if (ra !== rb) return ra - rb;
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

  // Affichage progressif : 12 produits, puis « Voir plus » (12 de plus à chaque clic)
  const PAGE_SIZE = 12;
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const showViewMore = filteredProducts.length > visibleCount;

  return (
    <div className="bg-white">
      <ScrollProgressBar />
      <BackToTop />
      <SiteHeader onWishlistOpen={() => setWishlistOpen(true)} onCartOpen={() => setCartOpen(true)} onSectionNav={handleSectionNav} />
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
                style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)', fontWeight: 300, fontStyle: 'italic' }}
              >{flashCat}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero : occupe l'écran sous le bandeau et l'en-tête, qui défilent avec la page
          (hauteur calculée : 192 px avec la barre d'annonce, 152 px sans) */}
      <section
        className={`relative flex flex-col items-center justify-center overflow-hidden ${heroMarcellus.variable} ${heroRaleway.variable} ${barVisible ? 'min-h-[calc(100dvh_-_192px)]' : 'min-h-[calc(100dvh_-_152px)]'}`}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/catalog/accueil-hero-2026.webp"
            alt="Salon d'exception signé Maison Serenia"
            fill
            sizes="100vw"
            preload
            fetchPriority="high"
            className="object-cover object-center max-md:object-[20%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
          style={{ fontFamily: 'var(--font-hero-texte), system-ui, sans-serif', fontWeight: 500 }}
        >
          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#D8C9B5] mb-6 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            Collection 2026 · Mobilier d&apos;exception
          </p>
          <h1
            className="text-[2.8rem] md:text-[5.2rem] font-normal text-white uppercase leading-none"
            style={{ fontFamily: 'var(--font-hero-titre), Georgia, serif', letterSpacing: '0.1em' }}
          >
            Maison Serenia
          </h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 h-px w-28 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #A68A6D, transparent)' }}
          />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              href="/collections/salon"
              className="bg-white text-black text-xs font-medium tracking-[0.2em] uppercase px-10 py-4 hover:bg-[#7F6A52] hover:text-white transition-colors duration-300"
            >
              Découvrir la collection Salon
            </Link>
            <a
              href="#bubble-promo"
              className="border border-white/60 text-white text-xs font-medium tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300"
            >
              Voir les promotions
            </a>
          </div>

          {/* Micro-réassurance */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-10 text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
          >
            <span className="flex items-center gap-1.5 text-[11px] tracking-wide"><Truck className="w-3.5 h-3.5 text-[#A68A6D]" strokeWidth={1.5} /> Livraison offerte dès {formatPrice(40, cur)}</span>
            <span className="hidden sm:block w-px h-3 bg-white/25" />
            <span className="flex items-center gap-1.5 text-[11px] tracking-wide"><Shield className="w-3.5 h-3.5 text-[#A68A6D]" strokeWidth={1.5} /> Paiement sécurisé</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ fontFamily: 'var(--font-hero-texte), system-ui, sans-serif', fontWeight: 500 }}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">Défiler pour découvrir</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight className="w-4 h-4 text-white/60 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Bubble : promotion Black Friday, présentée en grille sur fond noir */}
      <BubblePromoSection />

      {/* 2) Mon Intérieur IA — sur mobile : texte puis photo pleine largeur ; sur ordinateur (thème 2) : photo pleine largeur, texte clair à gauche sur un voile brun */}
      <section className="relative w-full overflow-hidden bg-[#D4BDAA] text-[#221607]">
        <div className="relative mx-auto max-w-[1672px] flex flex-col lg:block lg:h-[772px]">
          <div className="relative z-10 px-6 pt-7 pb-3 sm:pt-10 sm:pb-12 lg:absolute lg:left-[5.1%] lg:top-0 lg:w-[600px] lg:px-0 lg:pt-[88px] lg:pb-0">
            <p className="text-[9px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#3E2F1B] lg:text-[#EADBC8]">Notre service conseil</p>
            <span aria-hidden="true" className="block mt-2 sm:mt-7 w-[57px] h-px bg-[#3E2F1B]/60 lg:bg-[#EADBC8]/60" />
            <h2 className="mt-5 sm:mt-8 text-[34px] sm:text-[44px] lg:text-[66px] leading-[1.2] sm:leading-[1.02] lg:leading-[1.1] text-[#221607] lg:text-[#FBF7F2]" style={{ fontFamily: 'var(--font-pdp-inter-tight)' }}>
              Créez votre projet intérieur
            </h2>
            <p className="mt-3 sm:mt-7 lg:mt-[31px] max-w-[290px] sm:max-w-[470px] text-[13px] leading-[1.3] sm:text-[16px] sm:leading-[1.6] lg:text-[19px] lg:leading-[1.6] text-[#1D120C] lg:text-[#F1E8DC]">
              Décrivez votre espace, votre style et votre budget. Nous vous accompagnons dans la sélection de pièces adaptées à votre intérieur.
            </p>
            <Link href="/mon-interieur-ia" className="mt-5 sm:mt-10 lg:mt-[51px] inline-flex w-auto sm:w-[380px] items-center justify-between gap-3 whitespace-nowrap bg-[#6A513A] px-4 py-2 sm:px-10 sm:py-5 text-[12px] sm:text-[15px] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-white hover:bg-[#5A4430] transition-colors lg:bg-[#F6F3F2] lg:text-[#221607] lg:hover:bg-white">
              Démarrer mon projet <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.4} />
            </Link>
          </div>
          <div className="relative w-full aspect-[1672/941] lg:absolute lg:inset-y-0 lg:left-[calc(50%_-_50vw)] lg:right-[calc(50%_-_50vw)] lg:w-auto lg:aspect-auto">
            <Image
              src="/catalog/mon-interieur-ia-salon-clair.webp"
              alt="Salon avec canapé d'angle anthracite, meuble TV noir et tables basses en marbre"
              fill
              sizes="100vw"
              className="object-cover object-[50%_100%]"
            />
            <div aria-hidden="true" className="absolute inset-x-0 top-[-2px] h-[calc(35%+2px)] bg-gradient-to-b from-[#D4BDAA] to-transparent lg:hidden" />
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden lg:block w-full bg-[linear-gradient(to_right,rgba(34,22,7,0.88)_0%,rgba(34,22,7,0.62)_38%,rgba(34,22,7,0)_68%)]" />
          </div>
        </div>
      </section>

      {/* Acheter par catégorie (« Notre univers ») — bien visible, style meublier */}
      <ShopByCategory />

      <div className="w-full">
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
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-2 text-[#7F6A52]">Sélection</p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-black" style={{ fontFamily: 'var(--font-pdp-inter-tight, system-ui, sans-serif)' }}>
                      Nos Pièces Signatures
                    </h2>
                    <span className="block w-10 h-px mt-3 mb-2" style={{ background: 'linear-gradient(90deg, #A68A6D, #D8C9B5)' }} />
                    <p className="text-neutral-500 max-w-lg text-sm">
                      {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <select aria-label="Trier les produits"
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {displayedProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {(showViewMore || visibleCount > PAGE_SIZE) && (
                <div className="flex flex-col items-center gap-3 mt-12">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {showViewMore && (
                      <button
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="inline-flex items-center gap-2 border border-black text-black text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:bg-black hover:text-white transition-colors duration-300"
                      >
                        Voir plus de produits
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </button>
                    )}
                    {visibleCount > PAGE_SIZE && (
                      <button
                        onClick={() => setVisibleCount(PAGE_SIZE)}
                        className="inline-flex items-center gap-2 border border-neutral-300 text-neutral-600 text-xs font-bold tracking-[0.2em] uppercase px-10 py-4 hover:border-black hover:text-black transition-colors duration-300"
                      >
                        Voir moins
                        <ChevronRight className="w-4 h-4 -rotate-90" />
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] tracking-wide text-neutral-500">
                    {displayedProducts.length} sur {filteredProducts.length} produits
                  </span>
                </div>
              )}
            </div>
          </section>

      </div>


      <BundlesSection onCartOpen={() => setCartOpen(true)} />
      <NewsletterSection />
    </div>
  );
}
