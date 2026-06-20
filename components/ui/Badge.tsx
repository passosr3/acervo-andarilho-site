import { ReactNode, CSSProperties, HTMLAttributes } from 'react'

type BadgeTone = 'accent' | 'neutral' | 'danger' | 'amber' | 'violet'
type BadgeVariant = 'soft' | 'solid'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  variant?: BadgeVariant
  dot?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function Badge({
  tone = 'accent',
  variant = 'soft',
  dot = false,
  className = '',
  style = {},
  children,
  ...props
}: BadgeProps) {
  const tones = {
    accent:  { c: 'var(--accent)',     fill: 'var(--accent-fill)',   line: 'var(--accent-line)' },
    neutral: { c: 'var(--text-secondary)', fill: 'var(--surface-raised)', line: 'var(--border-color)' },
    danger:  { c: 'var(--danger)',     fill: 'var(--danger-dim)',    line: 'var(--danger)' },
    amber:   { c: 'var(--amber)',      fill: 'var(--amber-dim)',     line: 'var(--amber)' },
    violet:  { c: 'var(--violet)',     fill: 'var(--violet-dim)',    line: 'var(--violet)' },
  }
  const t = tones[tone]
  const solid = variant === 'solid'

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 11px',
        fontFamily: 'var(--font-data)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--tr-wider)',
        textTransform: 'uppercase',
        lineHeight: 1,
        borderRadius: 'var(--r-pill)',
        color: solid ? 'var(--accent-contrast)' : t.c,
        background: solid ? t.c : t.fill,
        border: `1px solid ${solid ? 'transparent' : t.line}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          className="aa-dot-pulse"
          style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? 'var(--accent-contrast)' : t.c, flex: 'none' }}
        />
      )}
      {children}
    </span>
  )
}
