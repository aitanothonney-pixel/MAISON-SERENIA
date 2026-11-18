'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { BrevoTracker } from '@/components/ui/brevo-tracker';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = 'cookie-consent';

type Choice = 'accepted' | 'refused';

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'refused' ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour cette visite.
  }
}

// Bandeau cookies, affiché sur toutes les pages publiques. Les traceurs non essentiels
// (Google Analytics, suivi Brevo) ne se chargent qu'après « Tout accepter ». « Refuser »
// n'en charge aucun. Le panier, le paiement et les préférences (devise, favoris)
// fonctionnent dans tous les cas.
export function CookieConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readChoice();
    // Lecture du choix enregistré après le rendu serveur — motif légitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored);
    setVisible(stored === null);
    const reopen = () => setVisible(true);
    window.addEventListener('cookie-settings-open', reopen);
    return () => window.removeEventListener('cookie-settings-open', reopen);
  }, []);

  // Pendant que le bandeau est ouvert, la barre d'achat mobile des fiches produit s'efface.
  useEffect(() => {
    document.documentElement.dataset.cookieBanner = visible ? 'open' : 'closed';
  }, [visible]);

  if (pathname?.startsWith('/gestion')) return null;

  const decide = (next: Choice) => {
    try {
      saveChoice(next);
    } catch {
      /* ignoré : voir saveChoice */
    }
    setChoice(next);
    setVisible(false);
  };

  return (
    <>
      {choice === 'accepted' && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      {choice === 'accepted' && <BrevoTracker />}
      {visible && (
        <div
          role="region"
          aria-label="Cookies"
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-neutral-800 bg-black shadow-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
            <p className="text-center text-sm leading-relaxed text-neutral-300 sm:text-left">
              Cookies indispensables au panier, au paiement et à vos préférences. Avec votre accord, nous utilisons aussi des cookies de mesure d&apos;audience et de relance (Google Analytics, Brevo).{' '}
              <Link href="/confidentialite" className="underline underline-offset-2 hover:text-white">
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide('refused')}
                className="rounded border border-white px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => decide('accepted')}
                className="rounded border border-white px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
