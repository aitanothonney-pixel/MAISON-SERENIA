'use client';

import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import Link from 'next/link';
import { Lock, Package, Boxes, LogOut } from 'lucide-react';

export default function AdminGate({ active, children }: { active: 'commandes' | 'stock'; children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'in' | 'out'>('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => { if (alive) setStatus(d?.authenticated ? 'in' : 'out'); })
      .catch(() => { if (alive) setStatus('out'); });
    return () => { alive = false; };
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword('');
        setStatus('in');
      } else if (res.status === 401) {
        setError('Mot de passe incorrect.');
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d?.message || 'Erreur.');
      }
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try { await fetch('/api/admin/login', { method: 'DELETE' }); } catch { /* ignore */ }
    setStatus('out');
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm text-neutral-400">Chargement…</p>
      </main>
    );
  }

  if (status === 'out') {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm bg-white border border-neutral-200 p-8 rounded-lg shadow-sm">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg text-center mb-1" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>Espace gestion</h1>
          <p className="text-xs text-neutral-500 text-center mb-6">Réservé à l&apos;administration.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className="w-full border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors mb-3"
          />
          {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {submitting ? '…' : 'Se connecter'}
          </button>
        </form>
      </main>
    );
  }

  const tab = (href: string, label: string, Icon: typeof Package, key: 'commandes' | 'stock') => (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold uppercase tracking-wider rounded ${
        active === key ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-1">
            {tab('/gestion/commandes', 'Commandes', Package, 'commandes')}
            {tab('/gestion/stock', 'Stock', Boxes, 'stock')}
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">{children}</div>
    </main>
  );
}
