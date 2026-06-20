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
    tagline: 'Specimen JAR — espécime alienígena suspenso, luz bioluminescente.',
    status: 'ativo',
    edition: 'Lote 01 · 50 unidades',
    priceFrom: 390,
    landingUrl: 'https://darkalien.acervoandarilho.com',
    stock: { available: 14, total: 50 },
    accent: '#03ff88',
    blurb: 'Um artefato que não deveria ter chegado até você. Peça numerada, tiragem fechada, montada à mão.',
  },
  {
    id: 'lendas',
    name: 'Lanterna do Curupira',
    universe: 'Lendas',
    icon: 'icon-lendas',
    tagline: 'O guardião das matas, esculpido em resina e brasa verde.',
    status: 'em-breve',
    edition: 'Lote 01 · em produção',
    priceFrom: null,
    accent: '#03ff88',
    blurb: 'O Andarilho cruzou florestas que falam. O que ele trouxe de lá ainda está sendo selado.',
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
    blurb: 'Há universos de onde se volta diferente. Este é um deles.',
  },
  {
    id: 'mitos',
    name: 'Tótem de Cronos',
    universe: 'Mitos',
    icon: 'icon-mitos',
    tagline: 'O tempo, preso numa coluna. Roubado de um templo que nunca existiu.',
    status: 'em-breve',
    edition: 'Lote 01 · em produção',
    priceFrom: null,
    accent: '#a06bff',
    blurb: 'Mitologia não é o passado. É outro endereço.',
  },
]

export const AA_PAGE: PageContent = {
  heroEyebrow: 'Acervo · Andarilho',
  heroTitleLine1: 'Ítens de',
  heroTitleLine2: 'outros mundos',
  heroDescription:
    'Existe um Andarilho que viaja entre universos em busca de relíquias. O que ele encontra, ele sela à mão — numerado, em tiragem fechada — e repassa a quem coleciona.',
  processoEyebrow: 'O Processo',
  processoTitle: 'Como uma relíquia chega até você',
  loreEyebrow: 'A Lore',
  loreTitle: 'O Andarilho não pertence\na lugar nenhum',
  loreBody:
    'Filmes, séries, lendas, mitos, terror, ficção. Cada porta leva a um mundo, e de cada travessia ele traz uma relíquia. Não fabrica souvenirs — traz provas de que aqueles mundos existem.',
  criadorEyebrow: 'O Criador',
  creatorName: 'Ronaldo Passos',
  creatorBody:
    'O Acervo Andarilho é a marca pessoal de Ronaldo Passos. Cada peça nasce na sua bancada — modelada, impressa em 3D, montada, pintada e selada à mão. Não há linha de produção: há um artesão e um número de série.',
  creatorQuote:
    'Eu não fabrico souvenirs. Eu trago de volta provas de que aqueles mundos existem.',
  creatorVideoUrl: '',
  creatorVideoOverlay: 'a bancada do Andarilho · em breve',
  universosEyebrow: 'O Acervo',
  universosTitle: 'Universos coletados',
}
