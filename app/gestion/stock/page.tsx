'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Save, AlertTriangle } from 'lucide-react';
import AdminGate from '@/components/ui/admin-gate';

interface Variant {
  id: string;
  sku: string;
  option_label: string | null;
  price_cents: number;
  stock: number;
  active: boolean;
  reserved: number;
  available: number;
  product_name: string;
  category: string | null;
}

const money = (c: number) => `${(c / 100).toFixed(2)} CHF`;

function StockPanel() {
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stock');
      const data = await res.json();
      if (!res.ok) { setError(data?.message || 'Erreur de chargement.'); return; }
      setEnabled(data.enabled !== false);
      setVariants(data.variants || []);
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial différé (évite un setState synchrone dans l'effet).
  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const edit = (id: string, fields: Partial<Variant>) => {
    setVariants((prev) => prev?.map((v) => (v.id === id ? { ...v, ...fields } : v)) ?? prev);
  };

  const save = async (v: Variant) => {
    setSavingId(v.id);
    try {
      const res = await fetch(`/api/admin/stock/${encodeURIComponent(v.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: v.stock, active: v.active, reason: 'ajustement admin' }),
      });
      if (res.ok) {
        await load();
      } else {
        const d = await res.json().catch(() => ({}));
        alert('Échec : ' + (d?.message || res.status));
      }
    } catch {
      alert('Erreur de connexion.');
    } finally {
      setSavingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!variants) return [];
    const q = query.trim().toLowerCase();
    if (!q) return variants;
    return variants.filter((v) =>
      `${v.product_name} ${v.option_label || ''} ${v.sku}`.toLowerCase().includes(q),
    );
  }, [variants, query]);

  if (enabled === false) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h1 className="text-lg mb-1" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Suivi de stock désactivé</h1>
          <p className="text-sm text-neutral-600">
            La base Supabase n&apos;est pas encore configurée. Une fois activée (Phase 8), le catalogue
            sera amorcé et la gestion du stock apparaîtra ici. Tant que rien n&apos;est activé, la boutique
            fonctionne normalement sans limite de stock.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Stock</h1>
          <p className="text-xs text-neutral-500 mt-1">{variants ? `${filtered.length} / ${variants.length} variante(s)` : '…'}</p>
        </div>
        <button onClick={load} className="p-2 border border-neutral-200 bg-white hover:border-black transition-colors" aria-label="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un produit, une option, un SKU…"
        className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors mb-4 bg-white"
      />

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && !variants && <p className="text-sm text-neutral-500">Chargement…</p>}

      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
        {filtered.map((v) => (
          <div key={v.id} className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{v.product_name}</p>
              <p className="text-[11px] text-neutral-400">
                {v.option_label && v.option_label !== 'Default' ? `${v.option_label} · ` : ''}{v.sku} · {money(v.price_cents)}
              </p>
            </div>
            <div className="text-[11px] text-neutral-500 text-right">
              <span className="block">réservé {v.reserved}</span>
              <span className="block">dispo {v.available}</span>
            </div>
            <label className="text-xs">
              <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Stock</span>
              <input
                type="number"
                min={0}
                value={v.stock}
                onChange={(e) => edit(v.id, { stock: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
                className="w-20 border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
              <input type="checkbox" checked={v.active} onChange={(e) => edit(v.id, { active: e.target.checked })} />
              Géré
            </label>
            <button
              onClick={() => save(v)}
              disabled={savingId === v.id}
              className="flex items-center justify-center gap-1.5 bg-black text-white px-3 py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {savingId === v.id ? '…' : 'OK'}
            </button>
          </div>
        ))}
        {variants && filtered.length === 0 && (
          <p className="p-6 text-sm text-neutral-500 text-center">Aucune variante ne correspond.</p>
        )}
      </div>

      <p className="text-[11px] text-neutral-400 mt-3">
        « Géré » = la variante est suivie en stock (vente bloquée si rupture). Décochez pour vendre sans limite.
      </p>
    </>
  );
}

export default function StockPage() {
  return (
    <AdminGate active="stock">
      <StockPanel />
    </AdminGate>
  );
}
