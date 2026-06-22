'use client'

import { useEffect, useRef, useState, CSSProperties } from 'react'
import type { Pedido } from '@/types/pedido'

interface PedidoDetailsProps {
  pedido: Pedido
  open: boolean
}

function DetailRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{
        fontFamily: 'var(--font-data)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--tr-wider)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
      }}>{value}</span>
    </div>
  )
}

function formatBRL(brl: number): string {
  return brl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PedidoDetails({ pedido, open }: PedidoDetailsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (open) {
      setVisible(true)
      // Measure after becoming visible
      requestAnimationFrame(() => {
        setHeight(ref.current?.scrollHeight ?? 0)
      })
    } else {
      setHeight(0)
      const timer = setTimeout(() => setVisible(false), 320)
      return () => clearTimeout(timer)
    }
  }, [open])

  const hasAddress = pedido.endereco_logradouro || pedido.endereco_cidade

  const wrapperStyle: CSSProperties = {
    overflow: 'hidden',
    height: `${height}px`,
    transition: 'height 320ms cubic-bezier(0.16,1,0.3,1)',
    opacity: open ? 1 : 0,
    transitionProperty: 'height, opacity',
  }

  if (!visible && !open) return null

  return (
    <div style={wrapperStyle} aria-hidden={!open}>
      <div ref={ref}>
        <div style={{
          padding: '20px 22px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>

          {/* Resumo do produto */}
          <div>
            <p style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 'var(--tr-wider)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}>Produto</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px 24px',
            }}>
              {pedido.universo && <DetailRow label="Universo" value={pedido.universo} />}
              <DetailRow label="Versão" value={pedido.versao} />
              {pedido.numero_serie != null && (
                <DetailRow label="N° de série" value={`#${String(pedido.numero_serie).padStart(4, '0')}`} />
              )}
              <DetailRow label="Total" value={formatBRL(pedido.valor_total)} />
              {pedido.valor_frete != null && (
                <DetailRow label="Frete" value={formatBRL(pedido.valor_frete)} />
              )}
            </div>
          </div>

          {/* Endereço de entrega */}
          {hasAddress && (
            <div>
              <p style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--tr-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 12,
              }}>Endereço de entrega</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '14px 24px',
              }}>
                <DetailRow label="Destinatário" value={pedido.endereco_destinatario} />
                <DetailRow label="Logradouro" value={
                  [pedido.endereco_logradouro, pedido.endereco_numero, pedido.endereco_complemento]
                    .filter(Boolean).join(', ')
                } />
                <DetailRow label="Bairro" value={pedido.endereco_bairro} />
                <DetailRow label="Cidade / UF" value={
                  [pedido.endereco_cidade, pedido.endereco_estado].filter(Boolean).join(' — ')
                } />
                <DetailRow label="CEP" value={pedido.endereco_cep} />
              </div>
            </div>
          )}

          {/* Nota fiscal — v2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'var(--surface-raised)',
            borderRadius: 'var(--r-md)',
            border: '1px dashed var(--border-color)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Nota fiscal disponível em breve
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
