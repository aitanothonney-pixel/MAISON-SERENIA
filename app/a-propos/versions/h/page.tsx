// Proposition H « Modulable » : des blocs éparpillés s'assemblent en grille au défilement, avec des ressorts.
import type { Metadata } from 'next';
import { Modulable } from './modulable';

export const metadata: Metadata = {
  title: 'Proposition H · Notre histoire',
  robots: { index: false, follow: false },
};

export default function PropositionH() {
  return <Modulable />;
}
