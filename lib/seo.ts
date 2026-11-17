import type { Metadata } from 'next';

export const SITE_URL = 'https://maison-serenia.com';

// Métadonnées d'une page statique : titre et description propres, URL canonique absolue.
// `noindex` pour les pages sans intérêt de référencement (confirmation de commande, 404).
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Maison Serenia',
      images: [{ url: `${SITE_URL}/catalog/WW4mTJDL.png`, width: 1200, height: 630 }],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
