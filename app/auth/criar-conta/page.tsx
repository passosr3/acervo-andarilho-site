import type { Metadata } from 'next'
import { CadastroForm } from '@/components/forms/CadastroForm'

export const metadata: Metadata = {
  title: 'Criar Conta — Acervo Andarilho',
}

export default function CriarContaPage() {
  return <CadastroForm />
}
