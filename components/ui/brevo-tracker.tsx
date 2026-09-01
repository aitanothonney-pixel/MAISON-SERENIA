'use client';

import { useEffect } from 'react';
import { brevoIdentify } from '@/lib/brevoTracking';

const CLIENT_KEY = process.env.NEXT_PUBLIC_BREVO_CLIENT_KEY;

// Charge le script de suivi Brevo (nécessaire au scénario « panier abandonné »).
// Ne fait rien si la clé de suivi n'est pas configurée.
export function BrevoTracker() {
  useEffect(() => {
    if (!CLIENT_KEY) return;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const w = window as any;
    if (w.sendinblue) { brevoIdentify(); return; }

    w.sib = { equeue: [], client_key: CLIENT_KEY };
    w.sendinblue = {};
    ['track', 'identify', 'trackLink', 'page'].forEach((k) => {
      w.sendinblue[k] = function () {
        const arg = Array.prototype.slice.call(arguments);
        (w.sib[k] || function () { const t: any = {}; t[k] = arg; w.sib.equeue.push(t); })(arg[0], arg[1], arg[2], arg[3]);
      };
    });
    const n = document.createElement('script');
    const first = document.getElementsByTagName('script')[0];
    n.type = 'text/javascript';
    n.id = 'sendinblue-js';
    n.async = true;
    n.src = 'https://sibautomation.com/sa.js?key=' + CLIENT_KEY;
    first?.parentNode?.insertBefore(n, first);
    w.sendinblue.page();
    brevoIdentify();
  }, []);

  return null;
}
