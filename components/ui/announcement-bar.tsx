'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useCurrency, formatPrice } from '@/lib/currency'
import { Pause, Play } from 'lucide-react'

const SESSION_KEY = 'announcement-bar-closed'
const INTERVAL_MS = 4500

export const ANNOUNCEMENT_BAR_HEIGHT = 40

const AnnouncementBarContext = createContext(false)
export function useAnnouncementBarVisible() {
  return useContext(AnnouncementBarContext)
}

export function AnnouncementBar({ children }: { children?: ReactNode }) {
  const cur = useCurrency()
  // Messages qui défilent. Un message avec `href` ouvre cette page au clic.
  const MESSAGES: { text: string; href?: string }[] = [
    { text: 'Profitez du Black Friday', href: '/promotions' },
    { text: `Livraison offerte dès ${formatPrice(40, cur)} d'achat` },
    { text: 'Collection Bubble 2026 — Jusqu\'à −30%' },
    { text: 'Paiement sécurisé par Stripe' },
    { text: 'Livraison en 1 à 4 semaines · Suivi inclus' },
  ]
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const closed = sessionStorage.getItem(SESSION_KEY)
      // Lecture d'un store client (sessionStorage) au montage — motif légitime.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!closed) setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible || paused) return
    // Préférence « réduire les animations » : pas de rotation automatique
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [visible, paused, MESSAGES.length])

  const current = MESSAGES[index]

  const handleClose = () => {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  return (
    <AnnouncementBarContext.Provider value={visible}>
      {visible && (
        <div
          style={{ height: ANNOUNCEMENT_BAR_HEIGHT }}
          className="fixed top-0 left-0 right-0 z-[75] bg-black text-white flex items-center justify-center px-12"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[#C9A96E] shrink-0" />
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] tracking-[0.15em] uppercase font-medium text-white/90 select-none whitespace-nowrap"
              >
                {current.href ? (
                  <Link href={current.href} className="hover:text-[#C9A96E] transition-colors">
                    {current.text}
                  </Link>
                ) : (
                  current.text
                )}
              </motion.span>
            </AnimatePresence>
            <span className="h-1 w-1 rounded-full bg-[#C9A96E] shrink-0" />
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Reprendre le défilement des annonces' : 'Mettre en pause le défilement des annonces'}
            aria-pressed={paused}
            className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            aria-label="Fermer la barre d'annonce"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors leading-none text-base"
          >
            ×
          </button>
        </div>
      )}
      {children}
    </AnnouncementBarContext.Provider>
  )
}
