'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, Lock, Check, Truck, CreditCard, Package } from 'lucide-react';
import { products } from '@/lib/products';
import { useCart } from '@/lib/useCart';

type Step = 'cart' | 'delivery' | 'payment' | 'confirmation';
type PayMethod = 'card' | 'paypal' | 'twint' | 'applepay';

const GOLD_GRADIENT = 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)';

// Packs canapé + fauteuil + figurine — prix fixe promis sur les cartes bundle
const BUNDLES = [
  { canape: 10, fauteuil: 2, figurine: 39 },  // blanc
  { canape: 13, fauteuil: 6, figurine: 31 },  // bleu
  { canape: 22, fauteuil: 8, figurine: 36 },  // rouge
];
const BUNDLE_PRICE = 1900;

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, clearCart } = useCart();
  const isBubble = (id: number) => [2, 6, 7, 8, 9, 10, 12, 13, 22].includes(id);

  const [step, setStep] = useState<Step>('cart');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [delivery, setDelivery] = useState({ prenom: '', nom: '', email: '', adresse: '', ville: '', code: '' });
  const [payment, setPayment] = useState({ carte: '', expiry: '', cvv: '', titulaire: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

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

  // Remise pack : chaque trio complet canapé+fauteuil+figurine est facturé au prix bundle
  const qtyOf = (id: number) => cartProducts.find((x) => x.id === id)?.qty ?? 0;
  const priceOf = (id: number) => cartProducts.find((x) => x.id === id)?.price ?? 0;
  const packDiscount = BUNDLES.reduce((sum, b) => {
    const packs = Math.min(qtyOf(b.canape), qtyOf(b.fauteuil), qtyOf(b.figurine));
    if (packs === 0) return sum;
    const trioPrice = priceOf(b.canape) + priceOf(b.fauteuil) + priceOf(b.figurine);
    return sum + packs * Math.max(0, trioPrice - BUNDLE_PRICE);
  }, 0);

  const total = subtotal - packDiscount;

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
            {/* Top help strip */}
            <div className="flex items-center gap-3 px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex-shrink-0">
              <span className="w-8 h-8 bg-black text-white text-[10px] font-bold tracking-wider flex items-center justify-center flex-shrink-0">
                MS
              </span>
              <p className="text-[13px] text-neutral-700 leading-tight">
                Besoin d&apos;aide? <a href="mailto:aitanothonney@gmail.com" className="font-semibold text-black hover:underline">Contactez-nous à aitanothonney@gmail.com</a>
              </p>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-black" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                  {stepTitle[step]}
                </span>
                {step === 'cart' && totalQty > 0 && (
                  <span className="text-neutral-400 text-sm">({totalQty})</span>
                )}
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-neutral-100 transition-colors" aria-label="Fermer">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Step indicator (delivery/payment) */}
            {stepIndex >= 0 && (
              <div className="px-6 pt-5 pb-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  {indicatorSteps.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1 flex-1 last:flex-none">
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${i <= stepIndex ? 'text-black' : 'text-neutral-300'}`}>
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
                      </div>
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
                  <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="h-full">
                    {cartProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-16">
                        <div className="relative w-20 h-20 rounded-full border border-[#C9A96E]/40 flex items-center justify-center">
                          <div className="absolute inset-1.5 rounded-full border border-neutral-100" />
                          <ShoppingBag className="w-7 h-7 text-neutral-300 relative" strokeWidth={1.3} />
                        </div>
                        <p className="font-serif text-base text-neutral-500" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                          Votre panier est vide
                        </p>
                        <p className="text-xs text-neutral-400">Ajoutez des produits pour commencer.</p>
                        <button
                          onClick={goShopping}
                          className="mt-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3 hover:bg-neutral-800 transition-colors"
                        >
                          Découvrir nos produits
                        </button>
                      </div>
                    ) : (
                      <div className="px-6 py-5 space-y-5">
                        {cartProducts.map(({ id, qty, product, price }) => (
                          <motion.div
                            key={id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start gap-4"
                          >
                            <div className="shrink-0 w-[92px] h-[92px] bg-neutral-100 overflow-hidden flex items-center justify-center">
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
                                  <p className="text-xs text-neutral-400 mt-1">{product.category}</p>
                                  <p className="text-[17px] font-bold text-black mt-2 price-luxe">
                                    {price.toLocaleString('fr-FR')} €
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeItem(id)}
                                  className="shrink-0 p-1 text-neutral-400 hover:text-black transition-colors"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                              </div>
                              <div className="flex items-center gap-0 mt-3">
                                <button
                                  onClick={() => updateQty(id, Math.max(1, qty - 1))}
                                  className="w-8 h-8 border border-neutral-200 flex items-center justify-center hover:border-black transition-colors text-neutral-700"
                                  aria-label="Diminuer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-10 h-8 flex items-center justify-center text-sm text-black">{qty}</span>
                                <button
                                  onClick={() => updateQty(id, qty + 1)}
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
                      <span>Livraison à domicile offerte · 3 à 6 semaines</span>
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

                    <div className="h-px bg-neutral-100" />
                    <div className="flex justify-between font-bold text-sm">
                      <span>Total à payer</span>
                      <span>{total.toLocaleString('fr-FR')} €</span>
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
                          <span className="font-bold text-black price-luxe">{orderTotal.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                          <Package className="w-3.5 h-3.5" />
                          <span>Expédition estimée : 3 à 6 semaines · Livraison offerte</span>
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
            </div>

            {/* Footer — CART step */}
            {step === 'cart' && cartProducts.length > 0 && (
              <div className="border-t border-neutral-100 flex-shrink-0">
                <div className="px-6 pt-6 pb-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Sous-total</span>
                    <span className="text-sm text-neutral-600 price-luxe">{subtotal.toLocaleString('fr-FR')} €</span>
                  </div>
                  {packDiscount > 0 && (
                    <div className="flex items-center justify-between bg-neutral-50 border border-[#C9A96E]/40 px-3 py-2.5 -mx-1">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#A07840]">Remise Pack</span>
                      <span className="text-lg font-bold text-[#A07840] price-luxe">−{packDiscount.toLocaleString('fr-FR')} €</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Livraison</span>
                    <span className="text-sm text-neutral-600">Gratuite</span>
                  </div>
                </div>

                <div className="px-6">
                  <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
                </div>

                <div className="px-6 py-5">
                  <div className="flex items-end justify-between mb-6">
                    <span className="text-[11px] tracking-[0.3em] uppercase text-black font-semibold">Total</span>
                    <span className="text-2xl font-bold text-black leading-none price-luxe">
                      {total.toLocaleString('fr-FR')} €
                    </span>
                  </div>

                  <button
                    onClick={() => startCheckout('card')}
                    className="w-full text-white py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)' }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Payer par carte
                  </button>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <button
                      onClick={() => startCheckout('paypal')}
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center gap-1.5"
                      aria-label="Payer avec PayPal"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="#1A1A1A" />
                      </svg>
                      <span className="text-[11px] font-semibold tracking-wide">PayPal</span>
                    </button>
                    <button
                      onClick={() => startCheckout('applepay')}
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center gap-1"
                      aria-label="Payer avec Apple Pay"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.18.74 2.93.8 1.12-.22 2.19-.91 3.39-.84 1.44.07 2.53.61 3.24 1.57-2.96 1.77-2.26 5.69.44 6.82-.52 1.42-1.22 2.83-2 3.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="text-[11px] font-semibold tracking-wide">Pay</span>
                    </button>
                    <button
                      onClick={() => startCheckout('twint')}
                      className="bg-white border border-neutral-200 text-black py-3 hover:border-black transition-colors flex items-center justify-center font-bold tracking-wide text-[11px]"
                      aria-label="Payer avec TWINT"
                    >
                      TWINT
                    </button>
                  </div>
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
                        {payMethod === 'paypal' ? 'Continuer vers PayPal' : payMethod === 'twint' ? 'Confirmer avec TWINT' : payMethod === 'applepay' ? 'Payer avec Apple Pay' : `Payer ${total.toLocaleString('fr-FR')} €`}
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
