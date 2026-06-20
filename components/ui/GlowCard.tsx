'use client'

import { useState, ReactNode, CSSProperties, HTMLAttributes } from 'react'

type CardVariant = 'default' | 'featured'

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
  padding?: number | string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function GlowCard({
  variant = 'default',
  interactive = true,
  padding = 24,
  className = '',
  style = {},
  children,
  ...props
}: GlowCardProps) {
  const [hover, setHover] = useState(false)

  const hoverStyle: CSSProperties = interactive && hover ? {
    transform: 'translateY(-4px)',
    borderColor: variant === 'featured' ? 'var(--accent)' : 'var(--border-emph)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
  } : {}

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        background: variant === 'featured'
          ? 'linear-gradient(180deg, var(--accent-wash), transparent 42%), var(--surface)'
          : 'var(--surface)',
        border: `1.5px solid ${variant === 'featured' ? 'var(--accent-line)' : 'var(--border-color)'}`,
        borderRadius: 20,
        padding,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base)',
        ...hoverStyle,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </div>
  )
}
