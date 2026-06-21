'use client'

import { useState } from 'react'
import type { LeadAdmin } from '@/app/admin/leads/page'

interface LeadsAdminTableProps {
  leads: LeadAdmin[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function LeadsAdminTable({ leads }: LeadsAdminTableProps) {
  const [filtroUniverse, setFiltroUniverse] = useState('todos')
  const [busca, setBusca] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Universos únicos
  const universes = Array.from(new Set(leads.map((l) => l.universe).filter(Boolean))).sort()

  const leadsFiltrados = leads.filter((l) => {
    if (filtroUniverse !== 'todos' && l.universe !== filtroUniverse) return false
    if (busca.trim()) {
      const q = busca.toLowerCase()
      if (!l.email.toLowerCase().includes(q)) return false
    }
    return true
  })

  async function handleExport() {
    setIsExporting(true)
    try {
      const params = filtroUniverse !== 'todos' ? `?universe=${encodeURIComponent(filtroUniverse)}` : ''
      const res = await fetch(`/api/admin/leads/export${params}`)

      if (!res.ok) {
        alert('Erro ao exportar CSV.')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${filtroUniverse !== 'todos' ? filtroUniverse : 'todos'}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Erro ao exportar CSV.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      {/* Filtros + exportação */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {/* Busca */}
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por e-mail…"
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

        {/* Filtro por universo */}
        {universes.length > 0 && (
          <div style={{ display: 'flex', gap: 4, background: 'var(--paper-sunken)', borderRadius: 'var(--r-pill)', padding: 4 }}>
            <button
              onClick={() => setFiltroUniverse('todos')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                background: filtroUniverse === 'todos' ? 'var(--paper-raised)' : 'transparent',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: filtroUniverse === 'todos' ? 'var(--ink-text)' : 'var(--ink-text-mute)',
                cursor: 'pointer',
                transition: 'all var(--dur-base)',
                boxShadow: filtroUniverse === 'todos' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Todos
            </button>
            {universes.map((u) => (
              <button
                key={u}
                onClick={() => setFiltroUniverse(u)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-pill)',
                  border: 'none',
                  background: filtroUniverse === u ? 'var(--paper-raised)' : 'transparent',
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: filtroUniverse === u ? 'var(--ink-text)' : 'var(--ink-text-mute)',
                  cursor: 'pointer',
                  transition: 'all var(--dur-base)',
                  boxShadow: filtroUniverse === u ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {u}
              </button>
            ))}
          </div>
        )}

        <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--ink-text-mute)', marginLeft: 'auto' }}>
          {leadsFiltrados.length} de {leads.length}
        </span>

        {/* Botão exportar CSV */}
        <button
          onClick={handleExport}
          disabled={isExporting || leadsFiltrados.length === 0}
          style={{
            height: 38,
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--paper-raised)',
            border: '1.5px solid var(--paper-border)',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-text-soft)',
            cursor: isExporting || leadsFiltrados.length === 0 ? 'not-allowed' : 'pointer',
            opacity: isExporting || leadsFiltrados.length === 0 ? 0.5 : 1,
            transition: 'all var(--dur-base)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {isExporting ? 'Exportando…' : 'Exportar CSV'}
        </button>
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
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
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
          <span>E-mail</span>
          <span>Universo</span>
          <span>Fonte</span>
          <span>Data</span>
        </div>

        {leadsFiltrados.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-text-mute)' }}>
            Nenhum lead encontrado.
          </div>
        ) : (
          leadsFiltrados.map((lead, i) => (
            <div
              key={lead.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: 12,
                padding: '13px 20px',
                borderTop: i > 0 ? '1px solid var(--paper-border)' : 'none',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-text)' }}>
                {lead.email}
              </span>
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 'var(--r-pill)',
                background: 'rgba(2,196,105,0.08)',
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--green-deep)',
              }}>
                {lead.universe || '—'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-text-mute)' }}>
                {lead.source || '—'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-text-mute)' }}>
                {formatDate(lead.created)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
