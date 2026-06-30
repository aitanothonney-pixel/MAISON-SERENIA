'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function FooterComponent() {
  return (
    <footer className="bg-black text-white/60 pt-16 pb-8">
      <div className="h-px w-full bg-neutral-800" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-[0.2em] uppercase mb-4 text-white" style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              MAISON SERENIA
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              L&apos;art de vivre à la française. Des pièces intemporelles conçues pour sublimer votre intérieur.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Salon', href: '#section-salon' },
                { label: 'Chambre', href: '#section-chambre' },
                { label: 'Bureau', href: '#section-bureau' },
                { label: 'Figurines', href: '#section-figurines' },
                { label: 'Été', href: '#section-ete' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" /> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'À propos', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Suivi commande', href: '/track-order' },
                { label: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suivez-nous */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">Suivez-nous</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/serenia_officiel' },
                { label: 'TikTok', href: 'https://www.tiktok.com/@serenia_officiel' },
                { label: 'Facebook', href: '#' },
                { label: 'Pinterest', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" /> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          {/* Pages légales */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 text-xs">
            <Link href="/cgv" className="hover:text-white transition-colors">
              CGV
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/retours" className="hover:text-white transition-colors">
              Retours
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-3 justify-center mb-8 flex-wrap">
            <span className="text-xs text-white/40">Paiements acceptés :</span>
            <svg viewBox="0 0 48 32" className="h-5 w-auto opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#1A1F71"/>
              <path d="M19.5 22H16.6L18.4 10H21.3L19.5 22Z" fill="white"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#252525"/>
              <circle cx="18" cy="16" r="8" fill="#EB001B"/>
              <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
              <path d="M32.3 11.2c.1-.7 0-1.2-.4-1.7-.5-.5-1.3-.8-2.4-.8h-4.1c-.3 0-.5.2-.6.5l-1.7 10.8c0 .2.1.4.3.4h2.4l.6-3.8v.1c.1-.3.3-.5.6-.5h1.3c2.5 0 4.5-1 5-4 .2-.8.1-1.5-.1-2Z" fill="#009EE3"/>
            </svg>
            <svg viewBox="0 0 48 32" className="h-5 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#000"/>
              <path d="M17.3 12.1c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.3-.7 2.1.8.1 1.5-.4 2-1ZM18 13.2c-1.1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.7 1.7-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.7.8 0 1.1-.5 2.1-.5 1 0 1.2.5 2.1.5.9 0 1.5-.8 2.1-1.7.6-.9.9-1.8.9-1.8s-1.7-.7-1.7-2.5c0-1.6 1.3-2.3 1.3-2.3s-.7-1.7-2.3-1.7Z" fill="white"/>
            </svg>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-white/30">
            © 2026 MAISON SERENIA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
