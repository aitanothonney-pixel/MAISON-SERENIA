'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sofa, BedDouble, UtensilsCrossed, Briefcase, DoorOpen, Palette, LayoutGrid,
  Sparkles, ArrowRight, ArrowLeft, Check, Loader2, Send, Wand2,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { formatPrice, convertPrice, useCurrency } from '@/lib/currency';
import { gaEvent } from '@/lib/analytics';
import type { RoomKey } from '@/lib/interieur-matching';

type Dims = { length?: number; width?: number; height?: number; maxWidth?: number; maxDepth?: number };
interface Brief {
  room?: RoomKey; intent?: string; decoType?: string; description?: string;
  dims: Dims; styles: string[]; colors: string[];
  budgetChf?: { min?: number; max?: number } | 'tbd';
}
interface RecoCard {
  id: number; name: string; category: string; priceChf: number; dimensions: string;
  images: string[]; colors: string[]; dimensionVerdict: 'fits' | 'tight' | 'too-big' | 'unknown';
  reasons: { why: string; styleFit: string; dimension: string; placement: string };
}
interface ApiResult {
  aiEnabled: boolean; intro: string; recos: RecoCard[];
  complements: { id: number; name: string; category: string; priceChf: number; images: string[] }[];
  meta: { candidateCount: number; roomLabel: string; note?: string };
}

const ROOMS: { key: RoomKey; label: string; icon: React.ElementType }[] = [
  { key: 'salon', label: 'Salon', icon: Sofa },
  { key: 'chambre', label: 'Chambre', icon: BedDouble },
  { key: 'salle-a-manger', label: 'Salle à manger', icon: UtensilsCrossed },
  { key: 'bureau', label: 'Bureau', icon: Briefcase },
  { key: 'entree', label: 'Entrée', icon: DoorOpen },
  { key: 'decoration', label: 'Décoration', icon: Palette },
  { key: 'autre', label: 'Autre espace', icon: LayoutGrid },
];

const SUBQ: Partial<Record<RoomKey, { value: string; label: string }[]>> = {
  salon: [
    { value: 'tout', label: 'Aménager tout mon salon' },
    { value: 'canape', label: 'Je cherche un canapé' },
    { value: 'fauteuil', label: 'Je cherche un fauteuil' },
    { value: 'deco', label: 'Ajouter de la décoration' },
    { value: 'petit-espace', label: 'Optimiser un petit espace' },
  ],
  chambre: [
    { value: 'tout', label: 'Aménager toute ma chambre' },
    { value: 'mobilier', label: 'Je cherche du mobilier' },
    { value: 'deco', label: 'Je cherche de la décoration' },
    { value: 'petit-espace', label: 'Optimiser l’espace' },
  ],
  'salle-a-manger': [
    { value: 'tout', label: 'Aménager toute la pièce' },
    { value: 'mobilier', label: 'Table & assises' },
    { value: 'deco', label: 'Décoration & ambiance' },
  ],
  bureau: [
    { value: 'tout', label: 'Aménager mon bureau' },
    { value: 'mobilier', label: 'Mobilier de travail' },
    { value: 'deco', label: 'Décoration & rangement' },
  ],
  entree: [
    { value: 'tout', label: 'Aménager mon entrée' },
    { value: 'mobilier', label: 'Mobilier (console, rangement)' },
    { value: 'deco', label: 'Miroir, tableau, déco' },
  ],
  decoration: [
    { value: 'murale', label: 'Décoration murale' },
    { value: 'luminaires', label: 'Luminaires' },
    { value: 'objets', label: 'Objets décoratifs' },
    { value: 'tapis', label: 'Tapis' },
    { value: 'accessoires', label: 'Accessoires' },
    { value: 'autre', label: 'Je ne sais pas encore' },
  ],
};

