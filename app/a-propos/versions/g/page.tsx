// Proposition G « Lumière » : la page passe de la nuit au jour en défilant ; le pointeur éclaire le titre et la photo.
import type { Metadata } from 'next';
import { Lumiere } from './lumiere';

export const metadata: Metadata = {
  title: 'Proposition G · Notre histoire',
  robots: { index: false, follow: false },
};

export default function PropositionG() {
  return <Lumiere />;
}
