'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { formatPrice, useCurrency } from '@/lib/currency';

const COLLECTIONS = [
  { label: 'Salon', href: '/collections/salon' },
  { label: 'Meubles', href: '/collections/meubles' },
  { label: 'Décorations', href: '/collections/figurines' },
  { label: 'Promotions', href: '/promotions' },
];

const SERVICE = [
  { label: 'Livraison', href: '/livraison' },
  { label: 'Retours & échanges', href: '/retours' },
  { label: 'Questions fréquentes', href: '/faq' },
  { label: 'Nous contacter', href: '/contact' },
  { label: 'À propos', href: '/a-propos' },
];

const LEGAL = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Conditions générales', href: '/cgv' },
  { label: 'Confidentialité', href: '/confidentialite' },
];

const LINK = 'text-neutral-500 transition-colors hover:text-black';

function FooterColumn({ title, children, extra }: { title: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-black">{title}</h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
      {extra}
    </div>
  );
}

// Pied de page commun à toutes les pages publiques : coordonnées, service client,
// mentions légales et gestion des cookies. Masqué dans l'espace de gestion.
export function SiteFooter() {
  const cur = useCurrency();
  const pathname = usePathname();
  if (pathname?.startsWith('/gestion')) return null;

  return (
    <footer className="border-t border-neutral-200 bg-white pb-8 pt-16 text-neutral-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo color="black" size="md" />
            </div>
            <p className="mb-1 text-sm leading-relaxed text-neutral-600">Mobilier &amp; pièces d&apos;exception.</p>
            <p className="mb-5 text-sm text-neutral-500">Genève, Suisse 🇨🇭</p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/serenia_officiel" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={LINK}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@serenia_officiel" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={`text-sm font-medium tracking-wider ${LINK}`}>
                TikTok
              </a>
            </div>
          </div>

          <FooterColumn title="Nos Collections">
            {COLLECTIONS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={LINK}>{item.label}</Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Service Client">
            {SERVICE.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={LINK}>{item.label}</Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn
            title="Informations"
            extra={
              <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500">
                <Truck className="h-4 w-4 text-[#7F6A52]" strokeWidth={1.5} />
                Livraison offerte dès {formatPrice(40, cur)}
              </div>
            }
          >
            {LEGAL.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={LINK}>{item.label}</Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('cookie-settings-open'))}
                className={LINK}
              >
                Gérer les cookies
              </button>
            </li>
          </FooterColumn>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© 2026 Maison Serenia · Genève, Suisse</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="flex h-7 w-11 items-center justify-center rounded border border-neutral-200 bg-white">
              <span className="text-[13px] font-bold italic tracking-tight text-[#1A1F71]" style={{ fontFamily: 'Arial, sans-serif' }}>VISA</span>
            </div>
            <div className="flex h-7 w-11 items-center justify-center rounded border border-neutral-200 bg-white">
              <span className="relative inline-block h-4 w-6">
                <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-[#EB001B]" />
                <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-[#F79E1B] mix-blend-multiply" />
              </span>
            </div>
            {/* PayPal : bleu plus foncé que la marque pour un contraste suffisant sur fond blanc */}
            <div className="flex h-7 items-center justify-center rounded border border-neutral-200 bg-white px-2.5">
              <span className="text-[12px] font-bold italic" style={{ fontFamily: 'Arial, sans-serif' }}>
                <span className="text-[#003087]">Pay</span><span className="text-[#0070BA]">Pal</span>
              </span>
            </div>
            <div className="flex h-7 items-center justify-center gap-0.5 rounded bg-black px-2.5">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="white" aria-hidden="true">
                <path d="M17 13.5c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.4-2c.7-1.1 1-2.2 1-2.3-.1 0-2.3-.9-2.3-3.2Zm-2-6c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.4-.8 2.3.9.1 1.7-.4 2.2-1Z" />
              </svg>
              <span className="text-[12px] font-medium text-white" style={{ fontFamily: 'Arial, sans-serif' }}>Pay</span>
            </div>
            <div className="flex h-7 w-11 items-center justify-center rounded bg-[#2E77BC]">
              <span className="text-[10px] font-bold tracking-tight text-white" style={{ fontFamily: 'Arial, sans-serif' }}>AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
