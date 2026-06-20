'use client'

import type { Metadata } from 'next'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// metadata só funciona em Server Components — exposta via generateMetadata separado
// mas como este é 'use client', usamos <title> via next/head ou simplesmente o layout pai cuida

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await pb.collection('users').requestPasswordReset(email)
      // Sempre mostra mensagem genérica — não revela se o email existe
      setStatus('sent')
    } catch {
      // PocketBase pode retornar erro se email inválido; ainda assim mensagem genérica
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--r-lg)',
          padding: '40px 36px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--accent-fill)',
            border: '1px solid var(--accent-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 6l10 7 10-7"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 12,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Link enviado
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-relaxed)',
            marginBottom: 32,
          }}
        >
          Se esse e-mail estiver cadastrado no Acervo Andarilho, você receberá o link de recuperação em breve. Verifique também a pasta de spam.
        </p>

        <Link
          href="/auth/login"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 'var(--fw-medium)',
          }}
        >
          ← Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--r-lg)',
        padding: '40px 36px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 8,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        Recuperar Senha
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          marginBottom: 32,
          lineHeight: 'var(--lh-relaxed)',
        }}
      >
        Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
          error={errorMsg}
        />

        <Button
          type="submit"
          block
          disabled={status === 'loading'}
          style={{ marginTop: 4 }}
        >
          {status === 'loading' ? 'Enviando…' : 'Enviar link de recuperação'}
        </Button>
      </form>

      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 28,
        }}
      >
        Lembrou a senha?{' '}
        <Link
          href="/auth/login"
          style={{
            color: 'var(--aa-green)',
            textDecoration: 'none',
            fontWeight: 'var(--fw-medium)',
          }}
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
