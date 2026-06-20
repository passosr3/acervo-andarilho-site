import type { Metadata } from 'next'
import Link from 'next/link'
import { AA_UNIVERSES } from '@/lib/content'
import { UniverseIcon } from '@/components/brand/UniverseIcon'
import type { UniverseIconName } from '@/components/brand/UniverseIcon'

export const metadata: Metadata = {
  title: 'Universos — Acervo Andarilho',
  description: 'Todos os universos do Acervo Andarilho. Peças numeradas, tiragem fechada, montadas à mão.',
  alternates: { canonical: '/universos' },
}

export default function UniversosPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: 'clamp(100px, 15vw, 160px)',
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: 'center',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 16,
          }}
        >
          O Acervo
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 10vw, 88px)',
            lineHeight: 0.9,
            color: 'var(--text-primary)',
            marginBottom: 24,
          }}
        >
          Universos coletados
        </h1>
        <p
          style={{
            color: 'var(--text-soft)',
            fontSize: 'var(--text-lg)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Cada universo é uma travessia. Cada peça, uma prova de que aquele mundo existe.
        </p>
      </section>

      {/* Grid */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px 120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {AA_UNIVERSES.map((u) => {
          const isAtivo = u.status === 'ativo'
          return (
            <Link
              key={u.id}
              href={`/universo/${u.id}`}
              style={{
                display: 'block',
                background: 'var(--surface)',
                border: `1px solid var(--border)`,
                borderRadius: 16,
                padding: 32,
                textDecoration: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow accent */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${u.accent}14 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Status badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-data)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isAtivo ? u.accent : 'var(--text-mute)',
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isAtivo ? u.accent : 'var(--text-mute)',
                    display: 'inline-block',
                  }}
                />
                {isAtivo ? 'Disponível' : 'Em breve'}
              </div>

              {/* Icon */}
              <UniverseIcon
                name={u.icon as UniverseIconName}
                size={72}
                flameColor={u.accent}
                animate={isAtivo}
                glow={isAtivo}
                style={{ marginBottom: 24 }}
              />

              {/* Universe label */}
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: u.accent,
                  marginBottom: 8,
                }}
              >
                {u.universe}
              </p>

              {/* Name */}
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  lineHeight: 0.95,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                {u.name}
              </h2>

              {/* Tagline */}
              <p
                style={{
                  color: 'var(--text-soft)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                  marginBottom: 24,
                }}
              >
                {u.tagline}
              </p>

              {/* Price / edition */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border)',
                  paddingTop: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-mute)',
                  }}
                >
                  {u.edition}
                </span>
                {u.priceFrom && (
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      color: 'var(--text-primary)',
                    }}
                  >
                    R$ {u.priceFrom.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </section>
    </>
  )
}
