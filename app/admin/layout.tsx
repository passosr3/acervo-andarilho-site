import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Acervo Andarilho',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'admin@acervoandarilho.com.br'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Visão Geral',
    icon: 'M3 12h7V3H3v9Zm0 8h7v-6H3v6Zm11 0h7V11h-7v9Zm0-17v6h7V3h-7Z',
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: 'M6 2l1.5 3M18 2l-1.5 3M3 6h18l-1.5 12.5A2 2 0 0 1 17.5 20h-11A2 2 0 0 1 4.5 18.5L3 6Z',
  },
  {
    href: '/admin/universos',
    label: 'Universos',
    icon: 'M3 7l9-4 9 4-9 4-9-4Zm0 5l9 4 9-4M3 17l9 4 9-4',
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const pbAuthCookie = cookieStore.get('pb_auth')

  let isAdmin = false

  if (pbAuthCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(pbAuthCookie.value))
      const email = parsed?.record?.email ?? ''
      const token = parsed?.token ?? ''
      isAdmin = email === ADMIN_EMAIL && typeof token === 'string' && token.length > 0
    } catch {
      isAdmin = false
    }
  }

  if (!isAdmin) {
    redirect('/auth/login?redirect=/admin')
  }

  return (
    <div className="aa-paper" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--paper-sunken)',
        borderRight: '1px solid var(--paper-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo / brand */}
        <div style={{ paddingBottom: 24, marginBottom: 8, borderBottom: '1px solid var(--paper-border)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--ink-text)',
              lineHeight: 1,
            }}>
              Acervo<br />
              <span style={{ color: 'var(--green-deep)' }}>Andarilho</span>
            </span>
          </Link>
          <p style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-text-mute)',
            marginTop: 6,
          }}>
            Painel Admin
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ink-text-soft)',
                transition: 'all var(--dur-base)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{
          borderTop: '1px solid var(--paper-border)',
          paddingTop: 16,
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: '#06140d',
            flexShrink: 0,
          }}>
            R
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink-text)', lineHeight: 1.3 }}>
              Ronaldo Passos
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-text-mute)' }}>
              administrador
            </div>
          </div>
          <a
            href="/auth/login"
            title="Sair"
            style={{ color: 'var(--ink-text-mute)', display: 'flex', textDecoration: 'none', flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, padding: 'clamp(24px, 3vw, 40px)', background: 'var(--paper)' }}>
        {children}
      </main>
    </div>
  )
}
