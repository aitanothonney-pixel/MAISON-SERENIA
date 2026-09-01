// Helpers de suivi Brevo (panier abandonné, commande). Toutes les fonctions
// sont sûres : si le tracker n'est pas chargé, elles ne font rien.

type CartItem = { name: string; price: number; quantity: number; url?: string; image?: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
function sb(): any {
  return typeof window !== 'undefined' ? (window as any).sendinblue : undefined;
}

export function getStoredEmail(): string | undefined {
  try {
    return localStorage.getItem('welcome-email') || undefined;
  } catch {
    return undefined;
  }
}

export function brevoIdentify(email?: string) {
  const s = sb();
  const mail = email || getStoredEmail();
  if (s && mail) {
    try { s.identify(mail); } catch { /* ignore */ }
  }
}

export function brevoTrackCart(opts: { total: number; items: CartItem[]; url: string; email?: string }) {
  const s = sb();
  if (!s) return;
  const email = opts.email || getStoredEmail();
  try {
    s.track(
      'cart_updated',
      email ? { email } : {},
      { id: 'cart', data: { total: opts.total, currency: 'CHF', url: opts.url, items: opts.items } },
    );
  } catch { /* ignore */ }
}

export function brevoTrackOrder(opts?: { total?: number; email?: string }) {
  const s = sb();
  if (!s) return;
  const email = opts?.email || getStoredEmail();
  try {
    s.track(
      'order_completed',
      email ? { email } : {},
      { id: 'order:' + Date.now(), data: { total: opts?.total ?? 0, currency: 'CHF' } },
    );
  } catch { /* ignore */ }
}
