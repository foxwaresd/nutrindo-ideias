import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    default: 'Nutrindo Ideias',
    template: '%s | Nutrindo Ideias',
  },
  description: 'Blog de nutrição por Evelyn Camargo. Dicas práticas, receitas saudáveis e conhecimento nutricional para uma vida mais equilibrada.',
  keywords: ['nutrição', 'blog de nutrição', 'Evelyn Camargo', 'alimentação saudável', 'receitas saudáveis', 'nutricionista', 'saúde', 'bem-estar'],
  authors: [{ name: 'Evelyn Camargo' }],
  creator: 'Evelyn Camargo',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Nutrindo Ideias',
    title: 'Nutrindo Ideias — Nutrição por Evelyn Camargo',
    description: 'Dicas práticas, receitas saudáveis e conhecimento nutricional por Evelyn Camargo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrindo Ideias — Nutrição por Evelyn Camargo',
    description: 'Dicas práticas, receitas saudáveis e conhecimento nutricional por Evelyn Camargo.',
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
        <AuthProvider>
          <PublicLayout>{children}</PublicLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
