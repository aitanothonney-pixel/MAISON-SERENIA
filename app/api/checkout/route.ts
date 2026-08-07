import Stripe from 'stripe';
import { products } from '@/lib/products';

// Pièces Bubble en promo -30%
const BUBBLE_IDS = [2, 6, 7, 8, 9, 10, 12, 13, 22];
const isBubble = (id: number) => BUBBLE_IDS.includes(id);

// Packs canapé + fauteuil + figurine au prix fixe
const BUNDLES = [
  { canape: 10, fauteuil: 2, figurine: 39 },
  { canape: 13, fauteuil: 6, figurine: 31 },
  { canape: 22, fauteuil: 8, figurine: 36 },
];
const BUNDLE_PRICE = 1900;

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_FEE = 4.9;

const chf = (amount: number) => Math.round(amount * 100); // centimes

// Diagnostic : ouvre /api/checkout dans le navigateur pour vérifier
// si la clé Stripe est bien détectée sur ce déploiement.
export async function GET() {
  return Response.json({ stripeConfigured: !!process.env.STRIPE_SECRET_KEY });
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  // Tant que la clé secrète n'est pas configurée, on signale que Stripe est inactif
  // (le site retombe alors sur son tunnel de démonstration).
  if (!key) {
    return Response.json({ enabled: false }, { status: 200 });
  }

  let body: { items?: { id: number; qty: number }[]; promo?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const cart = rawItems
    .map((it) => {
      const product = products.find((p) => p.id === Number(it.id));
      if (!product) return null;
      const qty = Math.max(1, Math.min(20, Math.floor(Number(it.qty) || 1)));
      const unit = isBubble(product.id) ? Math.round(product.price * 0.7) : product.price;
      return { product, qty, unit };
    })
    .filter(Boolean) as { product: typeof products[0]; qty: number; unit: number }[];

  if (cart.length === 0) {
    return Response.json({ error: 'Panier vide' }, { status: 400 });
  }

  try {
  const stripe = new Stripe(key);

  // Recalcul sécurisé côté serveur
  const subtotal = cart.reduce((s, x) => s + x.unit * x.qty, 0);
  const qtyOf = (id: number) => cart.find((x) => x.product.id === id)?.qty ?? 0;
  const unitOf = (id: number) => cart.find((x) => x.product.id === id)?.unit ?? 0;
  const packDiscount = BUNDLES.reduce((s, b) => {
    const packs = Math.min(qtyOf(b.canape), qtyOf(b.fauteuil), qtyOf(b.figurine));
    if (packs === 0) return s;
    const trio = unitOf(b.canape) + unitOf(b.fauteuil) + unitOf(b.figurine);
    return s + packs * Math.max(0, trio - BUNDLE_PRICE);
  }, 0);
  const afterPack = subtotal - packDiscount;
  const welcomeDiscount = body.promo && afterPack > 0 ? Math.round(afterPack * 0.1 * 100) / 100 : 0;
  const merchandise = afterPack - welcomeDiscount;
  const shipping = merchandise > 0 && merchandise < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const totalDiscount = packDiscount + welcomeDiscount;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map((x) => ({
    quantity: x.qty,
    price_data: {
      currency: 'chf',
      unit_amount: chf(x.unit),
      product_data: {
        name: x.product.name,
        images: x.product.images.slice(0, 1),
      },
    },
  }));

  // Remises (pack + code membre) via un coupon ponctuel
  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
  if (totalDiscount > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: chf(totalDiscount),
      currency: 'chf',
      duration: 'once',
      name: body.promo && packDiscount > 0 ? 'Remises Maison Serenia' : body.promo ? 'Code membre −10%' : 'Remise Pack',
    });
    discounts.push({ coupon: coupon.id });
  }

  const origin =
    req.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://maison-serenia.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    discounts,
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: chf(shipping), currency: 'chf' },
          display_name: shipping > 0 ? 'Livraison' : 'Livraison offerte',
        },
      },
    ],
    shipping_address_collection: {
      allowed_countries: ['CH', 'FR', 'DE', 'IT', 'AT', 'BE', 'LU'],
    },
    phone_number_collection: { enabled: true },
    success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?panier=annule`,
    locale: 'fr',
  });

  return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: 'checkout_failed', message }, { status: 500 });
  }
}
