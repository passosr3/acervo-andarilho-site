import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acervo Andarilho — Conta',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'var(--abyss)',
      }}
    >
      <Link
        href="/"
        aria-label="Acervo Andarilho — Voltar para home"
        style={{ display: 'flex', marginBottom: 48, lineHeight: 0, flexShrink: 0 }}
      >
        <Image
          src="/images/brand/logo-horizontal-branca.svg"
          alt="Acervo Andarilho"
          width={160}
          height={40}
          priority
        />
      </Link>
      {children}
    </div>
  )
}
