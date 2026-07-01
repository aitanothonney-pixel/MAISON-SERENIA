'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'ms_cart';
const EVENT = 'ms_cart_change';
export const ITEM_ADDED_EVENT = 'ms_item_added';

export interface CartItem {
  id: number;
  qty: number;
}

function readStorage(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function persist(next: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
    const sync = () => setItems(readStorage());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addItem = useCallback((id: number) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === id);
      const next = existing
        ? prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
        : [...prev, { id, qty: 1 }];
      persist(next);
      window.dispatchEvent(new CustomEvent(ITEM_ADDED_EVENT, { detail: { id } }));
      return next;
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, qty } : x));
      persist(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
    setItems([]);
  }, []);

  const count = items.reduce((sum, x) => sum + x.qty, 0);
  const inCart = useCallback((id: number) => items.some((x) => x.id === id), [items]);

  return { items, addItem, removeItem, updateQty, clearCart, count, inCart };
}
