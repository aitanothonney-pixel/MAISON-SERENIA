// Proposition E « Cinéma » : storytelling au défilement, photo qui change par chapitre, citation qui s'éclaire mot à mot.
import type { Metadata } from 'next';
import { Cinema } from './cinema';

export const metadata: Metadata = {
  title: 'Proposition E · Notre histoire',
  robots: { index: false, follow: false },
};

export default function PropositionE() {
  return <Cinema />;
}
