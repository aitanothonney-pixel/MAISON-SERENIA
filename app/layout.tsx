import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Italiana, Cinzel, Jost } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { AnnouncementBar } from '@/components/ui/announcement-bar'
import { WelcomePopup } from '@/components/ui/welcome-popup'
import { BrevoTracker } from '@/components/ui/brevo-tracker'
import { CurrencyProvider, type Currency } from '@/lib/currency'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
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
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${italiana.variable} ${cinzel.variable} ${jost.variable}`}>
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
        <CurrencyProvider value={currency}>
          <AnnouncementBar>{children}</AnnouncementBar>
          <WelcomePopup />
        </CurrencyProvider>
        <BrevoTracker />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
