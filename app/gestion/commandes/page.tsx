'use client';

import { useCallback, useEffect, useState } from 'react';
import { Package, Mail, Phone, MapPin, RefreshCw, Save } from 'lucide-react';
import AdminGate from '@/components/ui/admin-gate';

interface OrderItem {
  product_name: string;
  option_label: string | null;
  quantity: number;
  unit_price_cents: number;
}
interface Order {
  id: string;
  order_ref: string;
  created_at: string;
  amount_total_cents: number | null;
  currency: string;
  email: string | null;
  phone: string | null;
  customer_name: string | null;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  payment_status: string;
  fulfillment_status: string | null;
  carrier: string | null;
  tracking_number: string | null;
  items: OrderItem[];
  editable: boolean;
}

const FULFILLMENT: { value: string; label: string }[] = [
  { value: 'to_prepare', label: 'À préparer' },
  { value: 'prepared', label: 'Préparée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'cancelled', label: 'Annulée' },
];

const money = (cents: number | null, cur: string) =>
  `${((cents ?? 0) / 100).toFixed(2)} ${cur}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [source, setSource] = useState<'db' | 'stripe' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) { setError(data?.message || 'Erreur de chargement.'); return; }
      setOrders(data.orders || []);
      setSource(data.source || null);
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial différé (évite un setState synchrone dans l'effet).
  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const patch = async (id: string, fields: Partial<Pick<Order, 'fulfillment_status' | 'carrier' | 'tracking_number'>>) => {
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, ...fields } : o)) ?? prev);
  };

  const save = async (o: Order) => {
    setSavingId(o.id);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(o.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillment_status: o.fulfillment_status,
          carrier: o.carrier ?? '',
          tracking_number: o.tracking_number ?? '',
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert('Échec de l\'enregistrement : ' + (d?.message || res.status));
      }
    } catch {
      alert('Erreur de connexion.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Commandes</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {orders ? `${orders.length} commande(s)` : '…'}
            {source === 'stripe' && ' · lecture Stripe (statuts non modifiables sans Supabase)'}
            {source === 'db' && ' · base de données'}
          </p>
        </div>
        <button onClick={load} className="p-2 border border-neutral-200 bg-white hover:border-black transition-colors" aria-label="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && !orders && <p className="text-sm text-neutral-500">Chargement…</p>}

      {orders && orders.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-10 text-center">
          <Package className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Aucune commande pour le moment.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-400">{o.order_ref} · {fmtDate(o.created_at)}</p>
                <p className="text-lg font-bold mt-0.5">{money(o.amount_total_cents, o.currency)}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold">
                {o.payment_status === 'paid' ? 'Payée' : o.payment_status}
              </span>
            </div>

            <div className="border-t border-neutral-100 pt-3 mb-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Articles</p>
              <ul className="space-y-1">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-neutral-700">{it.quantity} × {it.product_name}{it.option_label ? ` (${it.option_label})` : ''}</span>
                    <span className="text-neutral-500">{money(it.unit_price_cents * it.quantity, o.currency)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-neutral-100 pt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1.5">
                {o.customer_name && <p className="font-semibold">{o.customer_name}</p>}
                {o.email && <p className="flex items-center gap-1.5 text-neutral-600"><Mail className="w-3.5 h-3.5 shrink-0" /> <a href={`mailto:${o.email}`} className="hover:underline">{o.email}</a></p>}
                {o.phone && <p className="flex items-center gap-1.5 text-neutral-600"><Phone className="w-3.5 h-3.5 shrink-0" /> {o.phone}</p>}
              </div>
              {o.shipping_address && (o.shipping_address.line1 || o.shipping_address.city) && (
                <div className="flex items-start gap-1.5 text-neutral-600">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {o.shipping_address.line1}{o.shipping_address.line2 ? `, ${o.shipping_address.line2}` : ''}<br />
                    {o.shipping_address.postal_code} {o.shipping_address.city}<br />
                    {o.shipping_address.country}
                  </span>
                </div>
              )}
            </div>

            {/* Gestion (uniquement si persistée en base) */}
            {o.editable ? (
              <div className="border-t border-neutral-100 pt-3 mt-3 grid sm:grid-cols-[auto_1fr_1fr_auto] gap-2 items-end">
                <label className="text-xs">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Statut</span>
                  <select
                    value={o.fulfillment_status || 'to_prepare'}
                    onChange={(e) => patch(o.id, { fulfillment_status: e.target.value })}
                    className="border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black"
                  >
                    {FULFILLMENT.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </label>
                <label className="text-xs">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Transporteur</span>
                  <input value={o.carrier || ''} onChange={(e) => patch(o.id, { carrier: e.target.value })} placeholder="La Poste, DHL…" className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                </label>
                <label className="text-xs">
                  <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">N° de suivi</span>
                  <input value={o.tracking_number || ''} onChange={(e) => patch(o.id, { tracking_number: e.target.value })} placeholder="Numéro" className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
                </label>
                <button onClick={() => save(o)} disabled={savingId === o.id} className="flex items-center justify-center gap-1.5 bg-black text-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> {savingId === o.id ? '…' : 'Enregistrer'}
                </button>
              </div>
            ) : (
              <p className="border-t border-neutral-100 pt-3 mt-3 text-[11px] text-neutral-400">
                Gestion des statuts disponible une fois Supabase activé.
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default function CommandesPage() {
  return (
    <AdminGate active="commandes">
      <OrdersPanel />
    </AdminGate>
  );
}
