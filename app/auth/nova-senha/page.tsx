'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

function NovaSenhaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (password !== passwordConfirm) {
      setErrorMsg('As senhas não coincidem.')
      return
    }
    if (password.length < 8) {
      setErrorMsg('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (!token) {
      setErrorMsg('Link inválido ou expirado. Solicite um novo link de recuperação.')
      return
    }

    setStatus('loading')
    try {
      await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm)
      setStatus('success')
      // Redireciona para login após curto delay para o usuário ler o feedback
      setTimeout(() => router.replace('/auth/login'), 2000)
    } catch (err: unknown) {
      setStatus('error')
      const pbError = err as { status?: number }
      if (pbError?.status === 400) {
        setErrorMsg('Link expirado ou inválido. Solicite um novo link de recuperação.')
      } else {
        setErrorMsg('Não foi possível redefinir a senha. Tente novamente.')
      }
    }
  }

  if (status === 'success') {
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
              d="M20 6L9 17l-5-5"
              stroke="var(--accent)"
              strokeWidth="2"
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
          Senha redefinida
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
          Sua senha foi atualizada com sucesso. Redirecionando para o login…
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
          Ir para o login
        </Link>
      </div>
    )
  }

  if (!token) {
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
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--danger)',
            marginBottom: 12,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Link inválido
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
          Este link não contém um token de recuperação válido. Solicite um novo link.
        </p>
        <Link
          href="/auth/recuperar-senha"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 'var(--fw-medium)',
          }}
        >
          Solicitar novo link
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
        Nova Senha
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
        Escolha uma nova senha para sua conta.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Nova senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          minLength={8}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
          error={
            passwordConfirm.length > 0 && password !== passwordConfirm
              ? 'As senhas não coincidem'
              : ''
          }
        />

        {errorMsg && (
          <p
            role="alert"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--danger)',
              margin: 0,
            }}
          >
            {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          block
          disabled={status === 'loading'}
          style={{ marginTop: 4 }}
        >
          {status === 'loading' ? 'Salvando…' : 'Salvar nova senha'}
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
        <Link
          href="/auth/login"
          style={{
            color: 'var(--aa-green)',
            textDecoration: 'none',
            fontWeight: 'var(--fw-medium)',
          }}
        >
          ← Voltar para o login
        </Link>
      </p>
    </div>
  )
}

export default function NovaSenhaPage() {
  return (
    <Suspense>
      <NovaSenhaForm />
    </Suspense>
  )
}
