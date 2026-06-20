'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { pb } from '@/lib/pocketbase'

function VerificarEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  )
  const [errorMsg, setErrorMsg] = useState(
    token ? '' : 'Link inválido. O token de verificação não foi encontrado.'
  )

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function verify() {
      try {
        await pb.collection('users').confirmVerification(token)
        if (!cancelled) setStatus('success')
      } catch (err: unknown) {
        if (cancelled) return
        const pbError = err as { status?: number }
        if (pbError?.status === 400) {
          setErrorMsg('Este link já foi usado ou expirou. Solicite um novo link de verificação.')
        } else {
          setErrorMsg('Não foi possível verificar seu e-mail. Tente novamente mais tarde.')
        }
        setStatus('error')
      }
    }

    verify()
    return () => { cancelled = true }
  }, [token])

  if (status === 'loading') {
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
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg
            className="aa-spin"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle
              cx="12" cy="12" r="10"
              stroke="var(--border-strong)"
              strokeWidth="2"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

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
          Verificando…
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
          }}
        >
          Confirmando seu e-mail, aguarde um instante.
        </p>
      </div>
    )
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
          Email confirmado!
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
          Sua conta está verificada. Bem-vindo ao Acervo Andarilho.
        </p>

        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            padding: '0 28px',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            borderRadius: 'var(--r-pill)',
            background: 'var(--green)',
            color: '#06140d',
            textDecoration: 'none',
            transition: 'background var(--dur-base)',
          }}
        >
          Ir para Minha Conta
        </Link>
      </div>
    )
  }

  // status === 'error'
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
          background: 'var(--danger-dim)',
          border: '1px solid rgba(255, 77, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="var(--danger)"
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
          color: 'var(--danger)',
          marginBottom: 12,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        Link expirado
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
        {errorMsg}
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
        Voltar para o login
      </Link>
    </div>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense>
      <VerificarEmailContent />
    </Suspense>
  )
}
