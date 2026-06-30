'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2 } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Suivi de commande</h1>
            <p className="text-neutral-600">
              Entrez votre numéro de commande et votre email pour suivre votre colis.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-12 p-8 bg-neutral-50 rounded-none">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: #2406-001234"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email de commande"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-white font-semibold rounded-none hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Suivre ma commande
            </button>
          </form>

          {/* Tracking result */}
          {searched && (
            <div className="space-y-8">
              {/* Order info */}
              <div className="p-6 bg-neutral-50 rounded-none">
                <h2 className="font-semibold text-black mb-4">Détails de votre commande</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600">Numéro</p>
                    <p className="font-semibold text-black">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Date</p>
                    <p className="font-semibold text-black">28 juin 2026</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Total</p>
                    <p className="font-semibold text-black">CHF 189.90</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Statut</p>
                    <p className="font-semibold text-green-600">En livraison</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="font-semibold text-black mb-6">Suivi du colis</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: CheckCircle2,
                      title: 'Commande confirmée',
                      date: '28 juin 2026 à 14:32',
                      description: 'Votre commande a été acceptée et traitée.',
                      completed: true,
                    },
                    {
                      icon: Package,
                      title: 'Colis préparé',
                      date: '29 juin 2026 à 09:15',
                      description: 'Votre colis a été emballé et est prêt pour l\'expédition.',
                      completed: true,
                    },
                    {
                      icon: Truck,
                      title: 'En transit',
                      date: 'Depuis 30 juin 2026',
                      description: 'Votre colis est actuellement en route. Numéro de suivi : DHL1234567890',
                      completed: true,
                    },
                    {
                      icon: CheckCircle2,
                      title: 'Livré',
                      date: 'Prévu le 5 juillet 2026',
                      description: 'Livraison estimée. Un SMS de confirmation vous sera envoyé.',
                      completed: false,
                    },
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-none flex items-center justify-center ${
                              step.completed
                                ? 'bg-green-100'
                                : 'bg-neutral-100'
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                step.completed
                                  ? 'text-green-600'
                                  : 'text-neutral-400'
                              }`}
                            />
                          </div>
                          {idx < 3 && (
                            <div className={`w-1 h-12 ${
                              step.completed ? 'bg-green-200' : 'bg-neutral-200'
                            }`} />
                          )}
                        </div>
                        <div className="pb-8">
                          <h3 className="font-semibold text-black">{step.title}</h3>
                          <p className="text-sm text-neutral-600">{step.date}</p>
                          <p className="text-sm text-neutral-700 mt-2">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 bg-neutral-50 rounded-none text-center">
                <p className="text-sm text-neutral-600 mb-4">
                  Des questions sur votre livraison ?
                </p>
                <a
                  href="/contact"
                  className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-none hover:bg-neutral-900 transition-colors text-sm"
                >
                  Contactez-nous
                </a>
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-none">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Conseil</h3>
            <p className="text-sm text-blue-800">
              Vous pouvez aussi suivre votre colis directement auprès du transporteur en cliquant sur le lien
              fourni dans votre email de confirmation d&apos;expédition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
