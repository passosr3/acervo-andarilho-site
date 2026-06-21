'use client'

import { useState, useTransition, useRef } from 'react'
import type { PedidoAdmin } from '@/app/admin/pedidos/page'
import { useRouter } from 'next/navigation'

const STATUS_ENVIO_OPTIONS = [
  { value: '', label: 'Sem status' },
  { value: 'producao', label: 'Em produção' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
] as const

type StatusEnvio = '' | 'producao' | 'enviado' | 'entregue'

const STATUS_ENVIO_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  '':         { label: 'Sem status',    color: 'var(--ink-text-mute)', bg: 'var(--paper-sunken)' },
  producao:   { label: 'Em produção',   color: 'var(--amber)',         bg: 'var(--amber-dim)' },
  enviado:    { label: 'Enviado',       color: '#a06bff',              bg: 'rgba(160,107,255,0.12)' },
  entregue:   { label: 'Entregue',      color: 'var(--green-deep)',    bg: 'rgba(2,196,105,0.12)' },
}

const STATUS_PAG_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  paid:     { label: 'Pago',       color: 'var(--green-deep)', bg: 'rgba(2,196,105,0.12)' },
  pending:  { label: 'Aguardando', color: 'var(--amber)',      bg: 'var(--amber-dim)' },
  refunded: { label: 'Estornado',  color: 'var(--danger)',     bg: 'var(--danger-dim)' },
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

interface PedidoRowProps {
  pedido: PedidoAdmin
}

