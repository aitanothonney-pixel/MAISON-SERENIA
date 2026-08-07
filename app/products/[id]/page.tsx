import { products } from '@/lib/products';
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

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        category: product.category,
        brand: { '@type': 'Brand', name: 'Maison Serenia' },
        offers: {
          '@type': 'Offer',
          url: `${BASE}/products/${product.id}`,
          priceCurrency: 'EUR',
          price: (product.name.includes('Bubble') ? Math.round(product.price * 0.7) : product.price).toString(),
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'Maison Serenia' },
        },
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
      <ProductClient params={params} />
    </>
  );
}
