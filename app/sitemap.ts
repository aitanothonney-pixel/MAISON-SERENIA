import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { COLLECTIONS } from '@/lib/collections';

const BASE = 'https://maison-serenia.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    '',
    '/produits',
    '/promotions',
    '/a-propos',
    '/livraison',
    '/retours',
    '/contact',
    '/faq',
    '/cgv',
    '/mentions-legales',
    '/confidentialite',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.6,
  }));

  const collectionPages = COLLECTIONS.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const packPages = ['blanc', 'bleu', 'rouge'].map((slug) => ({
    url: `${BASE}/packs/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const productPages = products.map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...collectionPages, ...packPages, ...productPages];
}
