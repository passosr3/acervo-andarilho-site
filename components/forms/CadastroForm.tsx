'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FormState = 'idle' | 'email-sent'

export function CadastroForm() {
  const { register, requestVerification, isLoading } = useAuth()

  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

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
      // Conta criada com sucesso — aguardar verificação de email.
      // NÃO fazer login automático: PocketBase rejeita auth de usuários não verificados.
      setFormState('email-sent')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('unique')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.')
      } else {
        setError('Não foi possível criar a conta. Tente novamente.')
      }
    }
  }

  async function handleResend() {
    setResendStatus('sending')
    try {
      await requestVerification(email)
      setResendStatus('sent')
    } catch {
      setResendStatus('error')
    }
  }

  // ── Estado: email enviado ──────────────────────────────────────────────────
  if (formState === 'email-sent') {
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
        {/* Ícone de envelope */}
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
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--accent)" strokeWidth="2" />
            <path d="M2 7l10 7 10-7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          Confirme seu email
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-relaxed)',
            marginBottom: 8,
          }}
        >
          Enviamos o link de ativação para:
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 20,
            wordBreak: 'break-all',
          }}
        >
          {email}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-relaxed)',
            marginBottom: 32,
          }}
        >
          Clique no link para ativar. Se não aparecer na caixa de entrada, confira a pasta de spam.
        </p>

        {/* Botão Reenviar */}
        <Button
          variant="ghost"
          block
          disabled={resendStatus === 'sending' || resendStatus === 'sent'}
          onClick={handleResend}
          style={{ marginBottom: 16 }}
        >
          {resendStatus === 'sending'
            ? 'Reenviando…'
            : resendStatus === 'sent'
            ? 'Email reenviado!'
            : 'Reenviar link de ativação'}
        </Button>

        {resendStatus === 'error' && (
          <p
            role="alert"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--danger)',
              marginBottom: 16,
            }}
          >
            Não foi possível reenviar. Aguarde um momento e tente de novo.
          </p>
        )}

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Já ativou sua conta?{' '}
          <Link
            href="/auth/login"
            style={{ color: 'var(--aa-green)', textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}
          >
            Entrar no acervo
          </Link>
        </p>
      </div>
    )
  }

  // ── Estado: formulário de cadastro ─────────────────────────────────────────
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
        Registrar-se
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 32 }}>
        Crie seu registro no acervo. Acompanhe suas peças e saiba primeiro quando novos lotes abrirem.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input
          label="Nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como você quer ser chamado"
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
          placeholder="Pelo menos 8 caracteres"
          required
          autoComplete="new-password"
          hint="Mínimo 8 caracteres"
        />
        <Input
          label="Confirmar senha"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirme a senha acima"
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
          {isLoading ? 'Criando registro…' : 'Criar meu registro'}
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
        Já tem registro?{' '}
        <Link
          href="/auth/login"
          style={{ color: 'var(--aa-green)', textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}
        >
          Entrar no acervo
        </Link>
      </p>
    </div>
  )
}
