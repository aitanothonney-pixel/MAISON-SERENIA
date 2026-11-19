import type { Metadata } from 'next'
import { Marcellus, IBM_Plex_Mono, Jost } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { AnnouncementBar } from '@/components/ui/announcement-bar'
import { WelcomePopup } from '@/components/ui/welcome-popup'
import { MotionProvider } from '@/components/ui/motion-provider'
import { CookieConsent } from '@/components/ui/cookie-consent'
import { SiteFooter } from '@/components/ui/site-footer'
import { CurrencyProvider, type Currency } from '@/lib/currency'

// Titres : Marcellus. Texte : Jost. Cotes et libellés : IBM Plex Mono.
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maison-serenia.com'),
  title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
  description: 'Découvrez MAISON SERENIA : canapés, fauteuils, tables, luminaires, tableaux d\'art et décoration design. Livraison offerte dès 40 CHF.',
  keywords: ['mobilier luxe', 'fauteuil design', 'canapé design', 'table basse', 'luminaire design', 'tableau abstrait', 'décoration intérieure', 'Maison Serenia'],
  openGraph: {
    title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
    description: 'Canapés, fauteuils, tables, luminaires, tableaux d\'art et décoration design. Livraison offerte dès 40 CHF.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: '/catalog/WW4mTJDL.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Maison Serenia | Mobilier de Luxe', description: 'Canapés, fauteuils, tables, luminaires, tableaux d\'art et décoration design.', images: ['/catalog/WW4mTJDL.png'] },
  robots: { index: true, follow: true },
  icons: {
    icon: '/catalog/Gf8GN24S.jpg',
    shortcut: '/catalog/Gf8GN24S.jpg',
    apple: '/catalog/Gf8GN24S.jpg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const currency: Currency = cookieStore.get('mss-currency')?.value === 'CHF' ? 'CHF' : 'EUR';
  return (
    <html lang="fr" className={`${marcellus.variable} ${plexMono.variable} ${jost.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Maison Serenia',
              url: 'https://maison-serenia.com',
              logo: 'https://maison-serenia.com/catalog/WW4mTJDL.png',
              image: 'https://maison-serenia.com/catalog/WW4mTJDL.png',
              email: 'maisonserenia@gmail.com',
              description: 'Mobilier de luxe et design contemporain : canapés, fauteuils, tables, luminaires, tableaux d\'art et décoration.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Genève',
                addressCountry: 'CH',
              },
              sameAs: [
                'https://www.instagram.com/serenia_officiel',
                'https://www.tiktok.com/@serenia_officiel',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Maison Serenia',
              url: 'https://maison-serenia.com',
              inLanguage: 'fr-CH',
            }),
          }}
        />
        <MotionProvider>
        <CurrencyProvider value={currency}>
          <AnnouncementBar>
            {children}
            <SiteFooter />
          </AnnouncementBar>
          <WelcomePopup />
          <CookieConsent />
        </CurrencyProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
