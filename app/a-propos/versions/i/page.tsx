// Proposition I « Pas à pas » : une bande horizontale épinglée, pilotée par le défilement vertical.
import type { Metadata } from 'next';
import { PasAPas } from './pas-a-pas';

export const metadata: Metadata = {
  title: 'Proposition I · Notre histoire',
  robots: { index: false, follow: false },
};

export default function PropositionI() {
  return <PasAPas />;
}
