'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function CadastroForm() {
  const { register, isLoading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== passwordConfirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (!agreed) {
      setError('Você precisa aceitar os termos de uso.')
      return
    }

    try {
      await register(name, email, password, passwordConfirm)
      router.replace('/account')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('unique')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.')
      } else {
        setError('Não foi possível criar a conta. Tente novamente.')
      }
    }
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
        Criar Conta
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 32 }}>
        Entre para o acervo de colecionadores
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          autoComplete="name"
        />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          hint="Mínimo 8 caracteres"
        />
        <Input
          label="Confirmar senha"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
        />

        {/* Terms checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--aa-green)', flexShrink: 0 }}
          />
          <span>
            Concordo com os{' '}
            <Link
              href="/termos"
              target="_blank"
              style={{ color: 'var(--aa-green)', textDecoration: 'none' }}
            >
              termos de uso
            </Link>{' '}
            e{' '}
            <Link
              href="/privacidade"
              target="_blank"
              style={{ color: 'var(--aa-green)', textDecoration: 'none' }}
            >
              política de privacidade
            </Link>
          </span>
        </label>

        {error && (
          <p
            role="alert"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--danger)',
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <Button type="submit" block disabled={isLoading || !agreed} style={{ marginTop: 4 }}>
          {isLoading ? 'Criando conta…' : 'Criar conta'}
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
        Já tem conta?{' '}
        <Link
          href="/auth/login"
          style={{ color: 'var(--aa-green)', textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
