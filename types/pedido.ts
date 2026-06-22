export interface Pedido {
  id: string
  collectionId?: string
  collectionName?: string
  created: string
  updated?: string
  universo?: string
  versao: string          // 'STD' | 'PRO'
  email: string
  numero_serie?: string | number
  status: string          // 'pago' | 'enviado' | 'entregue' | 'pendente'
  valor_total: number     // em BRL (ex: 289.0)
  valor_frete?: number
  tracking_code?: string
  nome?: string
  cpf?: string
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado?: string
  endereco_cep?: string
  endereco_destinatario?: string
}
