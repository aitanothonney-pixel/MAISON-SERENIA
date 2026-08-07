'use client';

import { createContext, useContext } from 'react';

// Devise: prix stockés en CHF (base, ce sont les prix que tu saisis).
// Un visiteur suisse voit le montant tel quel en CHF ; ailleurs, il est converti en EUR.
export type Currency = 'EUR' | 'CHF';

// Taux fixe CHF -> EUR (à ajuster de temps en temps). 1 CHF ≈ 1.05 €.
export const CHF_TO_EUR = 1.05;

export const CurrencyContext = createContext<Currency>('EUR');

export function useCurrency(): Currency {
  return useContext(CurrencyContext);
}

// Convertit un montant CHF (base) vers la devise cible.
export function convertPrice(amountChf: number, cur: Currency): number {
  const v = cur === 'EUR' ? amountChf * CHF_TO_EUR : amountChf;
  return Math.round(v * 100) / 100;
}

// Formate un montant (stocké en CHF) dans la devise du visiteur.
export function formatPrice(amountChf: number, cur: Currency): string {
  const v = convertPrice(amountChf, cur);
  const num = v.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  return cur === 'CHF' ? `${num} CHF` : `${num} €`;
}

export function CurrencyProvider({ value, children }: { value: Currency; children: React.ReactNode }) {
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// Composant d'affichage d'un prix (montant en EUR) — utilisable dans les pages serveur.
export function Price({ value }: { value: number }) {
  const cur = useCurrency();
  return <>{formatPrice(value, cur)}</>;
}
