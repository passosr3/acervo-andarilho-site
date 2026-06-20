'use client'

import { CSSProperties } from 'react'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'

const FOOTER_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/acervoandarilho',
    external: true,
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  const footerStyle: CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--void)',
    borderTop: '1px solid var(--border)',
    padding: 'clamp(48px, 8vw, 80px) var(--gutter) clamp(32px, 5vw, 48px)',
  }

  const innerStyle: CSSProperties = {
    maxWidth: 'var(--content-max)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
  }

  const linkStyle: CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--fw-medium)',
    letterSpacing: 'var(--tr-wider)',
    textTransform: 'uppercase',
    color: 'var(--text-mute)',
    textDecoration: 'none',
    transition: 'color var(--dur-base) var(--ease-out)',
  }

  const copyrightStyle: CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-xs)',
    letterSpacing: '0.06em',
    color: 'var(--text-faint)',
    textAlign: 'center',
  }

  return (
    <footer style={footerStyle} role="contentinfo">
      <div style={innerStyle}>
        {/* Logo */}
        <Link href="/" aria-label="Acervo Andarilho — Página inicial" style={{ display: 'flex', lineHeight: 0 }}>
          <BrandLogo width={180} animate glow />
        </Link>

        {/* Links */}
        <nav
          aria-label="Links do rodapé"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px 24px',
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.href} {...link} linkStyle={linkStyle} />
          ))}

          {/* Tagline link (non-navigational — decorative) */}
          <span style={{ ...linkStyle, cursor: 'default' }}>
            Feito com obsessão
          </span>
        </nav>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: 1,
          background: 'var(--border)',
          opacity: 0.5,
        }} />

        {/* Copyright */}
        <p style={copyrightStyle}>
          &copy; {year} Acervo Andarilho. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  label: string
  external?: boolean
  linkStyle: CSSProperties
}

function FooterLink({ href, label, external = false, linkStyle }: FooterLinkProps) {
  const props = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link
      href={href}
      style={linkStyle}
      {...props}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-soft)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-mute)'
      }}
    >
      {label}
    </Link>
  )
}
