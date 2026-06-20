import { AA_PAGE } from '@/lib/content'

export function LoreSection() {
  return (
    <section
      id="lore"
      aria-label="A Lore do Andarilho"
      style={{
        position: 'relative',
        background: 'var(--void)',
        color: 'var(--text)',
        padding: 'var(--section-y) clamp(20px,4vw,56px)',
        overflow: 'hidden',
      }}
    >
      {/* Blob lateral esquerdo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(3,255,136,0.14) 0%, transparent 70%)',
          top: '50%',
          left: -100,
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 820,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          {AA_PAGE.loreEyebrow}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-d1)',
            color: 'var(--text)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 0.98,
            marginTop: 12,
            whiteSpace: 'pre-line',
          }}
        >
          {AA_PAGE.loreTitle}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-lg)',
            color: 'var(--text-soft)',
            lineHeight: 1.7,
            maxWidth: 640,
            margin: '20px auto 0',
          }}
        >
          {AA_PAGE.loreBody}
        </p>
      </div>
    </section>
  )
}
