import { AA_PAGE } from '@/lib/content'

function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#06140d" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function CriadorSection() {
  return (
    <section
      id="criador"
      aria-label="O Criador"
      style={{
        background: 'var(--paper-sunken)',
        padding: 'var(--section-y) clamp(20px,4vw,56px)',
      }}
    >
      <div
        className="aa-creator-grid"
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {/* Video placeholder */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            borderRadius: 22,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--ink), var(--void))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background blob */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -70,
              right: -40,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(3,255,136,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Grid texture overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.35,
            }}
          />
          {/* Play button area */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <button
              type="button"
              aria-label="Reproduzir vídeo da bancada"
              disabled
              style={{
                width: 78,
                height: 78,
                borderRadius: '50%',
                background: 'var(--green)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                boxShadow: '0 0 0 10px rgba(3,255,136,0.12)',
                opacity: 0.85,
              }}
            >
              <PlayIcon />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                }}
              >
                Vídeo · Apresentação
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-mute)',
                  letterSpacing: '0.06em',
                  marginTop: 4,
                }}
              >
                {AA_PAGE.creatorVideoOverlay}
              </div>
            </div>
          </div>
          {/* Badge — top left */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 3,
              fontFamily: 'var(--font-data)',
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              border: '1px solid var(--accent-line)',
              padding: '5px 11px',
              borderRadius: 'var(--r-pill)',
            }}
          >
            Bancada · 2026
          </div>
        </div>

        {/* Text column */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green-deep)',
              marginBottom: 12,
            }}
          >
            {AA_PAGE.criadorEyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-d2)',
              color: 'var(--ink-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            {AA_PAGE.creatorName}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-md)',
              color: 'var(--ink-text-soft)',
              lineHeight: 1.7,
              marginTop: 18,
              maxWidth: 540,
            }}
          >
            {AA_PAGE.creatorBody}
          </p>
          <blockquote
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--ink-text)',
              lineHeight: 1.5,
              marginTop: 16,
              maxWidth: 540,
              fontStyle: 'italic',
              borderLeft: '3px solid var(--green)',
              paddingLeft: 20,
              marginLeft: 0,
            }}
          >
            &ldquo;{AA_PAGE.creatorQuote}&rdquo;
          </blockquote>

          {/* Stat blocks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginTop: 30,
              maxWidth: 460,
            }}
          >
            <div
              style={{
                background: 'var(--green)',
                borderRadius: 18,
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 52,
                  color: '#06140d',
                  lineHeight: 0.85,
                }}
              >
                +30
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(6,20,13,0.7)',
                  marginTop: 8,
                }}
              >
                peças seladas
              </div>
            </div>
            <div
              style={{
                background: 'var(--ink)',
                borderRadius: 18,
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 52,
                  color: 'var(--accent)',
                  lineHeight: 0.85,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginTop: 8,
                }}
              >
                feito à mão
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          .aa-creator-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
