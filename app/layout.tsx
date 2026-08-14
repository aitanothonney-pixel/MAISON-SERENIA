import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Italiana, Cinzel } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { AnnouncementBar } from '@/components/ui/announcement-bar'
import { WelcomePopup } from '@/components/ui/welcome-popup'
import { CurrencyProvider, type Currency } from '@/lib/currency'

const playfair = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maison-serenia.com'),
  title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
  description: 'Découvrez MAISON SERENIA : fauteuils et canapés Bubble, figurines KAWS collectibles, accessoires design. Livraison offerte dès 40€.',
  keywords: ['mobilier luxe', 'fauteuil design', 'canapé Bubble', 'figurines KAWS', 'décoration intérieure', 'Maison Serenia'],
  openGraph: {
    title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
    description: 'Fauteuils et canapés Bubble, figurines collectibles, accessoires design. Livraison offerte dès 40€.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: 'https://i.ibb.co/SDWTh9Xy/49-EA93-CC-D55-A-4-E02-90-F6-81-AFD9-AC86-D8.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Maison Serenia | Mobilier de Luxe', description: 'Fauteuils Bubble, figurines KAWS et accessoires design livrés en France.', images: ['https://i.ibb.co/SDWTh9Xy/49-EA93-CC-D55-A-4-E02-90-F6-81-AFD9-AC86-D8.jpg'] },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const currency: Currency = cookieStore.get('mss-currency')?.value === 'CHF' ? 'CHF' : 'EUR';
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${italiana.variable} ${cinzel.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Maison Serenia',
              url: 'https://maison-serenia.com',
              logo: 'https://i.ibb.co/SDWTh9Xy/49-EA93-CC-D55-A-4-E02-90-F6-81-AFD9-AC86-D8.jpg',
              image: 'https://i.ibb.co/SDWTh9Xy/49-EA93-CC-D55-A-4-E02-90-F6-81-AFD9-AC86-D8.jpg',
              email: 'maisonserenia@gmail.com',
              description: 'Mobilier de luxe et design contemporain : canapés et fauteuils Bubble, tables, pièces de collection et décoration.',
            }),
          }}
        />
        <CurrencyProvider value={currency}>
          <AnnouncementBar>{children}</AnnouncementBar>
          <WelcomePopup />
        </CurrencyProvider>
      </body>
    </html>
  )
}
