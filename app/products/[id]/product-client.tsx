'use client';

import { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, ChevronDown, ChevronRight, X, Check, Lock, Truck, CreditCard, Package, Shield, RotateCcw, Link2, Plus, Eye, Gift, Flame } from 'lucide-react';
import { products, getVariantGroup, collapseVariantDuplicates } from '@/lib/products';
import { categoryToSlug } from '@/lib/collections';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';
import { Logo } from '@/components/ui/logo';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { formatPrice, useCurrency } from '@/lib/currency';
import { WELCOME_CODE } from '@/components/ui/welcome-popup';
import { useAnnouncementBarVisible } from '@/components/ui/announcement-bar';
import { buildReviewStats, buildAllReviews } from '@/lib/reviews';

const normalizeCode = (s: string) => s.trim().replace(/\s+/g, ' ').toUpperCase();

// Gamme (sous-onglet) d'un produit — doit rester synchronisé avec collection-grid.tsx
function rangeOfName(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('tableau')) return 'Tableaux';
  if (n.includes('vase')) return 'Vases';
  if (n.includes('lampe') || n.includes('lustre') || n.includes('suspendue') || n.includes('luminaire')) return 'Luminaires';
  if (n.includes('canapé')) return 'Canapés';
  if (n.includes('fauteuil')) return 'Fauteuils';
  if (n.includes('table basse') || n.includes('gigogne')) return 'Tables basses';
  if (n.includes("table d'appoint") || n.includes('appoint')) return "Tables d'appoint";
  if (n.includes('table')) return 'Tables';
  if (n.includes('meuble tv') || n.includes('meuble télé')) return 'Meubles TV';
  if (n.includes('commode')) return 'Commodes';
  if (n.includes('armoire')) return 'Armoires';
  if (n.includes('buffet')) return 'Buffets';
  return null;
}

// Couleur (hex) devinée à partir d'un mot de couleur français
const COLOR_HEX: [string, string][] = [
  ['vert foncé', '#3a5a40'], ['vert thé', '#b7c4a0'], ['vert', '#6a8f5f'],
  ['bordeaux', '#6b1f2a'], ['rouge', '#b3222f'], ['rose', '#e8a9b6'],
  ['beige', '#d8c8a8'], ['blanc', '#f2efe9'], ['jaune', '#e6c24a'],
  ['orange', '#d97b34'], ['noir', '#1a1a1a'], ['gris', '#9e9e9e'], ['brun', '#6b4a30'],
  // Couleurs en anglais (labels de certains produits)
  ['brown', '#6b4a30'], ['pink', '#e8a9b6'], ['white', '#f2efe9'], ['green', '#6a8f5f'],
  ['amber', '#d9a15a'], ['smoky', '#6e6e6e'], ['smoke', '#6e6e6e'], ['transparent', '#dfe6ea'],
];
function hexForWord(word: string): string | null {
  const w = word.trim().toLowerCase();
  for (const [name, hex] of COLOR_HEX) if (w.includes(name)) return hex;
  return null;
}
// Deux hex à partir d'un libellé « X + Y » (pour une pastille bi-ton)
function swatchColors(label: string): [string, string] | null {
  const parts = label.split('+').map((p) => p.trim());
  if (parts.length < 2) {
    const single = hexForWord(label);
    return single ? [single, single] : null;
  }
  const a = hexForWord(parts[0]);
  const b = hexForWord(parts[1]);
  if (!a && !b) return null;
  return [a ?? b!, b ?? a!];
}

// Canapé Bubble ↔ Fauteuil Bubble de même couleur
const bubbleComplement: Record<number, number> = {
  10: 2, 2: 10,   // blanc
  13: 6, 6: 13,   // bleu
  22: 8, 8: 22,   // rouge
};

// ─── Deterministic per-product mock data (same product always shows the same numbers) ──

