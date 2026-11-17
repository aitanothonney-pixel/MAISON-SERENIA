// Promotions affichées sur le site : une seule source de vérité.
//
// Règle : aucun compte à rebours et aucune mention « offre limitée » sans date de fin réelle.
// Renseigner `endsAt` (ISO 8601, fuseau inclus) uniquement lorsque la fin de l'opération est
// confirmée. Tant que la valeur vaut `null`, le site n'affiche ni compte à rebours ni échéance.
export const BLACK_FRIDAY_PROMO = {
  label: 'Black Friday',
  /** Remise appliquée sur la collection Bubble (prix déjà calculés dans lib/products.ts). */
  bubbleDiscountLabel: '−30 %',
  endsAt: null as string | null,
} as const;

/** Timestamp de fin si la promotion a une date réelle encore à venir, sinon null. */
export function promoEndTimestamp(
  endsAt: string | null = BLACK_FRIDAY_PROMO.endsAt,
  now: number = Date.now(),
): number | null {
  if (!endsAt) return null;
  const end = Date.parse(endsAt);
  return Number.isFinite(end) && end > now ? end : null;
}

/** Date de fin lisible en français, calculée au fuseau suisse pour un rendu identique partout. */
export function formatPromoEnd(endsAt: string): string {
  return new Date(endsAt).toLocaleString('fr-CH', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  });
}
