export interface ProductSchemaProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

export function ProductSchema({
  id,
  name,
  description,
  price,
  image,
  category,
  rating = 4.8,
  reviewCount = 147,
  availability = 'InStock',
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: 'MAISON SERENIA',
    },
    sku: String(id),
    category,
    offers: {
      '@type': 'Offer',
      url: `https://maisonserenia.ch/products/${id}`,
      priceCurrency: 'CHF',
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'MAISON SERENIA',
        url: 'https://maisonserenia.ch',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
