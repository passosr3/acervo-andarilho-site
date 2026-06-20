'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Props {
  universe: string
  accentColor: string
}

type State = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export function TeaserEmailForm({ universe, accentColor }: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || state === 'loading') return
    setState('loading')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, universe, source: 'teaser_site' }),
      })

      if (res.status === 201) { setState('success'); return }
      if (res.status === 409) { setState('duplicate'); return }
      setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '28px 32px',
        borderRadius: 16,
        border: `1px solid ${accentColor}44`,
        background: `${accentColor}0d`,
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 32 }}>✦</span>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          color: accentColor,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Andarilho avisado!
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
          Você será o primeiro a saber quando este universo abrir.
        </p>
      </div>
    )
  }

  const hint =
    state === 'duplicate' ? 'Você já está na lista.' :
    state === 'error' ? 'Erro ao registrar. Tente novamente.' :
    undefined

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        textAlign: 'center',
      }}>
        Seja o primeiro a saber quando este universo abrir.
      </p>
      <Input
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state !== 'idle') setState('idle') }}
        required
        disabled={state === 'loading'}
        error={state === 'duplicate' ? 'Você já está na lista.' : state === 'error' ? 'Erro ao registrar. Tente novamente.' : ''}
      />
      <Button
        type="submit"
        size="lg"
        block
        disabled={state === 'loading' || !email}
        style={state !== 'loading' ? { background: accentColor, color: '#06140d' } : {}}
      >
        {state === 'loading' ? 'Registrando…' : 'Quero ser avisado'}
      </Button>
    </form>
  )
}
