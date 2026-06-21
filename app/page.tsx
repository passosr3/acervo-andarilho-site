import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { LoreSection } from '@/components/sections/LoreSection'
import { ProcessoSection } from '@/components/sections/ProcessoSection'
import { CriadorSection } from '@/components/sections/CriadorSection'
import { UniversosGrid } from '@/components/sections/UniversosGrid'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

export const metadata: Metadata = {
  title: 'Acervo Andarilho — Artefatos de Universos Infinitos',
  description:
    'Colecionáveis artesanais numerados inspirados em universos de ficção. Cada peça, uma relíquia de outro mundo.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    // aa-paper aplica as variáveis semânticas do tema claro para as seções light
    <div className="aa-paper">
      <HeroSection />
      <LoreSection />
      <ProcessoSection />
      <CriadorSection />
      <UniversosGrid />
      <ClosingCTA />
    </div>
  )
}
