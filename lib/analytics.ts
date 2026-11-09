'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Suivi e-commerce (GA4). Toutes les fonctions sont « sûres » : si Google
// Analytics n'est pas chargé (gtag absent), elles ne font rien silencieusement.
// Objectif : mesurer le tunnel de vente (vue produit → ajout panier → paiement
// → achat) pour savoir où les visiteurs abandonnent et optimiser les conversions.
// ─────────────────────────────────────────────────────────────────────────────

import { products, nice99 } from './products';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Params = Record<string, unknown>;

// Envoie un événement à GA4 (et au dataLayer pour GTM) si disponible.
export function gaEvent(name: string, params: Params = {}): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
  } catch {
    /* ne jamais casser l'UI pour un souci de tracking */
  }
}

// Prix affiché d'un produit — aligné sur le reste du site (Bubble −30 %).
function displayUnit(p: (typeof products)[number], size?: string): number {
  if (size && p.sizes) {
    const s = p.sizes.find((x) => x.label === size);
    if (s) return s.price;
  }
  return p.name.includes('Bubble') ? nice99(Math.round(p.price * 0.7)) : p.price;
}

function itemOf(id: number, qty = 1, size?: string) {
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  const price = displayUnit(p, size);
  return {
    item_id: String(id),
    item_name: p.name,
    item_category: p.category,
    price,
    quantity: qty,
    ...(size ? { item_variant: size } : {}),
  };
}

// Vue d'une fiche produit.
export function trackViewItem(id: number): void {
  const item = itemOf(id);
  if (!item) return;
  gaEvent('view_item', { currency: 'CHF', value: item.price, items: [item] });
}

// Ajout au panier.
export function trackAddToCart(id: number, size?: string, qty = 1): void {
  const item = itemOf(id, qty, size);
  if (!item) return;
  gaEvent('add_to_cart', { currency: 'CHF', value: item.price * qty, items: [item] });
}

const PENDING_KEY = 'ms_pending_purchase';

// Début du paiement (clic « commander / payer »). On mémorise aussi le panier
// et le montant pour pouvoir émettre un événement « purchase » fiable au retour
// de Stripe (la page de succès ne connaît pas le détail de la commande).
export function trackBeginCheckout(
  cart: { id: number; qty: number; size?: string }[],
  value: number,
): void {
  const items = cart.map((c) => itemOf(c.id, c.qty, c.size)).filter(Boolean);
  gaEvent('begin_checkout', { currency: 'CHF', value: Math.round(value), items });
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ cart, value: Math.round(value) }));
  } catch {
    /* ignore */
  }
}

// Achat confirmé (page de succès). Reconstruit l'événement à partir du panier
// mémorisé au début du paiement, puis nettoie la clé. Émet au minimum la
// conversion même si le détail est introuvable.
export function trackPurchaseFromPending(transactionId: string): void {
  let cart: { id: number; qty: number; size?: string }[] = [];
  let value = 0;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.cart)) cart = parsed.cart;
      if (typeof parsed?.value === 'number') value = parsed.value;
    }
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
  const items = cart.map((c) => itemOf(c.id, c.qty, c.size)).filter(Boolean);
  gaEvent('purchase', {
    transaction_id: transactionId,
    currency: 'CHF',
    value: Math.round(value),
    items,
  });
}
