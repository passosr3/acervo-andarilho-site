import type { Metadata } from 'next'
import { Teko, Oxanium } from 'next/font/google'
import './globals.css'

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
  openGraph: {
    title: 'Acervo Andarilho',
    description: 'Artefatos únicos de universos que você ama',
    siteName: 'Acervo Andarilho',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`h-full ${teko.variable} ${oxanium.variable}`}
      style={{
        // Wire Google Font variables into the DS font tokens
        ['--font-display' as string]: 'var(--font-teko), Oxanium, sans-serif',
        ['--font-ui' as string]: 'var(--font-oxanium), system-ui, sans-serif',
        ['--font-body' as string]: 'var(--font-oxanium), system-ui, sans-serif',
        ['--font-data' as string]: 'var(--font-oxanium), system-ui, sans-serif',
      }}
    >
      <body className="min-h-full bg-[var(--abyss)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  )
}
