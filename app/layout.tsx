import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Italiana, Cinzel } from 'next/font/google'
import './globals.css'
import { AnnouncementBar } from '@/components/ui/announcement-bar'
import { WelcomePopup } from '@/components/ui/welcome-popup'

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
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
  description: 'Découvrez MAISON SERENIA : fauteuils et canapés Bubble, figurines KAWS collectibles, accessoires design. Livraison offerte dès 80€.',
  keywords: ['mobilier luxe', 'fauteuil design', 'canapé Bubble', 'figurines KAWS', 'décoration intérieure', 'Maison Serenia'],
  openGraph: {
    title: 'Maison Serenia | Mobilier de Luxe & Design Contemporain',
    description: 'Fauteuils et canapés Bubble, figurines collectibles, accessoires design. Livraison offerte dès 80€.',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: 'https://i.ibb.co/xSV6MBVx/47-B09888-A4-A8-44-E7-A80-D-7-E1-D7-BDDF6-ED.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Maison Serenia | Mobilier de Luxe', description: 'Fauteuils Bubble, figurines KAWS et accessoires design livrés en France.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${italiana.variable} ${cinzel.variable}`}>
      <body>
        <AnnouncementBar>{children}</AnnouncementBar>
        <WelcomePopup />
      </body>
    </html>
  )
}
