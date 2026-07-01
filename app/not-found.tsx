'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#fff',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        {/* Large 404 */}
        <span
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            fontWeight: 700,
            color: '#e8e8e8',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          404
        </span>

        {/* Decorative sofa image */}
        <div style={{ position: 'relative', width: 160, height: 100 }}>
          <Image
            src="https://i.ibb.co/xSV6MBVx/47-B09888-A4-A8-44-E7-A80-D-7-E1-D7-BDDF6-ED.png"
            alt="Bubble sofa MAISON SERENIA"
            fill
            style={{ objectFit: 'contain' }}
            sizes="160px"
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 600,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          Cette page s&apos;est évaporée...
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1rem',
            color: '#6b6b6b',
            margin: 0,
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          Mais nos collections, elles, sont bien là.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Retour à l&apos;accueil
          </Link>

          <Link
            href="/products"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
              border: '1px solid #1a1a1a',
            }}
          >
            Voir nos produits
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
