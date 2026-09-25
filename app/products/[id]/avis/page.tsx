import { permanentRedirect } from 'next/navigation';

// Les avis clients générés automatiquement ont été retirés du site.
// Les anciens liens /products/[id]/avis renvoient vers la fiche produit.
export default async function AvisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/products/${id}`);
}
