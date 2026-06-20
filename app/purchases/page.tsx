import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import PocketBase from 'pocketbase'
import { PedidoRow } from '@/components/purchases/PedidoRow'
import type { Pedido } from '@/types/pedido'

export const metadata: Metadata = {
  title: 'Minhas Compras — Acervo Andarilho',
}

// Impede cache estático — página autenticada com dados dinâmicos
export const dynamic = 'force-dynamic'

async function getPedidos(email: string): Promise<Pedido[]> {
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
  )

  try {
    const records = await pb.collection('orders').getFullList({
      filter: `email = "${email}"`,
      sort: '-created',
    })

    return records.map((r) => ({
      id: r.id,
      stripe_session_id: r.stripe_session_id ?? undefined,
      email: r.email,
      status: r.status ?? 'pending',
      total: typeof r.total === 'number' ? r.total : 0,
      items: Array.isArray(r.items) ? r.items : [],
      payment_method: r.payment_method ?? undefined,
      payment_last4: r.payment_last4 ?? undefined,
      created: r.created,
      frete: r.frete ?? undefined,
      endereco_logradouro: r.endereco_logradouro ?? undefined,
      endereco_numero: r.endereco_numero ?? undefined,
      endereco_complemento: r.endereco_complemento ?? undefined,
      endereco_bairro: r.endereco_bairro ?? undefined,
      endereco_cidade: r.endereco_cidade ?? undefined,
      endereco_estado: r.endereco_estado ?? undefined,
      endereco_cep: r.endereco_cep ?? undefined,
    }))
  } catch {
    return []
  }
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'clamp(48px, 10vh, 80px) 24px',
      background: 'var(--surface)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--r-xl)',
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--surface-raised)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-d3)',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        marginBottom: 8,
      }}>
        Nenhuma compra ainda
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 28,
      }}>
        Suas aquisições aparecerão aqui após a compra.
      </p>
      <Link
        href="/universos"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 44,
          padding: '0 24px',
          background: 'var(--green)',
          color: '#06140d',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: 'var(--r-pill)',
        }}
      >
        Explorar o acervo
      </Link>
    </div>
  )
}

export default async function PurchasesPage() {
  // Lê o cookie de auth do PocketBase para extrair o email do usuário logado
  const cookieStore = await cookies()
  const pbAuthCookie = cookieStore.get('pb_auth')

  let userEmail: string | null = null

  if (pbAuthCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(pbAuthCookie.value))
      userEmail = parsed?.record?.email ?? null
    } catch {
      // cookie malformado — middleware já redirecionaria, mas protege aqui
    }
  }

  if (!userEmail) {
    // Middleware já redireciona antes de chegar aqui, mas protege caso passe
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          Redirecionando para login…
        </p>
      </div>
    )
  }

  const pedidos = await getPedidos(userEmail)
  const totalPago = pedidos
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.total, 0)

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(88px, 12vh, 120px)',
        paddingBottom: 'clamp(64px, 10vh, 96px)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        {/* Breadcrumb de volta para conta */}
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 28,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 'var(--tr-wide)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Minha conta
        </Link>

        {/* Cabeçalho da página */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 'var(--tr-widest)',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 4,
            }}>
              Histórico
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-d1)',
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              Minhas compras
            </h1>
          </div>

          {pedidos.length > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}>
                Total investido
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-d2)',
                color: 'var(--accent)',
                lineHeight: 1,
              }}>
                {formatBRL(totalPago)}
              </p>
            </div>
          )}
        </div>

        {/* Lista de pedidos ou empty state */}
        {pedidos.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pedidos.map((pedido) => (
              <PedidoRow key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}

        {/* Rodapé de suporte */}
        {pedidos.length > 0 && (
          <div style={{
            marginTop: 48,
            paddingTop: 28,
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
            }}>
              Dúvidas sobre seus pedidos?
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="mailto:contato@acervoandarilho.com.br"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 40,
                  padding: '0 18px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--fw-medium)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 'var(--r-pill)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                E-mail
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 40,
                  padding: '0 18px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--fw-medium)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 'var(--r-pill)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
