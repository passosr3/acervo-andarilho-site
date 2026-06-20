import { CSSProperties } from 'react'
import { Lantern } from './Lantern'

interface EditionSealProps {
  number?: number
  total?: number
  label?: string
  size?: number
  animate?: boolean
  className?: string
  style?: CSSProperties
}

/** Numbered authenticity certificate for a controlled edition run. */
export function EditionSeal({
  number = 14,
  total = 50,
  label = 'Edição Limitada',
  size = 132,
  animate = true,
  className = '',
  style = {},
}: EditionSealProps) {
  const pad = (n: number) => String(n).padStart(String(total).length, '0')
  const W = size

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: W,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: W * 0.04,
        padding: `${W * 0.13}px ${W * 0.1}px ${W * 0.11}px`,
        borderRadius: W * 0.11,
        background: 'radial-gradient(120% 70% at 50% 0%, rgba(3,255,136,0.16), transparent 60%), linear-gradient(180deg, #15211b 0%, #0b0e0f 72%)',
        border: '1px solid rgba(3,255,136,0.30)',
        boxShadow: '0 10px 26px rgba(0,0,0,0.34)',
        textAlign: 'center',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: W * 0.05,
          borderRadius: W * 0.08,
          border: '1px dashed rgba(3,255,136,0.22)',
          pointerEvents: 'none',
        }}
      />

      <Lantern size={W * 0.3} animate={animate} flameColor="var(--green)" structureColor="var(--text)" />

      <div style={{
        fontFamily: 'var(--font-data)',
        fontSize: Math.max(7, W * 0.062),
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--text-mute)',
      }}>
        Autenticidade
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: W * 0.26,
        lineHeight: 0.9,
        color: 'var(--green)',
        letterSpacing: '0.02em',
      }}>
        Nº {pad(number)}
      </div>

      <span
        aria-hidden="true"
        style={{ width: W * 0.3, height: 1, background: 'rgba(3,255,136,0.4)' }}
      />

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: Math.max(7.5, W * 0.07),
        color: 'var(--text-soft)',
        letterSpacing: '0.14em',
      }}>
        de {pad(total)}
      </div>

      {label && (
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: Math.max(6.5, W * 0.056),
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          maxWidth: '92%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: W * 0.01,
        }}>
          {label}
        </div>
      )}
    </div>
  )
}
