import { products } from '@/lib/products';
import ProductClient from './product-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === Number(id));
  if (!product) return { title: 'Produit | Maison Serenia' };
  return {
    title: `${product.name} | Maison Serenia`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: [{ url: product.images[0] }],
    },
  };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductClient params={params} />;
}
