'use client'

import { useState, ReactNode, CSSProperties, ElementType, ComponentPropsWithoutRef } from 'react'

interface TagProps {
  active?: boolean
  icon?: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

export function Tag({
  active = false,
  icon,
  as: El = 'button',
  className = '',
  style = {},
  children,
  ...props
}: TagProps) {
  const [hover, setHover] = useState(false)
  const lit = active || hover

  return (
    <El
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        fontFamily: 'var(--font-data)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-medium)',
        letterSpacing: 'var(--tr-wide)',
        textTransform: 'uppercase',
        lineHeight: 1,
        cursor: El === 'button' ? 'pointer' : 'default',
        borderRadius: 'var(--r-pill)',
        color: active ? 'var(--accent)' : lit ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: active ? 'var(--accent-fill)' : 'var(--surface-raised)',
        border: `1px solid ${active ? 'var(--accent-line)' : lit ? 'var(--border-emph)' : 'var(--border-color)'}`,
        boxShadow: active ? 'var(--glow-xs)' : 'none',
        transition: 'all var(--dur-base) var(--ease-out)',
        ...style,
      } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {icon && <span style={{ display: 'flex', width: 18, height: 18 }}>{icon}</span>}
      {children}
    </El>
  )
}
