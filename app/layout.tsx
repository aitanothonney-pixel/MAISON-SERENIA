import type { Metadata } from 'next'
import { Playfair_Display, Raleway, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MAISON SERENIA | Mobilier de Luxe',
  description: "Découvrez notre collection exclusive de mobilier haut de gamme. MAISON SERENIA, l'art de vivre à la française.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${raleway.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
