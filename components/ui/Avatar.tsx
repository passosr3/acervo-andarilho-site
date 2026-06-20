import { CSSProperties, HTMLAttributes } from 'react'

interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  name?: string
  size?: number
  glow?: boolean
  className?: string
  style?: CSSProperties
}

export function Avatar({
  src = '',
  name = '',
  size = 44,
  glow = false,
  className = '',
  style = {},
  ...props
}: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'var(--surface-raised)',
        border: `1.5px solid ${glow ? 'var(--accent)' : 'var(--border-emph)'}`,
        boxShadow: glow ? 'var(--glow-sm)' : 'none',
        color: 'var(--accent)',
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.42,
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: '0.04em',
        ...style,
      }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials || '◆'
      )}
    </span>
  )
}
