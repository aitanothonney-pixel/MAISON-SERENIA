import Anthropic from '@anthropic-ai/sdk';
import { matchProducts, type InterieurBrief, type Reco } from '@/lib/interieur-matching';

// Traitement IA strictement côté serveur. La clé n'est jamais exposée au client.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Modèle par défaut : Claude Opus 5.5. Surclassable via variable d'env
// INTERIEUR_IA_MODEL (ex. claude-haiku-5-5 pour réduire fortement les coûts).
const MODEL = process.env.INTERIEUR_IA_MODEL || 'claude-opus-5-5';

function briefSummary(b: InterieurBrief): string {
  const parts: string[] = [];
  parts.push(`Pièce : ${b.room}${b.intent ? ` (${b.intent})` : ''}${b.decoType ? ` / ${b.decoType}` : ''}`);
  if (b.description) parts.push(`Description libre : « ${b.description.slice(0, 600)} »`);
  if (b.dims) {
    const d = b.dims;
    const dd = [
      d.length && `longueur ${d.length} m`, d.width && `largeur ${d.width} m`,
      d.height && `hauteur ${d.height} m`, d.maxWidth && `largeur max meuble ${d.maxWidth} cm`,
      d.maxDepth && `profondeur max ${d.maxDepth} cm`,
    ].filter(Boolean).join(', ');
    if (dd) parts.push(`Dimensions : ${dd}`);
  }
  if (b.styles?.length) parts.push(`Styles : ${b.styles.join(', ')}`);
  if (b.colors?.length) parts.push(`Couleurs : ${b.colors.join(', ')}`);
  if (b.budgetChf && b.budgetChf !== 'tbd') parts.push(`Budget : ${b.budgetChf.min ?? 0}–${b.budgetChf.max ?? '∞'} CHF`);
  return parts.join('\n');
}

// Contexte produits REELS (le seul matériau autorisé pour l'IA).
function candidatesBlock(recos: Reco[]): string {
  return recos.map((r) => (
    `#${r.id} | ${r.name} | catégorie ${r.category} | ${r.priceChf} CHF | dimensions ${r.dimensions} | ` +
    `coloris ${r.colors.join('/') || 'n.c.'} | tenue dans l'espace : ${r.dimensionVerdict}`
  )).join('\n');
}

const SYSTEM = `Tu es le conseiller déco IA de MAISON SERENIA, maison de mobilier design à Genève.
Règles ABSOLUES :
- Tu ne recommandes QUE les produits réels fournis dans la liste de candidats. Jamais un produit, un prix, une dimension, une couleur ou une promotion qui n'y figure pas.
- N'évoque JAMAIS un type de produit que la maison ne vend pas. Le catalogue se limite à : canapés, fauteuils, commodes, meubles TV, tables (basses, à manger, gigognes), étagères, vases, tableaux, lampes et lustres. Ne parle donc jamais de miroir, tapis, chaise, console, buffet, lit, coussin, rideau ou tout autre article absent de la liste.
- Tu utilises exactement les prix (CHF), dimensions et coloris fournis. Si une dimension ne permet pas de conclure qu'un meuble rentre, tu le dis honnêtement (« à vérifier »), tu n'affirmes jamais qu'il rentre parfaitement sans donnée.
- Ton élégant, chaleureux, concis, en français. Tu parles comme un architecte d'intérieur, pas comme un robot.`;

interface AiItem { id: number; why: string; styleFit: string; placement: string }
interface AiEnrich { intro: string; items: AiItem[] }

function extractJson<T>(text: string): T | null {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    return m ? (JSON.parse(m[0]) as T) : null;
  } catch { return null; }
}

