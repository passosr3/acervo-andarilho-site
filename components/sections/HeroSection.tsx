'use client'

import Link from 'next/link'
import { Lantern } from '@/components/brand/Lantern'
import { Button } from '@/components/ui/Button'
import { AA_PAGE } from '@/lib/content'

// Arrow glyph inline para não depender de asset externo
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      aria-label="Hero — Acervo Andarilho"
      style={{
        position: 'relative',
        background: 'var(--paper)',
        padding: '128px clamp(20px,4vw,56px) clamp(60px,8vh,96px)',
        overflow: 'hidden',
      }}
    >
      {/* Aurora background — radial gradient animado */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(3,255,136,0.13) 0%, rgba(3,255,136,0.04) 38%, transparent 70%)',
          pointerEvents: 'none',
        }}
        className="aa-hero-aurora"
      />

      {/* Embers — partículas SVG subindo */}
      <div aria-hidden="true" className="aa-embers" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="aa-ember"
            style={{
              left: `${15 + i * 10}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Grid: texto + lanterna */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
        }}
        className="aa-hero-grid"
      >
        {/* Coluna de texto */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green-deep)',
              marginBottom: 18,
            }}
          >
            {AA_PAGE.heroEyebrow}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              lineHeight: 0.88,
              letterSpacing: '0.005em',
              color: 'var(--ink-text)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {AA_PAGE.heroTitleLine1}
            <br />
            {AA_PAGE.heroTitleLine2}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--ink-text-soft)',
              lineHeight: 1.6,
              maxWidth: 460,
              marginTop: 22,
            }}
          >
            {AA_PAGE.heroDescription}
          </p>
          <div
            style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}
          >
            <Button
              variant="dark"
              size="lg"
              iconRight={<ArrowRight />}
              onClick={() => scrollTo('universos')}
            >
              Explorar o Acervo
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => scrollTo('lore')}
              style={{ color: 'var(--ink-text)', borderColor: 'var(--paper-border)' }}
            >
              Conhecer a Lore
            </Button>
          </div>
        </div>

        {/* Coluna da lanterna */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 360,
          }}
          className="aa-hero-lantern"
        >
          {/* Blob verde atrás da lanterna */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(3,255,136,0.18) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <Lantern
            size={280}
            animate
            glow
            structureColor="var(--ink-text)"
            style={{ position: 'relative', zIndex: 2 }}
          />
        </div>
      </div>

      {/* Responsive + animações */}
      <style>{`
        @media (max-width: 767px) {
          .aa-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .aa-hero-lantern {
            min-height: 220px !important;
          }
        }

        /* Aurora pulse */
        @keyframes aa-aurora-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .aa-hero-aurora {
            animation: aa-aurora-pulse 6s ease-in-out infinite;
          }
        }

        /* Embers */
        .aa-ember {
          position: absolute;
          bottom: -8px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green), 0 0 12px rgba(3,255,136,0.5);
          opacity: 0;
        }
        @keyframes aa-ember-rise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          15%  { opacity: 0.9; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-480px) scale(0.3) translateX(20px); opacity: 0; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .aa-ember {
            animation: aa-ember-rise linear infinite;
          }
        }
      `}</style>
    </section>
  )
}
