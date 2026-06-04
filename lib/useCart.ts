'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'ms_cart';

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

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = (next: CartItem[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
  };

  const addItem = useCallback((id: number) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === id);
      const next = existing
        ? prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
        : [...prev, { id, qty: 1 }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, qty } : x));
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.setItem(KEY, '[]');
    setItems([]);
  }, []);

  const count = items.reduce((sum, x) => sum + x.qty, 0);
  const inCart = useCallback((id: number) => items.some((x) => x.id === id), [items]);

  return { items, addItem, removeItem, updateQty, clearCart, count, inCart };
}
