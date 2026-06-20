'use client'

interface CTALinkProps {
  href: string
  accent: string
  label?: string
}

export function CTALink({ href, accent, label = 'Ver a LP Completa →' }: CTALinkProps) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        minWidth: 220,
        padding: '0 36px',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-md)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: accent,
        color: '#06140d',
        borderRadius: 'var(--r-pill)',
        textDecoration: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 28px ${accent}44`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {label}
    </a>
  )
}
