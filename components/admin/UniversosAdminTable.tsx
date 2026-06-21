'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { UniversoAdmin } from '@/app/admin/universos/page'

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  ativo:      { label: 'Ativo',     color: 'var(--green-deep)', bg: 'rgba(2,196,105,0.12)' },
  'em-breve': { label: 'Em breve',  color: 'var(--amber)',      bg: 'var(--amber-dim)' },
  inativo:    { label: 'Inativo',   color: 'var(--ink-text-mute)', bg: 'var(--paper-sunken)' },
}

interface UniversoRowProps {
  universo: UniversoAdmin
}

function UniversoRow({ universo }: UniversoRowProps) {
  const router = useRouter()
  const [status, setStatus] = useState(universo.status)
  const [isSaving, setIsSaving] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const st = STATUS_STYLE[status] ?? STATUS_STYLE['inativo']

  async function updateStatus(newStatus: string) {
    if (newStatus === status) return
    setIsSaving(true)
    setError('')
    setToast('')

    try {
      const res = await fetch(`/api/admin/universos/${universo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error ?? 'Erro ao atualizar.')
        return
      }

      setStatus(newStatus)
      setToast('Salvo!')
      setTimeout(() => setToast(''), 2000)

      startTransition(() => {
        router.refresh()
      })
    } catch {
      setError('Erro de conexão.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr auto',
      gap: 16,
      padding: '16px 20px',
      borderTop: '1px solid var(--paper-border)',
      alignItems: 'center',
    }}>
      {/* Slug + nome */}
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--ink-text)', lineHeight: 1, marginBottom: 4 }}>
          {universo.nome}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-text-mute)' }}>
          /{universo.slug}
        </div>
      </div>

      {/* Accent color + LP URL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {universo.accent_color && (
          <span style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: universo.accent_color,
            border: '1.5px solid var(--paper-border)',
            flexShrink: 0,
          }} />
        )}
        {universo.lp_url && (
          <a
            href={universo.lp_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--green-deep)',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {universo.lp_url}
          </a>
        )}
      </div>

      {/* Status badge */}
      <div>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: st.color,
          background: st.bg,
        }}>
          {st.label}
        </span>
      </div>

      {/* Toggle actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {status !== 'ativo' && (
          <button
            onClick={() => updateStatus('ativo')}
            disabled={isSaving || isPending}
            style={{
              height: 34,
              padding: '0 14px',
              background: 'var(--green)',
              color: '#06140d',
              border: 'none',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isSaving || isPending ? 'not-allowed' : 'pointer',
              opacity: isSaving || isPending ? 0.5 : 1,
              transition: 'opacity var(--dur-base)',
            }}
          >
            Ativar
          </button>
        )}

        {status !== 'em-breve' && (
          <button
            onClick={() => updateStatus('em-breve')}
            disabled={isSaving || isPending}
            style={{
              height: 34,
              padding: '0 14px',
              background: 'transparent',
              color: 'var(--amber)',
              border: '1.5px solid var(--amber)',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isSaving || isPending ? 'not-allowed' : 'pointer',
              opacity: isSaving || isPending ? 0.5 : 1,
              transition: 'opacity var(--dur-base)',
            }}
          >
            Em breve
          </button>
        )}

        {status !== 'inativo' && (
          <button
            onClick={() => updateStatus('inativo')}
            disabled={isSaving || isPending}
            style={{
              height: 34,
              padding: '0 14px',
              background: 'transparent',
              color: 'var(--ink-text-mute)',
              border: '1.5px solid var(--paper-border)',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isSaving || isPending ? 'not-allowed' : 'pointer',
              opacity: isSaving || isPending ? 0.5 : 1,
              transition: 'opacity var(--dur-base)',
            }}
          >
            Desativar
          </button>
        )}

        {toast && (
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--green-deep)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toast}
          </span>
        )}

        {error && (
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)' }}>
            {error}
          </span>
        )}
      </div>
    </div>
  )
}

interface UniversosAdminTableProps {
  universos: UniversoAdmin[]
}

export function UniversosAdminTable({ universos }: UniversosAdminTableProps) {
  if (universos.length === 0) {
    return (
      <div style={{
        padding: '48px 20px',
        textAlign: 'center',
        background: 'var(--paper-raised)',
        border: '1px dashed var(--paper-border)',
        borderRadius: 'var(--r-xl)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--ink-text-mute)',
      }}>
        Nenhum universo encontrado na collection <code>universos</code> do PocketBase.
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--paper-raised)',
      border: '1px solid var(--paper-border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr auto',
        gap: 16,
        padding: '12px 20px',
        background: 'var(--paper-sunken)',
        borderBottom: '1px solid var(--paper-border)',
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--ink-text-mute)',
      }}>
        <span>Nome / Slug</span>
        <span>Landing Page</span>
        <span>Status</span>
        <span>Ações</span>
      </div>

      {universos.map((u) => (
        <UniversoRow key={u.id} universo={u} />
      ))}
    </div>
  )
}
