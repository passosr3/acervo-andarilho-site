'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AA_UNIVERSES, AA_PAGE } from '@/lib/content'
import { UniverseIcon } from '@/components/brand/UniverseIcon'
import type { UniverseIconName } from '@/components/brand/UniverseIcon'
import type { Universe } from '@/lib/content'

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UniverseCard({ u }: { u: Universe }) {
  const [hover, setHover] = useState(false)
  const isAtivo = u.status === 'ativo'

  const href = isAtivo
    ? (u.landingUrl ?? `/universo/${u.id}`)
    : `/universo/${u.id}`

  return (
    <Link
      href={href}
      target={isAtivo && u.landingUrl ? '_blank' : undefined}
      rel={isAtivo && u.landingUrl ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper-raised)',
        borderRadius: 20,
        overflow: 'hidden',
        border: `1.5px solid ${isAtivo ? 'var(--green-deep)' : 'var(--paper-border)'}`,
        textDecoration: 'none',
        transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover ? '0 18px 44px rgba(0,0,0,0.12)' : '0 1px 0 rgba(0,0,0,0.03)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}
    >
      {/* Card header / thumb */}
      <div
        style={{
          position: 'relative',
          background: isAtivo ? 'var(--green)' : 'var(--paper-sunken)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 160,
          overflow: 'hidden',
        }}
      >
        {/* Blob accent */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: isAtivo
              ? 'radial-gradient(ellipse 90% 90% at 50% 60%, rgba(3,255,136,0.22) 0%, transparent 70%)'
              : `radial-gradient(ellipse 90% 90% at 50% 60%, ${u.accent}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <UniverseIcon
          name={u.icon as UniverseIconName}
          size={72}
          flameColor={isAtivo ? '#06140d' : u.accent}
          structureColor={isAtivo ? '#06140d' : 'var(--ink-text-mute)'}
          animate={isAtivo}
          glow={isAtivo}
          style={{
            position: 'relative',
            zIndex: 2,
            transform: hover ? 'scale(1.06) rotate(-2deg)' : 'none',
            transition: 'transform var(--dur-slow) var(--ease-out)',
          }}
        />
        {/* Status badge — top left */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 3,
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isAtivo ? '#06140d' : 'var(--ink-text-mute)',
            background: isAtivo ? 'rgba(6,20,13,0.16)' : 'var(--paper)',
            padding: '5px 10px',
            borderRadius: 'var(--r-pill)',
          }}
        >
          {isAtivo ? '● Disponível' : 'Em breve'}
        </div>
      </div>

      {/* Card body */}
      <div
        style={{
          padding: '20px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink-text-mute)',
          }}
        >
          {u.universe}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            color: 'var(--ink-text)',
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: '6px 0 0',
          }}
        >
          {u.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-text-soft)',
            lineHeight: 1.55,
            marginTop: 8,
            flex: 1,
          }}
        >
          {u.tagline}
        </p>

        {/* Footer: price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                color: 'var(--ink-text-mute)',
                letterSpacing: '0.05em',
              }}
            >
              {u.edition}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                color: isAtivo ? 'var(--green-deep)' : 'var(--ink-text-mute)',
                lineHeight: 1.1,
              }}
            >
              {isAtivo && u.priceFrom
                ? `R$ ${u.priceFrom.toLocaleString('pt-BR')}`
                : '—'}
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 38,
              padding: '0 16px',
              cursor: 'pointer',
              background: isAtivo ? 'var(--ink-text)' : 'transparent',
              color: isAtivo ? 'var(--paper)' : 'var(--ink-text)',
              border: isAtivo ? 'none' : '1.5px solid var(--ink-text)',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {isAtivo ? <>Acessar <ArrowRight /></> : 'Entrar na fila'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function UniversosGrid() {
  return (
    <section
      id="universos"
      aria-label="Universos do Acervo Andarilho"
      style={{
        background: 'var(--paper)',
        padding: 'var(--section-y) clamp(20px,4vw,56px)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div
          className="aa-universos-header"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 38,
          }}
        >
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
              {AA_PAGE.universosEyebrow}
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
              {AA_PAGE.universosTitle}
            </h2>
          </div>
          <Link
            href="/universos"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-text-soft)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              borderBottom: '1px solid var(--paper-border)',
              paddingBottom: 2,
            }}
          >
            Acervo completo →
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(252px, 1fr))',
            gap: 18,
          }}
        >
          {AA_UNIVERSES.map((u) => (
            <UniverseCard key={u.id} u={u} />
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .aa-universos-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  )
}
