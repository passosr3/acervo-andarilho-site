'use client'

import { useState, CSSProperties } from 'react'
import { StatusBadge } from './StatusBadge'
import { PedidoDetails } from './PedidoDetails'
import type { Pedido } from '@/types/pedido'

interface PedidoRowProps {
  pedido: Pedido
}

function formatBRL(brl: number): string {
  return brl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function PedidoRow({ pedido }: PedidoRowProps) {
  const [open, setOpen] = useState(false)

  // Identificador curto para exibição: número de série ou últimos 8 chars do id
  const sessionShort = pedido.numero_serie
    ? String(pedido.numero_serie).padStart(4, '0')
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
        {/* Lado esquerdo: ID + data + versão + status */}
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
          {pedido.versao && (
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'var(--accent-fill)',
              border: '1px solid var(--accent-line)',
              borderRadius: 'var(--r-sm)',
              padding: '2px 8px',
              flexShrink: 0,
            }}>
              {pedido.versao}
            </span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}>
            {formatDate(pedido.created)}
          </span>
          <StatusBadge status={pedido.status} />
        </div>

        {/* Lado direito: valor + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-d3)',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {formatBRL(pedido.valor_total)}
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
