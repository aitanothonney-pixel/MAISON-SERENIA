import type { Testimonial } from '@/components/ui/testimonials-columns-1';

// Témoignages clients affichés sur le site.
// Règle : uniquement des avis réels et vérifiables (client identifié avec son accord, commande réelle).
// Aucun témoignage n'est inventé. Tant que la liste est vide, la section n'est pas affichée.
export const VERIFIED_TESTIMONIALS: Testimonial[] = [];
