'use client';

import { createContext, useContext } from 'react';

// Devise: prix stockés en EUR (base). Conversion vers CHF pour les visiteurs suisses.
export type Currency = 'EUR' | 'CHF';

// Taux fixe EUR -> CHF (à ajuster de temps en temps).
export const EUR_TO_CHF = 0.96;

export const CurrencyContext = createContext<Currency>('EUR');

export function useCurrency(): Currency {
  return useContext(CurrencyContext);
}

// Convertit un montant EUR vers la devise cible.
export function convertPrice(amountEur: number, cur: Currency): number {
  const v = cur === 'CHF' ? amountEur * EUR_TO_CHF : amountEur;
  return Math.round(v * 100) / 100;
}

// Formate un montant (stocké en EUR) dans la devise du visiteur.
export function formatPrice(amountEur: number, cur: Currency): string {
  const v = convertPrice(amountEur, cur);
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
