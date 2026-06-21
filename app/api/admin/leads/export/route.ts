import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'admin@acervoandarilho.com.br'

function isAdminRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get('pb_auth')
  if (!cookie?.value) return false

  try {
    const parsed = JSON.parse(decodeURIComponent(cookie.value))
    const email = parsed?.record?.email ?? ''
    const token = parsed?.token ?? ''
    return email === ADMIN_EMAIL && typeof token === 'string' && token.length > 0
  } catch {
    return false
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const universe = searchParams.get('universe')

  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Configuração de admin ausente no servidor.' }, { status: 500 })
  }

  try {
    await pb.admins.authWithPassword(adminEmail, adminPassword)
  } catch {
    return NextResponse.json({ error: 'Falha na autenticação admin.' }, { status: 500 })
  }

  try {
    const filter = universe ? `universe = "${universe}"` : ''
    const records = await pb.collection('leads').getFullList({
      sort: '-created',
      filter: filter || undefined,
    })

    // Gera CSV
    const header = 'id,email,universo,fonte,data_cadastro'
    const rows = records.map((r) => {
      const date = new Date(r.created).toLocaleDateString('pt-BR')
      return [
        escapeCsvField(r.id ?? ''),
        escapeCsvField(r.email ?? ''),
        escapeCsvField(r.universe ?? r.universo ?? ''),
        escapeCsvField(r.source ?? ''),
        escapeCsvField(date),
      ].join(',')
    })

    const csv = [header, ...rows].join('\n')
    const filename = universe
      ? `leads-${universe}-${new Date().toISOString().slice(0, 10)}.csv`
      : `leads-todos-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao exportar leads.' }, { status: 502 })
  }
}
