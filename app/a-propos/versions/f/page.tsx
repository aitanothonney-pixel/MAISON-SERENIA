// Proposition F « Matière » : titres révélés par masque, images en parallaxe, ligne dorée qui se dessine.
import type { Metadata } from 'next';
import { Matiere } from './matiere';

export const metadata: Metadata = {
  title: 'Proposition F · Notre histoire',
  robots: { index: false, follow: false },
};

export default function PropositionF() {
  return <Matiere />;
}
