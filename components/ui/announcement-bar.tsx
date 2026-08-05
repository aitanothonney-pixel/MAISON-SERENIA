'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MESSAGES = [
  'Livraison offerte dès 40€ d\'achat',
  'Collection Bubble 2026 — Jusqu\'à −30%',
  'Paiement 100% sécurisé · SSL 256-bit',
  'Expédition sous 24-48h · Suivi inclus',
]

const SESSION_KEY = 'announcement-bar-closed'
const INTERVAL_MS = 4500

export const ANNOUNCEMENT_BAR_HEIGHT = 40

const AnnouncementBarContext = createContext(false)
export function useAnnouncementBarVisible() {
  return useContext(AnnouncementBarContext)
}

export function AnnouncementBar({ children }: { children?: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const closed = sessionStorage.getItem(SESSION_KEY)
      if (!closed) setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [visible])

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
                {MESSAGES[index]}
              </motion.span>
            </AnimatePresence>
            <span className="h-1 w-1 rounded-full bg-[#C9A96E] shrink-0" />
          </div>
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
