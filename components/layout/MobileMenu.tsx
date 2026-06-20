'use client'

import { useEffect, useRef, CSSProperties } from 'react'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'

interface NavLink {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavLink[]
  pathname: string
}

export function MobileMenu({ isOpen, onClose, navLinks, pathname }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Trap focus and prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 'calc(var(--z-sticky) + 1)' as unknown as number,
    backgroundColor: 'rgba(7, 9, 10, 0.72)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const drawerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 'calc(var(--z-sticky) + 2)' as unknown as number,
    backgroundColor: 'var(--ink)',
    borderBottom: '1px solid var(--border)',
    padding: '0 var(--gutter) 32px',
    transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
  }

  const navItemStyle = (isActive: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    height: 56,
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(26px, 5vw, 32px)',
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: 'var(--tr-wide)',
    textTransform: 'uppercase',
    color: isActive ? 'var(--aa-green)' : 'var(--text)',
    textShadow: isActive ? 'var(--text-glow-soft)' : 'none',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border)',
    transition: 'color var(--dur-base) var(--ease-out)',
  })

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        style={overlayStyle}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        style={drawerStyle}
      >
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
        }}>
          <Link href="/" onClick={onClose} aria-label="Acervo Andarilho — Página inicial" style={{ display: 'flex', lineHeight: 0 }}>
            <BrandLogo width={140} />
          </Link>

          <button
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-soft)',
              padding: 8,
              borderRadius: 'var(--r-sm)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav aria-label="Navegação mobile">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                style={navItemStyle(isActive)}
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Minha Conta */}
          <Link
            href="/auth/login"
            style={{ ...navItemStyle(false), borderBottom: 'none', marginTop: 8 }}
            onClick={onClose}
          >
            Minha Conta
          </Link>
        </nav>
      </div>

      {/* Respect prefers-reduced-motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #mobile-menu,
          #mobile-menu ~ * {
            transition: opacity 140ms linear !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  )
}
