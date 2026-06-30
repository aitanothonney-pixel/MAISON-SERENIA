import type { Metadata } from 'next'
import { Playfair_Display, Sora, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@/components/analytics'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MAISON SERENIA | Mobilier & Décoration Haut de Gamme',
  description: "Découvrez notre collection exclusive de mobilier premium. Sélection curatée, paiement sécurisé, retours 30 jours. L'art de vivre à la française.",
  keywords: 'mobilier, décoration, canapé, fauteuil, design, premium',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  authors: [{ name: 'MAISON SERENIA' }],
  metadataBase: new URL('https://maisonserenia.ch'),
  openGraph: {
    title: 'MAISON SERENIA | Mobilier Haut de Gamme',
    description: 'Meubles et décoration premium. Collection curatée, paiement sécurisé, satisfaction garantie.',
    url: 'https://maisonserenia.ch',
    siteName: 'MAISON SERENIA',
    images: [
      {
        url: 'https://i.ibb.co/j9h5SNVC/IMG-2392.jpg',
        width: 1200,
        height: 630,
        alt: 'MAISON SERENIA - Mobilier Haut de Gamme',
      },
    ],
    locale: 'fr_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAISON SERENIA',
    description: 'Mobilier premium curatisé. Paiement sécurisé, retours faciles.',
    creator: '@serenia_officiel',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${sora.variable} ${dmSerif.variable}`}>
      <head>
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  )
}
