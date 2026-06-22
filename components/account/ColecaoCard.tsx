'use client'

import { CSSProperties } from 'react'

export interface Pedido {
  id: string
  collectionId?: string
  collectionName?: string
  created: string
  updated?: string
  universo?: string
  numero_serie?: string | number
  versao: string
  valor_total: number
  status: string          // 'pago' | 'enviado' | 'entregue' | 'pendente'
  tracking_code?: string
  email: string
  nome?: string
}

const STATUS_MAP: Record<string, { label: string; tone: 'neutral' | 'amber' | 'blue' | 'accent' }> = {
  pendente:  { label: 'Aguardando pagamento', tone: 'neutral' },
  pago:      { label: 'Em produção',          tone: 'amber'   },
  enviado:   { label: 'Enviado',              tone: 'blue'    },
  entregue:  { label: 'Entregue',             tone: 'accent'  },
}

const TONE_STYLES: Record<string, CSSProperties> = {
  neutral: { color: 'var(--text-soft)',   background: 'var(--surface-raised)', border: '1px solid var(--border-color)' },
  amber:   { color: 'var(--amber)',       background: 'var(--amber-dim)',       border: '1px solid rgba(255,178,62,0.3)' },
  blue:    { color: '#4db8ff',            background: 'rgba(77,184,255,0.1)',   border: '1px solid rgba(77,184,255,0.3)' },
  accent:  { color: 'var(--accent)',      background: 'var(--accent-fill)',     border: '1px solid var(--accent-line)'  },
}

interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS_MAP[status] ?? { label: status, tone: 'neutral' as const }
  const t = TONE_STYLES[s.tone]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 'var(--r-pill)',
      fontFamily: 'var(--font-data)',
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...t,
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'currentColor',
        flex: 'none',
        opacity: 0.85,
      }} />
      {s.label}
    </span>
  )
}

interface ColecaoCardProps {
  pedido: Pedido
}

export function ColecaoCard({ pedido }: ColecaoCardProps) {
  const dataCompra = new Date(pedido.created).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Formata o número de série para exibição: "#0042 / 500" ou só "#0042"
  const serialDisplay = pedido.numero_serie
    ? `#${pedido.numero_serie.toString().padStart(4, '0')}`
    : '—'

  const valorFormatado = pedido.valor_total
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)
    : null

  return (
    <article
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--r-lg)',
        padding: '20px 22px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '12px 20px',
        alignItems: 'start',
        transition: 'border-color var(--dur-base) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-emph)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'
      }}
    >
      {/* Linha superior: nome + serial */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {pedido.versao || 'Specimen Jar'}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--accent)',
            background: 'var(--accent-fill)',
            border: '1px solid var(--accent-line)',
            borderRadius: 'var(--r-sm)',
            padding: '3px 9px',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}>
            {serialDisplay}
          </span>
        </div>

        {/* Status + data */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
          <StatusBadge status={pedido.status} />
          <span style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            {dataCompra}
          </span>
        </div>

        {/* Tracking code (quando enviado) */}
        {pedido.status === 'enviado' && pedido.tracking_code && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Rastreio:
            </span>
            <a
              href={`https://www.linkcorreios.com.br/?id=${pedido.tracking_code}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: '#4db8ff',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')}
            >
              {pedido.tracking_code}
            </a>
          </div>
        )}
      </div>

      {/* Valor */}
      {valorFormatado && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            color: 'var(--text-secondary)',
            lineHeight: 1,
          }}>
            {valorFormatado}
          </span>
        </div>
      )}
    </article>
  )
}
