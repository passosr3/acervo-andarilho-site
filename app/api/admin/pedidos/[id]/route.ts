import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'admin@acervoandarilho.com.br'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'contato@acervoandarilho.com.br'

const VALID_STATUS_ENVIO = ['producao', 'enviado', 'entregue', ''] as const
type StatusEnvio = typeof VALID_STATUS_ENVIO[number]

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

async function sendShippedEmail(pedidoEmail: string, trackingCode: string, pedidoId: string) {
  if (!RESEND_API_KEY) return

  const trackingMsg = trackingCode
    ? `Seu código de rastreio é: <strong>${trackingCode}</strong>`
    : 'Em breve você receberá o código de rastreio.'

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Acervo Andarilho <${FROM_EMAIL}>`,
        to: [pedidoEmail],
        subject: 'Seu pedido foi enviado! 🚀',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #f4f4f4; border-radius: 12px;">
            <h1 style="font-size: 28px; color: #1e1e1e; margin-bottom: 16px;">Seu pedido foi enviado!</h1>
            <p style="font-size: 16px; color: #4c534e; line-height: 1.6; margin-bottom: 20px;">
              Olá! Seu pedido <strong>#${pedidoId.slice(0, 8)}</strong> do Acervo Andarilho saiu para entrega.
            </p>
            <p style="font-size: 16px; color: #4c534e; line-height: 1.6; margin-bottom: 24px;">
              ${trackingMsg}
            </p>
            <p style="font-size: 14px; color: #767d78; margin-bottom: 0;">
              Qualquer dúvida, responda este e-mail ou entre em contato em <a href="mailto:${FROM_EMAIL}" style="color: #02c469;">${FROM_EMAIL}</a>.
            </p>
          </div>
        `,
      }),
    })
  } catch {
    // Não bloquear a atualização do pedido por falha no e-mail
    console.error('[admin] Falha ao enviar e-mail de rastreio')
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verificar auth admin
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const { id } = await params

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  // 2. Parsear body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  // 3. Validar campos permitidos
  const allowedFields = ['tracking_code', 'status_envio']
  const patch: Record<string, unknown> = {}

  for (const field of allowedFields) {
    if (field in body) {
      patch[field] = body[field]
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo válido para atualizar.' }, { status: 400 })
  }

  if ('status_envio' in patch) {
    const val = patch.status_envio as string
    if (!VALID_STATUS_ENVIO.includes(val as StatusEnvio)) {
      return NextResponse.json({ error: 'status_envio inválido.' }, { status: 422 })
    }
  }

  if ('tracking_code' in patch) {
    const tc = String(patch.tracking_code).trim()
    if (tc.length > 50) {
      return NextResponse.json({ error: 'tracking_code muito longo.' }, { status: 422 })
    }
    patch.tracking_code = tc
  }

  // 4. Atualizar no PocketBase com credenciais admin
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
    // Busca o pedido atual para saber o e-mail e status anterior
    const pedidoAtual = await pb.collection('orders').getOne(id)
    const statusEnvioAnterior = pedidoAtual.status_envio ?? ''

    // Atualiza
    const updated = await pb.collection('orders').update(id, patch)

    // Dispara e-mail se mudou para "enviado"
    const novoStatusEnvio = patch.status_envio as string | undefined
    if (
      novoStatusEnvio === 'enviado' &&
      statusEnvioAnterior !== 'enviado' &&
      pedidoAtual.email
    ) {
      const trackingCode = (patch.tracking_code as string | undefined) ?? pedidoAtual.tracking_code ?? ''
      await sendShippedEmail(pedidoAtual.email, trackingCode, id)
    }

    return NextResponse.json({ ok: true, record: { id: updated.id, status_envio: updated.status_envio, tracking_code: updated.tracking_code } })
  } catch (err: unknown) {
    const pbErr = err as { status?: number; message?: string }
    if (pbErr?.status === 404) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
    }
    console.error('[admin/pedidos] Erro ao atualizar:', pbErr)
    return NextResponse.json({ error: 'Erro ao atualizar pedido.' }, { status: 502 })
  }
}
