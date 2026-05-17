import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import PublicLayout from '@/components/PublicLayout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ciências da Nutrição',
    template: '%s | Ciências da Nutrição',
  },
  description: 'Blog sobre nutrição baseado em ciência. Dicas práticas e conhecimento nutricional para uma alimentação saudável e equilibrada.',
  keywords: ['nutrição', 'ciências da nutrição', 'alimentação saudável', 'receitas saudáveis', 'nutricionista', 'saúde', 'bem-estar'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ciências da Nutrição',
    title: 'Ciências da Nutrição',
    description: 'Blog sobre nutrição baseado em ciência. Dicas práticas e conhecimento nutricional para uma alimentação saudável.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ciências da Nutrição',
    description: 'Blog sobre nutrição baseado em ciência. Dicas práticas e conhecimento nutricional para uma alimentação saudável.',
  },
  other: {
    'google-adsense-account': 'ca-pub-3506193444513548',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3506193444513548"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <PublicLayout>{children}</PublicLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
