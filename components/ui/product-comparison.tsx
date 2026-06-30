'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

interface ComparisonProduct {
  id: string | number;
  name: string;
  image: string;
  price: number;
  features: { [key: string]: string | boolean };
}

interface ProductComparisonProps {
  products?: ComparisonProduct[];
}

export function ProductComparison({ products = [] }: ProductComparisonProps) {
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const toggleProduct = (id: string | number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((p) => p !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  if (selected.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-none p-6">
        <h3 className="font-bold text-black mb-2">Comparer les produits</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Sélectionnez jusqu'à 3 produits pour les comparer côte à côte.
        </p>
        <p className="text-xs text-blue-700">
          Cliquez sur "Comparer" sur les cartes produits pour ajouter à la comparaison.
        </p>
      </div>
    );
  }

  const selectedProducts = products.filter((p) => selected.includes(p.id));
  const allFeatureKeys = Array.from(
    new Set(selectedProducts.flatMap((p) => Object.keys(p.features)))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-neutral-50">
            <th className="text-left p-4 border border-neutral-200 font-bold text-black text-sm w-48">
              Caractéristiques
            </th>
            {selectedProducts.map((product) => (
              <th
                key={product.id}
                className="p-4 border border-neutral-200 text-center min-w-48"
              >
                <button
                  onClick={() => toggleProduct(product.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-neutral-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative h-20 w-20 mx-auto mb-2 bg-neutral-100 rounded">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-semibold text-black text-xs line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="text-lg font-bold text-black">
                  {product.price.toLocaleString('fr-FR')}€
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatureKeys.map((key) => (
            <tr key={key} className="hover:bg-neutral-50">
              <td className="p-4 border border-neutral-200 font-semibold text-black text-sm">
                {key}
              </td>
              {selectedProducts.map((product) => {
                const value = product.features[key];
                return (
                  <td
                    key={`${product.id}-${key}`}
                    className="p-4 border border-neutral-200 text-center text-sm text-neutral-600"
                  >
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-300 mx-auto" />
                      )
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
