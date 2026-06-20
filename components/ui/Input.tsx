'use client'

import { useState, ReactNode, CSSProperties, InputHTMLAttributes, useId } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: string
  hint?: string
  error?: string
  mono?: boolean
  iconLeft?: ReactNode
  id?: string
  className?: string
  style?: CSSProperties
}

export function Input({
  label = '',
  hint = '',
  error = '',
  mono = false,
  iconLeft,
  id,
  className = '',
  style = {},
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focus, setFocus] = useState(false)
  const generatedId = useId()
  const fieldId = id || generatedId
  const invalid = !!error

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'var(--text-2xs)',
            letterSpacing: 'var(--tr-wider)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontWeight: 'var(--fw-semibold)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface-raised)',
          border: `1px solid ${invalid ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border-color)'}`,
          borderRadius: 10,
          padding: '0 15px',
          height: 48,
          transition: 'border-color var(--dur-base)',
        }}
      >
        {iconLeft && (
          <span style={{ display: 'flex', color: 'var(--text-muted)', flex: 'none' }}>{iconLeft}</span>
        )}
        <input
          id={fieldId}
          onFocus={(e) => { setFocus(true); onFocus?.(e) }}
          onBlur={(e) => { setFocus(false); onBlur?.(e) }}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
            fontSize: 'var(--text-md)',
            letterSpacing: mono ? '0.06em' : '0.01em',
          }}
          {...props}
        />
      </div>
      {(hint || error) && (
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-xs)',
            color: invalid ? 'var(--danger)' : 'var(--text-muted)',
          }}
        >
          {error || hint}
        </span>
      )}
    </div>
  )
}
