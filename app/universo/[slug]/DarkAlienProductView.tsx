'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─────────────────────────────────────────────
// Constantes — editar aqui para customizar o produto
// ─────────────────────────────────────────────

const ACCENT = '#03ff88'
const ACCENT_CONTRAST = '#06140d'

// URL da landing page + seção de escolha — alterar por produto
const LP_URL = 'https://acervoandarilho.com.br/darkalien#versoes'

// ─────────────────────────────────────────────
// Galeria — cada imagem tem titulo + legenda exibidos ao selecionar
// ─────────────────────────────────────────────

interface GaleriaItem {
  src: string
  alt: string
  titulo: string
  legenda: string
}

const GALERIA: GaleriaItem[] = [
  {
    src: '/images/darkalien/darkalien_02_promocional.png',
    alt: 'DarkAlien Specimen JAR — foto principal',
    titulo: 'O artefato completo',
    legenda:
      'Cilindro acrílico verde pré-colorido, espécime em suspensão, base de contenção iluminada. Cada unidade numerada e montada à mão em 3 a 4 dias.',
  },
  {
    src: '/images/darkalien/darkalien_02_promocional_B.png',
    alt: 'DarkAlien — ângulo lateral',
    titulo: 'Ângulo lateral',
    legenda:
      'A silhueta do Specimen JAR — nenhum ângulo é igual ao outro. A geometria octogonal do Topo visível de qualquer posição.',
  },
  {
    src: '/images/darkalien/darkalien_02_promocional_c.png',
    alt: 'DarkAlien — vista frontal',
    titulo: 'Vista frontal',
    legenda:
      'O espécime visível através do acrílico verde. A cor está no material — não é pintura, não desbota.',
  },
  {
    src: '/images/darkalien/raff_02_topo_A.png',
    alt: 'Módulo Topo — Lid octogonal',
    titulo: 'Módulo Topo — Lid octogonal',
    legenda:
      'Tampa em geometria octogonal impressa em 3D. Insert de acrílico leitoso que difunde a luz sem queimar o olho.',
  },
  {
    src: '/images/darkalien/raff_02_topo_B.png',
    alt: 'Topo com iluminação ativa',
    titulo: 'Topo com iluminação ativa',
    legenda:
      'O LED integrado transforma o cilindro num objeto vivo. Intensidade calculada para criar profundidade — não para clarear o ambiente.',
  },
  {
    src: '/images/darkalien/raff_02_topo_C.png',
    alt: 'Detalhe do insert de acrílico',
    titulo: 'Insert de acrílico leitoso',
    legenda:
      'O insert no centro do Lid é o que separa a luz bruta de uma iluminação com caráter. Cada Topo é fixado à mão.',
  },
  {
    src: '/images/darkalien/alien.png',
    alt: 'O espécime alienígena',
    titulo: 'O espécime',
    legenda:
      'Anatomia 100% autoral — modelada digitalmente, impressa em 3D. Sem franquia, sem IP de terceiros. O espécime que não deveria ter chegado aqui.',
  },
  {
    src: '/images/darkalien/raff_02_basecompleta_A.png',
    alt: 'Base de Contenção — Versão PRO',
    titulo: 'Base de Contenção — Versão PRO',
    legenda:
      'Módulo SCC-79/1A integrado: iluminação colorida em 8 modos, bateria recarregável via USB-C e modo BREACH — vibração + alerta sonoro.',
  },
  {
    src: '/images/darkalien/raff_02_basecompleta_B.png',
    alt: 'Base STD',
    titulo: 'Base — Versão STD',
    legenda:
      'Alimentação USB-C direta, iluminação branca integrada. Simples. Funcional. A contenção que o espécime exige.',
  },
]

// ─────────────────────────────────────────────
// Especificações técnicas
// ─────────────────────────────────────────────

const SPECS = [
  { label: 'Material', valor: 'Resina acrílica + impressão 3D + pintura manual' },
  { label: 'Espécime', valor: 'PLA impresso em 3D — anatomia autoral' },
  { label: 'Cilindro', valor: 'Acrílico verde pré-colorido (cor no material, não pintura)' },
  { label: 'Iluminação', valor: 'LED branca (topo + base) · versão PRO: 8 modos de cor' },
  { label: 'Alimentação', valor: 'USB-C · versão PRO: bateria recarregável interna' },
  { label: 'Lote', valor: 'Lote 01 — 50 unidades numeradas' },
  { label: 'Produção', valor: '3 a 4 dias por unidade — montagem 100% manual' },
  { label: 'O que inclui', valor: 'Base + cilindro + topo + carta de autenticidade numerada' },
]

const FEATURES_STD = [
  'Espécime 3D autoral em suspensão',
  'Cilindro acrílico verde pré-colorido',
  'Iluminação branca topo + base',
  'Alimentação USB-C',
  'Carta de autenticidade numerada',
]

