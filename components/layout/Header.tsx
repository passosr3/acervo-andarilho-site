'use client'

import { useState, useEffect, CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { MobileMenu } from './MobileMenu'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Universos', href: '/universos' },
]

interface NavLinkProps {
  href: string
  label: string
  pathname: string
  onClick?: () => void
}

function NavLink({ href, label, pathname, onClick }: NavLinkProps) {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  const style: CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--fw-medium)',
    letterSpacing: 'var(--tr-wider)',
    textTransform: 'uppercase',
    color: isActive ? 'var(--aa-green)' : 'var(--text-soft)',
    textShadow: isActive ? 'var(--text-glow-soft)' : 'none',
    textDecoration: 'none',
    padding: '4px 0',
    borderBottom: isActive ? '1.5px solid var(--aa-green)' : '1.5px solid transparent',
    transition: 'color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), text-shadow var(--dur-base)',
  }

  return (
    <Link href={href} style={style} onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-soft)'
        }
      }}
    >
      {label}
    </Link>
  )
}

function AccountButton() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const isLoggedIn = user !== null
  const [hover, setHover] = useState(false)
  const [logoutHover, setLogoutHover] = useState(false)

  const linkStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 40,
    padding: '0 16px',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: hover ? 'var(--aa-green)' : 'var(--text-soft)',
    background: hover ? 'var(--green-ghost)' : 'transparent',
    border: `1.5px solid ${hover ? 'var(--green-line)' : 'var(--border)'}`,
    borderRadius: 'var(--r-pill)',
    textDecoration: 'none',
    transition: 'color var(--dur-base), background var(--dur-base), border-color var(--dur-base)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }

  const avatarIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/account"
          style={linkStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {avatarIcon}
          <span>Minha Conta</span>
        </Link>
        <button
          onClick={() => { logout(); router.push('/') }}
          aria-label="Sair da conta"
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: 40,
            background: 'transparent',
            border: `1.5px solid ${logoutHover ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--r-pill)',
            color: logoutHover ? 'var(--danger)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color var(--dur-base), border-color var(--dur-base)',
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/auth/login"
      style={linkStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {avatarIcon}
      <span>Minha Conta</span>
    </Link>
  )
}

// Pages with light/white backgrounds need an opaque dark header from the start
// so the logo (light-colored) remains visible before the user scrolls.
const LIGHT_BG_ROUTES = ['/', '/universos', '/auth', '/account', '/purchases', '/admin']

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isLightPage = LIGHT_BG_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const solidBg = 'rgba(13, 15, 16, 0.92)'
  const headerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 'var(--z-sticky)' as unknown as number,
    height: 68,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: (scrolled || isLightPage) ? solidBg : 'transparent',
    backdropFilter: (scrolled || isLightPage) ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: (scrolled || isLightPage) ? 'blur(14px)' : 'none',
    borderBottom: (scrolled || isLightPage) ? '1px solid rgba(42, 47, 48, 0.6)' : '1px solid transparent',
    transition: 'background-color var(--dur-slow) var(--ease-out), backdrop-filter var(--dur-slow), border-color var(--dur-slow)',
  }

  const innerStyle: CSSProperties = {
    width: '100%',
    maxWidth: 'var(--content-max)',
    margin: '0 auto',
    padding: '0 var(--gutter)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  }

  return (
    <>
      <header style={headerStyle} role="banner">
        <div style={innerStyle}>
          {/* Logo */}
          <Link href="/" aria-label="Acervo Andarilho — Página inicial" style={{ display: 'flex', alignItems: 'center', lineHeight: 0, flexShrink: 0 }}>
            <BrandLogo width={160} animate glow />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Navegação principal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              // Hidden on mobile via inline-style — controlled by MQ in a style tag below
            }}
            className="header-desktop-nav"
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="header-desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AccountButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="header-mobile-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'none', // shown via CSS below
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 8,
              borderRadius: 'var(--r-sm)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {menuOpen ? (
              // X icon
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              // Hamburger icon
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Responsive display switching */}
      <style>{`
        @media (max-width: 767px) {
          .header-desktop-nav,
          .header-desktop-cta { display: none !important; }
          .header-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 768px) {
          .header-mobile-toggle { display: none !important; }
          .header-desktop-nav { display: flex !important; }
          .header-desktop-cta { display: flex !important; }
        }
      `}</style>

      {/* Mobile drawer */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={NAV_LINKS}
        pathname={pathname}
      />
    </>
  )
}
