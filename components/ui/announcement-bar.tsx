'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MESSAGES = [
  '🚚 Livraison offerte dès 80€ d\'achat',
  '✨ Collection Bubble 2026 — Jusqu\'à −30%',
  '🔒 Paiement 100% sécurisé · SSL 256-bit',
  '📦 Expédition sous 24-48h · Suivi inclus',
]

const SESSION_KEY = 'announcement-bar-closed'
const INTERVAL_MS = 4000

export function AnnouncementBar() {
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

  if (!visible) return null

  return (
    <div
      style={{ height: 36 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black text-white flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs tracking-wide select-none"
        >
          {MESSAGES[index]}
        </motion.span>
      </AnimatePresence>
      <button
        onClick={handleClose}
        aria-label="Fermer la barre d'annonce"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors leading-none text-base"
      >
        ×
      </button>
    </div>
  )
}