const FEATURES_PRO_EXTRA = [
  'Módulo SCC-79/1A integrado na base',
  'Bateria recarregável via USB-C',
  'Iluminação colorida — 8 modos de cor',
  'Modo BREACH: vibração + alerta sonoro',
  'Operação 100% sem fio',
]

// ─────────────────────────────────────────────
// Sub-componente: Galeria com legenda
// ─────────────────────────────────────────────

function Galeria() {
  const [ativo, setAtivo] = useState(0)
  const item = GALERIA[ativo]

  return (
    <section
      aria-label="Galeria de fotos do DarkAlien"
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: ACCENT,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Galeria do Produto
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 5vw, 44px)',
          lineHeight: 1.0,
          color: 'var(--text)',
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        {item.titulo}
      </h2>

      {/* Imagem principal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          maxWidth: 800,
          margin: '0 auto',
          background: '#0a0a0a',
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${ACCENT}22`,
        }}
      >
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          style={{ objectFit: 'contain', padding: 24 }}
          sizes="(max-width: 768px) 100vw, 800px"
          priority={ativo === 0}
        />
      </div>

      {/* Legenda */}
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '20px 0 32px',
          borderBottom: '1px solid var(--border)',
          minHeight: 64,
        }}
      >
        <p
          style={{
            color: 'var(--text-soft)',
            fontSize: 15,
            lineHeight: 1.6,
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {item.legenda}
        </p>
      </div>

      {/* Thumbnails */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 800,
          margin: '24px auto 0',
        }}
      >
        {GALERIA.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setAtivo(i)}
            aria-label={img.alt}
            aria-pressed={ativo === i}
            style={{
              width: 76,
              height: 76,
              padding: 0,
              border: `2px solid ${ativo === i ? ACCENT : 'var(--border)'}`,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#0a0a0a',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              transition: 'border-color 0.15s ease, transform 0.12s ease',
              transform: ativo === i ? 'scale(1.05)' : 'none',
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'contain', padding: 6 }}
              sizes="76px"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

interface Props {
  stdDisponivel?: number | null
  proDisponivel?: number | null
  totalLote?: number
}

export function DarkAlienProductView({ stdDisponivel = null, proDisponivel = null, totalLote = 50 }: Props) {
  const stockLabel =
    stdDisponivel !== null
      ? `${stdDisponivel} de ${totalLote} restantes · Produção manual`
      : 'Produção manual · tiragem limitada'

  const stockLabelFull =
    stdDisponivel !== null
      ? `${stdDisponivel} de ${totalLote} restantes · Versão STD R$ 289 · Versão PRO R$ 329`
      : 'Versão STD R$ 289 · Versão PRO R$ 329'
  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section
        aria-label="DarkAlien — Specimen JAR"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'var(--abyss)',
        }}
      >
        {/* Glow backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}12 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, width: '100%' }}>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: ACCENT,
              marginBottom: 16,
            }}
          >
            Ficção Científica · Lote 01 — 50 Unidades
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 14vw, 120px)',
              lineHeight: 0.88,
              color: 'var(--text)',
              marginBottom: 8,
              letterSpacing: '-0.01em',
            }}
          >
            DarkAlien
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 4vw, 32px)',
              color: ACCENT,
              letterSpacing: '0.04em',
              marginBottom: 28,
              textTransform: 'uppercase',
            }}
          >
            Specimen JAR
          </p>

          <p
            style={{
              color: 'var(--text-soft)',
              fontSize: 'clamp(16px, 2.5vw, 19px)',
              maxWidth: 540,
              margin: '0 auto 40px',
              lineHeight: 1.55,
            }}
          >
            Um artefato que não deveria ter chegado até você. Peça numerada, tiragem fechada,
            montada à mão.
          </p>

          {/* Preços */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginBottom: 4,
                }}
              >
                Versão STD
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  color: 'var(--text)',
                }}
              >
                R$ 289
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginBottom: 4,
                }}
              >
                Versão PRO
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  color: ACCENT,
                }}
              >
                R$ 329
              </div>
            </div>
          </div>

          <a
            href={LP_URL}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 56,
              minWidth: 240,
              padding: '0 40px',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: ACCENT,
              color: ACCENT_CONTRAST,
              borderRadius: 32,
              textDecoration: 'none',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 8px 32px ${ACCENT}44`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Garantir o meu Specimen
          </a>

          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--text-mute)',
              marginTop: 16,
            }}
          >
            {stockLabel}
          </p>
        </div>
      </section>

      {/* ── GALERIA ──────────────────────────────── */}
      <div style={{ background: 'var(--abyss)' }}>
        <Galeria />
      </div>

      {/* ── ESPECIFICAÇÕES + VERSÕES ─────────────── */}
      <section
        id="specs"
        aria-label="Especificações e versões"
        style={{
          background: '#0a0a0a',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              alignItems: 'start',
            }}
          >
            {/* Specs técnicas */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                  marginBottom: 24,
                }}
              >
                Especificações
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  lineHeight: 1.0,
                  color: 'var(--text)',
                  marginBottom: 32,
                }}
              >
                O que você recebe
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {SPECS.map((spec, i) => (
                  <div
                    key={spec.label}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '14px 0',
                      borderBottom: i < SPECS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-mute)',
                        minWidth: 100,
                        flexShrink: 0,
                        paddingTop: 2,
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        color: 'var(--text-soft)',
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {spec.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Versões STD vs PRO */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: ACCENT,
                  marginBottom: 24,
                }}
              >
                Versões
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  lineHeight: 1.0,
                  color: 'var(--text)',
                  marginBottom: 32,
                }}
              >
                STD vs PRO
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Card STD */}
                <div
                  style={{
                    background: 'var(--ink)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '20px 24px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      color: 'var(--text)',
                      margin: '0 0 16px',
                    }}
                  >
                    Versão STD
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FEATURES_STD.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-soft)' }}>
                        <span style={{ color: ACCENT, flexShrink: 0, fontSize: 12, lineHeight: '1.6' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card PRO */}
                <div
                  style={{
                    background: 'var(--ink)',
                    border: `1px solid ${ACCENT}44`,
                    borderRadius: 12,
                    padding: '20px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${ACCENT}88, transparent)`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        color: 'var(--text)',
                        margin: 0,
                      }}
                    >
                      Versão PRO
                    </p>
                    <span
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontSize: 9,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: ACCENT,
                        border: `1px solid ${ACCENT}44`,
                        borderRadius: 4,
                        padding: '3px 8px',
                      }}
                    >
                      Recomendado
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FEATURES_STD.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-soft)' }}>
                        <span style={{ color: ACCENT, flexShrink: 0, fontSize: 12, lineHeight: '1.6' }}>✓</span>
                        {f}
                      </li>
                    ))}
                    <li style={{ marginTop: 8 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-data)',
                          fontSize: 9,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: ACCENT,
                        }}
                      >
                        + Módulo SCC-79/1A incluso:
                      </span>
                    </li>
                    {FEATURES_PRO_EXTRA.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: ACCENT }}>
                        <span style={{ flexShrink: 0, fontSize: 12, lineHeight: '1.6' }}>+</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA versões */}
                <a
                  href={LP_URL}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 52,
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: ACCENT,
                    color: ACCENT_CONTRAST,
                    borderRadius: 32,
                    textDecoration: 'none',
                    marginTop: 8,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 28px ${ACCENT}44`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  Escolher meu Specimen →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section
        aria-label="Adquirir DarkAlien"
        style={{
          background: 'var(--abyss)',
          padding: '80px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${ACCENT}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div
            style={{
              width: 220,
              height: 220,
              margin: '0 auto 40px',
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `1px solid ${ACCENT}33`,
            }}
          >
            <Image
              src="/images/darkalien/darkalien_02_promocional.png"
              alt="DarkAlien Specimen JAR"
              fill
              style={{ objectFit: 'contain', padding: 16 }}
              sizes="220px"
            />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: ACCENT,
              marginBottom: 20,
            }}
          >
            Lote 01 · Produção Manual · 50 Unidades
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 8vw, 72px)',
              lineHeight: 0.95,
              color: 'var(--text)',
              marginBottom: 20,
            }}
          >
            Quando o lote acabar,
            <br />
            <span style={{ color: ACCENT }}>não há data de retorno.</span>
          </h2>

          <p
            style={{
              color: 'var(--text-soft)',
              fontSize: 17,
              maxWidth: 480,
              margin: '0 auto 40px',
              lineHeight: 1.55,
            }}
          >
            Um artefato que não deveria ter chegado até você. Cada unidade, numerada e montada à
            mão em 3 a 4 dias.
          </p>

          <a
            href={LP_URL}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
              minWidth: 260,
              padding: '0 44px',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: ACCENT,
              color: ACCENT_CONTRAST,
              borderRadius: 32,
              textDecoration: 'none',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 10px 36px ${ACCENT}50`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Garantir o meu Specimen →
          </a>

          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--text-mute)',
              marginTop: 20,
            }}
          >
            {stockLabelFull}
          </p>
        </div>
      </section>

      {/* ── BACK LINK ───────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '40px 24px 80px', background: '#0a0a0a' }}>
        <Link
          href="/"
          style={{
            color: 'var(--text-mute)',
            fontSize: 13,
            textDecoration: 'underline',
            fontFamily: 'var(--font-data)',
            letterSpacing: '0.06em',
          }}
        >
          ← Ver todos os universos
        </Link>
      </div>
    </>
  )
}