function PedidoRow({ pedido }: PedidoRowProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [statusEnvio, setStatusEnvio] = useState<StatusEnvio>(pedido.status_envio as StatusEnvio || '')
  const [trackingCode, setTrackingCode] = useState(pedido.tracking_code || '')
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const trackingRef = useRef<HTMLInputElement>(null)

  const stPag = STATUS_PAG_STYLE[pedido.status] ?? { label: pedido.status, color: 'var(--ink-text-mute)', bg: 'var(--paper-sunken)' }
  const stEnvio = STATUS_ENVIO_STYLE[statusEnvio] ?? STATUS_ENVIO_STYLE['']

  async function handleSave() {
    setIsSaving(true)
    setError('')
    setToast('')

    try {
      const res = await fetch(`/api/admin/pedidos/${pedido.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_envio: statusEnvio, tracking_code: trackingCode }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error ?? 'Erro ao salvar.')
        return
      }

      setToast('Salvo!')
      setTimeout(() => setToast(''), 2500)

      startTransition(() => {
        router.refresh()
      })
    } catch {
      setError('Erro de conexão.')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = statusEnvio !== (pedido.status_envio || '') || trackingCode !== (pedido.tracking_code || '')

  return (
    <>
      {/* Row principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 40px',
        gap: 12,
        padding: '14px 20px',
        alignItems: 'center',
        borderTop: '1px solid var(--paper-border)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-text-mute)' }}>
          #{pedido.id.slice(0, 8)}<br />
          <span style={{ fontSize: 10, color: 'var(--ink-text-mute)' }}>{formatDate(pedido.created)}</span>
        </span>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {pedido.email}
        </span>

        <span>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: stPag.color,
            background: stPag.bg,
          }}>
            {stPag.label}
          </span>
        </span>

        <span>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: stEnvio.color,
            background: stEnvio.bg,
          }}>
            {stEnvio.label}
          </span>
        </span>

        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-text)' }}>
          {formatBRL(pedido.total)}
        </span>

        <button
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? 'Fechar' : 'Expandir'}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--paper-border)',
            background: isExpanded ? 'var(--paper-sunken)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-text-mute)',
            transition: 'all var(--dur-base)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base)' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Painel expandido */}
      {isExpanded && (
        <div style={{
          padding: '20px 20px 24px',
          background: 'var(--paper-sunken)',
          borderTop: '1px solid var(--paper-border)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 24,
        }}>
          {/* Coluna 1: Edição */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: 'var(--ink-text)',
              marginBottom: 16,
            }}>
              Atualizar pedido
            </h3>

            {/* Status de envio */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-text-mute)',
                marginBottom: 8,
              }}>
                Status de envio
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STATUS_ENVIO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusEnvio(opt.value as StatusEnvio)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--r-pill)',
                      border: `1.5px solid ${statusEnvio === opt.value ? 'var(--green-deep)' : 'var(--paper-border)'}`,
                      background: statusEnvio === opt.value ? 'rgba(2,196,105,0.12)' : 'var(--paper-raised)',
                      fontFamily: 'var(--font-data)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: statusEnvio === opt.value ? 'var(--green-deep)' : 'var(--ink-text-soft)',
                      cursor: 'pointer',
                      transition: 'all var(--dur-base)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking code */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-text-mute)',
                marginBottom: 8,
              }}>
                Código de rastreio
              </label>
              <input
                ref={trackingRef}
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="BR123456789BR"
                maxLength={50}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 14px',
                  background: 'var(--paper-raised)',
                  border: '1.5px solid var(--paper-border)',
                  borderRadius: 10,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: 'var(--ink-text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color var(--dur-base)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--green-deep)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--paper-border)'}
              />
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleSave}
                disabled={isSaving || (!hasChanges) || isPending}
                style={{
                  height: 40,
                  padding: '0 20px',
                  background: hasChanges && !isSaving ? 'var(--green)' : 'var(--paper-sunken)',
                  color: hasChanges && !isSaving ? '#06140d' : 'var(--ink-text-mute)',
                  border: 'none',
                  borderRadius: 'var(--r-pill)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: hasChanges && !isSaving ? 'pointer' : 'not-allowed',
                  transition: 'all var(--dur-base)',
                }}
              >
                {isSaving ? 'Salvando…' : 'Salvar'}
              </button>

              {toast && (
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  color: 'var(--green-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {toast}
                </span>
              )}

              {error && (
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--danger)' }}>
                  {error}
                </span>
              )}
            </div>
          </div>

          {/* Coluna 2: Detalhes */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: 'var(--ink-text)',
              marginBottom: 16,
            }}>
              Detalhes do pedido
            </h3>

            {/* Items */}
            {pedido.items.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-text-mute)', marginBottom: 8 }}>
                  Itens
                </p>
                {pedido.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--paper-border)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-text-soft)' }}>
                    <span>{item.name || item.description || `Item ${i + 1}`} {item.quantity && item.quantity > 1 ? `× ${item.quantity}` : ''}</span>
                    {item.amount && <span style={{ fontFamily: 'var(--font-mono)' }}>{formatBRL(item.amount)}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Endereço */}
            {pedido.endereco_logradouro && (
              <div>
                <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-text-mute)', marginBottom: 6 }}>
                  Endereço de entrega
                </p>
                <address style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-text-soft)', fontStyle: 'normal', lineHeight: 1.6 }}>
                  {pedido.endereco_logradouro}, {pedido.endereco_numero}
                  {pedido.endereco_complemento && ` — ${pedido.endereco_complemento}`}<br />
                  {pedido.endereco_bairro} — {pedido.endereco_cidade}/{pedido.endereco_estado}<br />
                  CEP {pedido.endereco_cep}
                </address>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

interface PedidosAdminTableProps {
  pedidos: PedidoAdmin[]
}

const STATUS_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'paid', label: 'Pagos' },
  { value: 'pending', label: 'Aguardando' },
  { value: 'refunded', label: 'Estornados' },
]

const ENVIO_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: '', label: 'Sem status' },
  { value: 'producao', label: 'Em produção' },
  { value: 'enviado', label: 'Enviados' },
  { value: 'entregue', label: 'Entregues' },
]

export function PedidosAdminTable({ pedidos }: PedidosAdminTableProps) {
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroEnvio, setFiltroEnvio] = useState('todos')
  const [busca, setBusca] = useState('')

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroStatus !== 'todos' && p.status !== filtroStatus) return false
    if (filtroEnvio !== 'todos' && p.status_envio !== filtroEnvio) return false
    if (busca.trim()) {
      const q = busca.toLowerCase()
      if (!p.email.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {/* Busca */}
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por e-mail ou ID…"
          style={{
            height: 38,
            padding: '0 14px',
            background: 'var(--paper-raised)',
            border: '1.5px solid var(--paper-border)',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--ink-text)',
            outline: 'none',
            minWidth: 220,
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--green-deep)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--paper-border)'}
        />

        {/* Filtro pagamento */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--paper-sunken)', borderRadius: 'var(--r-pill)', padding: 4 }}>
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltroStatus(opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                background: filtroStatus === opt.value ? 'var(--paper-raised)' : 'transparent',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: filtroStatus === opt.value ? 'var(--ink-text)' : 'var(--ink-text-mute)',
                cursor: 'pointer',
                transition: 'all var(--dur-base)',
                boxShadow: filtroStatus === opt.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Filtro envio */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--paper-sunken)', borderRadius: 'var(--r-pill)', padding: 4 }}>
          {ENVIO_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltroEnvio(opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                background: filtroEnvio === opt.value ? 'var(--paper-raised)' : 'transparent',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: filtroEnvio === opt.value ? 'var(--ink-text)' : 'var(--ink-text-mute)',
                cursor: 'pointer',
                transition: 'all var(--dur-base)',
                boxShadow: filtroEnvio === opt.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--ink-text-mute)', marginLeft: 'auto' }}>
          {pedidosFiltrados.length} de {pedidos.length} pedidos
        </span>
      </div>

      {/* Tabela */}
      <div style={{
        background: 'var(--paper-raised)',
        border: '1px solid var(--paper-border)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 40px',
          gap: 12,
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
          <span>ID / Data</span>
          <span>E-mail</span>
          <span>Pagamento</span>
          <span>Envio</span>
          <span>Total</span>
          <span></span>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-text-mute)' }}>
            Nenhum pedido encontrado com os filtros atuais.
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <PedidoRow key={pedido.id} pedido={pedido} />
          ))
        )}
      </div>
    </div>
  )
}
