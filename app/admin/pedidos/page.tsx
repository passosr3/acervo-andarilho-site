import PocketBase from 'pocketbase'
import type { Metadata } from 'next'
import { PedidosAdminTable } from '@/components/admin/PedidosAdminTable'

export const metadata: Metadata = {
  title: 'Pedidos — Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export interface PedidoAdmin {
  id: string
  email: string
  status: string
  status_envio: string
  tracking_code: string
  total: number
  created: string
  items: Array<{ name?: string; description?: string; quantity?: number; amount?: number }>
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado?: string
  endereco_cep?: string
  frete?: number
  universo?: string
}

async function getPedidos(): Promise<PedidoAdmin[]> {
  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword)
    } catch {
      // segue sem admin auth
    }
  }

  try {
    const records = await pb.collection('orders').getFullList({
      sort: '-created',
    })

    return records.map((r) => ({
      id: r.id,
      email: r.email ?? '',
      status: r.status ?? 'pending',
      status_envio: r.status_envio ?? '',
      tracking_code: r.tracking_code ?? '',
      total: typeof r.total === 'number' ? r.total : 0,
      created: r.created,
      items: Array.isArray(r.items) ? r.items : [],
      endereco_logradouro: r.endereco_logradouro ?? undefined,
      endereco_numero: r.endereco_numero ?? undefined,
      endereco_complemento: r.endereco_complemento ?? undefined,
      endereco_bairro: r.endereco_bairro ?? undefined,
      endereco_cidade: r.endereco_cidade ?? undefined,
      endereco_estado: r.endereco_estado ?? undefined,
      endereco_cep: r.endereco_cep ?? undefined,
      frete: r.frete ?? undefined,
      universo: r.universo ?? undefined,
    }))
  } catch {
    return []
  }
}

export default async function PedidosAdminPage() {
  const pedidos = await getPedidos()

  return (
    <div>
      {/* Topbar */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--green-deep)',
          marginBottom: 4,
        }}>
          Operação
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-d2)',
          color: 'var(--ink-text)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          Pedidos
        </h1>
      </div>

      <PedidosAdminTable pedidos={pedidos} />
    </div>
  )
}
