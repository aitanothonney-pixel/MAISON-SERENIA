'use client';

import { useEffect, useState } from 'react';
import { Lock, Package, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  date: number;
  amount: number;
  currency: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    city: string | null;
    country: string | null;
  };
  items: { description: string; quantity: number; amount: number }[];
}

const STORAGE_KEY = 'ms_admin_key';

export default function CommandesPage() {
  const [key, setKey] = useState('');
  const [input, setInput] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { setKey(saved); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (key) fetchOrders(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const fetchOrders = async (k: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders?key=${encodeURIComponent(k)}`);
      const data = await res.json();
      if (res.status === 401) {
        setError('Mot de passe incorrect.');
        setKey('');
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        return;
      }
      if (!res.ok) {
        setError(data?.message || 'Erreur.');
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try { localStorage.setItem(STORAGE_KEY, input.trim()); } catch { /* ignore */ }
    setKey(input.trim());
  };

  const logout = () => {
    setKey('');
    setOrders(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const fmtDate = (ts: number) =>
    new Date(ts * 1000).toLocaleString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Écran de connexion
  if (!key) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <form onSubmit={submit} className="w-full max-w-sm bg-white border border-neutral-200 p-8 rounded-lg shadow-sm">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-serif text-center mb-1" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Mes commandes</h1>
          <p className="text-xs text-neutral-500 text-center mb-6">Espace privé — réservé à la gestion.</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors mb-3"
            autoFocus
          />
          {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
          <button type="submit" className="w-full bg-black text-white py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors">
            Se connecter
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Mes commandes</h1>
            <p className="text-xs text-neutral-500 mt-1">{orders ? `${orders.length} commande(s) payée(s)` : '…'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchOrders(key)} className="p-2 border border-neutral-200 bg-white hover:border-black transition-colors" aria-label="Rafraîchir">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout} className="text-[11px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Déconnexion</button>
          </div>
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
                  <p className="text-[11px] uppercase tracking-widest text-neutral-400">{fmtDate(o.date)}</p>
                  <p className="text-lg font-bold mt-0.5">{o.amount.toFixed(2)} {o.currency}</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold">Payée</span>
              </div>

              {/* Articles */}
              <div className="border-t border-neutral-100 pt-3 mb-3">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Articles</p>
                <ul className="space-y-1">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-neutral-700">{it.quantity} × {it.description}</span>
                      <span className="text-neutral-500">{it.amount.toFixed(2)} {o.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Client + livraison */}
              <div className="border-t border-neutral-100 pt-3 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1.5">
                  {o.name && <p className="font-semibold">{o.name}</p>}
                  {o.email && <p className="flex items-center gap-1.5 text-neutral-600"><Mail className="w-3.5 h-3.5 shrink-0" /> <a href={`mailto:${o.email}`} className="hover:underline">{o.email}</a></p>}
                  {o.phone && <p className="flex items-center gap-1.5 text-neutral-600"><Phone className="w-3.5 h-3.5 shrink-0" /> {o.phone}</p>}
                </div>
                {(o.address.line1 || o.address.city) && (
                  <div className="flex items-start gap-1.5 text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      {o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}<br />
                      {o.address.postal_code} {o.address.city}<br />
                      {o.address.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
