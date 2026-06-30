'use client';

import { Truck, Lock, RotateCcw } from 'lucide-react';

export function AssuranceBar() {
  return (
    <section className="w-full bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-3 gap-8 md:gap-12">
          {/* Livraison rapide */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 p-3 bg-white rounded-lg">
              <Truck className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">Livraison rapide</h3>
            <p className="text-xs text-neutral-600">8-15 jours ouvrés</p>
          </div>

          {/* Paiement sécurisé */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 p-3 bg-white rounded-lg">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">Paiement sécurisé</h3>
            <p className="text-xs text-neutral-600">SSL 256-bit</p>
          </div>

          {/* Retours faciles */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 p-3 bg-white rounded-lg">
              <RotateCcw className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold text-black mb-1">Retours 30 jours</h3>
            <p className="text-xs text-neutral-600">Satisfait ou remboursé</p>
          </div>
        </div>
      </div>
    </section>
  );
}
