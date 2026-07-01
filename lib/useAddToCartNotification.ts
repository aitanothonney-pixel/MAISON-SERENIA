'use client';

import { useState, useEffect, useCallback } from 'react';
import { ITEM_ADDED_EVENT } from './useCart';
import { products } from './products';

export interface AddedProductInfo {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export function useAddToCartNotification() {
  const [addedProduct, setAddedProduct] = useState<AddedProductInfo | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleItemAdded = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ id: number }>;
    const productId = customEvent.detail?.id;

    if (productId) {
      const product = products.find((p) => p.id === Math.abs(productId));
      if (product) {
        setAddedProduct({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          category: product.category,
        });
        setShowNotification(true);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener(ITEM_ADDED_EVENT, handleItemAdded);
    return () => {
      window.removeEventListener(ITEM_ADDED_EVENT, handleItemAdded);
    };
  }, [handleItemAdded]);

  const closeNotification = useCallback(() => {
    setShowNotification(false);
    setTimeout(() => setAddedProduct(null), 300);
  }, []);

  return {
    showNotification,
    addedProduct,
    closeNotification,
  };
}
