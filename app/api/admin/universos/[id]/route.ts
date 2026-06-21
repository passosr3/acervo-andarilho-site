import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'admin@acervoandarilho.com.br'

const VALID_STATUS = ['ativo', 'em-breve', 'inativo'] as const
type UniversoStatus = typeof VALID_STATUS[number]

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  const allowedFields = ['status', 'description', 'accent_color', 'lp_url']
  const patch: Record<string, unknown> = {}

  for (const field of allowedFields) {
    if (field in body) {
      patch[field] = body[field]
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo válido.' }, { status: 400 })
  }

  if ('status' in patch) {
    if (!VALID_STATUS.includes(patch.status as UniversoStatus)) {
      return NextResponse.json({ error: 'status inválido.' }, { status: 422 })
    }
  }

  const pb = new PocketBase(PB_URL)
  pb.autoCancellation(false)

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Configuração de admin ausente.' }, { status: 500 })
  }

  try {
    await pb.admins.authWithPassword(adminEmail, adminPassword)
  } catch {
    return NextResponse.json({ error: 'Falha na autenticação admin.' }, { status: 500 })
  }

  try {
    const updated = await pb.collection('universos').update(id, patch)
    return NextResponse.json({ ok: true, record: { id: updated.id, status: updated.status } })
  } catch (err: unknown) {
    const pbErr = err as { status?: number }
    if (pbErr?.status === 404) {
      return NextResponse.json({ error: 'Universo não encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar universo.' }, { status: 502 })
  }
}