async function enrich(client: Anthropic, brief: InterieurBrief, recos: Reco[]): Promise<AiEnrich | null> {
  const prompt = `Projet du client :
${briefSummary(brief)}

Candidats RÉELS du catalogue (n'utilise que ceux-ci) :
${candidatesBlock(recos)}

Rédige en JSON STRICT, sans texte autour :
{
  "intro": "2 phrases chaleureuses qui résument ta sélection pour ce projet",
  "items": [
    { "id": <id du candidat>, "why": "pourquoi ce produit pour ce projet (1-2 phrases)", "styleFit": "en quoi il colle au style/couleurs demandés", "placement": "conseil d'intégration concret dans la pièce" }
  ]
}
Un objet par candidat fourni, dans le même ordre. Respecte les verdicts de dimension (ne promets pas qu'un meuble « à vérifier » ou « trop grand » rentre).`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    output_config: { effort: 'low' },
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('');
  return extractJson<AiEnrich>(text);
}

async function chat(client: Anthropic, brief: InterieurBrief, recos: Reco[], history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const context = `Projet initial :
${briefSummary(brief)}

Produits RÉELS actuellement proposés (tu ne peux parler que de ceux-ci, ou dire que tu n'as pas trouvé mieux dans le catalogue) :
${candidatesBlock(recos)}`;
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    output_config: { effort: 'low' },
    system: `${SYSTEM}\n\n${context}`,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });
  return res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('').trim();
}

export async function POST(req: Request) {
  let body: { action?: string; brief?: InterieurBrief; messages?: { role: 'user' | 'assistant'; content: string }[] };
  try { body = await req.json(); } catch { return Response.json({ error: 'bad_request' }, { status: 400 }); }

  const brief = body.brief;
  if (!brief || !brief.room) return Response.json({ error: 'missing_brief' }, { status: 400 });

  // 1) Moteur déterministe sur le vrai catalogue (toujours exécuté).
  const match = matchProducts(brief);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const aiEnabled = !!apiKey;

  // Action CHAT : nécessite l'IA.
  if (body.action === 'chat') {
    if (!aiEnabled) {
      return Response.json({ aiEnabled: false, reply: "L'assistant conversationnel sera actif dès que la clé IA sera configurée. En attendant, ajustez vos critères (budget, style, pièce) pour relancer une sélection.", recos: match.recos });
    }
    try {
      const client = new Anthropic({ apiKey });
      const reply = await chat(client, brief, match.recos, body.messages || []);
      return Response.json({ aiEnabled: true, reply, recos: match.recos });
    } catch (e) {
      return Response.json({ aiEnabled: true, reply: "Désolé, je n'ai pas pu traiter votre demande à l'instant. Réessayez dans un moment.", error: e instanceof Error ? e.message : 'ai_error', recos: match.recos }, { status: 200 });
    }
  }

  // Action RECOMMEND (défaut).
  let intro: string | null = null;
  let recos = match.recos;
  if (aiEnabled && recos.length) {
    try {
      const client = new Anthropic({ apiKey });
      const ai = await enrich(client, brief, recos);
      if (ai) {
        intro = ai.intro;
        const byId = new Map(ai.items.map((i) => [i.id, i]));
        recos = recos.map((r) => {
          const e = byId.get(r.id);
          return e ? { ...r, reasons: { why: e.why || r.reasons.why, styleFit: e.styleFit || r.reasons.styleFit, dimension: r.reasons.dimension, placement: e.placement || r.reasons.placement } } : r;
        });
      }
    } catch { /* repli silencieux sur les explications moteur */ }
  }

  return Response.json({
    aiEnabled,
    intro: intro || defaultIntro(match.meta.roomLabel, recos.length),
    recos,
    complements: match.complements,
    meta: match.meta,
  });
}

function defaultIntro(roomLabel: string, n: number): string {
  if (n === 0) return "Nous n'avons pas trouvé de pièce correspondant exactement à ces critères dans notre catalogue actuel. Ajustez le budget ou le style pour élargir la recherche.";
  return `Voici une sélection de ${n} pièce${n > 1 ? 's' : ''} de notre collection, choisies pour votre ${roomLabel.toLowerCase()} selon vos critères.`;
}
