'use client'

import { useState, ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'

type IconButtonVariant = 'ghost' | 'solid' | 'bare'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  label: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  style = {},
  children,
  disabled,
  ...props
}: IconButtonProps) {
  const [hover, setHover] = useState(false)
  const dims = { sm: 34, md: 42, lg: 50 }[size]

  const variants: Record<IconButtonVariant, CSSProperties> = {
    ghost: { background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' },
    solid: { background: 'var(--green)', border: '1px solid transparent', color: 'var(--accent-contrast)' },
    bare:  { background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)' },
  }

  const hoverVariants: Record<IconButtonVariant, CSSProperties> = {
    ghost: { color: 'var(--accent)', borderColor: 'var(--accent-line)', boxShadow: 'var(--glow-xs)' },
    solid: { background: 'var(--green-bright)', boxShadow: 'var(--glow-md)' },
    bare:  { color: 'var(--accent)' },
  }

  const hoverStyle = !disabled && hover ? hoverVariants[variant] : {}

  return (
    <button
      aria-label={label}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dims,
        height: dims,
        flex: 'none',
        borderRadius: 'var(--r-sm)',
        cursor: 'pointer',
        transition: 'all var(--dur-base) var(--ease-out)',
        ...(disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
        ...variants[variant],
        ...hoverStyle,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  )
}
