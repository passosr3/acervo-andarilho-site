// Server-side only — usado em Server Components e API routes
// NÃO adicionar 'use client' aqui

const PB_URL = process.env.POCKETBASE_URL ?? 'http://129.121.35.179:8090'

export interface EstoqueRecord {
  id: string
  versao: 'STD' | 'PRO'
  universo: string
  total_lote: number
  disponivel: number
  lote_numero: number
}

export interface EstoqueUniverso {
  std: EstoqueRecord | null
  pro: EstoqueRecord | null
}

export async function fetchEstoque(universo: string): Promise<EstoqueUniverso> {
  try {
    const filter = encodeURIComponent(`universo="${universo}"`)
    const res = await fetch(
      `${PB_URL}/api/collections/estoque/records?filter=${filter}&perPage=10`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return { std: null, pro: null }
    const data = await res.json()
    const items: EstoqueRecord[] = data.items ?? []
    return {
      std: items.find((r) => r.versao === 'STD') ?? null,
      pro: items.find((r) => r.versao === 'PRO') ?? null,
    }
  } catch {
    return { std: null, pro: null }
  }
}
