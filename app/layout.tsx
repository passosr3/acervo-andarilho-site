import type { Metadata } from 'next'
import { Teko, Oxanium } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { UmamiScript } from '@/components/analytics/UmamiScript'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

const teko = Teko({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-teko',
  display: 'swap',
})

const oxanium = Oxanium({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oxanium',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Acervo Andarilho — Artefatos de Universos Infinitos',
  description:
    'Colecionáveis artesanais numerados inspirados em universos de ficção. Cada peça, uma relíquia.',
  metadataBase: new URL('https://acervoandarilho.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Acervo Andarilho',
    description: 'Artefatos únicos de universos que você ama',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    siteName: 'Acervo Andarilho',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://acervoandarilho.com.br',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? '/'
  const isAuthRoute = pathname.startsWith('/auth')
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html
      lang="pt-BR"
      className={`h-full ${teko.variable} ${oxanium.variable}`}
      style={{
        ['--font-display' as string]: 'var(--font-teko), Oxanium, sans-serif',
        ['--font-ui' as string]: 'var(--font-oxanium), system-ui, sans-serif',
        ['--font-body' as string]: 'var(--font-oxanium), system-ui, sans-serif',
        ['--font-data' as string]: 'var(--font-oxanium), system-ui, sans-serif',
      }}
    >
      <body className="min-h-full bg-[var(--abyss)] text-[var(--text)] antialiased">
        <AuthProvider>
          {!isAuthRoute && !isAdminRoute && <Header />}
          <main>{children}</main>
          {!isAuthRoute && !isAdminRoute && <Footer />}
          <UmamiScript />
        </AuthProvider>
      </body>
    </html>
  )
}
