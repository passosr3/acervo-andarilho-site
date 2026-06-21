'use client'

import Link from 'next/link'

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ClosingCTA() {
  const handleScroll = () => {
    const el = document.getElementById('universos')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      aria-label="Entre no acervo"
      style={{
        background: 'var(--paper)',
        padding: '0 clamp(20px,4vw,56px) clamp(56px,7vh,88px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          background: 'var(--green)',
          borderRadius: 28,
          padding: 'clamp(40px,6vw,72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        {/* Background blob */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,20,13,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-d1)',
              color: '#06140d',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            Entre no acervo
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-md)',
              color: 'rgba(6,20,13,0.72)',
              marginTop: 10,
              maxWidth: 420,
              marginBottom: 0,
            }}
          >
            Acompanhe suas peças, números de série e os próximos universos antes de todos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleScroll}
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            height: 56,
            minWidth: 200,
            padding: '0 36px',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            borderRadius: 'var(--r-pill)',
            cursor: 'pointer',
            border: 'none',
            background: '#06140d',
            color: 'var(--green)',
            flexShrink: 0,
          }}
        >
          <span>Explorar agora</span>
          <ArrowRight />
        </button>
      </div>
    </section>
  )
}
