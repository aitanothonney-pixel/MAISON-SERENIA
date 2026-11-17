import { describe, it, expect } from 'vitest';
import { BLACK_FRIDAY_PROMO, promoEndTimestamp } from '../lib/promotions';

describe('promotions — compte à rebours réel uniquement', () => {
  it('aucune échéance affichée tant qu\'aucune date de fin réelle n\'est renseignée', () => {
    expect(BLACK_FRIDAY_PROMO.endsAt).toBeNull();
    expect(promoEndTimestamp(null, Date.parse('2026-11-17T10:00:00Z'))).toBeNull();
  });

  it('renvoie la fin lorsque la date est encore à venir', () => {
    const end = '2030-12-01T23:59:59+01:00';
    expect(promoEndTimestamp(end, Date.parse('2030-11-01T00:00:00Z'))).toBe(Date.parse(end));
  });

  it('ne réarme jamais une date dépassée (aucun faux compteur)', () => {
    expect(promoEndTimestamp('2026-11-30T23:59:59+01:00', Date.parse('2026-12-01T00:00:00Z'))).toBeNull();
  });

  it('ignore une date invalide', () => {
    expect(promoEndTimestamp('pas-une-date', 0)).toBeNull();
  });
});
