'use client'

import { useState, CSSProperties } from 'react'
import { StatusBadge } from './StatusBadge'
import { PedidoDetails } from './PedidoDetails'
import type { Pedido } from '@/types/pedido'

interface PedidoRowProps {
  pedido: Pedido
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function PaymentMethodChip({ method, last4 }: { method?: string; last4?: string }) {
  const isCard = method === 'card' || method === 'cartao' || method === 'cartão'
  const label = isCard && last4 ? `Cartão •••• ${last4}` : method === 'pix' ? 'PIX' : (method ?? 'Cartão')

  const chipStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-muted)',
    background: 'var(--surface-raised)',
    padding: '4px 10px',
    borderRadius: 'var(--r-pill)',
    border: '1px solid var(--border-color)',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <span style={chipStyle}>
      {isCard ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      )}
      {label}
    </span>
  )
}

export function PedidoRow({ pedido }: PedidoRowProps) {
  const [open, setOpen] = useState(false)

  const sessionShort = pedido.stripe_session_id
    ? pedido.stripe_session_id.slice(-12).toUpperCase()
    : pedido.id.slice(-8).toUpperCase()

  const cardStyle: CSSProperties = {
    background: 'var(--surface)',
    border: `1px solid ${open ? 'var(--border-emph)' : 'var(--border-color)'}`,
    borderRadius: 'var(--r-xl)',
    overflow: 'hidden',
    transition: 'border-color var(--dur-base) var(--ease-out)',
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    padding: '14px 20px',
    cursor: 'pointer',
    background: open ? 'var(--surface-raised)' : 'transparent',
    transition: 'background var(--dur-base)',
    borderBottom: open ? '1px solid var(--border-color)' : '1px solid transparent',
    minHeight: 64,
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  }

  const chevronStyle: CSSProperties = {
    width: 18,
    height: 18,
    color: 'var(--text-muted)',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform var(--dur-base) var(--ease-out)',
    flexShrink: 0,
  }

  return (
    <div style={cardStyle} role="article" aria-label={`Pedido #${sessionShort}`}>
      {/* Header clicável */}
      <div
        style={headerStyle}
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }}
      >
        {/* Lado esquerdo: ID + data + status + método */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}>
            #{sessionShort}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}>
            {formatDate(pedido.created)}
          </span>
          <StatusBadge status={pedido.status} />
          <PaymentMethodChip method={pedido.payment_method} last4={pedido.payment_last4} />
        </div>

        {/* Lado direito: valor + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-d3)',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {formatBRL(pedido.total)}
          </span>
          <svg style={chevronStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Painel de detalhes expansível */}
      <PedidoDetails pedido={pedido} open={open} />
    </div>
  )
}