const STYLES = ['Moderne', 'Minimaliste', 'Contemporain', 'Scandinave', 'Vintage', 'Industriel', 'Luxe', 'Chaleureux', 'Je ne sais pas encore'];
const COLORS: { name: string; hex: string }[] = [
  { name: 'Beige', hex: '#D9CBB3' }, { name: 'Blanc', hex: '#F4F2ED' }, { name: 'Noir', hex: '#1A1A1A' },
  { name: 'Gris', hex: '#9A9A9A' }, { name: 'Marron', hex: '#6B4A33' }, { name: 'Violet', hex: '#6B4E8A' },
  { name: 'Bleu', hex: '#3C5A86' }, { name: 'Vert', hex: '#4F6A51' }, { name: 'Autre', hex: 'transparent' },
];
const BUDGETS: { label: string; value: { min?: number; max?: number } | 'tbd' }[] = [
  { label: 'Moins de 300', value: { max: 300 } },
  { label: '300 à 600', value: { min: 300, max: 600 } },
  { label: '600 à 1 000', value: { min: 600, max: 1000 } },
  { label: '1 000 à 2 000', value: { min: 1000, max: 2000 } },
  { label: '2 000 à 5 000', value: { min: 2000, max: 5000 } },
  { label: 'Plus de 5 000', value: { min: 5000 } },
];

