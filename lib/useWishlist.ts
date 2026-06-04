'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'ms_wishlist';

function readStorage(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(readStorage());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isWished = useCallback((id: number) => ids.includes(id), [ids]);

  return { ids, toggle, isWished, count: ids.length };
}
