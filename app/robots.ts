import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://maison-serenia.com/sitemap.xml',
    host: 'https://maison-serenia.com',
  };
}
