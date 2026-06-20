import { NextRequest, NextResponse } from 'next/server'

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://129.121.35.179:8090'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.email || !body?.universe) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 422 })
  }

  const res = await fetch(`${PB_URL}/api/collections/leads/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: body.email.toLowerCase().trim(),
      universe: body.universe,
      source: body.source ?? 'teaser_site',
    }),
  })

  if (res.ok) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  // PocketBase retorna 400 com código "validation_not_unique" para duplicatas
  if (res.status === 400) {
    const pb = await res.json().catch(() => ({}))
    const isdup =
      pb?.data?.email?.code === 'validation_not_unique' ||
      JSON.stringify(pb).includes('not_unique')
    if (isdup) {
      return NextResponse.json({ duplicate: true }, { status: 409 })
    }
  }

  return NextResponse.json({ error: 'Erro ao registrar.' }, { status: 502 })
}
