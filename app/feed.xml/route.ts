import { products, getVariantGroup, getVariantGroupKey, type Product } from '@/lib/products';

// Flux produits Google Merchant Center (RSS 2.0 + espace de noms g:).
// URL publique : https://maison-serenia.com/feed.xml
// Merchant Center le télécharge automatiquement toutes les 24 h : il suffit de
// modifier lib/products.ts et de redéployer pour que Google soit à jour.
//
// Flux destiné à la Suisse : prix en CHF, liens forcés en CHF (?devise=CHF)
// pour que la page vue par Google affiche la même devise que le flux.

export const dynamic = 'force-static';

const BASE = 'https://maison-serenia.com';
const BRAND = 'Maison Serenia';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Prix réellement payé, identique à la fiche produit et au paiement Stripe :
// - produit avec options (taille / coloris) : prix de la 1re option (sélectionnée par défaut)
// - collection Bubble : prix remisé −30 %
// - sinon : prix de base
function sellingPrice(p: Product): number {
  if (p.sizes?.length) return p.sizes[0].price;
  if (p.name.includes('Bubble')) return Math.round(p.price * 0.7);
  return p.price;
}

function description(p: Product): string {
  const parts = [p.description];
  if (p.dimensions) parts.push(`Dimensions : ${p.dimensions}.`);
  if (p.material) parts.push(`Matière : ${p.material}.`);
  if (p.details?.length) parts.push(p.details.join(' · ') + '.');
  return parts.join(' ').slice(0, 5000);
}

function item(p: Product): string {
  const link = `${BASE}/products/${p.id}?devise=CHF`;
  const [mainImage, ...extraImages] = p.images;
  const groupKey = getVariantGroupKey(p.id);
  const color = getVariantGroup(p.id)?.find((v) => v.productId === p.id)?.color;

  const lines = [
    `<g:id>${p.id}</g:id>`,
    `<g:title>${esc(p.name.slice(0, 150))}</g:title>`,
    `<g:description>${esc(description(p))}</g:description>`,
    `<g:link>${esc(link)}</g:link>`,
    `<g:image_link>${esc(mainImage)}</g:image_link>`,
    ...extraImages.slice(0, 10).map((img) => `<g:additional_image_link>${esc(img)}</g:additional_image_link>`),
    `<g:availability>in_stock</g:availability>`,
    `<g:price>${sellingPrice(p).toFixed(2)} CHF</g:price>`,
    `<g:condition>new</g:condition>`,
    `<g:brand>${esc(BRAND)}</g:brand>`,
    `<g:identifier_exists>no</g:identifier_exists>`,
    `<g:product_type>${esc(`Maison > ${p.category}`)}</g:product_type>`,
  ];
  if (groupKey) lines.push(`<g:item_group_id>${esc(groupKey)}</g:item_group_id>`);
  if (color) lines.push(`<g:color>${esc(color)}</g:color>`);

  return `<item>\n${lines.map((l) => `  ${l}`).join('\n')}\n</item>`;
}

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${esc(BRAND)}</title>
<link>${BASE}</link>
<description>Catalogue produits ${esc(BRAND)} (Suisse, CHF)</description>
${products.filter((p) => p.images.length > 0).map(item).join('\n')}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