function seedFromId(seed: number) {
  let s = seed;
  return function next() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function dimensionGuideExtra(category: string) {
  if (category === 'Décorations') {
    return {
      title: 'Hauteur & socle',
      content: "La hauteur indiquée inclut le socle d'origine. Prévoyez une étagère ou vitrine d'une profondeur minimale de 15 cm pour une présentation stable.",
    };
  }
  if (category === 'Été') {
    return {
      title: 'Poids & encombrement',
      content: "Produit compact et léger, pensé pour être transporté facilement. Le poids et l'encombrement plié sont précisés dans la fiche technique ci-dessus.",
    };
  }
  return {
    title: 'Profondeur d\'assise',
    content: "La profondeur d'assise détermine le confort d'usage : comptez environ 55 à 60 cm pour une assise droite, et jusqu'à 65 cm pour un confort cocooning type Bubble.",
  };
}

const ACTIVITY_NAMES = ['Claude D.', 'Diane M.', 'Boris D.', 'Emma L.', 'Julien K.', 'Nadia S.', 'Marc T.', 'Alice V.', 'Hugo P.', 'Léa R.'];

function buildLiveActivity(productId: number) {
  const rng = seedFromId(productId * 17 + 55);
  const viewers = 3 + Math.floor(rng() * 10);
  const buyers = 1 + Math.floor(rng() * 7);
  const names = [...ACTIVITY_NAMES].sort(() => rng() - 0.5);

  // Nombre de lignes aléatoire (4 à 6)
  const count = 4 + Math.floor(rng() * 3);
  const feed: { name: string; action: string; type: 'view' | 'buy'; time: string }[] = [];
  let elapsed = Math.floor(rng() * 3); // minutes depuis maintenant
  let nameIdx = 0;

  for (let i = 0; i < count; i++) {
    const isBuy = rng() < 0.45;
    // De temps en temps, une ligne groupée "+N personnes"
    const grouped = isBuy && rng() < 0.3;
    const name = grouped
      ? `+${2 + Math.floor(rng() * 7)} personnes`
      : names[nameIdx++ % names.length];
    const time =
      elapsed === 0 ? "à l'instant"
      : elapsed === 1 ? 'il y a 1 min'
      : elapsed < 60 ? `il y a ${elapsed} min`
      : `il y a ${Math.floor(elapsed / 60)} h`;
    feed.push({
      name,
      action: isBuy
        ? (grouped ? 'ont acheté cet article' : 'a acheté cet article')
        : 'regarde ce produit',
      type: isBuy ? 'buy' : 'view',
      time,
    });
    elapsed += 1 + Math.floor(rng() * 18); // écart aléatoire entre chaque ligne
  }
  return { viewers, buyers, feed };
}

// Prix élevé + forte marge (collection Bubble) => vaut la peine de pousser l'urgence d'achat
function buildStockUrgency(productId: number) {
  const rng = seedFromId(productId * 31 + 911);
  const stock = 1 + Math.floor(rng() * 5);
  const viewers = 2 + Math.floor(rng() * 9);
  const soldThisMonth = 15 + Math.floor(rng() * 60);
  return { stock, viewers, soldThisMonth };
}

const FAQ_ITEMS = [
  { q: 'Combien de temps pour la livraison ?', a: 'Comptez 1 à 4 semaines pour la livraison de votre commande, avec un suivi inclus dès l\'expédition.' },
  { q: 'Comment retourner un article ?', a: "Vous disposez de 30 jours pour changer d'avis. Contactez notre service client pour lancer un retour : l'enlèvement à domicile est organisé gratuitement." },
  { q: 'Le produit est-il conforme aux photos ?', a: 'Oui, nos photos sont fidèles au produit livré. De légères variations de teinte peuvent survenir selon les écrans.' },
];

// ─── Checkout Drawer ──────────────────────────────────────────────────────────

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

function CheckoutDrawer({
  open,
  onClose,
  product,
  unitPrice,
  size,
}: {
  open: boolean;
  onClose: () => void;
  product: { id: number; name: string; price: number; images: string[]; category: string };
  unitPrice?: number;
  size?: string;
}) {
  const cur = useCurrency();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [delivery, setDelivery] = useState({ prenom: '', nom: '', email: '', adresse: '', ville: '', code: '' });
  const [payment, setPayment] = useState({ carte: '', expiry: '', cvv: '', titulaire: '' });
  const [payMethod, setPayMethod] = useState<'card' | 'paypal' | 'twint' | 'applepay'>('card');
  const [payLoading, setPayLoading] = useState(false);
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [promoNeedsSignup, setPromoNeedsSignup] = useState(false);

  const isBubble = product.name.includes('Bubble');
  const promoPrice = unitPrice ?? (isBubble ? Math.round(product.price * 0.7) : product.price);
  const bubbleDiscount = isBubble ? product.price - promoPrice : 0; // remise -30%
  const welcomeDiscount = welcomeActive ? Math.round(promoPrice * 0.10 * 100) / 100 : 0;
  const merchandiseTotal = promoPrice - welcomeDiscount;
  // Livraison offerte dès 40.–, sinon 4,90
  const shippingFee = merchandiseTotal > 0 && merchandiseTotal < 40 ? 4.90 : 0;
  const finalTotal = merchandiseTotal + shippingFee;

  useEffect(() => {
    const read = () => {
      try { setWelcomeActive(!!localStorage.getItem('welcome-discount')); } catch { /* ignore */ }
    };
    read();
    window.addEventListener('welcome-discount-updated', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('welcome-discount-updated', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  const applyPromo = (raw: string) => {
    if (normalizeCode(raw) !== normalizeCode(WELCOME_CODE)) {
      setPromoNeedsSignup(false);
      setPromoError(true);
      return;
    }
    // Le code −10% est réservé aux inscrits (popup ou newsletter du pied de page)
    let subscribed = false;
    try { subscribed = !!localStorage.getItem('welcome-email'); } catch { /* ignore */ }
    if (!subscribed) {
      setPromoNeedsSignup(true);
      setPromoError(true);
      return;
    }
    setWelcomeActive(true);
    setPromoError(false);
    setPromoNeedsSignup(false);
    setPromoInput('');
    try {
      localStorage.setItem('welcome-discount', WELCOME_CODE);
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
  };

  const removePromo = () => {
    setWelcomeActive(false);
    try {
      localStorage.removeItem('welcome-discount');
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
  };

  const PromoField = () => (
    welcomeActive ? (
      <div className="flex items-center justify-between bg-[#C9A96E]/5 border border-[#C9A96E]/40 rounded-xl px-3 py-2.5">
        <span className="flex items-center gap-2 text-[12px] font-semibold text-[#A07840]">
          <Check className="w-3.5 h-3.5" /> Code « {WELCOME_CODE} » — −10%
        </span>
        <button type="button" onClick={removePromo} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Retirer</button>
      </div>
    ) : (
      <div>
        <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">Code promo</label>
        <div className="flex gap-2">
          <input
            value={promoInput}
            onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
            onPaste={(e) => { const t = e.clipboardData.getData('text'); setTimeout(() => applyPromo(t), 0); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(promoInput); } }}
            placeholder="MAISON SERENIA"
            className={`flex-1 border rounded-xl px-3 py-2.5 text-sm uppercase tracking-wider focus:outline-none transition-colors ${promoError ? 'border-red-400' : 'border-neutral-200 focus:border-black'}`}
          />
          <button
            type="button"
            onClick={() => applyPromo(promoInput)}
            disabled={!promoInput.trim()}
            className="px-4 bg-black text-white text-[11px] font-semibold tracking-[0.15em] uppercase rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-40"
          >
            Appliquer
          </button>
        </div>
        {promoError && <p className="text-[11px] text-red-500 mt-1.5">{promoNeedsSignup ? 'Code réservé aux inscrits — inscrivez-vous à la newsletter pour l’activer.' : 'Ce code n’est pas valide.'}</p>}
      </div>
    )
  );

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: 'cart', label: 'Panier', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { key: 'delivery', label: 'Livraison', icon: <Truck className="w-3.5 h-3.5" /> },
    { key: 'payment', label: 'Paiement', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { key: 'confirmation', label: 'Confirmation', icon: <Check className="w-3.5 h-3.5" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handlePay = async () => {
    setPayLoading(true);
    // Paiement réel via Stripe si configuré, sinon confirmation de démonstration.
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: product.id, qty: 1, size }], promo: welcomeActive }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      // Stripe configuré mais erreur → pas de fausse confirmation
      if (data?.enabled !== false) {
        setPayLoading(false);
        alert('Paiement indisponible.\n\nEtape: ' + (data?.stage || '?') + '\n' + (data?.message || 'Réessayez.'));
        return;
      }
      // Stripe non configuré → confirmation de démonstration
    } catch { /* erreur réseau → démonstration */ }
    setTimeout(() => {
      setPayLoading(false);
      setStep('confirmation');
    }, 1800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('cart');
      setPayLoading(false);
    }, 400);
  };

  const deliveryValid = delivery.prenom && delivery.nom && delivery.email && delivery.adresse && delivery.ville && delivery.code;
  const paymentValid = payMethod !== 'card' || (payment.carte.replace(/\s/g, '').length === 16 && payment.expiry.length === 5 && payment.cvv.length === 3 && payment.titulaire);

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <h2 className="text-base font-serif font-bold tracking-wide">
                {step === 'cart' && 'Mon panier'}
                {step === 'delivery' && 'Livraison'}
                {step === 'payment' && 'Paiement sécurisé'}
                {step === 'confirmation' && 'Commande confirmée'}
              </h2>
              <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Indicateur d'étapes retiré — le paiement se fait directement sur Stripe */}
            {false && (
              <div />
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ── CART ── */}
                {step === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="p-6"
                  >
                    <div className="flex gap-4 p-4 rounded-2xl border border-neutral-100 bg-neutral-50 mb-6">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center border border-neutral-100">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={80}
                          height={80}
                          className={product.name.includes('Bubble') || product.category === 'Décorations' ? 'object-contain w-full h-full p-1' : 'object-cover w-full h-full'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black leading-tight mb-1">{product.name}</p>
                        <p className="text-xs text-neutral-400 mb-2">{product.category} · Qté 1</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black price-luxe">{formatPrice(promoPrice, cur)}</span>
                          {product.name.includes('Bubble') && (
                            <span className="text-neutral-400 line-through text-xs price-luxe">{formatPrice(product.price, cur)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">{PromoField()}</div>

                    {(bubbleDiscount > 0 && welcomeDiscount > 0) && (
                      <div className="flex items-center gap-2 mb-4 bg-[#C9A96E]/5 border border-[#C9A96E]/40 rounded-xl px-3 py-2.5">
                        <Gift className="w-4 h-4 text-[#A07840] shrink-0" />
                        <span className="text-[12px] text-[#A07840] font-semibold">Vous cumulez 2 offres : −30% collection + −10% membre 🎉</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between text-neutral-500">
                        <span>Prix d&apos;origine</span><span>{formatPrice(product.price, cur)}</span>
                      </div>
                      {bubbleDiscount > 0 && (
                        <div className="flex justify-between text-[#A07840] font-semibold">
                          <span>Promotion −30%</span><span>−{formatPrice(bubbleDiscount, cur)}</span>
                        </div>
                      )}
                      {welcomeDiscount > 0 && (
                        <div className="flex justify-between text-[#A07840] font-semibold">
                          <span>Code membre −10%</span><span>−{formatPrice(welcomeDiscount, cur)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-500">
                        <span>Livraison</span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600">Offerte</span>
                        ) : (
                          <span>{formatPrice(shippingFee, cur)}</span>
                        )}
                      </div>
                      {shippingFee > 0 && (
                        <div className="flex items-start gap-2 text-[11px] text-neutral-500 bg-neutral-50 rounded-lg p-2.5">
                          <Truck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Frais de <span className="font-semibold text-black">{formatPrice(shippingFee, cur)}</span> car la commande est inférieure à {formatPrice(40, cur)}. Ajoutez {formatPrice((40 - merchandiseTotal), cur)} pour l&apos;obtenir <span className="font-semibold text-emerald-600">offerte</span>.</span>
                        </div>
                      )}
                      <div className="h-px bg-neutral-100 my-2" />
                      <div className="flex justify-between font-bold text-black text-base">
                        <span>Total</span><span>{formatPrice(finalTotal, cur)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 bg-neutral-50 rounded-xl p-3">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>Livraison à domicile offerte · 1 à 4 semaines</span>
                    </div>
                  </motion.div>
                )}

                {/* ── DELIVERY ── */}
                {step === 'delivery' && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'prenom', label: 'Prénom', col: 1 },
                        { key: 'nom', label: 'Nom', col: 1 },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">{f.label}</label>
                          <input
                            value={delivery[f.key as keyof typeof delivery]}
                            onChange={(e) => setDelivery({ ...delivery, [f.key]: e.target.value })}
                            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                            placeholder={f.label}
                          />
                        </div>
                      ))}
                    </div>
                    {[
                      { key: 'email', label: 'Email', placeholder: 'votre@email.com', type: 'email' },
                      { key: 'adresse', label: 'Adresse', placeholder: '12 rue de la Paix' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          value={delivery[f.key as keyof typeof delivery]}
                          onChange={(e) => setDelivery({ ...delivery, [f.key]: e.target.value })}
                          className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'ville', label: 'Ville', placeholder: 'Genève' },
                        { key: 'code', label: 'Code postal', placeholder: '75001' },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">{f.label}</label>
                          <input
                            value={delivery[f.key as keyof typeof delivery]}
                            onChange={(e) => setDelivery({ ...delivery, [f.key]: e.target.value })}
                            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                            placeholder={f.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── PAYMENT ── */}
                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Paiement 100% sécurisé — chiffrement SSL 256 bits</span>
                    </div>

                    {/* Method tabs */}
                    <div className="grid grid-cols-4 gap-2">
                      {([
                        { key: 'card', label: 'Carte', icon: <CreditCard className="w-4 h-4" /> },
                        { key: 'paypal', label: 'PayPal', icon: <span className="text-[#003087] font-bold text-xs">PP</span> },
                        { key: 'twint', label: 'Twint', icon: <span className="font-bold text-xs text-black">TW</span> },
                        { key: 'applepay', label: 'Apple Pay', icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> },
                      ] as const).map((m) => (
                        <motion.button
                          key={m.key}
                          onClick={() => setPayMethod(m.key)}
                          whileTap={{ scale: 0.97 }}
                          className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 text-xs font-semibold transition-all duration-200 ${
                            payMethod === m.key ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          <span className={payMethod === m.key ? 'text-white' : ''}>{m.icon}</span>
                          {m.label}
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Card fields */}
                      {payMethod === 'card' && (
                        <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">Titulaire de la carte</label>
                            <input value={payment.titulaire} onChange={(e) => setPayment({ ...payment, titulaire: e.target.value })}
                              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Jean Dupont" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">Numéro de carte</label>
                            <input value={payment.carte} onChange={(e) => setPayment({ ...payment, carte: formatCard(e.target.value) })}
                              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors font-mono tracking-wider"
                              placeholder="1234 5678 9012 3456" maxLength={19} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">Expiration</label>
                              <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors font-mono"
                                placeholder="MM/AA" maxLength={5} />
                            </div>
                            <div>
                              <label className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block">CVV</label>
                              <input value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors font-mono"
                                placeholder="123" maxLength={3} type="password" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* PayPal */}
                      {payMethod === 'paypal' && (
                        <motion.div key="paypal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="bg-[#FFC439]/10 border border-[#FFC439]/40 rounded-2xl p-5 text-center space-y-3">
                          <div className="flex justify-center">
                            <div className="bg-[#003087] text-white font-bold text-lg px-4 py-2 rounded-xl tracking-tight">
                              Pay<span className="text-[#009cde]">Pal</span>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.</p>
                          <p className="text-xs text-neutral-400">Compte PayPal ou carte bancaire acceptés</p>
                        </motion.div>
                      )}

                      {/* Apple Pay */}
                      {payMethod === 'applepay' && (
                        <motion.div key="applepay" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="bg-black/5 border border-black/10 rounded-2xl p-5 text-center space-y-3">
                          <div className="flex justify-center items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="black"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                            <span className="font-bold text-lg tracking-tight">Apple Pay</span>
                          </div>
                          <p className="text-sm text-neutral-600">Confirmez le paiement avec Face ID ou Touch ID sur votre appareil Apple.</p>
                          <p className="text-xs text-neutral-400">Disponible sur iPhone, iPad et Mac</p>
                        </motion.div>
                      )}

                      {/* Twint */}
                      {payMethod === 'twint' && (
                        <motion.div key="twint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="bg-black/5 border border-black/10 rounded-2xl p-5 text-center space-y-3">
                          <div className="flex justify-center">
                            <div className="bg-black text-white font-black text-xl px-5 py-2 rounded-xl tracking-widest">
                              TWINT
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">Scannez le QR code avec votre app TWINT pour confirmer le paiement.</p>
                          <div className="mx-auto w-24 h-24 bg-white border border-neutral-200 rounded-xl flex items-center justify-center">
                            <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
                              <rect x="4" y="4" width="24" height="24" rx="2" fill="black"/>
                              <rect x="8" y="8" width="16" height="16" rx="1" fill="white"/>
                              <rect x="11" y="11" width="10" height="10" fill="black"/>
                              <rect x="52" y="4" width="24" height="24" rx="2" fill="black"/>
                              <rect x="56" y="8" width="16" height="16" rx="1" fill="white"/>
                              <rect x="59" y="11" width="10" height="10" fill="black"/>
                              <rect x="4" y="52" width="24" height="24" rx="2" fill="black"/>
                              <rect x="8" y="56" width="16" height="16" rx="1" fill="white"/>
                              <rect x="11" y="59" width="10" height="10" fill="black"/>
                              <rect x="36" y="4" width="8" height="8" fill="black"/>
                              <rect x="36" y="16" width="8" height="8" fill="black"/>
                              <rect x="4" y="36" width="8" height="8" fill="black"/>
                              <rect x="16" y="36" width="8" height="8" fill="black"/>
                              <rect x="36" y="36" width="8" height="8" fill="black"/>
                              <rect x="48" y="36" width="8" height="8" fill="black"/>
                              <rect x="60" y="36" width="8" height="8" fill="black"/>
                              <rect x="36" y="48" width="8" height="8" fill="black"/>
                              <rect x="48" y="52" width="8" height="8" fill="black"/>
                              <rect x="60" y="52" width="8" height="8" fill="black"/>
                              <rect x="36" y="60" width="8" height="8" fill="black"/>
                              <rect x="60" y="68" width="8" height="8" fill="black"/>
                              <rect x="72" y="60" width="4" height="4" fill="black"/>
                            </svg>
                          </div>
                          <p className="text-xs text-neutral-400">Valable 5 minutes</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {PromoField()}

                    {(bubbleDiscount > 0 && welcomeDiscount > 0) && (
                      <div className="flex items-center gap-2 bg-[#C9A96E]/5 border border-[#C9A96E]/40 rounded-xl px-3 py-2.5">
                        <Gift className="w-4 h-4 text-[#A07840] shrink-0" />
                        <span className="text-[12px] text-[#A07840] font-semibold">Vous cumulez 2 offres : −30% collection + −10% membre 🎉</span>
                      </div>
                    )}

                    <div className="h-px bg-neutral-100" />
                    <div className="space-y-1.5">
                      {(bubbleDiscount > 0 || welcomeDiscount > 0) && (
                        <div className="flex justify-between text-sm text-neutral-500">
                          <span>Prix d&apos;origine</span><span>{formatPrice(product.price, cur)}</span>
                        </div>
                      )}
                      {bubbleDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#A07840] font-semibold">
                          <span>Promotion −30%</span><span>−{formatPrice(bubbleDiscount, cur)}</span>
                        </div>
                      )}
                      {welcomeDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#A07840] font-semibold">
                          <span>Code membre −10%</span><span>−{formatPrice(welcomeDiscount, cur)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Livraison</span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600 font-medium">Offerte</span>
                        ) : (
                          <span>{formatPrice(shippingFee, cur)}</span>
                        )}
                      </div>
                      {shippingFee > 0 && (
                        <div className="flex items-start gap-2 text-[11px] text-neutral-500 bg-neutral-50 rounded-lg p-2.5">
                          <Truck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Frais de livraison de <span className="font-semibold text-black">{formatPrice(shippingFee, cur)}</span> appliqués car la commande est inférieure à {formatPrice(40, cur)}.</span>
                        </div>
                      )}
                      <div className="h-px bg-neutral-100 my-1" />
                      <div className="flex justify-between font-bold text-sm">
                        <span>Total à payer</span>
                        <span>{formatPrice(finalTotal, cur)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── CONFIRMATION ── */}
                {step === 'confirmation' && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="p-6 flex flex-col items-center text-center pt-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-6"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-serif font-bold mb-2">Merci pour votre commande !</h3>
                      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                        Votre commande a bien été reçue. Vous recevrez un email de confirmation à <strong>{delivery.email || 'votre adresse'}</strong>.
                      </p>
                      <div className="bg-neutral-50 rounded-2xl p-4 text-left w-full mb-6">
                        <div className="flex gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-white border border-neutral-100 flex items-center justify-center overflow-hidden">
                            <Image src={product.images[0]} alt={product.name} width={48} height={48}
                              className={product.name.includes('Bubble') || product.category === 'Décorations' ? 'object-contain w-full h-full p-1' : 'object-cover w-full h-full'} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{product.name}</p>
                            <p className="text-xs text-neutral-400">{formatPrice(finalTotal, cur)} · Livraison offerte</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Package className="w-3.5 h-3.5" />
                          <span>Expédition estimée : 1 à 4 semaines</span>
                        </div>
                      </div>
                      <button
                        onClick={handleClose}
                        className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                      >
                        Continuer mes achats
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer CTA */}
            {step !== 'confirmation' && (
              <div className="p-6 border-t border-neutral-100 space-y-3">
                {step === 'cart' && (
                  <button
                    onClick={handlePay}
                    disabled={payLoading}
                    className="w-full py-4 rounded-xl bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {payLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Redirection vers le paiement…
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Payer {formatPrice(finalTotal, cur)}
                      </>
                    )}
                  </button>
                )}
                {step === 'delivery' && (
                  <button
                    onClick={() => setStep('payment')}
                    disabled={!deliveryValid}
                    className="w-full py-4 rounded-xl bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuer vers le paiement
                  </button>
                )}
                {step === 'payment' && (
                  <button
                    onClick={handlePay}
                    disabled={!paymentValid || payLoading}
                    className="w-full py-4 rounded-xl bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {payLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Traitement en cours…
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {payMethod === 'paypal' ? 'Continuer vers PayPal' : payMethod === 'twint' ? 'Confirmer avec TWINT' : payMethod === 'applepay' ? 'Payer avec Apple Pay' : `Payer ${formatPrice(finalTotal, cur)}`}
                      </>
                    )}
                  </button>
                )}
                {step !== 'cart' && (
                  <button
                    onClick={() => setStep(step === 'payment' ? 'delivery' : 'cart')}
                    className="w-full text-center text-xs text-neutral-400 hover:text-black transition-colors"
                  >
                    ← Retour
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Cart Toast ───────────────────────────────────────────────────────────────

function CartToast({ show, productName }: { show: boolean; productName: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium whitespace-nowrap"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-black" />
          </motion.div>
          <span>{productName} ajouté au panier</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Product Client ───────────────────────────────────────────────────────────

export default function ProductClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === Number(id));

  const cur = useCurrency();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { isWished, toggle: toggleWish } = useWishlist();
  const { addItem: addToCart, count: cartCount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<typeof products>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [addedComplement, setAddedComplement] = useState(false);
  const [openDim, setOpenDim] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const barVisible = useAnnouncementBarVisible();

  // Taille par défaut = la plus petite (première) si le produit propose des tailles
  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product.sizes[0].label);
  }, [product]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [id]);

  useEffect(() => {
    if (!product) return;
    const key = 'ms_recently_viewed';
    const stored: number[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    // Build recently viewed list (excluding current) before updating storage
    const filtered = stored.filter((pid) => pid !== product.id);
    const viewedProducts = filtered.slice(0, 5).map((pid) => products.find((p) => p.id === pid)).filter((p): p is (typeof products)[number] => Boolean(p));
    setRecentlyViewed(viewedProducts);
    // Save updated list with current product at front
    const updated = [product.id, ...filtered].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
  }, [product]);

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

  const bubbleOrder = [2, 10, 6, 13, 8, 22, 12, 7, 9];
  const isBubble = bubbleOrder.includes(product.id);
  const currentGroup = getVariantGroup(product.id);
  const related = product.category === 'Été'
    ? (() => {
        const seenGroups = new Set<number>();
        return products.filter(p => {
          if (p.category !== 'Été') return false;
          const grp = getVariantGroup(p.id);
          if (grp) {
            const firstId = grp[0].productId;
            if (currentGroup && grp[0].productId === currentGroup[0].productId) return false;
            if (seenGroups.has(firstId)) return false;
            seenGroups.add(firstId);
            return p.id === firstId;
          }
          return p.id !== product.id;
        });
      })()
    : isBubble
      ? bubbleOrder.filter((bid) => bid !== product.id).map((bid) => products.find((p) => p.id === bid)!).filter(Boolean)
      : (() => {
          // Suggestions par thème : tableau→tableaux, vase→vases, luminaire→luminaires, canapé→canapés…
          const themeOf = (name: string) => {
            const s = name.toLowerCase();
            if (s.includes('tableau')) return 'tableau';
            if (s.includes('vase')) return 'vase';
            if (s.includes('lampe') || s.includes('lustre') || s.includes('suspendue') || s.includes('luminaire')) return 'luminaire';
            if (s.includes('canapé')) return 'canapé';
            if (s.includes('fauteuil')) return 'fauteuil';
            if (s.includes('table')) return 'table';
            if (s.includes('commode') || s.includes('meuble tv') || s.includes('meuble télé')) return 'meuble';
            return 'autre';
          };
          const myTheme = themeOf(product.name);
          const sameTheme = collapseVariantDuplicates(
            products.filter((p) => p.id !== product.id && !p.name.includes('Bubble') && themeOf(p.name) === myTheme),
          );
          if (sameTheme.length > 0) return sameTheme;
          return collapseVariantDuplicates(
            products.filter((p) => p.category === product.category && p.id !== product.id && !p.name.includes('Bubble')),
          ).slice(0, 8);
        })();

  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const scrollRelated = (dir: 'left' | 'right') => {
    relatedScrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const recentScrollRef = useRef<HTMLDivElement>(null);
  const scrollRecent = (dir: 'left' | 'right') => {
    recentScrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;
  // Prix affiché : selon la taille choisie si le produit en propose, sinon prix promo
  const unitPrice = product.sizes
    ? (product.sizes.find((s) => s.label === selectedSize)?.price ?? product.sizes[0].price)
    : promoPrice;

  const complementId = bubbleComplement[product.id];
  const complementProduct = complementId ? products.find((p) => p.id === complementId) : undefined;

  const handleAddToCart = () => {
    addToCart(product.id, product.sizes ? selectedSize : undefined);
    setAdded(true);
    setToastMessage(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleAddComplement = () => {
    if (!complementProduct) return;
    addToCart(complementProduct.id);
    setAddedComplement(true);
    setToastMessage(complementProduct.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const dimExtra = dimensionGuideExtra(product.category);
  const dimensionAccordions = [
    { title: 'Avant de commencer', content: "Mesurez précisément l'espace disponible dans votre intérieur avant de passer commande, en prévoyant au moins 10 à 15 cm de marge pour la circulation et l'ouverture des portes." },
    { title: 'Guide des dimensions', content: `Dimensions du produit : ${product.dimensions}. Ces mesures correspondent à l'encombrement total du produit fini, hors emballage.` },
    { title: dimExtra.title, content: dimExtra.content },
  ];

  const reviewStats = buildReviewStats(product.id);
  const reviews = buildAllReviews(product.id, product.category, product.name).slice(0, 3);
  const stockUrgency = buildStockUrgency(product.id);

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
          <p>Livraison à domicile offerte, installation comprise. Délai : 1 à 4 semaines selon disponibilité.</p>
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
    <>
    <div className="min-h-screen bg-white">
      <CartToast show={showToast} productName={toastMessage || product.name} />
      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product={product} unitPrice={unitPrice} size={product.sizes ? selectedSize : undefined} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Navbar */}
      <header className={`fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${barVisible ? 'top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <Logo color="black" size="md" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center border border-black/15 hover:border-black text-neutral-600 hover:text-black transition-all duration-300"
              aria-label="Favoris"
            >
              <Heart className={`w-4 h-4 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center border border-black/15 hover:border-black text-neutral-600 hover:text-black transition-all duration-300"
              aria-label="Panier"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              {cartCount > 0 && (
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

      <div className={barVisible ? 'pt-[104px]' : 'pt-16'}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/collections/${categoryToSlug(product.category)}`}
              className="hover:text-black transition-colors"
            >
              {product.category}
            </Link>
            {(() => {
              const g = rangeOfName(product.name);
              if (!g) return null;
              return (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <Link
                    href={`/collections/${categoryToSlug(product.category)}?g=${encodeURIComponent(g)}`}
                    className="hover:text-black transition-colors"
                  >
                    {g}
                  </Link>
                </>
              );
            })()}
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">{product.name}</span>
          </nav>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="group relative overflow-hidden rounded-xl bg-neutral-50"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-auto block"
                  />
                </AnimatePresence>

                {/* Flèches de navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const ni = (selectedImage - 1 + product.images.length) % product.images.length;
                        setSelectedImage(ni);
                        const m = product.sizes?.find((s) => s.image === product.images[ni]);
                        if (m) setSelectedSize(m.label);
                      }}
                      aria-label="Image précédente"
                      className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-black bg-white/85 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 hover:shadow-[0_4px_18px_rgba(0,0,0,0.18)] transition-all duration-300 z-10"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const ni = (selectedImage + 1) % product.images.length;
                        setSelectedImage(ni);
                        const m = product.sizes?.find((s) => s.image === product.images[ni]);
                        if (m) setSelectedSize(m.label);
                      }}
                      aria-label="Image suivante"
                      className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-black bg-white/85 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 hover:shadow-[0_4px_18px_rgba(0,0,0,0.18)] transition-all duration-300 z-10"
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={1} />
                    </button>

                    {/* Points indicateurs */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {product.images.map((_, i) => (
                        <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedImage ? 'w-5 bg-black' : 'w-1.5 bg-black/25'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <AnimatePresence>
                {lightbox && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
                    onClick={() => setLightbox(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.88, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.88, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="relative max-w-[90vw] max-h-[90vh]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
                      />
                    </motion.div>
                    <button
                      onClick={() => setLightbox(false)}
                      className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-7 h-7" />
                    </button>
                    {product.images.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${i === selectedImage ? 'bg-white scale-125' : 'bg-white/40'}`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {product.images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedImage(i);
                        // Si cette image correspond à un coloris, on le sélectionne à droite
                        const match = product.sizes?.find((s) => s.image === img);
                        if (match) setSelectedSize(match.label);
                      }}
                      className={`relative w-16 h-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50 transition-all duration-200 ${
                        selectedImage === i ? 'ring-2 ring-black ring-offset-1' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} vue ${i + 1}`} fill sizes="120px" className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:pt-4">
              {/* Category + name */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-black" />
                  <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">{product.category}</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-black leading-tight mb-4">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(reviewStats.avg) ? 'fill-[#C9A96E] text-[#C9A96E]' : 'text-neutral-300'}`}
                        strokeWidth={i < Math.round(reviewStats.avg) ? 0 : 1.5}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">{reviewStats.avg}</span>
                  <span className="text-neutral-200">·</span>
                  <Link href={`/products/${product.id}/avis`} className="text-xs text-neutral-400 underline underline-offset-2 hover:text-black transition-colors">
                    {reviewStats.total} avis
                  </Link>
                </div>
                {/* Social Share */}
                <div className="flex gap-3 items-center text-neutral-400 text-xs mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 hover:text-black transition-colors"
                    title="Copier le lien"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {linkCopied ? <span className="text-green-600 font-medium">Lien copié !</span> : <span>Partager</span>}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-100 mb-6" />

              {/* Price block — sobre, encadré de filets fins */}
              <div className="border-y border-neutral-200 py-5 mb-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl text-black price-luxe">{formatPrice(unitPrice, cur)}</p>
                    {isBubble && (
                      <p className="text-sm text-neutral-400 line-through price-luxe">{formatPrice(product.price, cur)}</p>
                    )}
                  </div>
                  {isBubble && (
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#A07840] border border-[#C9A96E]/50 px-3 py-1.5 whitespace-nowrap">
                      −30% · Offre limitée
                    </span>
                  )}
                </div>
                {isBubble && (
                  <p className="text-xs text-neutral-400 mt-3 tracking-wide">
                    Livraison offerte · Installation comprise
                  </p>
                )}
              </div>

              {/* Disponibilité — mention discrète, sans alarmisme */}
              {isBubble && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)' }} />
                  <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-500">
                    Édition limitée — plus que {stockUrgency.stock} exemplaires
                  </p>
                </div>
              )}

              {/* Preuve sociale — visiteurs en direct & ventes du mois */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[11px] tracking-wide text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#A07840]" />
                  <strong className="text-black font-medium tabular-nums">{stockUrgency.viewers}</strong>&nbsp;personnes regardent ce produit
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#A07840]" />
                  <strong className="text-black font-medium tabular-nums">{stockUrgency.soldThisMonth}</strong>&nbsp;vendus ce mois-ci
                </span>
                {!isBubble && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] shrink-0" />
                    Plus que&nbsp;<strong className="text-black font-medium tabular-nums">{stockUrgency.stock}</strong>&nbsp;en stock
                  </span>
                )}
              </div>

              {/* Size selector — tailles au choix (ex. tableaux) */}
              {product.sizes && (
                <div className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
                    {product.sizeLabel ?? 'Taille'} — <span className="text-black font-medium">{selectedSize}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          setSelectedSize(s.label);
                          if (s.image) {
                            const idx = product.images.indexOf(s.image);
                            if (idx >= 0) setSelectedImage(idx);
                          }
                        }}
                        className={`px-3 py-2.5 text-[13px] border transition-all duration-200 flex flex-col items-center leading-tight ${
                          s.label === selectedSize
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {(() => {
                          const sw = swatchColors(s.label);
                          if (!sw) return null;
                          return (
                            <span
                              className={`w-4 h-4 rounded-full mb-1 border ${s.label === selectedSize ? 'border-white/40' : 'border-black/10'}`}
                              style={{ background: `linear-gradient(135deg, ${sw[0]} 0 50%, ${sw[1]} 50% 100%)` }}
                            />
                          );
                        })()}
                        <span>{s.label}</span>
                        <span className={`text-[11px] ${s.label === selectedSize ? 'text-white/70' : 'text-neutral-400'}`}>{formatPrice(s.price, cur)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-neutral-500">En stock · Livraison en 1 à 4 semaines</span>
                  </div>
                </div>
              )}

              {/* Color variants */}
              {variants && (
                <div className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3">
                    Couleur — <span className="text-black font-medium">{variants.find(v => v.productId === product.id)?.color}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    {variants.map((v) => (
                      <button
                        key={v.productId}
                        onClick={() => router.push(`/products/${v.productId}`)}
                        title={v.color}
                        className={`w-8 h-8 border-2 transition-all duration-200 ${
                          v.productId === product.id ? 'border-black scale-110 shadow-md' : 'border-neutral-200 hover:border-neutral-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.colorHex }}
                      />
                    ))}
                  </div>
                  {/* Stock Indicator — les Bubble ont déjà l'encart d'urgence ci-dessus */}
                  {!isBubble && (
                    <div className="flex items-center gap-2 text-xs mt-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-neutral-500">En stock · Livraison en 1 à 4 semaines</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-neutral-500 leading-relaxed mb-6 text-sm">{product.description}</p>

              {/* Caractéristiques — rangées épurées */}
              <div className="border-t border-neutral-100 divide-y divide-neutral-100 mb-8">
                <div className="flex items-center justify-between gap-6 py-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 shrink-0">Dimensions</span>
                  <span className="text-sm text-neutral-700 text-right">{product.dimensions}</span>
                </div>
                <div className="flex items-center justify-between gap-6 py-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 shrink-0">Matière</span>
                  <span className="text-sm text-neutral-700 text-right">{product.material}</span>
                </div>
              </div>

              {/* Livraison estimée */}
              <div className="flex items-center gap-2.5 mb-5 px-4 py-3 border border-neutral-100 bg-neutral-50/60">
                <Truck className="w-4 h-4 text-[#A07840] shrink-0" />
                <p className="text-xs text-neutral-600">
                  Commandez aujourd'hui — livraison estimée entre le{' '}
                  <strong className="text-black font-medium">
                    {new Date(Date.now() + 7 * 864e5).toLocaleDateString('fr-CH', { day: 'numeric', month: 'long' })}
                  </strong>{' '}et le{' '}
                  <strong className="text-black font-medium">
                    {new Date(Date.now() + 28 * 864e5).toLocaleDateString('fr-CH', { day: 'numeric', month: 'long' })}
                  </strong>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 mb-10">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 font-semibold text-sm tracking-[0.2em] uppercase text-white relative overflow-hidden flex items-center justify-center gap-3 border border-black transition-colors duration-300"
                  style={{ background: added ? '#333' : '#000' }}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-3">
                        <Check className="w-4 h-4" /> Ajouté au panier
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4" /> Ajouter au panier
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={() => setCheckoutOpen(true)}
                    whileTap={{ scale: 0.99 }}
                    className="py-4 font-semibold text-sm tracking-[0.2em] uppercase border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Acheter
                  </motion.button>

                  <motion.button
                    onClick={() => toggleWish(product.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`py-4 font-semibold text-sm tracking-[0.2em] uppercase border transition-all duration-300 flex items-center justify-center gap-2 ${
                      isWished(product.id) ? 'border-red-400 bg-red-50 text-red-500' : 'border-neutral-300 bg-white text-neutral-500 hover:border-black hover:text-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWished(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {isWished(product.id) ? 'Sauvé' : 'Wishlist'}
                  </motion.button>
                </div>
              </div>

              {/* Reassurance Badges */}
              <div className="flex gap-3 flex-wrap mb-8">
                <span className="text-[10px] tracking-wide text-neutral-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Garantie 2 ans
                </span>
                <span className="text-[10px] tracking-wide text-neutral-500 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Emballage protecteur
                </span>
                <span className="text-[10px] tracking-wide text-neutral-500 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Retour 30j
                </span>
                <span className="text-[10px] tracking-wide text-neutral-500 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Paiement sécurisé
                </span>
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
                      <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`} />
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

          {/* Souvent acheté ensemble */}
          {complementProduct && (
            <section className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-black mb-6">Souvent acheté ensemble</h2>
              <div className="space-y-3 mb-4">
                {(() => {
                  const cp = complementProduct;
                  const cpPromo = Math.round(cp.price * 0.7);
                  return (
                    <div className="flex items-center gap-4 p-4 border border-neutral-200">
                      <Link href={`/products/${cp.id}`} className="shrink-0 w-16 h-16 bg-neutral-50 flex items-center justify-center overflow-hidden">
                        <img loading="lazy" decoding="async" src={cp.images[0]} alt={cp.name} className="w-full h-full object-contain p-1.5" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${cp.id}`} className="font-serif font-bold text-sm text-black hover:underline">{cp.name}</Link>
                        <p className="text-xs text-neutral-400 mt-0.5">{cp.category}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-black text-sm price-luxe">{formatPrice(cpPromo, cur)}</span>
                        <button
                          onClick={handleAddComplement}
                          className="w-9 h-9 bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                          aria-label={`Ajouter ${cp.name} au panier`}
                        >
                          {addedComplement ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>
          )}

          {/* Guide des dimensions & tailles */}
          <section className="mt-16">
            <div className="bg-neutral-50 p-6 md:p-10">
              <h2 className="text-2xl font-serif font-bold text-black mb-1">Guide des dimensions &amp; tailles</h2>
              <span className="block w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
              <div className="space-y-3">
                {dimensionAccordions.map((acc, i) => (
                  <div key={i} className="bg-white border border-neutral-200">
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-sm font-serif font-bold text-black text-left"
                      onClick={() => setOpenDim(openDim === i ? null : i)}
                    >
                      {acc.title}
                      <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${openDim === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openDim === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed">{acc.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-neutral-50 border-l-2 border-[#C9A96E] px-5 py-4 text-sm text-neutral-600">
                Besoin d&apos;aide ? Notre équipe vous accompagne pour choisir les bonnes dimensions. <Link href="/contact" className="text-black underline font-semibold hover:no-underline">Contactez-nous</Link>
              </div>
            </div>
          </section>

          {/* Questions fréquentes */}
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-black mb-1">Questions fréquentes</h2>
            <span className="block w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-neutral-200">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-serif font-bold text-black text-left bg-neutral-50"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white"
                      >
                        <p className="px-5 pb-5 pt-4 text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* Avis de nos clients */}
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-black mb-1">Avis de nos clients</h2>
            <span className="block w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)' }} />
            <div className="bg-neutral-50 border border-neutral-200 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="text-center shrink-0 md:pr-6 md:border-r md:border-neutral-200 w-full md:w-auto">
                <p className="text-4xl font-serif font-bold text-black">{reviewStats.avg}</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(reviewStats.avg) ? 'fill-[#C9A96E] text-[#C9A96E]' : 'text-neutral-300'}`} />
                  ))}
                </div>
                <p className="text-xs text-neutral-400">{reviewStats.total} avis vérifiés</p>
              </div>
              <div className="flex-1 w-full space-y-1.5">
                {[
                  { star: 5, count: reviewStats.five },
                  { star: 4, count: reviewStats.four },
                  { star: 3, count: reviewStats.three },
                  { star: 2, count: reviewStats.two },
                  { star: 1, count: reviewStats.one },
                ].map(({ star, count }) => {
                  const pct = reviewStats.total ? (count / reviewStats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-6 text-neutral-400 shrink-0">{star}★</span>
                      <div className="flex-1 h-2 bg-neutral-200 overflow-hidden">
                        <div className="h-full bg-[#C9A96E]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-neutral-400 shrink-0">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {reviews.map((r, i) => (
                <div key={i} className="border border-neutral-200 p-4">
                  <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-black">{r.name}</span>
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Achat vérifié</span>
                    </div>
                    <span className="text-xs text-neutral-400">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i2) => (
                      <Star key={i2} className={`w-3.5 h-3.5 ${i2 < r.rating ? 'fill-[#C9A96E] text-[#C9A96E]' : 'text-neutral-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href={`/products/${product.id}/avis`} className="text-sm font-semibold text-black hover:underline">Voir tous les avis →</Link>
            </div>
          </section>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <section className="mt-24">
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-2xl font-serif font-bold">Consultés récemment</h2>
                <div className="flex items-center gap-2">
                  <motion.button onClick={() => scrollRecent('left')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Précédent">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </motion.button>
                  <motion.button onClick={() => scrollRecent('right')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Suivant">
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div ref={recentScrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {recentlyViewed.map((p) => {
                  const pIsBubble = [2, 10, 6, 13, 8, 22, 12, 7, 9].includes(p.id);
                  const pPromo = pIsBubble ? Math.round(p.price * 0.7) : p.price;
                  return (
                    <motion.div key={p.id} className="group flex-shrink-0 w-64 md:w-80 snap-start"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97, opacity: 0.85 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/products/${p.id}`}>
                        <div className={`relative aspect-square overflow-hidden rounded-xl bg-white mb-3 border border-neutral-100 ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'p-4' : ''}`}>
                          <Image src={p.images[0]} alt={p.name} width={400} height={400}
                            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'object-contain' : 'object-cover'}`} />
                          {pIsBubble && (
                            <span className="absolute top-2 left-2 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-black">−30%</span>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWish(p.id); }}
                            className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 hover:bg-white hover:scale-110 ${isWished(p.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-all ${isWished(p.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                          </button>
                        </div>
                      </Link>
                      <p className="font-semibold text-sm text-black group-hover:underline">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="font-bold text-sm text-black price-luxe">{formatPrice(pPromo, cur)}</p>
                        {pIsBubble && <p className="text-neutral-400 line-through text-xs price-luxe">{formatPrice(p.price, cur)}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-24">
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-2xl font-serif font-bold">Vous aimerez aussi</h2>
                <div className="flex items-center gap-2">
                  <motion.button onClick={() => scrollRelated('left')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Précédent">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </motion.button>
                  <motion.button onClick={() => scrollRelated('right')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Suivant">
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div ref={relatedScrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {related.map((p) => {
                  const pIsBubble = bubbleOrder.includes(p.id);
                  const pPromo = pIsBubble ? Math.round(p.price * 0.7) : p.price;
                  return (
                    <motion.div key={p.id} className="group flex-shrink-0 w-64 md:w-80 snap-start"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97, opacity: 0.85 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/products/${p.id}`}>
                        <div className={`relative aspect-square overflow-hidden rounded-xl bg-white mb-3 border border-neutral-100 ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'p-4' : ''}`}>
                          <Image src={p.images[0]} alt={p.name} width={400} height={400}
                            style={[7, 9, 12].includes(p.id) ? { transform: 'scale(1.3)', transformOrigin: 'center center' } : undefined}
                            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${pIsBubble && p.images[1] ? 'group-hover:opacity-0' : ''} ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'object-contain' : 'object-cover'}`} />
                          {pIsBubble && p.images[1] && (
                            <Image src={p.images[1]} alt={p.name} width={400} height={400}
                              style={[7, 9, 12].includes(p.id) ? { transform: 'scale(1.3)', transformOrigin: 'center center' } : undefined}
                              className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                          )}
                          {pIsBubble && (
                            <span className="absolute top-2 left-2 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-black">−30%</span>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWish(p.id); }}
                            className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 hover:bg-white hover:scale-110 ${isWished(p.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-all ${isWished(p.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                          </button>
                        </div>
                      </Link>
                      <p className="font-semibold text-sm text-black group-hover:underline">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="font-bold text-sm text-black price-luxe">{formatPrice(pPromo, cur)}</p>
                        {pIsBubble && <p className="text-neutral-400 line-through text-xs price-luxe">{formatPrice(p.price, cur)}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Back button */}
          <div className="mt-16">
            <Link href="/#tous" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Wishlist Drawer */}
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <span className="font-serif font-semibold text-lg">Favoris</span>
              </div>
              <button onClick={() => setWishlistOpen(false)} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {products.filter((p) => isWished(p.id)).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Heart className="w-12 h-12 text-neutral-200" />
                  <p className="font-serif text-lg text-neutral-400">Aucun favori pour l&apos;instant</p>
                  <p className="text-sm text-neutral-300">Cliquez sur le cœur d&apos;un produit pour l&apos;ajouter ici.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.filter((p) => isWished(p.id)).map((p) => {
                    const price = p.name.includes('Bubble') ? Math.round(p.price * 0.7) : p.price;
                    return (
                      <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl border border-neutral-100">
                        <Link href={`/products/${p.id}`} onClick={() => setWishlistOpen(false)} className="shrink-0 w-20 h-20 rounded-xl bg-neutral-50 overflow-hidden flex items-center justify-center">
                          <img loading="lazy" decoding="async" src={p.images[0]} alt={p.name} className={`w-full h-full ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'object-contain p-2' : 'object-cover'}`} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${p.id}`} onClick={() => setWishlistOpen(false)}>
                            <p className="font-serif font-semibold text-sm text-black leading-snug hover:underline">{p.name}</p>
                          </Link>
                          <p className="font-bold text-sm text-black mt-1 price-luxe">{formatPrice(price, cur)}</p>
                        </div>
                        <button onClick={() => toggleWish(p.id)} className="shrink-0 p-2 rounded-full hover:bg-red-50 transition-colors">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
