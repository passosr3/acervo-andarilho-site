import PocketBase from 'pocketbase'
import type { Metadata } from 'next'
import { LeadsAdminTable } from '@/components/admin/LeadsAdminTable'

export const metadata: Metadata = {
  title: 'Leads — Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export interface LeadAdmin {
  id: string
  email: string
  universe: string
  source: string
  created: string
}

async function getLeads(): Promise<LeadAdmin[]> {
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
    const records = await pb.collection('leads').getFullList({
      sort: '-created',
    })

    return records.map((r) => ({
      id: r.id,
      email: r.email ?? '',
      universe: r.universe ?? r.universo ?? '',
      source: r.source ?? '',
      created: r.created,
    }))
  } catch {
    return []
  }
}

export default async function LeadsAdminPage() {
  const leads = await getLeads()

  const byUniverse = leads.reduce((acc, lead) => {
    const u = lead.universe || 'sem-universo'
    if (!acc[u]) acc[u] = 0
    acc[u]++
    return acc
  }, {} as Record<string, number>)

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
          Captação
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-d2)',
          color: 'var(--ink-text)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          Leads
        </h1>
      </div>

      {/* Resumo por universo */}
      {Object.keys(byUniverse).length > 0 && (
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 28,
        }}>
          <div style={{
            padding: '12px 20px',
            background: 'var(--green)',
            borderRadius: 'var(--r-lg)',
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: '#06140d',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>{leads.length}</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-data)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>total</span>
          </div>

          {Object.entries(byUniverse).map(([universe, count]) => (
            <div key={universe} style={{
              padding: '12px 20px',
              background: 'var(--paper-raised)',
              border: '1px solid var(--paper-border)',
              borderRadius: 'var(--r-lg)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-text)', lineHeight: 1 }}>
                {count}
              </div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-text-mute)', marginTop: 4 }}>
                {universe}
              </div>
            </div>
          ))}
        </div>
      )}

      <LeadsAdminTable leads={leads} />
    </div>
  )
}
