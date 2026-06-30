'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';

interface SocialProofEvent {
  id: string;
  type: 'view' | 'purchase';
  name: string;
  avatar: string;
  timeAgo: string;
}

interface LiveSocialProofProps {
  viewersCount?: number;
  recentPurchases?: number;
  showAnimatedNotifications?: boolean;
}

const sampleEvents: SocialProofEvent[] = [
  {
    id: '1',
    type: 'purchase',
    name: 'Marie D.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    timeAgo: 'à l\'instant',
  },
  {
    id: '2',
    type: 'view',
    name: '+4 personnes',
    avatar: '',
    timeAgo: 'regardent maintenant',
  },
  {
    id: '3',
    type: 'purchase',
    name: 'Jean P.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    timeAgo: 'il y a 2 min',
  },
];

export function LiveSocialProof({
  viewersCount = 7,
  recentPurchases = 3,
  showAnimatedNotifications = true,
}: LiveSocialProofProps) {
  const [displayedEvents, setDisplayedEvents] = useState(sampleEvents);

  useEffect(() => {
    if (!showAnimatedNotifications) return;

    const interval = setInterval(() => {
      const newEvent: SocialProofEvent = {
        id: Math.random().toString(),
        type: Math.random() > 0.6 ? 'purchase' : 'view',
        name: Math.random() > 0.5 ? '+' + Math.floor(Math.random() * 5 + 1) + ' personnes' : ['Alice', 'Boris', 'Claude', 'Diane', 'Émile'][Math.floor(Math.random() * 5)] + ' ' + ['D.', 'M.', 'L.', 'H.'][Math.floor(Math.random() * 4)] + '.',
        avatar: `https://images.unsplash.com/photo-${1494790108377 + Math.floor(Math.random() * 10)}?w=60&h=60&fit=crop`,
        timeAgo: 'à l\'instant',
      };

      setDisplayedEvents((prev) => [newEvent, ...prev.slice(0, 3)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [showAnimatedNotifications]);

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-none p-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-700" />
          <div>
            <p className="text-xs text-blue-600 uppercase font-semibold">Actuellement</p>
            <p className="text-lg font-bold text-blue-900">{viewersCount} regardent</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-none p-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-green-700" />
          <div>
            <p className="text-xs text-green-600 uppercase font-semibold">Derniers jours</p>
            <p className="text-lg font-bold text-green-900">{recentPurchases} achats</p>
          </div>
        </div>
      </div>

      {/* Live feed */}
      <div className="space-y-2">
        <p className="text-xs uppercase font-semibold text-neutral-600">Activité en direct</p>
        {displayedEvents.map((event, idx) => (
          <div
            key={event.id}
            className="animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-50 border border-neutral-200 rounded-none p-3 flex items-center gap-3"
          >
            {event.type === 'purchase' ? (
              <div className="w-8 h-8 rounded-none bg-green-100 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-green-700" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-none bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-blue-700" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {event.name}
              </p>
              <p className="text-xs text-neutral-600">
                {event.type === 'purchase' ? 'a acheté cet article' : 'regarde ce produit'}
              </p>
            </div>

            <p className="text-xs text-neutral-500 flex-shrink-0">{event.timeAgo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
