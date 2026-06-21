import PocketBase from 'pocketbase'
import type { Metadata } from 'next'
import { UniversosAdminTable } from '@/components/admin/UniversosAdminTable'

export const metadata: Metadata = {
  title: 'Universos — Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export interface UniversoAdmin {
  id: string
  slug: string
  nome: string
  status: string
  accent_color?: string
  description?: string
  lp_url?: string
  ordem?: number
  created: string
  updated: string
}

async function getUniversos(): Promise<UniversoAdmin[]> {
  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword)
    } catch {
      // segue
    }
  }

  try {
    const records = await pb.collection('universos').getFullList({
      sort: 'ordem,nome',
    })

    return records.map((r) => ({
      id: r.id,
      slug: r.slug ?? '',
      nome: r.nome ?? r.name ?? r.id,
      status: r.status ?? 'em-breve',
      accent_color: r.accent_color ?? undefined,
      description: r.description ?? undefined,
      lp_url: r.lp_url ?? undefined,
      ordem: typeof r.ordem === 'number' ? r.ordem : undefined,
      created: r.created,
      updated: r.updated,
    }))
  } catch {
    return []
  }
}

export default async function UniversosAdminPage() {
  const universos = await getUniversos()

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
          Catálogo
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-d2)',
          color: 'var(--ink-text)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          Universos
        </h1>
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-text-mute)',
        marginBottom: 28,
      }}>
        Ative ou desative universos. Para editar produtos e schema completo, use o{' '}
        <a
          href={`${PB_URL}/_/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--green-deep)', textDecoration: 'underline' }}
        >
          PocketBase Admin UI
        </a>
        .
      </p>

      <UniversosAdminTable universos={universos} />
    </div>
  )
}
