import { Universe } from '@/lib/content'
import { UniverseIcon } from '@/components/brand/UniverseIcon'
import type { UniverseIconName } from '@/components/brand/UniverseIcon'
import { TeaserEmailForm } from '@/components/forms/TeaserEmailForm'

interface Props {
  universe: Universe
}

export function TeaserHero({ universe }: Props) {
  const accent = universe.accent

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        '--universe-accent': accent,
      } as React.CSSProperties}
    >
      {/* Glow radial de fundo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${accent}1a 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Ícone desfocado — efeito "não revelado" */}
      <div
        aria-hidden
        style={{
          position: 'relative',
          marginBottom: 48,
          filter: 'blur(6px) grayscale(0.6)',
          opacity: 0.6,
          animation: 'aa-tease-pulse 3s ease-in-out infinite',
        }}
      >
        <UniverseIcon
          name={universe.icon as UniverseIconName}
          size={160}
          flameColor={accent}
          glow={false}
          animate={false}
        />
      </div>

      {/* Eyebrow */}
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tr-widest)',
        textTransform: 'uppercase',
        color: accent,
        margin: '0 0 12px',
      }}>
        Lote fechado · {universe.universe} · em preparação
      </p>

      {/* Título principal */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.4rem, 8vw, 5.5rem)',
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        color: 'var(--text-primary)',
        margin: '0 0 8px',
        textAlign: 'center',
      }}>
        {universe.name}
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-md)',
        color: 'var(--text-muted)',
        maxWidth: 480,
        textAlign: 'center',
        lineHeight: 1.6,
        margin: '0 0 48px',
      }}>
        {universe.blurb}
      </p>

      {/* Formulário de captura */}
      <TeaserEmailForm universe={universe.id} accentColor={accent} />

      {/* Linha decorativa abaixo */}
      <div style={{
        marginTop: 64,
        width: 1,
        height: 80,
        background: `linear-gradient(to bottom, ${accent}44, transparent)`,
      }} />

      <style>{`
        @keyframes aa-tease-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.04); opacity: 0.75; }
        }
      `}</style>
    </section>
  )
}
