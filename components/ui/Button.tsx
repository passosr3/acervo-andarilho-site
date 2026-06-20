'use client'

import { useState, ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'dark' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pulse?: boolean
  block?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Button({
  variant = 'primary',
  size = 'md',
  pulse = false,
  block = false,
  iconLeft,
  iconRight,
  className = '',
  style = {},
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: { height: 40, padding: '0 20px', font: 'var(--text-sm)', gap: 8, minWidth: undefined },
    md: { height: 48, padding: '0 28px', font: 'var(--text-md)', gap: 9, minWidth: undefined },
    lg: { height: 56, padding: '0 36px', font: 'var(--text-lg)', gap: 11, minWidth: 200 },
  }
  const s = sizes[size]

  const variants: Record<Variant, CSSProperties> = {
    primary: { background: 'var(--green)', color: '#06140d', borderColor: 'transparent' },
    dark:    { background: 'var(--ink-text)', color: 'var(--paper)', borderColor: 'transparent' },
    ghost:   { background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-emph)' },
    danger:  { background: 'transparent', color: 'var(--danger)', borderColor: 'var(--danger)' },
  }

  const hoverVariants: Record<Variant, CSSProperties> = {
    primary: { background: 'var(--green-bright)', transform: 'translateY(-1px)', boxShadow: '0 6px 22px rgba(3,255,136,0.28)' },
    dark:    { background: 'var(--green-deep)', color: '#06140d', transform: 'translateY(-1px)' },
    ghost:   { background: 'var(--surface-hover)', borderColor: 'var(--text-primary)', transform: 'translateY(-1px)' },
    danger:  { background: 'var(--danger-dim)', transform: 'translateY(-1px)' },
  }

  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const hoverStyle = !disabled && hover ? { ...hoverVariants[variant], transform: active ? 'translateY(0)' : hoverVariants[variant].transform } : {}
  const disabledStyle: CSSProperties = disabled ? { opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none', transform: 'none' } : {}

  return (
    <button
      disabled={disabled}
      className={`${pulse && variant === 'primary' && !disabled ? 'aa-anim-pulse' : ''} ${className}`}
      style={{
        position: 'relative',
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        minWidth: s.minWidth,
        padding: s.padding,
        fontFamily: 'var(--font-ui)',
        fontSize: s.font,
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        borderRadius: 'var(--r-pill)',
        cursor: 'pointer',
        border: '1.5px solid transparent',
        transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-base), color var(--dur-base), box-shadow var(--dur-base)',
        WebkitTapHighlightColor: 'transparent',
        ...variants[variant],
        ...hoverStyle,
        ...disabledStyle,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...props}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  )
}
