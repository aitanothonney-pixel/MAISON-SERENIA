'use client';

import { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, ChevronDown, ChevronRight, X, Check, Lock, Truck, CreditCard, Package } from 'lucide-react';
import { products, getVariantGroup } from '@/lib/products';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';

// ─── Checkout Drawer ──────────────────────────────────────────────────────────

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

function CheckoutDrawer({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: { name: string; price: number; images: string[]; category: string };
}) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [delivery, setDelivery] = useState({ prenom: '', nom: '', email: '', adresse: '', ville: '', code: '' });
  const [payment, setPayment] = useState({ carte: '', expiry: '', cvv: '', titulaire: '' });
  const [payMethod, setPayMethod] = useState<'card' | 'paypal' | 'twint' | 'applepay'>('card');
  const [payLoading, setPayLoading] = useState(false);

  const promoPrice = product.name.includes('Bubble') ? Math.round(product.price * 0.7) : product.price;

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: 'cart', label: 'Panier', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { key: 'delivery', label: 'Livraison', icon: <Truck className="w-3.5 h-3.5" /> },
    { key: 'payment', label: 'Paiement', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { key: 'confirmation', label: 'Confirmation', icon: <Check className="w-3.5 h-3.5" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handlePay = () => {
    setPayLoading(true);
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

            {/* Step indicator */}
            {step !== 'confirmation' && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center gap-1">
                  {steps.slice(0, 3).map((s, i) => (
                    <div key={s.key} className="flex items-center gap-1 flex-1">
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 ${i <= stepIndex ? 'text-black' : 'text-neutral-300'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${i < stepIndex ? 'bg-black text-white' : i === stepIndex ? 'border-2 border-black text-black' : 'border border-neutral-200 text-neutral-300'}`}>
                          {i < stepIndex ? <Check className="w-3 h-3" /> : s.icon}
                        </div>
                        <span className="hidden sm:block">{s.label}</span>
                      </div>
                      {i < 2 && <div className={`flex-1 h-px transition-colors duration-300 ${i < stepIndex ? 'bg-black' : 'bg-neutral-200'}`} />}
                    </div>
                  ))}
                </div>
              </div>
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
                          className={product.name.includes('Bubble') || product.category === 'Figurines' ? 'object-contain w-full h-full p-1' : 'object-cover w-full h-full'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black leading-tight mb-1">{product.name}</p>
                        <p className="text-xs text-neutral-400 mb-2">{product.category} · Qté 1</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">{promoPrice.toLocaleString('fr-FR')} €</span>
                          {product.name.includes('Bubble') && (
                            <span className="text-neutral-400 line-through text-xs">{product.price.toLocaleString('fr-FR')} €</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between text-neutral-500">
                        <span>Sous-total</span><span>{promoPrice.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Livraison</span><span className="text-emerald-600">Offerte</span>
                      </div>
                      <div className="h-px bg-neutral-100 my-2" />
                      <div className="flex justify-between font-bold text-black text-base">
                        <span>Total</span><span>{promoPrice.toLocaleString('fr-FR')} €</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 bg-neutral-50 rounded-xl p-3">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>Livraison à domicile offerte · 3 à 6 semaines</span>
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
                        { key: 'ville', label: 'Ville', placeholder: 'Paris' },
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

                    <div className="h-px bg-neutral-100" />
                    <div className="flex justify-between font-bold text-sm">
                      <span>Total à payer</span>
                      <span>{promoPrice.toLocaleString('fr-FR')} €</span>
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
                              className={product.name.includes('Bubble') || product.category === 'Figurines' ? 'object-contain w-full h-full p-1' : 'object-cover w-full h-full'} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{product.name}</p>
                            <p className="text-xs text-neutral-400">{promoPrice.toLocaleString('fr-FR')} € · Livraison offerte</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Package className="w-3.5 h-3.5" />
                          <span>Expédition estimée : 3 à 6 semaines</span>
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
                    onClick={() => setStep('delivery')}
                    className="w-full py-4 rounded-xl bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                  >
                    Continuer vers la livraison
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
                        {payMethod === 'paypal' ? 'Continuer vers PayPal' : payMethod === 'twint' ? 'Confirmer avec TWINT' : payMethod === 'applepay' ? 'Payer avec Apple Pay' : `Payer ${promoPrice.toLocaleString('fr-FR')} €`}
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

// ─── Product Page ─────────────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === Number(id));

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { isWished, toggle: toggleWish } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [id]);

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
  const related = product.category === 'Figurines'
    ? products.filter((p) => p.category === 'Figurines' && p.id !== product.id)
    : isBubble
      ? bubbleOrder.filter((bid) => bid !== product.id).map((bid) => products.find((p) => p.id === bid)!).filter(Boolean)
      : products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const scrollRelated = (dir: 'left' | 'right') => {
    relatedScrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const promoPrice = isBubble ? Math.round(product.price * 0.7) : product.price;

  const handleAddToCart = () => {
    addToCart(product.id);
    setAdded(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

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
          <p>Livraison à domicile offerte, installation comprise. Délai : 3 à 6 semaines selon disponibilité.</p>
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
      <CartToast show={showToast} productName={product.name} />
      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product={product} />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <Link href="/" className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
            MAISON SERENIA
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setWishlistOpen(true)} className="relative flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
              <Heart className={`w-5 h-5 transition-all ${isWished(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <Link href="/" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
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
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 cursor-zoom-in"
                onClick={() => setLightbox(true)}
              >
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
                      className={product.category === 'Figurines'
                        ? product.id === 33
                          ? 'object-cover object-center scale-110'
                          : 'object-contain p-6'
                        : isBubble ? 'object-contain p-4' : 'object-cover'}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
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
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-200 ${
                        selectedImage === i ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} vue ${i + 1}`} fill className="object-cover" />
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
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-black text-black" />)}
                    <span className="relative w-4 h-4 inline-block">
                      <Star className="w-4 h-4 text-neutral-300" />
                      <span className="absolute inset-0 overflow-hidden w-[50%]"><Star className="w-4 h-4 fill-black text-black" /></span>
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">4.5</span>
                  <span className="text-neutral-200">·</span>
                  <span className="text-xs text-neutral-400 underline underline-offset-2 cursor-pointer">24 avis</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-100 mb-6" />

              {/* Price block */}
              <div className="rounded-2xl p-4 mb-6 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-black">{promoPrice.toLocaleString('fr-FR')} €</p>
                    {isBubble && (
                      <p className="text-base text-neutral-400 line-through">{product.price.toLocaleString('fr-FR')} €</p>
                    )}
                  </div>
                  {isBubble && (
                    <div className="text-center">
                      <span className="text-white text-sm font-bold px-3 py-1.5 rounded-full block bg-black">−30%</span>
                      <p className="text-[10px] text-neutral-400 mt-1">Offre limitée</p>
                    </div>
                  )}
                </div>
                {isBubble && (
                  <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                    <span>✓</span> Livraison offerte · Installation comprise
                  </p>
                )}
              </div>

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
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          v.productId === product.id ? 'border-black scale-110 shadow-md' : 'border-neutral-200 hover:border-neutral-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.colorHex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-neutral-500 leading-relaxed mb-6 text-sm">{product.description}</p>

              {/* Specs pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs border border-neutral-100 rounded-full px-4 py-1.5 text-neutral-500 bg-neutral-50">📐 {product.dimensions}</span>
                <span className="text-xs border border-neutral-100 rounded-full px-4 py-1.5 text-neutral-500 bg-neutral-50">🪵 {product.material}</span>
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

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-24">
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-2xl font-serif font-bold">Vous aimerez aussi</h2>
                <div className="flex items-center gap-2">
                  <motion.button onClick={() => scrollRelated('left')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Précédent">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </motion.button>
                  <motion.button onClick={() => scrollRelated('right')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:border-black hover:shadow-sm transition-colors duration-200" aria-label="Suivant">
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
                        <div className={`relative aspect-square overflow-hidden rounded-xl bg-white mb-3 border border-neutral-100 ${p.name.includes('Bubble') || p.category === 'Figurines' ? 'p-2' : ''}`}>
                          <Image src={p.images[0]} alt={p.name} width={400} height={400}
                            style={pIsBubble ? { transform: p.id === 12 ? 'scale(1.65)' : [10, 13].includes(p.id) ? 'scale(1.45)' : [7, 8, 9].includes(p.id) ? 'scale(1.45)' : 'scale(1.3)', transformOrigin: 'center center' } : undefined}
                            className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${pIsBubble && p.images[1] ? 'group-hover:opacity-0' : ''} ${p.name.includes('Bubble') || p.category === 'Figurines' ? 'object-contain' : 'object-cover'}`} />
                          {pIsBubble && p.images[1] && (
                            <Image src={p.images[1]} alt={p.name} width={400} height={400}
                              style={{ transform: p.id === 12 ? 'scale(1.65)' : [10, 13].includes(p.id) ? 'scale(1.45)' : [7, 8, 9].includes(p.id) ? 'scale(1.45)' : 'scale(1.3)', transformOrigin: 'center center' }}
                              className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 p-2" />
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
                        <p className="font-bold text-sm text-black">{pPromo.toLocaleString('fr-FR')} €</p>
                        {pIsBubble && <p className="text-neutral-400 line-through text-xs">{p.price.toLocaleString('fr-FR')} €</p>}
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
                          <img src={p.images[0]} alt={p.name} className={`w-full h-full ${p.name.includes('Bubble') || p.category === 'Figurines' ? 'object-contain p-2' : 'object-cover'}`} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${p.id}`} onClick={() => setWishlistOpen(false)}>
                            <p className="font-serif font-semibold text-sm text-black leading-snug hover:underline">{p.name}</p>
                          </Link>
                          <p className="font-bold text-sm text-black mt-1">{price.toLocaleString('fr-FR')} €</p>
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
