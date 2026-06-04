'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'ms_wishlist';
const EVENT = 'ms_wishlist_change';

function readStorage(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function save(next: number[]) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(readStorage());
    const sync = () => setIds(readStorage());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      save(next);
      return next;
    });
  }, []);

  const isWished = useCallback((id: number) => ids.includes(id), [ids]);

  return { ids, toggle, isWished, count: ids.length };
}
