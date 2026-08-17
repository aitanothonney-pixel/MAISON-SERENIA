import { products } from '@/lib/products';
import { buildReviewStats } from '@/lib/reviews';
import { categoryToSlug } from '@/lib/collections';
import ProductClient from './product-client';

const BASE = 'https://maison-serenia.com';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === Number(id));
  if (!product) return { title: 'Produit | Maison Serenia' };
  const desc = product.description.slice(0, 155);
  return {
    title: `${product.name} | Maison Serenia`,
    description: desc,
    alternates: { canonical: `${BASE}/products/${product.id}` },
    openGraph: {
      title: product.name,
      description: desc,
      type: 'website',
      url: `${BASE}/products/${product.id}`,
      images: [{ url: product.images[0], alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: desc,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === Number(id));

  const stats = product ? buildReviewStats(product.id) : null;
  // Date de validité du prix (1 an), requise par Google pour les offres.
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  const jsonLd = product && stats
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        category: product.category,
        material: product.material,
        brand: { '@type': 'Brand', name: 'Maison Serenia' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: stats.avg,
          reviewCount: stats.total,
          bestRating: 5,
          worstRating: 1,
        },
        offers: {
          '@type': 'Offer',
          url: `${BASE}/products/${product.id}`,
          priceCurrency: 'CHF',
          price: (product.name.includes('Bubble') ? Math.round(product.price * 0.7) : product.price).toString(),
          priceValidUntil,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Maison Serenia' },
        },
      }
    : null;

  const breadcrumbLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
          { '@type': 'ListItem', position: 2, name: product.category, item: `${BASE}/collections/${categoryToSlug(product.category)}` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE}/products/${product.id}` },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      <ProductClient params={params} />
    </>
  );
}
