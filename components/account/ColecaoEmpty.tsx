import Link from 'next/link'

export function ColecaoEmpty() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '64px 24px',
        border: '1px dashed var(--border-emph)',
        borderRadius: 'var(--r-xl)',
        textAlign: 'center',
        background: 'var(--surface)',
      }}
    >
      {/* Lanterna — ícone SVG pequeno */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {/* corpo da lanterna */}
        <rect x="16" y="18" width="16" height="10" rx="3" stroke="var(--accent)" strokeWidth="1.5" />
        {/* cabeça da lanterna */}
        <path
          d="M16 21 L12 25 L12 25 L16 28"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* raios de luz */}
        <line x1="10" y1="24" x2="7" y2="24" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9" y1="20" x2="7" y2="18" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9" y1="28" x2="7" y2="30" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        {/* botão */}
        <circle cx="28" cy="23" r="1.5" fill="var(--accent)" />
      </svg>

      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-d3)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 1.1,
          marginBottom: 8,
        }}>
          Sua coleção está esperando
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          lineHeight: 'var(--lh-relaxed)',
          maxWidth: '30ch',
          margin: '0 auto',
        }}>
          pelo primeiro artefato
        </p>
      </div>

      <Link
        href="/universo/darkalien"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 44,
          padding: '0 24px',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--accent-contrast)',
          background: 'var(--accent)',
          borderRadius: 'var(--r-pill)',
          textDecoration: 'none',
          transition: 'background var(--dur-base), transform var(--dur-fast)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-bright)'
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)'
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
        }}
      >
        Descobrir DarkAlien
      </Link>
    </div>
  )
}
