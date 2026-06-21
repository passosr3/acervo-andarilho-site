// Acervo Andarilho — conteúdo canônico da página principal
// Espelha data.js do Design System, mas em TypeScript com tipagem explícita.

export type UniverseStatus = 'ativo' | 'em-breve'

export interface Universe {
  id: string
  name: string
  universe: string
  icon: string
  tagline: string
  status: UniverseStatus
  image?: string
  edition: string
  priceFrom: number | null
  landingUrl?: string
  stock?: { available: number; total: number }
  accent: string
  blurb: string
}

export interface PageContent {
  heroEyebrow: string
  heroTitleLine1: string
  heroTitleLine2: string
  heroDescription: string
  processoEyebrow: string
  processoTitle: string
  loreEyebrow: string
  loreTitle: string
  loreBody: string
  criadorEyebrow: string
  creatorName: string
  creatorBody: string
  creatorQuote: string
  creatorVideoUrl: string
  creatorVideoOverlay: string
  universosEyebrow: string
  universosTitle: string
}

export const AA_UNIVERSES: Universe[] = [
  {
    id: 'darkalien',
    name: 'DarkAlien',
    universe: 'Ficção Científica',
    icon: 'icon-ficcao',
    tagline: 'Espécime alienígena selado em acrílico. Lote 01 — 50 unidades, montagem manual.',
    status: 'ativo',
    edition: 'Lote 01 · 50 unidades',
    priceFrom: 390,
    landingUrl: 'https://darkalien.acervoandarilho.com',
    stock: { available: 14, total: 50 },
    accent: '#03ff88',
    blurb: 'Um artefato que não deveria ter chegado até você. Peça numerada, tiragem fechada, montada à mão. Quando o Lote 01 acabar, não há previsão do que vem depois.',
  },
  {
    id: 'lendas',
    name: 'Lanterna do Curupira',
    universe: 'Lendas',
    icon: 'icon-lendas',
    tagline: 'O guardião das matas, capturado em resina. Brasa verde que não apaga.',
    status: 'em-breve',
    edition: 'Lote 01 · em produção',
    priceFrom: null,
    accent: '#03ff88',
    blurb: 'O Andarilho entrou numa floresta que não aparece no mapa. O que ele trouxe de lá ainda está sendo selado.',
  },
  {
    id: 'terror',
    name: 'Relicário do Pesadelo',
    universe: 'Terror',
    icon: 'icon-terror',
    tagline: 'Uma caixa que respira no escuro. Não recomendada para os medrosos.',
    status: 'em-breve',
    edition: 'Lote 01 · em produção',
    priceFrom: null,
    accent: '#ff4d5e',
    blurb: 'Há universos de onde se volta diferente. O Andarilho voltou. O que ele trouxe ainda não tem nome.',
  },
  {
    id: 'mitos',
    name: 'Tótem de Cronos',
    universe: 'Mitos',
    icon: 'icon-mitos',
    tagline: 'O tempo preso numa coluna. Retirado de um templo que nunca existiu.',
    status: 'em-breve',
    edition: 'Lote 01 · em produção',
    priceFrom: null,
    accent: '#a06bff',
    blurb: 'Mitologia não é o passado. É outro endereço — e o Andarilho já esteve lá.',
  },
]

export const AA_PAGE: PageContent = {
  heroEyebrow: 'Acervo · Andarilho',
  heroTitleLine1: 'Relíquias de',
  heroTitleLine2: 'outros mundos',
  heroDescription:
    'Um Andarilho cruza universos e volta com provas. O que ele encontra, sela à mão — peça numerada, tiragem fechada. Não há reposição. Só existe uma chance de entrar num lote.',
  processoEyebrow: 'O Processo',
  processoTitle: 'De onde vêm as relíquias',
  loreEyebrow: 'A Lore',
  loreTitle: 'O Andarilho não pertence\na lugar nenhum',
  loreBody:
    'Filmes, lendas, mitos, terror, ficção científica. Cada porta que ele abre leva a um mundo diferente — e de cada travessia ele volta com um objeto. Não fabrica souvenirs. Traz provas de que aqueles mundos existem.',
  criadorEyebrow: 'O Criador',
  creatorName: 'Ronaldo Passos',
  creatorBody:
    'O Acervo Andarilho é a marca pessoal de Ronaldo Passos. Cada peça nasce na sua bancada: modelada, impressa em 3D, montada, pintada e selada à mão. Não existe linha de produção. Existe um artesão, uma bancada e um número de série.',
  creatorQuote:
    'Eu não fabrico souvenirs. Eu trago de volta provas de que aqueles mundos existem.',
  creatorVideoUrl: '',
  creatorVideoOverlay: 'a bancada do Andarilho · em breve',
  universosEyebrow: 'O Acervo',
  universosTitle: 'Universos coletados',
}
