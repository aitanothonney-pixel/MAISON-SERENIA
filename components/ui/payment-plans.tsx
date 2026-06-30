'use client';

import { CreditCard, Check } from 'lucide-react';

interface PaymentPlan {
  name: string;
  installments: number;
  monthlyAmount: number;
  totalInterest: number;
  minAmount: number;
}

interface PaymentPlansProps {
  price: number;
  showMinimum?: boolean;
}

export function PaymentPlans({ price, showMinimum = true }: PaymentPlansProps) {
  const plans: PaymentPlan[] = [
    {
      name: '4 fois',
      installments: 4,
      monthlyAmount: Math.ceil(price / 4 * 100) / 100,
      totalInterest: 0,
      minAmount: 50,
    },
    {
      name: '6 fois',
      installments: 6,
      monthlyAmount: Math.ceil(price / 6 * 100 + 5) / 100,
      totalInterest: Math.round((price / 6) * 0.05 * 10) / 10,
      minAmount: 100,
    },
    {
      name: '12 fois',
      installments: 12,
      monthlyAmount: Math.ceil(price / 12 * 100 + 8) / 100,
      totalInterest: Math.round((price / 12) * 0.08 * 10) / 10,
      minAmount: 200,
    },
  ];

  const eligiblePlans = plans.filter((p) => price >= p.minAmount);

  if (eligiblePlans.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-blue-700" />
        <h3 className="font-bold text-blue-900">Paiements Flexibles</h3>
      </div>

      <div className="space-y-3">
        {eligiblePlans.map((plan) => (
          <button
            key={plan.name}
            className="w-full p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-black">
                  {plan.monthlyAmount.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  € × {plan.installments}
                </p>
                <p className="text-xs text-neutral-600">
                  {plan.totalInterest === 0
                    ? 'Sans frais'
                    : `+ ${plan.totalInterest.toLocaleString('fr-FR')}€ d'intérêts`}
                </p>
              </div>
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-blue-700 mt-3">
        💳 Alimenté par Klarna | Validation instantanée
      </p>
    </div>
  );
}
