import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Han Plaza - Обучающая платформа',
  description: 'Полнофункциональная обучающая платформа с системой авторизации, управлением категориями и видео для сотрудников Han Plaza',
  icons: {
    icon: [
      {
        url: '/images/logo.png',
        type: 'image/png',
      },
    ],
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Han Plaza',
    title: 'Han Plaza - Обучающая платформа',
    description: 'Полнофункциональная обучающая платформа с системой авторизации, управлением категориями и видео для сотрудников Han Plaza',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 1200,
        alt: 'Han Plaza - Мебельная сеть',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Han Plaza - Обучающая платформа',
    description: 'Полнофункциональная обучающая платформа с системой авторизации, управлением категориями и видео для сотрудников Han Plaza',
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
