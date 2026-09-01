'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Check, Package } from 'lucide-react';
import { brevoTrackOrder } from '@/lib/brevoTracking';

export default function CommandeSuccesPage() {
  // On vide le panier après un paiement réussi
  useEffect(() => {
    try {
      localStorage.setItem('ms_cart', '[]');
      window.dispatchEvent(new CustomEvent('ms_cart_change'));
    } catch { /* ignore */ }
    // Signale la commande à Brevo → annule toute relance « panier abandonné »
    brevoTrackOrder();
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07840 100%)' }}
        >
          <Check className="w-10 h-10 text-white" />
        </div>
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#A07840] mb-3">Paiement confirmé</p>
        <h1 className="text-3xl font-serif text-black mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Merci pour votre commande !
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8">
          Votre paiement a bien été reçu. Vous recevrez un e-mail de confirmation avec le récapitulatif de votre commande. Nous préparons votre colis avec le plus grand soin.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mb-10">
          <Package className="w-4 h-4" />
          <span>Expédition estimée : 1 à 4 semaines</span>
        </div>
        <Link
          href="/"
          className="inline-block bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-10 py-4 hover:bg-neutral-800 transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </main>
  );
}
