export interface Pedido {
  id: string
  stripe_session_id?: string
  email: string
  status: 'paid' | 'pending' | 'refunded' | string
  total: number          // em centavos
  items: PedidoItem[]
  payment_method?: string
  payment_last4?: string
  created: string        // ISO datetime string do PocketBase
  frete?: number         // em centavos

  // Endereço de entrega
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado?: string
  endereco_cep?: string
}

export interface PedidoItem {
  description?: string
  name?: string
  amount?: number  // em centavos
  quantity?: number
}
