import { cookies } from 'next/headers'
import Link from 'next/link'
import PocketBase from 'pocketbase'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'admin@acervoandarilho.com.br'

async function getAdminPb() {
  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword)
    } catch {
      // Segue sem auth de admin — queries públicas ainda funcionam
    }
  }

  return pb
}

async function getDashboardMetrics() {
  const pb = await getAdminPb()

  try {
    const [ordersResult, leadsResult, universosResult] = await Promise.allSettled([
      pb.collection('orders').getList(1, 1, { sort: '-created' }),
      pb.collection('leads').getList(1, 1),
      pb.collection('universos').getFullList(),
    ])

    const totalPedidos = ordersResult.status === 'fulfilled' ? ordersResult.value.totalItems : 0
    const totalLeads = leadsResult.status === 'fulfilled' ? leadsResult.value.totalItems : 0
    const universos = universosResult.status === 'fulfilled' ? universosResult.value : []

    // Pedidos pagos recentes
    let pedidosRecentes: Array<{
      id: string
      email: string
      status: string
      total: number
      created: string
    }> = []
    try {
      const recentOrders = await pb.collection('orders').getList(1, 5, {
        sort: '-created',
      })
      pedidosRecentes = recentOrders.items.map((r) => ({
        id: r.id,
        email: r.email ?? '',
        status: r.status ?? 'pending',
        total: typeof r.total === 'number' ? r.total : 0,
        created: r.created,
      }))
    } catch {
      // ignore
    }

    // Receita total (pedidos paid)
    let receitaTotal = 0
    try {
      const paidOrders = await pb.collection('orders').getFullList({
        filter: 'status = "paid"',
        fields: 'total',
      })
      receitaTotal = paidOrders.reduce((acc, r) => acc + (typeof r.total === 'number' ? r.total : 0), 0)
    } catch {
      // ignore
    }

    // Pedidos pendentes de envio
    let pedidosPendentesEnvio = 0
    try {
      const pending = await pb.collection('orders').getList(1, 1, {
        filter: 'status = "paid" && (status_envio = "" || status_envio = "producao")',
      })
      pedidosPendentesEnvio = pending.totalItems
    } catch {
      // ignore
    }

    return {
      totalPedidos,
      totalLeads,
      totalUniversos: universos.length,
      receitaTotal,
      pedidosPendentesEnvio,
      pedidosRecentes,
    }
  } catch {
    return {
      totalPedidos: 0,
      totalLeads: 0,
      totalUniversos: 0,
      receitaTotal: 0,
      pedidosPendentesEnvio: 0,
      pedidosRecentes: [],
    }
  }
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  paid:     { label: 'Pago',       color: 'var(--green-deep)', bg: 'rgba(2,196,105,0.12)' },
  pending:  { label: 'Aguardando', color: 'var(--amber)',      bg: 'var(--amber-dim)' },
  refunded: { label: 'Estornado',  color: 'var(--danger)',     bg: 'var(--danger-dim)' },
}

export default async function AdminPage() {
  const metrics = await getDashboardMetrics()

  const stats = [
    { value: String(metrics.totalPedidos), label: 'pedidos', green: false, href: '/admin/pedidos' },
    { value: formatBRL(metrics.receitaTotal), label: 'receita total', green: true, href: null },
    { value: String(metrics.pedidosPendentesEnvio), label: 'para enviar', green: false, href: '/admin/pedidos', alert: metrics.pedidosPendentesEnvio > 0 },
    { value: String(metrics.totalLeads), label: 'leads', green: false, href: '/admin/leads' },
  ]

  return (
    <div>
      {/* Topbar */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--green-deep)',
          marginBottom: 4,
        }}>
          Bem-vindo, Ronaldo
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-d2)',
          color: 'var(--ink-text)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          Visão Geral
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 36,
      }}>
        {stats.map((s) => {
          const card = (
            <div style={{
              background: s.green ? 'var(--green)' : 'var(--paper-raised)',
              border: s.green ? 'none' : `1px solid ${s.alert ? 'var(--amber)' : 'var(--paper-border)'}`,
              borderRadius: 'var(--r-xl)',
              padding: '22px 24px',
              cursor: s.href ? 'pointer' : 'default',
              transition: 'transform var(--dur-base)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                color: s.green ? '#06140d' : s.alert ? 'var(--amber)' : 'var(--ink-text)',
                lineHeight: 0.9,
                marginBottom: 8,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: s.green ? 'rgba(6,20,13,0.7)' : s.alert ? 'var(--amber)' : 'var(--ink-text-mute)',
              }}>
                {s.label}
              </div>
            </div>
          )

          return s.href ? (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          )
        })}
      </div>

      {/* Atalhos rápidos */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        {[
          { href: '/admin/pedidos', label: 'Gerenciar pedidos' },
          { href: '/admin/universos', label: 'Gerenciar universos' },
          { href: '/admin/leads', label: 'Ver leads' },
        ].map((btn) => (
          <Link
            key={btn.href}
            href={btn.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 40,
              padding: '0 20px',
              background: 'var(--paper-raised)',
              border: '1.5px solid var(--paper-border)',
              borderRadius: 'var(--r-pill)',
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--ink-text-soft)',
              textDecoration: 'none',
              transition: 'border-color var(--dur-base)',
            }}
          >
            {btn.label}
          </Link>
        ))}
      </div>

      {/* Pedidos recentes */}
      {metrics.pedidosRecentes.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-d3)',
              color: 'var(--ink-text)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              Pedidos Recentes
            </h2>
            <Link
              href="/admin/pedidos"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--green-deep)',
                textDecoration: 'none',
              }}
            >
              Ver todos →
            </Link>
          </div>

          <div style={{
            background: 'var(--paper-raised)',
            border: '1px solid var(--paper-border)',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1fr',
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
              <span>ID</span>
              <span>E-mail</span>
              <span>Status</span>
              <span>Total</span>
            </div>

            {metrics.pedidosRecentes.map((p, i) => {
              const st = STATUS_STYLE[p.status] ?? { label: p.status, color: 'var(--ink-text-mute)', bg: 'var(--paper-sunken)' }
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr',
                    gap: 12,
                    padding: '14px 20px',
                    borderTop: i > 0 ? '1px solid var(--paper-border)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-text-mute)' }}>
                    #{p.id.slice(0, 8)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.email}
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
                      color: st.color,
                      background: st.bg,
                    }}>
                      {st.label}
                    </span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-text)' }}>
                    {formatBRL(p.total)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
