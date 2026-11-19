'use client';

import { useState, use, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, ChevronDown, ChevronRight, X, Check, Lock, Truck, CreditCard, Package, Link2, Plus, Gift, Sparkles, FileText, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { products, getVariantGroup, collapseVariantDuplicates, nice99 } from '@/lib/products';
import { BLACK_FRIDAY_PROMO, formatPromoEnd } from '@/lib/promotions';
import { categoryToSlug } from '@/lib/collections';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';
import { trackViewItem, trackBeginCheckout } from '@/lib/analytics';
import { Logo } from '@/components/ui/logo';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { formatPrice, useCurrency } from '@/lib/currency';
import { WELCOME_CODE } from '@/components/ui/welcome-popup';

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
  if (n.includes('étagère') || n.includes('etagere') || n.includes('rangement') || n.includes('support de livres') || n.includes('serre-livre') || n.includes('porte-revues')) return 'Rangements';
  return null;
}

// Couleur (hex) devinée à partir d'un mot de couleur français
const COLOR_HEX: [string, string][] = [
  ['vert foncé', '#3a5a40'], ['vert thé', '#b7c4a0'], ['vert', '#6a8f5f'],
  ['bordeaux', '#6b1f2a'], ['rouge', '#b3222f'], ['rose', '#e8a9b6'],
  ['beige', '#d8c8a8'], ['blanc', '#F6F2EB'], ['jaune', '#e6c24a'],
  ['orange', '#d97b34'], ['noir', '#34322F'], ['gris', '#9e9e9e'], ['brun', '#6b4a30'],
  // Couleurs en anglais (labels de certains produits)
  ['brown', '#6b4a30'], ['pink', '#e8a9b6'], ['white', '#F6F2EB'], ['green', '#6a8f5f'],
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

const FAQ_ITEMS = [
  { q: 'Combien de temps pour la livraison ?', a: 'Comptez 1 à 4 semaines pour la livraison de votre commande, avec un suivi inclus dès l\'expédition.' },
  { q: 'Comment retourner un article ?', a: "Vous disposez de 30 jours pour changer d'avis. Contactez notre service client pour lancer un retour. Les frais de retour sont à votre charge, sauf article défectueux ou erreur de notre part." },
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
  const promoPrice = unitPrice ?? (isBubble ? nice99(Math.round(product.price * 0.7)) : product.price);
  const bubbleDiscount = isBubble ? product.price - promoPrice : 0; // remise -30%
  // Prix d'origine (avant remises), conscient de la taille choisie : pour un
  // produit à tailles, c'est le prix de la taille, pas le prix de base.
  const originalPrice = promoPrice + bubbleDiscount;
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

  // Bouton « offre exceptionnelle » : applique la remise −10% en un seul clic,
  // sans saisie du code ni condition d'inscription. Objectif : inciter à l'achat.
  const applyWelcomeOffer = () => {
    setWelcomeActive(true);
    setPromoError(false);
    setPromoNeedsSignup(false);
    setPromoInput('');
    try {
      localStorage.setItem('welcome-discount', WELCOME_CODE);
      window.dispatchEvent(new Event('welcome-discount-updated'));
    } catch { /* ignore */ }
  };

  const PromoField = () => (
    welcomeActive ? (
      <div className="flex items-center justify-between bg-[#7F6A52]/5 border border-[#A68A6D]/40 rounded-xl px-3 py-2.5">
        <span className="flex items-center gap-2 text-[12px] font-semibold text-[#7F6A52]">
          <Check className="w-3.5 h-3.5" /> Offre −10% activée · code « {WELCOME_CODE} »
        </span>
        <button type="button" onClick={removePromo} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">Retirer</button>
      </div>
    ) : (
      <div className="space-y-3">
        {/* Bouton « offre exceptionnelle » : applique la remise −10% en un clic */}
        <button
          type="button"
          onClick={applyWelcomeOffer}
          className="group w-full flex items-center justify-between gap-3 rounded-xl border border-[#A68A6D]/60 bg-gradient-to-r from-[#A68A6D]/15 to-[#A68A6D]/5 px-4 py-3 text-left transition-all hover:border-[#7F6A52] hover:shadow-sm"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-[#7F6A52] shrink-0" />
            <span className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#7F6A52] leading-tight">Remise de 10 % immédiate</span>
              <span className="text-[11px] text-[#7F6A52] leading-tight">Activée en un clic, sans code</span>
            </span>
          </span>
          <span className="shrink-0 rounded-lg bg-[#7F6A52] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors group-hover:bg-black">
            J&apos;en profite
          </span>
        </button>

        {/* Repli : saisie manuelle du code pour qui le possède déjà */}
        <div>
          <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">Vous avez un code promo ?</label>
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
      </div>
    )
  );


  const handlePay = async () => {
    setPayLoading(true);
    trackBeginCheckout([{ id: product.id, qty: 1, size }], merchandiseTotal);
    // Paiement réel via Stripe uniquement. En cas d'indisponibilité : message
    // d'erreur clair, JAMAIS de fausse confirmation.
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
      setPayLoading(false);
      alert('Le paiement est momentanément indisponible. Votre commande n\'a pas été enregistrée — merci de réessayer dans un instant.' + (data?.message ? `\n\n(${data.message})` : ''));
    } catch {
      setPayLoading(false);
      alert('Connexion interrompue. Votre commande n\'a pas été enregistrée — merci de réessayer.');
    }
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
                        <p className="text-xs text-neutral-500 mb-2">{product.category} · Qté 1</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black price-luxe">{formatPrice(promoPrice, cur)}</span>
                          {product.name.includes('Bubble') && (
                            <span className="text-neutral-500 line-through text-xs price-luxe">{formatPrice(product.price, cur)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">{PromoField()}</div>

                    {(bubbleDiscount > 0 && welcomeDiscount > 0) && (
                      <div className="flex items-center gap-2 mb-4 bg-[#7F6A52]/5 border border-[#A68A6D]/40 rounded-xl px-3 py-2.5">
                        <Gift className="w-4 h-4 text-[#7F6A52] shrink-0" />
                        <span className="text-[12px] text-[#7F6A52] font-semibold">Vous cumulez 2 remises : −30 % collection + −10 % 🎉</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between text-neutral-500">
                        <span>Prix d&apos;origine</span><span>{formatPrice(originalPrice, cur)}</span>
                      </div>
                      {bubbleDiscount > 0 && (
                        <div className="flex justify-between text-[#7F6A52] font-semibold">
                          <span>Promotion −30%</span><span>−{formatPrice(bubbleDiscount, cur)}</span>
                        </div>
                      )}
                      {welcomeDiscount > 0 && (
                        <div className="flex justify-between text-[#7F6A52] font-semibold">
                          <span>Remise −10 %</span><span>−{formatPrice(welcomeDiscount, cur)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-500">
                        <span>Livraison</span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700">Offerte</span>
                        ) : (
                          <span>{formatPrice(shippingFee, cur)}</span>
                        )}
                      </div>
                      {shippingFee > 0 && (
                        <div className="flex items-start gap-2 text-[11px] text-neutral-500 bg-neutral-50 rounded-lg p-2.5">
                          <Truck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Frais de <span className="font-semibold text-black">{formatPrice(shippingFee, cur)}</span> car la commande est inférieure à {formatPrice(40, cur)}. Ajoutez {formatPrice((40 - merchandiseTotal), cur)} pour l&apos;obtenir <span className="font-semibold text-emerald-700">offerte</span>.</span>
                        </div>
                      )}
                      <div className="h-px bg-neutral-100 my-2" />
                      <div className="flex justify-between font-bold text-black text-base">
                        <span>Total</span><span>{formatPrice(finalTotal, cur)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 bg-neutral-50 rounded-xl p-3">
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
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">{f.label}</label>
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
                        <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">{f.label}</label>
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
                          <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">{f.label}</label>
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
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-xl p-3">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Paiement sécurisé par Stripe</span>
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
                            <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">Titulaire de la carte</label>
                            <input value={payment.titulaire} onChange={(e) => setPayment({ ...payment, titulaire: e.target.value })}
                              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Jean Dupont" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">Numéro de carte</label>
                            <input value={payment.carte} onChange={(e) => setPayment({ ...payment, carte: formatCard(e.target.value) })}
                              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors font-mono tracking-wider"
                              placeholder="1234 5678 9012 3456" maxLength={19} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">Expiration</label>
                              <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors font-mono"
                                placeholder="MM/AA" maxLength={5} />
                            </div>
                            <div>
                              <label className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1 block">CVV</label>
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
                          <p className="text-xs text-neutral-500">Compte PayPal ou carte bancaire acceptés</p>
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
                          <p className="text-xs text-neutral-500">Disponible sur iPhone, iPad et Mac</p>
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
                          <p className="text-xs text-neutral-500">Valable 5 minutes</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {PromoField()}

                    {(bubbleDiscount > 0 && welcomeDiscount > 0) && (
                      <div className="flex items-center gap-2 bg-[#7F6A52]/5 border border-[#A68A6D]/40 rounded-xl px-3 py-2.5">
                        <Gift className="w-4 h-4 text-[#7F6A52] shrink-0" />
                        <span className="text-[12px] text-[#7F6A52] font-semibold">Vous cumulez 2 remises : −30 % collection + −10 % 🎉</span>
                      </div>
                    )}

                    <div className="h-px bg-neutral-100" />
                    <div className="space-y-1.5">
                      {(bubbleDiscount > 0 || welcomeDiscount > 0) && (
                        <div className="flex justify-between text-sm text-neutral-500">
                          <span>Prix d&apos;origine</span><span>{formatPrice(originalPrice, cur)}</span>
                        </div>
                      )}
                      {bubbleDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#7F6A52] font-semibold">
                          <span>Promotion −30%</span><span>−{formatPrice(bubbleDiscount, cur)}</span>
                        </div>
                      )}
                      {welcomeDiscount > 0 && (
                        <div className="flex justify-between text-sm text-[#7F6A52] font-semibold">
                          <span>Remise −10 %</span><span>−{formatPrice(welcomeDiscount, cur)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Livraison</span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-medium">Offerte</span>
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
                            <p className="text-xs text-neutral-500">{formatPrice(finalTotal, cur)} · Livraison offerte</p>
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
                    className="w-full text-center text-xs text-neutral-500 hover:text-black transition-colors"
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
  // Barre d'achat fixe (mobile) : visible quand le bouton principal sort de l'écran
  const [ctaOut, setCtaOut] = useState(false);
  const ctaObserver = useRef<IntersectionObserver | null>(null);
  // Ref de rappel : l'observateur est posé dès que le bouton existe dans le DOM
  const setCtaNode = useCallback((el: HTMLButtonElement | null) => {
    ctaObserver.current?.disconnect();
    ctaObserver.current = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(([entry]) => setCtaOut(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
      io.observe(el);
      ctaObserver.current = io;
    }
  }, []);
  // Refs de défilement déclarées avant tout return anticipé (règles des hooks)
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);
  // Fourchette de livraison estimée, calculée une seule fois (évite un appel
  // impur — Date.now — pendant le rendu).
  const [deliveryRange] = useState(() => {
    const fmt = (days: number) =>
      new Date(Date.now() + days * 864e5).toLocaleDateString('fr-CH', { day: 'numeric', month: 'long' });
    return { from: fmt(7), to: fmt(28) };
  });

  // Taille par défaut = la plus petite (première) si le produit propose des tailles
  useEffect(() => {
    // Taille par défaut dérivée du produit (prop) — motif légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (product?.sizes?.length) setSelectedSize(product.sizes[0].label);
  }, [product]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [id]);

  useEffect(() => {
    if (!product) return;
    trackViewItem(product.id);
    const key = 'ms_recently_viewed';
    const stored: number[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    // Build recently viewed list (excluding current) before updating storage
    const filtered = stored.filter((pid) => pid !== product.id);
    const viewedProducts = filtered.slice(0, 5).map((pid) => products.find((p) => p.id === pid)).filter((p): p is (typeof products)[number] => Boolean(p));
    // Lecture « vus récemment » (store client) au montage — motif légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentlyViewed(viewedProducts);
    // Save updated list with current product at front
    const updated = [product.id, ...filtered].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
  }, [product]);

  // Photos : navigation (flèches, clavier, glissement) et agrandissement
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxOpenerRef = useRef<HTMLElement | null>(null);
  const lightboxDialogRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const goToImage = useCallback((ni: number) => {
    if (!product) return;
    setSelectedImage(ni);
    const lbl = product.imageColor?.[ni] || product.sizes?.find((s) => s.image === product.images[ni])?.label;
    if (lbl) setSelectedSize(lbl);
  }, [product]);

  const stepImage = useCallback((delta: number) => {
    if (!product || product.images.length < 2) return;
    const n = product.images.length;
    goToImage((selectedImage + delta + n) % n);
  }, [product, selectedImage, goToImage]);

  const openLightbox = (opener: HTMLElement) => {
    lightboxOpenerRef.current = opener;
    setZoomed(false);
    setLightbox(true);
  };

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    setZoomed(false);
    lightboxOpenerRef.current?.focus();
  }, []);

  // Clavier dans l'agrandissement : Échap, flèches, focus maintenu dans la fenêtre, fond non défilant
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowRight') { stepImage(1); return; }
      if (e.key === 'ArrowLeft') { stepImage(-1); return; }
      if (e.key === 'Tab' && lightboxDialogRef.current) {
        const focusable = lightboxDialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    lightboxCloseRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, stepImage, closeLightbox]);

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
  // Fiche descriptive PDF à proposer à côté du bouton « Partager ».
  const FICHE_PDF_NAME_BY_ID: Record<number, string> = {
    60: 'Meuble TV bois 150 cm',
    61: 'Meuble TV extensible noir',
    62: 'Table à manger ovale en bois massif',
    63: 'Table à manger ovale en bois massif',
    64: 'Meuble TV industriel brun rustique',
    65: 'Table d\'appoint double couche',
    66: 'Table d\'appoint double couche',
    67: 'Table d\'appoint double couche',
    68: 'Table basse mobile noire',
    74: 'Commode 6 tiroirs bois & noir',
    75: 'Commode meuble TV long à tiroirs',
    76: 'Commode blanche 6 tiroirs',
    77: 'Table basse Farmhouse en bois',
    83: 'Table basse bicolore à niveaux décalés',
    84: 'Lot de 2 tables gigognes',
    85: 'Lot de 2 tables gigognes',
    86: 'Lot de 2 tables gigognes',
    87: 'Canapé d\'angle 3 places crème',
    // Canapés-lits modulables chenille (2 places convertibles)
    89: 'Canapé-lit modulaire chenille vert',
    90: 'Canapé-lit modulaire chenille noir',
    91: 'Canapé-lit modulaire chenille beige',
    92: 'Canapé-lit modulaire chenille bleu',
    // Canapés sectionnels en U (chenille, double méridienne)
    94: 'Canapé d\'angle modulable en U gris foncé',
    95: 'Canapé d\'angle modulable en U noir',
    96: 'Canapé d\'angle modulable en U gris clair',
    97: 'Canapé d\'angle modulable en U beige',
    98: 'Canapé d\'angle modulable en U brun',
    99: 'Canapé d\'angle modulable en U vert',
    // Canapés modulables en L et en U « style nuage »
    100: 'Canapé modulable en L style nuage gris anthracite',
    101: 'Canapé modulable en L style nuage gris anthracite',
    102: 'Canapé modulable en L style nuage gris anthracite',
    113: 'Canapé modulable en U style nuage blanc',
    114: 'Canapé modulable en U style nuage noir',
    115: 'Canapé modulable en U style nuage gris',
    // Tables à manger
    132: 'Table à manger en bois massif nordique',
    // Tables basses
    78: 'Table basse industrielle 2 niveaux',
    81: 'Table basse moderne noire 2 étagères',
    133: 'Lot de 2 tables basses rondes noyer',
    // Tables d'appoint
    82: 'Table d\'appoint 2 niveaux noyer',
  };
  // Fiches communes à toute une gamme (Bubble)
  const fichePdfNameLc = product.name.toLowerCase();
  const fichePdfName = FICHE_PDF_NAME_BY_ID[product.id]
    ?? (product.name.includes('Bubble') && fichePdfNameLc.includes('fauteuil') ? 'Fauteuil Bubble'
      : product.name.includes('Bubble') && fichePdfNameLc.includes('canapé') ? 'Canapé Bubble'
      : undefined);
  // Lien vers public/docs/MAISON SERENIA DESCRIPTIF - <produit>.pdf (encodé : espaces, accents, apostrophes)
  const fichePdfHref = fichePdfName
    ? `/docs/${encodeURIComponent(`MAISON SERENIA DESCRIPTIF - ${fichePdfName}.pdf`)}`
    : undefined;
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

  const scrollRelated = (dir: 'left' | 'right') => {
    relatedScrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const scrollRecent = (dir: 'left' | 'right') => {
    recentScrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const promoPrice = isBubble ? nice99(Math.round(product.price * 0.7)) : product.price;
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
      {ctaOut && (
        <div className="pdp-sticky-cta pdp fixed inset-x-0 bottom-0 z-[60] md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-neutral-600 truncate">{product.name}</p>
            <p className="text-[15px] font-semibold text-black pdp-display">{formatPrice(unitPrice, cur)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="shrink-0 px-5 py-3.5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {added ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      )}
      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product={product} unitPrice={unitPrice} size={product.sizes ? selectedSize : undefined} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Navbar */}
      <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
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
                  style={{ background: 'linear-gradient(135deg, #7F6A52 0%, #5E4E3C 100%)' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`pdp${ctaOut ? ' pb-24 md:pb-0' : ''}`}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-500">
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] gap-10 lg:gap-14">

            {/* Image Gallery */}
            <div className="space-y-2.5">
{/* Grande photo et grille des autres vues (mise en page V2, toutes les fiches) */}
              <div className="group relative aspect-[4/3] overflow-hidden bg-[#F6F2EB]">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  preload={selectedImage === 0}
                  className="object-contain p-2"
                />
                <button
                  type="button"
                  onClick={(e) => openLightbox(e.currentTarget)}
                  aria-label="Agrandir la photo"
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-white/90 text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-colors hover:bg-white"
                >
                  <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              {product.images.length > 1 && (
                <div className={`grid gap-2.5 ${product.images.length > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {product.images.map((img, i) => i === selectedImage ? null : (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { goToImage(i); openLightbox(e.currentTarget); }}
                      aria-label={`Agrandir la photo ${i + 1}`}
                      className="relative aspect-[4/3] overflow-hidden bg-[#F6F2EB]"
                    >
                      <Image src={img} alt={`${product.name} vue ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {lightbox && (
                  <motion.div
                    ref={lightboxDialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Photo agrandie : ${product.name}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex overflow-auto bg-black/90"
                    onClick={closeLightbox}
                  >
                    <motion.div
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.92, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative m-auto transition-[width,height] duration-300 ${zoomed ? 'w-[200vw] h-[200vh]' : 'w-[92vw] h-[84vh]'}`}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => { swipeStartRef.current = { x: e.clientX, y: e.clientY }; }}
                      onPointerUp={(e) => {
                        const s = swipeStartRef.current;
                        swipeStartRef.current = null;
                        if (!s || zoomed) return;
                        const dx = e.clientX - s.x;
                        const dy = e.clientY - s.y;
                        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepImage(dx < 0 ? 1 : -1);
                      }}
                    >
                      <Image
                        src={product.images[selectedImage]}
                        alt={`${product.name}, photo ${selectedImage + 1} sur ${product.images.length}`}
                        fill
                        sizes="92vw"
                        className="object-contain"
                      />
                    </motion.div>

                    <button
                      ref={lightboxCloseRef}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                      aria-label="Fermer la photo agrandie"
                      className="fixed top-5 right-5 z-10 text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-7 h-7" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                      className="fixed top-5 left-5 z-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
                    >
                      {zoomed ? <ZoomOut className="w-5 h-5" strokeWidth={1.5} /> : <ZoomIn className="w-5 h-5" strokeWidth={1.5} />}
                      {zoomed ? 'Réduire' : 'Zoomer'}
                    </button>

                    {product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); stepImage(-1); }}
                          aria-label="Photo précédente"
                          className="fixed left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/80 transition-colors hover:text-white md:left-6"
                        >
                          <ChevronRight className="w-6 h-6 rotate-180" strokeWidth={1.2} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); stepImage(1); }}
                          aria-label="Photo suivante"
                          className="fixed right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/80 transition-colors hover:text-white md:right-6"
                        >
                          <ChevronRight className="w-6 h-6" strokeWidth={1.2} />
                        </button>
                        <div className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                          {product.images.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); goToImage(i); }}
                              aria-label={`Afficher la photo ${i + 1}`}
                              aria-current={i === selectedImage ? 'true' : undefined}
                              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${i === selectedImage ? 'scale-125 bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Product Info */}
            <div className="lg:pt-2">
              {/* Catégorie, nom et description */}
              <div className="mb-6">
                <p className="pdp-kicker mb-3">{product.category}</p>
                <h1 className="pdp-display mb-4 text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-balance text-black md:text-[44px]">{product.name}</h1>
                <p className="mb-5 text-[15px] leading-[1.6] text-[#4d4842]">{product.description}</p>
                {/* Social Share */}
                <div className="flex gap-3 items-center text-neutral-500 text-xs mt-2">
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
                  {fichePdfHref && (
                    <>
                      <span className="text-neutral-200">·</span>
                      <a
                        href={fichePdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-black transition-colors"
                        title="Fiche descriptive et dimensions (PDF)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Descriptif &amp; dimensions</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Bannière Black Friday — remise −30 % sur la collection Bubble */}
              {isBubble && (
                <div className="mb-6 flex items-center justify-between gap-4 border border-[#34322F] bg-white px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7F6A52]">Black Friday</p>
                    <p className="mt-1.5 text-[14px] text-[#4d4842]">{BLACK_FRIDAY_PROMO.endsAt ? <>Offre valable jusqu&apos;au {formatPromoEnd(BLACK_FRIDAY_PROMO.endsAt)}</> : <>Remise de 30 % sur toute la collection Bubble</>}</p>
                  </div>
                  <p className="pdp-display shrink-0 text-[28px] font-bold leading-none text-black">−30%</p>
                </div>
              )}

              {/* Prix */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <p className="pdp-display text-[36px] font-medium leading-none tracking-[-0.02em] text-black">{formatPrice(unitPrice, cur)}</p>
                  {isBubble && (
                    <p className="pdp-display text-[14px] text-neutral-500 line-through">{formatPrice(product.price, cur)}</p>
                  )}
                </div>
                {isBubble && (
                  <p className="mt-3 text-[13px] text-[#4d4842]">Livraison offerte · Installation comprise</p>
                )}
              </div>

              {/* Size selector — tailles au choix (ex. tableaux) */}
              {product.sizes && (
                <div className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3">
                    {product.sizeLabel ?? 'Taille'} — <span className="text-black font-medium">{selectedSize}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          setSelectedSize(s.label);
                          // Saute à la 1ʳᵉ photo de ce coloris (via imageColor si dispo, sinon l'image de l'option)
                          const idx = product.imageColor
                            ? product.imageColor.indexOf(s.label)
                            : (s.image ? product.images.indexOf(s.image) : -1);
                          if (idx >= 0) setSelectedImage(idx);
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
                        <span className={`text-[11px] ${s.label === selectedSize ? 'text-white/70' : 'text-neutral-500'}`}>{formatPrice(s.price, cur)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-neutral-500">Livraison en 1 à 4 semaines</span>
                  </div>
                </div>
              )}

              {/* Color variants */}
              {variants && (
                <div className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3">
                    Couleur — <span className="text-black font-medium">{variants.find(v => v.productId === product.id)?.color}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    {variants.map((v) => (
                      <button
                        key={v.productId}
                        onClick={() => router.push(`/products/${v.productId}`)}
                        title={v.color}
                        className={`w-10 h-10 border-2 transition-all duration-200 ${
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
                      <span className="text-neutral-500">Livraison en 1 à 4 semaines</span>
                    </div>
                  )}
                </div>
              )}

              {/* Caractéristiques */}
              <div className="mb-8 border-t border-[#e6dfd3] text-sm">
                <div className="flex items-center justify-between gap-6 border-b border-[#e6dfd3] py-3.5">
                  <span className="shrink-0 text-[#6b6660]">Dimensions</span>
                  <span className="text-right text-[#34322F]">{product.dimensions}</span>
                </div>
                <div className="flex items-center justify-between gap-6 border-b border-[#e6dfd3] py-3.5">
                  <span className="shrink-0 text-[#6b6660]">Matière</span>
                  <span className="text-right text-[#34322F]">{product.material}</span>
                </div>
              </div>

              {/* Boutons d'achat */}
              <div className="mb-4 space-y-2.5">
                <motion.button
                  ref={setCtaNode}
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.99 }}
                  className="relative flex h-[54px] w-full items-center justify-center gap-2.5 overflow-hidden text-[15px] font-semibold text-white transition-colors duration-300"
                  style={{ background: added ? '#6b6660' : '#34322F' }}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4" /> Ajouté au panier
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4" /> Ajouter au panier
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    onClick={() => setCheckoutOpen(true)}
                    whileTap={{ scale: 0.99 }}
                    className="flex h-[54px] items-center justify-center gap-2 border border-[#34322F] bg-white text-[14px] font-semibold text-[#34322F] transition-colors duration-300 hover:bg-[#34322F] hover:text-white"
                  >
                    <Lock className="w-4 h-4" /> Acheter
                  </motion.button>

                  <motion.button
                    onClick={() => toggleWish(product.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`flex h-[54px] items-center justify-center gap-2 border text-[14px] font-semibold transition-colors duration-300 ${
                      isWished(product.id) ? 'border-red-400 bg-red-50 text-red-500' : 'border-[#34322F] bg-white text-[#34322F] hover:bg-neutral-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWished(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {isWished(product.id) ? 'Sauvé' : 'Wishlist'}
                  </motion.button>
                </div>
              </div>

              {/* Livraison estimée */}
              <p className="mb-8 flex items-start gap-2 text-[13px] text-[#4d4842]">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#7F6A52]" />
                <span>
                  Commandez aujourd&apos;hui — livraison estimée entre le{' '}
                  <strong className="whitespace-nowrap font-semibold text-black">{deliveryRange.from}</strong>{' '}et le{' '}
                  <strong className="whitespace-nowrap font-semibold text-black">{deliveryRange.to}</strong>
                </span>
              </p>

              {/* Réassurance — panneau sous les boutons d'achat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 mb-8 border border-neutral-200 p-4">
                {[
                  { icon: <CreditCard className="w-[18px] h-[18px]" strokeWidth={1.5} />, title: 'Paiement sécurisé', sub: 'Stripe · 3D Secure' },
                  { icon: <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />, title: 'Livraison offerte', sub: `dès ${formatPrice(40, cur)} d’achat` },
                  { icon: <Package className="w-[18px] h-[18px]" strokeWidth={1.5} />, title: 'Emballage soigné', sub: 'expédié avec soin' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-black">{r.icon}</span>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[12px] font-semibold text-black leading-tight">{r.title}</p>
                      {r.sub && <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{r.sub}</p>}
                    </div>
                  </div>
                ))}
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
                      <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`} />
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
              <h2 className="pdp-display mb-6 text-2xl font-semibold tracking-[-0.02em] text-black">Souvent acheté ensemble</h2>
              <div className="space-y-3 mb-4">
                {(() => {
                  const cp = complementProduct;
                  const cpPromo = nice99(Math.round(cp.price * 0.7));
                  return (
                    <div className="flex items-center gap-4 p-4 border border-neutral-200">
                      <Link href={`/products/${cp.id}`} className="shrink-0 w-16 h-16 bg-neutral-50 flex items-center justify-center overflow-hidden">
                        <Image src={cp.images[0]} alt={cp.name} width={64} height={64} className="w-full h-full object-contain p-1.5" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${cp.id}`} className="pdp-display text-[15px] font-semibold text-black hover:underline">{cp.name}</Link>
                        <p className="text-xs text-neutral-500 mt-0.5">{cp.category}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="pdp-display text-[15px] font-semibold text-black">{formatPrice(cpPromo, cur)}</span>
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
              <h2 className="pdp-display mb-1 text-2xl font-semibold tracking-[-0.02em] text-black">Guide des dimensions &amp; tailles</h2>
              <span className="block w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #A68A6D, #D8C9B5)' }} />
              <div className="space-y-3">
                {dimensionAccordions.map((acc, i) => (
                  <div key={i} className="bg-white border border-neutral-200">
                    <button
                      className="pdp-display w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-black text-left"
                      onClick={() => setOpenDim(openDim === i ? null : i)}
                    >
                      {acc.title}
                      <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${openDim === i ? 'rotate-180' : ''}`} />
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
              <div className="mt-4 bg-neutral-50 border-l-2 border-[#A68A6D] px-5 py-4 text-sm text-neutral-600">
                Besoin d&apos;aide ? Notre équipe vous accompagne pour choisir les bonnes dimensions. <Link href="/contact" className="text-black underline font-semibold hover:no-underline">Contactez-nous</Link>
              </div>
            </div>
          </section>

          {/* Questions fréquentes */}
          <section className="mt-16">
            <h2 className="pdp-display mb-1 text-2xl font-semibold tracking-[-0.02em] text-black">Questions fréquentes</h2>
            <span className="block w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #A68A6D, #D8C9B5)' }} />
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-neutral-200">
                  <button
                    className="pdp-display w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-black text-left bg-neutral-50"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
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

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <section className="mt-24">
              <div className="flex items-end justify-between mb-10">
                <h2 className="pdp-display text-2xl font-semibold tracking-[-0.02em]">Consultés récemment</h2>
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
                  const pPromo = pIsBubble ? nice99(Math.round(p.price * 0.7)) : p.price;
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
                            aria-label="Ajouter aux favoris" aria-pressed={isWished(p.id)} className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 hover:bg-white hover:scale-110 ${isWished(p.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-all ${isWished(p.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                          </button>
                        </div>
                      </Link>
                      <p className="font-semibold text-sm text-black group-hover:underline">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="pdp-display text-[15px] font-semibold text-black">{formatPrice(pPromo, cur)}</p>
                        {pIsBubble && <p className="pdp-display text-neutral-500 line-through text-xs">{formatPrice(p.price, cur)}</p>}
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
                <h2 className="pdp-display text-2xl font-semibold tracking-[-0.02em]">Vous aimerez aussi</h2>
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
                  const pPromo = pIsBubble ? nice99(Math.round(p.price * 0.7)) : p.price;
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
                            aria-label="Ajouter aux favoris" aria-pressed={isWished(p.id)} className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 hover:bg-white hover:scale-110 ${isWished(p.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-all ${isWished(p.id) ? 'fill-red-500 text-red-500' : 'text-black'}`} />
                          </button>
                        </div>
                      </Link>
                      <p className="font-semibold text-sm text-black group-hover:underline">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="pdp-display text-[15px] font-semibold text-black">{formatPrice(pPromo, cur)}</p>
                        {pIsBubble && <p className="pdp-display text-neutral-500 line-through text-xs">{formatPrice(p.price, cur)}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Back button */}
          <div className="mt-16">
            <Link href="/#tous" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
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
                  <p className="font-serif text-lg text-neutral-500">Aucun favori pour l&apos;instant</p>
                  <p className="text-sm text-neutral-300">Cliquez sur le cœur d&apos;un produit pour l&apos;ajouter ici.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.filter((p) => isWished(p.id)).map((p) => {
                    const price = p.name.includes('Bubble') ? nice99(Math.round(p.price * 0.7)) : p.price;
                    return (
                      <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl border border-neutral-100">
                        <Link href={`/products/${p.id}`} onClick={() => setWishlistOpen(false)} className="shrink-0 w-20 h-20 rounded-xl bg-neutral-50 overflow-hidden flex items-center justify-center">
                          <Image src={p.images[0]} alt={p.name} width={80} height={80} className={`w-full h-full ${p.name.includes('Bubble') || p.category === 'Décorations' ? 'object-contain p-2' : 'object-cover'}`} />
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
