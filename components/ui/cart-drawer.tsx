'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, Lock, Check, Truck, CreditCard, Package } from 'lucide-react';
import { products } from '@/lib/products';
import { useCart } from '@/lib/useCart';
import { formatPrice, useCurrency } from '@/lib/currency';
import { WELCOME_CODE } from '@/components/ui/welcome-popup';

const normalizeCode = (s: string) => s.trim().replace(/\s+/g, ' ').toUpperCase();

type Step = 'cart' | 'delivery' | 'payment' | 'confirmation';
type PayMethod = 'card' | 'paypal' | 'twint' | 'applepay';

const GOLD_GRADIENT = 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)';

// Ensembles canapé + fauteuil — prix fixe, avec tableau 50×70 offert (au choix)
const BUNDLES = [
  { canape: 10, fauteuil: 2 },  // blanc
  { canape: 13, fauteuil: 6 },  // bleu
  { canape: 22, fauteuil: 8 },  // rouge
];
const BUNDLE_PRICE = 1900;
const GIFT_TABLEAU_PRICE = 60; // tableau 50×70 offert avec un ensemble

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, addItem, removeItem, updateQty, clearCart } = useCart();
  const cur = useCurrency();
  const isBubble = (id: number) => [2, 6, 7, 8, 9, 10, 12, 13, 22].includes(id);

  const [step, setStep] = useState<Step>('cart');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [delivery, setDelivery] = useState({ prenom: '', nom: '', email: '', adresse: '', ville: '', code: '' });
  const [payment, setPayment] = useState({ carte: '', expiry: '', cvv: '', titulaire: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

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
    if (normalizeCode(raw) === normalizeCode(WELCOME_CODE)) {
      setWelcomeActive(true);
      setPromoError(false);
      setPromoInput('');
      try {
        localStorage.setItem('welcome-discount', WELCOME_CODE);
        window.dispatchEvent(new Event('welcome-discount-updated'));
      } catch { /* ignore */ }
    } else {
      setPromoError(true);
    }
  };

  const removePromo = () => {
    setWelcomeActive(false);
    try {
      localStorage.removeItem('welcome-discount');
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
  };

  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return null;
    // Prix de base selon la taille choisie si le produit en propose
    const sizeMatch = product.sizes && item.size ? product.sizes.find((s) => s.label === item.size) : undefined;
    const base = sizeMatch ? sizeMatch.price : product.price;
    const price = isBubble(product.id) ? Math.round(base * 0.7) : base;
    return { ...item, product, price, orig: base };
  }).filter(Boolean) as { id: number; qty: number; size?: string; product: typeof products[0]; price: number; orig: number }[];

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

  const totalQty = cartProducts.reduce((sum, x) => sum + x.qty, 0);
  const subtotal = cartProducts.reduce((sum, x) => sum + x.price * x.qty, 0);
  // Prix d'origine (avant la promo -30% des pièces Bubble) et économie correspondante
  const originalSubtotal = cartProducts.reduce((sum, x) => sum + x.orig * x.qty, 0);
  const bubbleSavings = Math.round((originalSubtotal - subtotal) * 100) / 100;

  // Remise ensemble : chaque paire canapé+fauteuil est facturée au prix bundle,
  // et un tableau 50×70 par paire est offert.
  const qtyOf = (id: number) => cartProducts.find((x) => x.id === id)?.qty ?? 0;
  const priceOf = (id: number) => cartProducts.find((x) => x.id === id)?.price ?? 0;
  let totalPacks = 0;
  const pairDiscount = BUNDLES.reduce((sum, b) => {
    const packs = Math.min(qtyOf(b.canape), qtyOf(b.fauteuil));
    totalPacks += packs;
    if (packs === 0) return sum;
    const pairPrice = priceOf(b.canape) + priceOf(b.fauteuil);
    return sum + packs * Math.max(0, pairPrice - BUNDLE_PRICE);
  }, 0);
  const giftQty = cartProducts
    .filter((x) => x.product.name.includes('Tableau') && x.size === '50×70 cm')
    .reduce((s, x) => s + x.qty, 0);
  const giftDiscount = Math.min(totalPacks, giftQty) * GIFT_TABLEAU_PRICE;
  const packDiscount = pairDiscount + giftDiscount;

  const afterPack = subtotal - packDiscount;
  // Remise de bienvenue -10% (inscription newsletter)
  const welcomeDiscount = welcomeActive && afterPack > 0 ? Math.round(afterPack * 0.10 * 100) / 100 : 0;
  const merchandise = afterPack - welcomeDiscount;
  // Livraison offerte dès 40.–, sinon frais de port fixes de 4,90
  const FREE_SHIPPING_THRESHOLD = 40;
  const SHIPPING_FEE = 4.90;
  const shipping = merchandise > 0 && merchandise < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - merchandise);
  const freeShippingProgress = Math.min(100, Math.round((merchandise / FREE_SHIPPING_THRESHOLD) * 100));
  const total = merchandise + shipping;
  // Produits à ajouter pour franchir le seuil de livraison gratuite
  const cartIds = cartProducts.map((x) => x.id);
  const shippingBoosters = shipping > 0
    ? (() => {
        const seenNames = new Set<string>();
        return products
          .filter((p) => !cartIds.includes(p.id))
          .map((p) => ({ p, price: isBubble(p.id) ? Math.round(p.price * 0.7) : p.price }))
          .filter((x) => x.price >= remainingForFreeShipping && x.price <= remainingForFreeShipping + 60)
          .sort((a, b) => a.price - b.price)
          .filter((x) => { if (seenNames.has(x.p.name)) return false; seenNames.add(x.p.name); return true; })
          .slice(0, 4);
      })()
    : [];

  const goShopping = () => {
    handleClose();
    if (window.location.pathname === '/') {
      setTimeout(() => document.getElementById('section-salon')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } else {
      window.location.href = '/#section-salon';
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('cart');
      setPayLoading(false);
    }, 400);
  };

  const startCheckout = (method: PayMethod) => {
    setPayMethod(method);
    setStep('delivery');
  };

  // Paiement réel via Stripe si configuré, sinon repli sur le tunnel de démonstration.
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const handleCheckout = async (method: PayMethod) => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty, size: i.size })), promo: welcomeActive }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      // Repli sur le tunnel de démonstration UNIQUEMENT si Stripe n'est pas configuré
      if (data?.enabled === false) {
        startCheckout(method);
        return;
      }
      // Stripe configuré mais erreur → surtout pas de fausse confirmation
      alert('Paiement indisponible.\n\nEtape: ' + (data?.stage || '?') + '\n' + (data?.message || 'Réessayez.'));
    } catch {
      // Erreur réseau : on tente le tunnel de démonstration (aucun débit)
      startCheckout(method);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePay = () => {
    setPayLoading(true);
    setOrderTotal(total);
    setTimeout(() => {
      setPayLoading(false);
      clearCart();
      setStep('confirmation');
    }, 1800);
  };

  const deliveryValid = delivery.prenom && delivery.nom && delivery.email && delivery.adresse && delivery.ville && delivery.code;
  const paymentValid = payMethod !== 'card' || (payment.carte.replace(/\s/g, '').length === 16 && payment.expiry.length === 5 && payment.cvv.length === 3 && payment.titulaire);

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  // Vente croisée « Complétez votre intérieur » — pièces complémentaires populaires
  const CROSS_SELL_IDS = [77, 105, 83, 100, 129, 78, 87, 108];
  const crossSell = (() => {
    const seen = new Set<string>();
    return CROSS_SELL_IDS
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is typeof products[0] => !!p && !cartIds.includes(p.id))
      .filter((p) => { if (seen.has(p.name)) return false; seen.add(p.name); return true; })
      .slice(0, 3)
      .map((p) => ({ p, price: isBubble(p.id) ? Math.round(p.price * 0.7) : p.price }));
  })();

  const renderCrossSell = () => {
    if (crossSell.length === 0) return null;
    return (
      <div className="px-6 pb-5">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#A07840] font-bold mb-3">
          Complétez votre intérieur
        </p>
        <div className="space-y-2.5">
          {crossSell.map(({ p, price }) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border border-neutral-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className={`w-full h-full ${isBubble(p.id) || p.category === 'Décorations' || p.category === 'Été' ? 'object-contain p-1' : 'object-cover'}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-black truncate leading-tight">{p.name}</p>
                <p className="text-[12px] font-bold text-black price-luxe">{formatPrice(price, cur)}</p>
              </div>
              <button
                onClick={() => addItem(p.id)}
                className="shrink-0 flex items-center gap-1 border border-black px-3 h-8 text-[10px] font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                aria-label={`Ajouter ${p.name} au panier`}
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShippingBoosters = () => {
    if (shippingBoosters.length === 0) return null;
    return (
      <div className="border border-[#C9A96E]/40 bg-[#C9A96E]/5 rounded-lg p-3 mt-1">
        <p className="text-[10px] tracking-widest uppercase text-[#A07840] font-bold mb-2.5 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> Ajoutez un article & livraison offerte
        </p>
        <div className="space-y-2.5">
          {shippingBoosters.map(({ p, price }) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white border border-neutral-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className={`w-full h-full ${isBubble(p.id) || p.category === 'Décorations' || p.category === 'Été' ? 'object-contain p-1' : 'object-cover'}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-black truncate leading-tight">{p.name}</p>
                <p className="text-[12px] font-bold text-black price-luxe">{formatPrice(price, cur)}</p>
              </div>
              <button
                onClick={() => addItem(p.id)}
                className="shrink-0 w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                aria-label={`Ajouter ${p.name} au panier`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const stepTitle: Record<Step, string> = {
    cart: 'Mon Panier',
    delivery: 'Livraison',
    payment: 'Paiement sécurisé',
    confirmation: 'Commande confirmée',
  };

  const stepIndex = step === 'delivery' ? 0 : step === 'payment' ? 1 : -1;
  const indicatorSteps = [
    { label: 'Livraison', icon: <Truck className="w-3 h-3" /> },
    { label: 'Paiement', icon: <CreditCard className="w-3 h-3" /> },
  ];

  const inputClass = 'w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors';
  const labelClass = 'text-[10px] tracking-widest uppercase text-neutral-400 mb-1 block';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[61] flex flex-col shadow-2xl"
          >
            {/* Bandeau réassurance */}
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F5F1EA] border-b border-[#E7DFD1] flex-shrink-0 text-[11px] tracking-wide text-[#8a7658]">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>Livraison offerte dès {formatPrice(40, cur)} · Retours sous 30 jours</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 flex-shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#A07840] mb-1">
                  {step === 'cart' ? 'Votre commande' : step === 'delivery' ? 'Étape 1 / 2' : step === 'payment' ? 'Étape 2 / 2' : 'Merci'}
                </p>
                <h2 className="font-serif text-xl text-black leading-none" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  {stepTitle[step]}
                  {step === 'cart' && totalQty > 0 && <span className="text-neutral-400 text-base"> ({totalQty})</span>}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 -mr-2 hover:bg-neutral-100 transition-colors" aria-label="Fermer">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Step indicator (delivery/payment) */}
            {stepIndex >= 0 && (
              <div className="px-6 pt-5 pb-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  {indicatorSteps.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1 flex-1 last:flex-none">
                      <button
                        type="button"
                        onClick={() => { if (i < stepIndex) setStep((['delivery', 'payment'] as Step[])[i]); }}
                        disabled={i >= stepIndex}
                        className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${i <= stepIndex ? 'text-black' : 'text-neutral-300'} ${i < stepIndex ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}`}
                        aria-label={i < stepIndex ? `Revenir à l'étape ${s.label}` : s.label}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                            i < stepIndex
                              ? 'text-white shadow-sm'
                              : i === stepIndex
                                ? 'border-[1.5px] border-[#C9A96E] text-black bg-white shadow-sm'
                                : 'border border-neutral-200 text-neutral-300'
                          }`}
                          style={i < stepIndex ? { background: GOLD_GRADIENT } : undefined}
                        >
                          {i < stepIndex ? <Check className="w-3 h-3" /> : s.icon}
                        </div>
                        <span>{s.label}</span>
                      </button>
                      {i < indicatorSteps.length - 1 && (
                        <div
                          className="flex-1 h-px transition-colors duration-300 bg-neutral-200"
                          style={i < stepIndex ? { background: 'linear-gradient(90deg, #C9A96E, #A07840)' } : undefined}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ── CART ── */}
                {step === 'cart' && (
                  <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                    {cartProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6 py-16">
                        <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-1" style={{ background: 'linear-gradient(135deg, #F5F1EA 0%, #EDE4D3 100%)' }}>
                          <ShoppingBag className="w-7 h-7 text-[#C9A96E]" strokeWidth={1.4} />
                        </div>
                        <p className="font-serif text-lg text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                          Votre panier est vide
                        </p>
                        <p className="text-sm text-neutral-400 max-w-[240px]">Découvrez nos pièces et commencez votre sélection.</p>
                        <button
                          onClick={goShopping}
                          className="mt-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-neutral-800 transition-colors"
                        >
                          Parcourir la boutique
                        </button>
                      </div>
                    ) : (
                      <div className="px-6 py-5 space-y-5">
                        {cartProducts.map(({ id, qty, product, price, size }) => (
                          <motion.div
                            key={`${id}|${size || ''}`}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start gap-4"
                          >
                            <div className="shrink-0 w-[92px] h-[92px] bg-white border border-neutral-100 overflow-hidden flex items-center justify-center">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className={`w-full h-full ${isBubble(id) || product.category === 'Figurines' || product.category === 'Été' ? 'object-contain p-2' : 'object-cover'}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[15px] text-black leading-snug">{product.name}</p>
                                  <p className="text-xs text-neutral-400 mt-1">{size ? `Taille : ${size}` : product.category}</p>
                                  <p className="text-[17px] font-bold text-black mt-2 price-luxe">
                                    {formatPrice(price, cur)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeItem(id, size)}
                                  className="shrink-0 p-1 text-neutral-400 hover:text-black transition-colors"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                              </div>
                              <div className="flex items-center gap-0 mt-3">
                                <button
                                  onClick={() => updateQty(id, Math.max(1, qty - 1), size)}
                                  className="w-8 h-8 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors text-neutral-700"
                                  aria-label="Diminuer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-10 h-8 flex items-center justify-center text-sm text-black">{qty}</span>
                                <button
                                  onClick={() => updateQty(id, qty + 1, size)}
                                  className="w-8 h-8 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors text-neutral-700"
                                  aria-label="Augmenter"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {cartProducts.length > 0 && (
                      <div className="border-t border-neutral-100 pt-5">
                        {renderCrossSell()}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── DELIVERY ── */}
                {step === 'delivery' && (
                  <motion.div key="delivery" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Prénom</label>
                        <input value={delivery.prenom} onChange={(e) => setDelivery({ ...delivery, prenom: e.target.value })} className={inputClass} placeholder="Prénom" />
                      </div>
                      <div>
                        <label className={labelClass}>Nom</label>
                        <input value={delivery.nom} onChange={(e) => setDelivery({ ...delivery, nom: e.target.value })} className={inputClass} placeholder="Nom" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })} className={inputClass} placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Adresse</label>
                      <input value={delivery.adresse} onChange={(e) => setDelivery({ ...delivery, adresse: e.target.value })} className={inputClass} placeholder="12 rue de la Paix" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Ville</label>
                        <input value={delivery.ville} onChange={(e) => setDelivery({ ...delivery, ville: e.target.value })} className={inputClass} placeholder="Genève" />
                      </div>
                      <div>
                        <label className={labelClass}>Code postal</label>
                        <input value={delivery.code} onChange={(e) => setDelivery({ ...delivery, code: e.target.value })} className={inputClass} placeholder="1201" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-50 p-3">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>Livraison à domicile offerte · 1 à 4 semaines</span>
                    </div>
                  </motion.div>
                )}

                {/* ── PAYMENT ── */}
                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Paiement 100% sécurisé — chiffrement SSL 256 bits</span>
                    </div>

                    {/* Method tabs */}
                    <div className="grid grid-cols-4 gap-2">
                      {([
                        { key: 'card', label: 'Carte', icon: <CreditCard className="w-4 h-4" /> },
                        { key: 'paypal', label: 'PayPal', icon: <span className="font-bold text-xs">PP</span> },
                        { key: 'twint', label: 'Twint', icon: <span className="font-bold text-xs">TW</span> },
                        { key: 'applepay', label: 'Apple Pay', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> },
                      ] as const).map((m) => (
                        <button
                          key={m.key}
                          onClick={() => setPayMethod(m.key)}
                          className={`flex flex-col items-center justify-center gap-1 py-3 border text-[10px] font-semibold transition-all duration-200 ${
                            payMethod === m.key ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {m.icon}
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {payMethod === 'card' && (
                        <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
                          <div>
                            <label className={labelClass}>Titulaire de la carte</label>
                            <input value={payment.titulaire} onChange={(e) => setPayment({ ...payment, titulaire: e.target.value })} className={inputClass} placeholder="Jean Dupont" />
                          </div>
                          <div>
                            <label className={labelClass}>Numéro de carte</label>
                            <input value={payment.carte} onChange={(e) => setPayment({ ...payment, carte: formatCard(e.target.value) })}
                              className={`${inputClass} font-mono tracking-wider`} placeholder="1234 5678 9012 3456" maxLength={19} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Expiration</label>
                              <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                                className={`${inputClass} font-mono`} placeholder="MM/AA" maxLength={5} />
                            </div>
                            <div>
                              <label className={labelClass}>CVV</label>
                              <input value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                className={`${inputClass} font-mono`} placeholder="123" maxLength={3} type="password" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {payMethod === 'paypal' && (
                        <motion.div key="paypal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="border border-neutral-200 p-5 text-center space-y-3">
                          <div className="flex justify-center">
                            <div className="bg-[#003087] text-white font-bold text-lg px-4 py-2 tracking-tight">
                              Pay<span className="text-[#009cde]">Pal</span>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.</p>
                          <p className="text-xs text-neutral-400">Compte PayPal ou carte bancaire acceptés</p>
                        </motion.div>
                      )}

                      {payMethod === 'applepay' && (
                        <motion.div key="applepay" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="border border-neutral-200 p-5 text-center space-y-3">
                          <div className="flex justify-center items-center gap-2">
                            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="black"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                            <span className="font-bold text-lg tracking-tight">Apple Pay</span>
                          </div>
                          <p className="text-sm text-neutral-600">Confirmez le paiement avec Face ID ou Touch ID sur votre appareil Apple.</p>
                          <p className="text-xs text-neutral-400">Disponible sur iPhone, iPad et Mac</p>
                        </motion.div>
                      )}

                      {payMethod === 'twint' && (
                        <motion.div key="twint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                          className="border border-neutral-200 p-5 text-center space-y-3">
                          <div className="flex justify-center">
                            <div className="bg-black text-white font-black text-xl px-5 py-2 tracking-widest">TWINT</div>
                          </div>
                          <p className="text-sm text-neutral-600">Scannez le QR code avec votre app TWINT pour confirmer le paiement.</p>
                          <div className="mx-auto w-24 h-24 bg-white border border-neutral-200 flex items-center justify-center">
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

                    {/* Code promo */}
                    {welcomeActive ? (
                      <div className="flex items-center justify-between bg-[#C9A96E]/5 border border-[#C9A96E]/40 px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[12px] font-semibold text-[#A07840]">
                          <Check className="w-3.5 h-3.5" /> Code « {WELCOME_CODE} » — −10%
                        </span>
                        <button onClick={removePromo} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Retirer</button>
                      </div>
                    ) : (
                      <div>
                        <label className={labelClass}>Code promo</label>
                        <div className="flex gap-2">
                          <input
                            value={promoInput}
                            onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
                            onPaste={(e) => { const t = e.clipboardData.getData('text'); setTimeout(() => applyPromo(t), 0); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(promoInput); } }}
                            placeholder="MAISON SERENIA"
                            className={`flex-1 border px-3 py-2.5 text-sm uppercase tracking-wider focus:outline-none transition-colors ${promoError ? 'border-red-400' : 'border-neutral-200 focus:border-black'}`}
                          />
                          <button
                            type="button"
                            onClick={() => applyPromo(promoInput)}
                            disabled={!promoInput.trim()}
                            className="px-4 bg-black text-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40"
                          >
                            Appliquer
                          </button>
                        </div>
                        {promoError && <p className="text-[11px] text-red-500 mt-1.5">Ce code n&apos;est pas valide.</p>}
                      </div>
                    )}

                    {(bubbleSavings > 0 && welcomeDiscount > 0) && (
                      <div className="flex items-center gap-2 bg-[#C9A96E]/5 border border-[#C9A96E]/40 px-3 py-2.5">
                        <span className="text-[12px] text-[#A07840] font-semibold">🎉 Vous cumulez 2 offres : −30% collection + −10% membre</span>
                      </div>
                    )}

                    <div className="h-px bg-neutral-100" />
                    <div className="space-y-1.5">
                      {(bubbleSavings > 0 || welcomeDiscount > 0) && (
                        <div className="flex justify-between text-sm text-neutral-500">
                          <span>Prix d’origine</span>
                          <span>{formatPrice(originalSubtotal, cur)}</span>
                        </div>
                      )}
                      {bubbleSavings > 0 && (
                        <div className="flex justify-between text-sm text-[#A07840] font-semibold">
                          <span>Promotion −30%</span>
                          <span>−{formatPrice(bubbleSavings, cur)}</span>
                        </div>
                      )}
                      {packDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#A07840] font-semibold">
                          <span>Remise Pack</span>
                          <span>−{formatPrice(packDiscount, cur)}</span>
                        </div>
                      )}
                      {welcomeDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#A07840] font-semibold">
                          <span>Code membre −10%</span>
                          <span>−{formatPrice(welcomeDiscount, cur)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Livraison</span>
                        {shipping === 0 ? (
                          <span className="text-emerald-600 font-medium">Offerte</span>
                        ) : (
                          <span>{formatPrice(shipping, cur)}</span>
                        )}
                      </div>
                      {shipping > 0 && (
                        <div className="flex items-start gap-2 text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-lg">
                          <Truck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Frais de livraison de <span className="font-semibold text-black">{formatPrice(SHIPPING_FEE, cur)}</span> appliqués car votre commande est inférieure à {formatPrice(40, cur)}. Ajoutez {formatPrice(remainingForFreeShipping, cur)} d&apos;articles pour l&apos;obtenir <span className="font-semibold text-emerald-600">offerte</span>.</span>
                        </div>
                      )}
                      <div className="h-px bg-neutral-100 my-1" />
                      <div className="flex justify-between font-bold text-sm">
                        <span>Total à payer</span>
                        <span>{formatPrice(total, cur)}</span>
                      </div>
                    </div>

                    {/* Suggestions pour atteindre la livraison offerte */}
                    {renderShippingBoosters()}
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
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: GOLD_GRADIENT }}
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full">
                      <h3 className="text-xl font-serif font-bold mb-2" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Merci pour votre commande !</h3>
                      <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                        Votre commande a bien été reçue. Vous recevrez un email de confirmation à <strong>{delivery.email || 'votre adresse'}</strong>.
                      </p>
                      <div className="bg-neutral-50 p-4 text-left w-full mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Montant réglé</span>
                          <span className="font-bold text-black price-luxe">{formatPrice(orderTotal, cur)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                          <Package className="w-3.5 h-3.5" />
                          <span>Expédition estimée : 1 à 4 semaines</span>
                        </div>
                      </div>
                      <button
                        onClick={goShopping}
                        className="w-full py-3.5 bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                      >
                        Continuer mes achats
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            {/* Récapitulatif panier — défile avec les articles */}
            {step === 'cart' && cartProducts.length > 0 && (
              <div className="border-t border-neutral-100">
                {/* Code promo */}
                <div className="px-6 pt-5">
                  {welcomeActive ? (
                    <div className="flex items-center justify-between bg-[#C9A96E]/5 border border-[#C9A96E]/40 px-3 py-2.5">
                      <span className="flex items-center gap-2 text-[12px] font-semibold text-[#A07840]">
                        <Check className="w-3.5 h-3.5" /> Code « {WELCOME_CODE} » appliqué
                      </span>
                      <button onClick={removePromo} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Retirer</button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
                          onPaste={(e) => { const t = e.clipboardData.getData('text'); setTimeout(() => applyPromo(t), 0); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') applyPromo(promoInput); }}
                          placeholder="Code promo"
                          className={`flex-1 border px-3 py-2.5 text-sm uppercase tracking-wider focus:outline-none transition-colors ${promoError ? 'border-red-400' : 'border-neutral-200 focus:border-black'}`}
                        />
                        <button
                          onClick={() => applyPromo(promoInput)}
                          disabled={!promoInput.trim()}
                          className="px-4 bg-black text-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40"
                        >
                          Appliquer
                        </button>
                      </div>
                      {promoError && <p className="text-[11px] text-red-500 mt-1.5">Ce code n&apos;est pas valide.</p>}
                    </div>
                  )}
                </div>
                <div className="px-6 pt-4 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">{bubbleSavings > 0 ? 'Prix d’origine' : 'Sous-total'}</span>
                    <span className="text-sm text-neutral-600 price-luxe">{formatPrice((bubbleSavings > 0 ? originalSubtotal : subtotal), cur)}</span>
                  </div>
                  {bubbleSavings > 0 && (
                    <div className="flex items-center justify-between bg-neutral-50 border border-[#C9A96E]/40 px-3 py-2.5 -mx-1">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#A07840]">Promotion −30%</span>
                      <span className="text-lg font-bold text-[#A07840] price-luxe">−{formatPrice(bubbleSavings, cur)}</span>
                    </div>
                  )}
                  {packDiscount > 0 && (
                    <div className="flex items-center justify-between bg-neutral-50 border border-[#C9A96E]/40 px-3 py-2.5 -mx-1">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#A07840]">Remise Pack</span>
                      <span className="text-lg font-bold text-[#A07840] price-luxe">−{formatPrice(packDiscount, cur)}</span>
                    </div>
                  )}
                  {welcomeDiscount > 0 && (
                    <div className="flex items-center justify-between bg-neutral-50 border border-[#C9A96E]/40 px-3 py-2.5 -mx-1">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#A07840]">Bienvenue −10%</span>
                      <span className="text-lg font-bold text-[#A07840] price-luxe">−{formatPrice(welcomeDiscount, cur)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Livraison</span>
                    {shipping === 0 ? (
                      <span className="text-sm text-emerald-600 font-medium">Offerte</span>
                    ) : (
                      <span className="text-sm text-neutral-600 price-luxe">{formatPrice(shipping, cur)}</span>
                    )}
                  </div>

                  {/* Barre de progression vers la livraison offerte */}
                  {merchandise > 0 && (
                    <div className="pt-1">
                      {shipping > 0 ? (
                        <p className="text-[11px] text-neutral-500 mb-1.5">
                          Plus que <span className="font-bold text-[#A07840]">{formatPrice(remainingForFreeShipping, cur)}</span> pour la <span className="font-medium text-black">livraison offerte</span> 🚚
                        </p>
                      ) : (
                        <p className="text-[11px] text-emerald-600 font-medium mb-1.5 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Bravo, vous bénéficiez de la livraison offerte !
                        </p>
                      )}
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${freeShippingProgress}%`, background: shipping > 0 ? GOLD_GRADIENT : 'linear-gradient(90deg,#10b981,#059669)' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Suggestions pour atteindre la livraison offerte */}
                  {renderShippingBoosters()}
                </div>

                <div className="px-6">
                  <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
                </div>

                <div className="px-6 py-5">
                  <div className="flex items-end justify-between mb-6">
                    <span className="text-[11px] tracking-[0.3em] uppercase text-black font-semibold">Total</span>
                    <span className="text-2xl font-bold text-black leading-none price-luxe">
                      {formatPrice(total, cur)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckout('card')}
                    disabled={checkoutLoading}
                    className="w-full text-white py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)' }}
                  >
                    {checkoutLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Redirection…
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Passer au paiement
                      </>
                    )}
                  </button>

                  {/* Moyens de paiement disponibles sur la page sécurisée Stripe */}
                  <p className="text-center text-[10px] tracking-wide text-neutral-400 mt-3">
                    Carte · Apple Pay · TWINT · PayPal · Klarna · Link
                  </p>
                </div>

                <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 flex items-start gap-2.5">
                  <Lock className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-1">Paiement sécurisé</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Maison Serenia accepte les modes de paiement sécurisés. Vos données sont traitées de façon confidentielle.
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Footer — DELIVERY / PAYMENT steps */}
            {(step === 'delivery' || step === 'payment') && (
              <div className="p-6 border-t border-neutral-100 space-y-3 flex-shrink-0">
                {step === 'delivery' && (
                  <button
                    onClick={() => setStep('payment')}
                    disabled={!deliveryValid}
                    className="w-full py-4 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuer vers le paiement
                  </button>
                )}
                {step === 'payment' && (
                  <button
                    onClick={handlePay}
                    disabled={!paymentValid || payLoading}
                    className="w-full py-4 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        {payMethod === 'paypal' ? 'Continuer vers PayPal' : payMethod === 'twint' ? 'Confirmer avec TWINT' : payMethod === 'applepay' ? 'Payer avec Apple Pay' : `Payer ${formatPrice(total, cur)}`}
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setStep(step === 'payment' ? 'delivery' : 'cart')}
                  className="w-full text-center text-xs text-neutral-400 hover:text-black transition-colors"
                >
                  ← Retour
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
