import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PocketBase from 'pocketbase'
import type { Metadata } from 'next'
import { ColecaoCard, type Pedido } from '@/components/account/ColecaoCard'
import { ColecaoEmpty } from '@/components/account/ColecaoEmpty'

export const metadata: Metadata = {
  title: 'Minha Conta — Acervo Andarilho',
  description: 'Seu acervo de artefatos colecionáveis numerados.',
  robots: { index: false, follow: false },
}

// Força renderização dinâmica — dados sempre frescos e protegidos por cookie
export const dynamic = 'force-dynamic'

async function getPbServerInstance() {
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
  )
  // Silencia auto-refresh no servidor (não há store de sessão)
  pb.autoCancellation(false)
  return pb
}

export default async function AccountPage() {
  // 1. Lê cookie de auth
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('pb_auth')

  if (!authCookie?.value) {
    redirect('/auth/login?redirect=/account')
  }

  // 2. Autentica o PocketBase server-side via cookie
  const pb = await getPbServerInstance()
  try {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`)
  } catch {
    redirect('/auth/login?redirect=/account')
  }

  if (!pb.authStore.isValid) {
    redirect('/auth/login?redirect=/account')
  }

  const user = pb.authStore.record

  if (!user) {
    redirect('/auth/login?redirect=/account')
  }

  // 3. Busca pedidos do colecionador
  let pedidos: Pedido[] = []
  try {
    const result = await pb.collection('pedidos').getList<Pedido>(1, 50, {
      filter: `email="${user.email}"`,
      sort: '-created',
    })
    pedidos = result.items
  } catch {
    // Se a collection ainda não existir ou ocorrer erro, renderiza tela vazia
    pedidos = []
  }

  // 4. Dados derivados
  const totalPecas = pedidos.filter((p) => p.status !== 'pending').length
  const iniciaisNome = (user.name as string || user.email as string || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const dataDesde = new Date(user.created as string).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  const primeiroNome = ((user.name as string) || '').split(' ')[0] || 'Colecionador'

  return (
    <main
      style={{
        paddingTop: 100,
        minHeight: '100vh',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: '0 var(--gutter) clamp(60px, 8vh, 96px)',
        }}
      >
        {/* ── Cabeçalho da Conta ── */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            flexWrap: 'wrap',
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {/* Avatar com iniciais */}
          <span
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--aa-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 'var(--fw-bold)',
              color: '#06140d',
              flexShrink: 0,
              boxShadow: 'var(--glow-sm)',
            }}
          >
            {iniciaisNome || '◆'}
          </span>

          {/* Nome + e-mail */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--tr-widest)',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 4,
              }}
            >
              Colecionador desde {dataDesde}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-d2)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}
            >
              Olá, {primeiroNome}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                marginTop: 4,
                letterSpacing: '0.04em',
              }}
            >
              {user.email as string}
            </p>
          </div>

          {/* Contador de peças */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '16px 24px',
              background: 'var(--accent-fill)',
              border: '1px solid var(--accent-line)',
              borderRadius: 'var(--r-lg)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-d2)',
                color: 'var(--accent)',
                lineHeight: 1,
                textShadow: 'var(--text-glow-soft)',
              }}
            >
              {totalPecas}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--tr-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {totalPecas === 1 ? 'peça no acervo' : 'peças no acervo'}
            </span>
          </div>
        </header>

        {/* ── Seção: Minha Coleção ── */}
        <section aria-labelledby="colecao-heading">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <h2
              id="colecao-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-d3)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Minha Coleção
            </h2>

            {pedidos.length > 0 && (
              <Link
                href="/purchases"
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--fw-semibold)',
                  letterSpacing: 'var(--tr-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Ver histórico completo
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          {/* Grid de cards ou estado vazio */}
          {pedidos.length === 0 ? (
            <ColecaoEmpty />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
                gap: 12,
              }}
            >
              {pedidos.map((pedido) => (
                <ColecaoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          )}
        </section>

        {/* ── Link rápido para histórico (rodapé da seção) ── */}
        {pedidos.length > 0 && (
          <div
            style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/purchases"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 44,
                padding: '0 24px',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1.5px solid var(--border-emph)',
                borderRadius: 'var(--r-pill)',
                textDecoration: 'none',
              }}
            >
              Ver histórico completo de compras
            </Link>
          </div>
        )}
      </div>

      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 480px) {
          [data-account-header] {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  )
}