const VERDICT_BADGE: Record<RecoCard['dimensionVerdict'], { label: string; cls: string }> = {
  fits: { label: 'Rentre dans votre espace', cls: 'bg-green-50 text-green-700 border-green-200' },
  tight: { label: 'Rentre (espace serré)', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  'too-big': { label: 'À vérifier — dépasse l’espace', cls: 'bg-red-50 text-red-600 border-red-200' },
  unknown: { label: 'Dimensions à confirmer', cls: 'bg-neutral-50 text-neutral-500 border-neutral-200' },
};

export default function Assistant() {
  const cur = useCurrency();
  const [started, setStarted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [brief, setBrief] = useState<Brief>({ dims: {}, styles: [], colors: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const flow = useMemo(() => {
    const hasSub = brief.room ? !!SUBQ[brief.room] : false;
    return ['room', ...(hasSub ? ['sub'] : []), 'space', 'style', 'budget'] as const;
  }, [brief.room]);
  const current = flow[Math.min(stepIdx, flow.length - 1)];
  const progress = Math.round(((stepIdx + 1) / flow.length) * 100);

  const set = (patch: Partial<Brief>) => setBrief((b) => ({ ...b, ...patch }));
  const toggleIn = (key: 'styles' | 'colors', v: string) =>
    setBrief((b) => ({ ...b, [key]: b[key].includes(v) ? b[key].filter((x) => x !== v) : [...b[key], v] }));

  const next = () => setStepIdx((i) => Math.min(i + 1, flow.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  const budgetLabel = (b: { label: string; value: { min?: number; max?: number } | 'tbd' }) => {
    if (b.value === 'tbd') return b.label;
    const fmt = (chf: number) => Math.round(convertPrice(chf, cur));
    const sym = cur === 'CHF' ? 'CHF' : '€';
    if (b.value.min == null) return `Moins de ${fmt(b.value.max!)} ${sym}`;
    if (b.value.max == null) return `Plus de ${fmt(b.value.min)} ${sym}`;
    return `${fmt(b.value.min)} à ${fmt(b.value.max)} ${sym}`;
  };

  async function analyze() {
    setLoading(true);
    gaEvent('ia_questionnaire_complete', { room: brief.room });
    gaEvent('ia_analyze', { room: brief.room, styles: brief.styles.join(','), has_budget: brief.budgetChf !== undefined });
    try {
      const res = await fetch('/api/interieur-ia', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recommend', brief: { ...brief, currency: cur } }),
      });
      const data: ApiResult = await res.json();
      setResult(data);
      gaEvent('ia_reco_shown', { count: data.recos?.length ?? 0, ai: data.aiEnabled });
    } catch {
      setResult({ aiEnabled: false, intro: 'Une erreur est survenue. Réessayez dans un instant.', recos: [], complements: [], meta: { candidateCount: 0, roomLabel: '' } });
    } finally {
      setLoading(false);
    }
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const history = [...chatMsgs, { role: 'user' as const, content: text }];
    setChatMsgs(history);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/interieur-ia', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', brief: { ...brief, currency: cur }, messages: history }),
      });
      const data = await res.json();
      setChatMsgs((m) => [...m, { role: 'assistant', content: data.reply || '…' }]);
    } catch {
      setChatMsgs((m) => [...m, { role: 'assistant', content: 'Connexion interrompue, réessayez.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── Écran d'accueil ──────────────────────────────────────────────────────
  if (!started) {
    return (
      <main className="relative bg-black min-h-screen text-white flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        <Image src="/catalog/j9h5SNVC.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/90" />
        <div className="relative flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C9A96E] mb-6"><Sparkles className="w-4 h-4" /> Mon Intérieur IA</span>
          <h1 className="text-4xl md:text-6xl leading-[1.1] mb-6 max-w-3xl" style={{ fontFamily: 'var(--font-italiana, Georgia, serif)' }}>
            Imaginez votre intérieur idéal
          </h1>
          <p className="text-neutral-300 max-w-xl leading-relaxed mb-10" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Décrivez votre espace, vos envies et vos dimensions. Notre assistant IA vous aide à trouver les meubles et accessoires adaptés à votre intérieur parmi notre collection Maison Serenia.
          </p>
          <button
            onClick={() => { setStarted(true); gaEvent('ia_assistant_open'); }}
            className="group inline-flex items-center gap-3 bg-white text-black px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-white transition-colors"
          >
            Commencer mon projet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link href="/" className="mt-8 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">← Retour à la boutique</Link>
        </div>
      </main>
    );
  }

  // ── Résultats ────────────────────────────────────────────────────────────
  if (result) {
    return (
      <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        <div className="border-b border-neutral-100 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <Link href="/" className="inline-block mb-6"><Logo color="black" size="sm" /></Link>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#A07840] mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Votre sélection</p>
            <h1 className="text-3xl md:text-5xl text-black mb-4" style={{ fontFamily: 'var(--font-italiana, Georgia, serif)' }}>Voici notre sélection pour votre intérieur</h1>
            <p className="text-neutral-600 max-w-2xl leading-relaxed">{result.intro}</p>
            {!result.aiEnabled && (
              <p className="mt-3 text-[12px] text-neutral-400">Sélection fondée sur votre brief et notre catalogue réel. Les explications personnalisées et le chat s&apos;activent une fois la clé IA configurée.</p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
          {result.recos.length === 0 && (
            <div className="text-center py-16 border border-neutral-200">
              <p className="text-neutral-600">{result.meta.note || 'Aucun produit trouvé pour ces critères.'}</p>
              <button onClick={() => { setResult(null); setStepIdx(0); }} className="mt-6 inline-flex items-center gap-2 border border-black px-6 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Ajuster mes critères</button>
            </div>
          )}

          {result.recos.map((r, i) => {
            const badge = VERDICT_BADGE[r.dimensionVerdict];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="grid md:grid-cols-[320px_1fr] gap-6 border border-neutral-200 p-5">
                <Link href={`/products/${r.id}`} onClick={() => gaEvent('ia_reco_click', { item_id: String(r.id) })} className="relative aspect-square bg-neutral-50 overflow-hidden block">
                  {r.images[0] && <Image src={r.images[0]} alt={r.name} fill sizes="320px" className="object-contain p-3" />}
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400">{r.category}</p>
                      <h3 className="text-xl text-black" style={{ fontFamily: 'var(--font-playfair)' }}>{r.name}</h3>
                    </div>
                    <p className="text-lg font-bold text-black shrink-0 price-luxe">{formatPrice(r.priceChf, cur)}</p>
                  </div>
                  <span className={`inline-block text-[11px] border px-2 py-0.5 rounded-full mb-3 ${badge.cls}`}>{badge.label}</span>
                  <div className="space-y-2 text-[13px] text-neutral-600 leading-relaxed">
                    <p><span className="font-semibold text-black">Pourquoi : </span>{r.reasons.why}</p>
                    <p><span className="font-semibold text-black">Style : </span>{r.reasons.styleFit}</p>
                    <p><span className="font-semibold text-black">Dimensions : </span>{r.reasons.dimension}</p>
                    <p><span className="font-semibold text-black">Intégration : </span>{r.reasons.placement}</p>
                    {r.colors.length > 0 && <p><span className="font-semibold text-black">Coloris : </span>{r.colors.join(', ')}</p>}
                  </div>
                  <Link href={`/products/${r.id}`} onClick={() => gaEvent('ia_reco_click', { item_id: String(r.id) })}
                    className="mt-4 inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors">
                    Découvrir ce produit <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {result.complements.length > 0 && (
            <div className="pt-6">
              <h2 className="text-2xl text-black mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>Pour compléter votre intérieur</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.complements.map((c) => (
                  <Link key={c.id} href={`/products/${c.id}`} onClick={() => gaEvent('ia_reco_click', { item_id: String(c.id) })} className="group">
                    <div className="relative aspect-square bg-neutral-50 overflow-hidden mb-2 border border-neutral-100">
                      {c.images[0] && <Image src={c.images[0]} alt={c.name} fill sizes="200px" className="object-contain p-2" />}
                    </div>
                    <p className="text-[12px] font-semibold text-black leading-tight truncate group-hover:underline">{c.name}</p>
                    <p className="text-[12px] text-neutral-500 price-luxe">{formatPrice(c.priceChf, cur)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          <div className="border-t border-neutral-100 pt-8">
            <h2 className="text-xl text-black mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}><Wand2 className="w-5 h-5 text-[#A07840]" /> Affiner avec l&apos;assistant</h2>
            {chatMsgs.length > 0 && (
              <div className="space-y-3 mb-4">
                {chatMsgs.map((m, i) => (
                  <div key={i} className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'ml-auto bg-black text-white' : 'bg-neutral-100 text-neutral-800'}`}>{m.content}</div>
                ))}
                {chatLoading && <div className="bg-neutral-100 inline-flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-500"><Loader2 className="w-4 h-4 animate-spin" /> L&apos;assistant réfléchit…</div>}
              </div>
            )}
            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
                placeholder="Ex. « Propose-moi quelque chose de plus petit » ou « plutôt beige »"
                className="flex-1 border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading} className="bg-black text-white px-5 flex items-center justify-center hover:bg-neutral-800 transition-colors disabled:opacity-40"><Send className="w-4 h-4" /></button>
            </div>
            <button onClick={() => { setResult(null); setChatMsgs([]); setStepIdx(0); }} className="mt-6 text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">← Recommencer un projet</button>
          </div>
        </div>
      </main>
    );
  }

  // ── Questionnaire ────────────────────────────────────────────────────────
  const canNext =
    current === 'room' ? !!brief.room :
    current === 'sub' ? !!(brief.intent || brief.decoType) :
    true;

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      {/* Barre de progression */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/"><Logo color="black" size="sm" /></Link>
            <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Étape {stepIdx + 1} / {flow.length}</span>
          </div>
          <div className="h-1 bg-neutral-100 overflow-hidden rounded-full">
            <motion.div className="h-full bg-[#C9A96E]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div key={current + stepIdx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>

            {current === 'room' && (
              <>
                <h2 className="text-3xl md:text-4xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Quelle pièce souhaitez-vous aménager ?</h2>
                <p className="text-neutral-500 mb-8">Sélectionnez un espace pour commencer.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROOMS.map((r) => {
                    const Icon = r.icon; const active = brief.room === r.key;
                    return (
                      <button key={r.key} onClick={() => { set({ room: r.key, intent: undefined, decoType: undefined }); gaEvent('ia_select_room', { room: r.key }); }}
                        className={`flex flex-col items-center gap-3 border p-6 transition-all ${active ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 hover:border-neutral-400'}`}>
                        <Icon className={`w-7 h-7 ${active ? 'text-[#A07840]' : 'text-neutral-700'}`} strokeWidth={1.4} />
                        <span className="text-sm font-medium text-black">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {current === 'sub' && brief.room && (
              <>
                <h2 className="text-3xl md:text-4xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Votre besoin précis</h2>
                <p className="text-neutral-500 mb-8">Qu&apos;est-ce qui vous amène pour votre {ROOMS.find((r) => r.key === brief.room)?.label.toLowerCase()} ?</p>
                <div className="space-y-2">
                  {(SUBQ[brief.room] || []).map((o) => {
                    const key = brief.room === 'decoration' ? 'decoType' : 'intent';
                    const active = brief[key as 'intent' | 'decoType'] === o.value;
                    return (
                      <button key={o.value} onClick={() => set(brief.room === 'decoration' ? { decoType: o.value } : { intent: o.value })}
                        className={`w-full flex items-center justify-between border px-5 py-4 text-left transition-all ${active ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                        <span className="text-sm text-black">{o.label}</span>
                        {active && <Check className="w-4 h-4 text-[#A07840]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {current === 'space' && (
              <>
                <h2 className="text-3xl md:text-4xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Parlez-nous de votre espace</h2>
                <p className="text-neutral-500 mb-6">Plus vous êtes précis, meilleures seront nos recommandations. Tout est facultatif.</p>
                <textarea value={brief.description || ''} onChange={(e) => set({ description: e.target.value })} rows={5}
                  placeholder="Mon salon fait environ 25 m². J'ai un mur de 3 mètres de largeur. Je souhaite un canapé design, quelques éléments de décoration et une ambiance moderne, chaleureuse et minimaliste."
                  className="w-full border border-neutral-300 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-black transition-colors resize-none" />
                <p className="text-[11px] uppercase tracking-widest text-neutral-400 mt-8 mb-3">Dimensions (facultatif)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['length', 'Longueur pièce (m)'], ['width', 'Largeur pièce (m)'], ['height', 'Hauteur plafond (m)'],
                    ['maxWidth', 'Largeur max meuble (cm)'], ['maxDepth', 'Profondeur max (cm)'],
                  ] as [keyof Dims, string][]).map(([k, label]) => (
                    <div key={k}>
                      <label className="text-[11px] text-neutral-400 block mb-1">{label}</label>
                      <input type="number" min="0" inputMode="decimal" value={brief.dims[k] ?? ''}
                        onChange={(e) => set({ dims: { ...brief.dims, [k]: e.target.value ? Number(e.target.value) : undefined } })}
                        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {current === 'style' && (
              <>
                <h2 className="text-3xl md:text-4xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Votre style</h2>
                <p className="text-neutral-500 mb-6">Plusieurs choix possibles.</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {STYLES.map((s) => {
                    const active = brief.styles.includes(s);
                    return (
                      <button key={s} onClick={() => toggleIn('styles', s)}
                        className={`px-4 py-2.5 text-sm border transition-all ${active ? 'border-black bg-black text-white' : 'border-neutral-300 text-neutral-700 hover:border-black'}`}>{s}</button>
                    );
                  })}
                </div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Couleurs souhaitées</p>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => {
                    const active = brief.colors.includes(c.name);
                    return (
                      <button key={c.name} onClick={() => toggleIn('colors', c.name)}
                        className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${active ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                        <span className="w-4 h-4 rounded-full border border-neutral-300" style={{ background: c.hex === 'transparent' ? 'conic-gradient(#f00,#0f0,#00f,#f00)' : c.hex }} />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {current === 'budget' && (
              <>
                <h2 className="text-3xl md:text-4xl text-black mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Votre budget</h2>
                <p className="text-neutral-500 mb-8">Pour cet aménagement, en {cur === 'CHF' ? 'francs suisses' : 'euros'}.</p>
                <div className="grid grid-cols-2 gap-3">
                  {BUDGETS.map((b) => {
                    const active = JSON.stringify(brief.budgetChf) === JSON.stringify(b.value);
                    return (
                      <button key={b.label} onClick={() => set({ budgetChf: b.value })}
                        className={`border px-4 py-4 text-sm transition-all ${active ? 'border-black bg-neutral-50 font-semibold' : 'border-neutral-200 hover:border-neutral-400'}`}>{budgetLabel(b)}</button>
                    );
                  })}
                  <button onClick={() => set({ budgetChf: 'tbd' })}
                    className={`col-span-2 border px-4 py-4 text-sm transition-all ${brief.budgetChf === 'tbd' ? 'border-black bg-neutral-50 font-semibold' : 'border-neutral-200 hover:border-neutral-400'}`}>Budget à définir</button>
                </div>
              </>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <button onClick={back} disabled={stepIdx === 0}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-500 hover:text-black transition-colors disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          {current === 'budget' ? (
            <button onClick={analyze} disabled={loading}
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[#A07840] transition-colors disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse en cours…</> : <><Sparkles className="w-4 h-4" /> Analyser mon intérieur avec l&apos;IA</>}
            </button>
          ) : (
            <button onClick={next} disabled={!canNext}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-30">
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
