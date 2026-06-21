'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─────────────────────────────────────────────
// Constantes de copy e dados extraídos da LP
// ─────────────────────────────────────────────

const ACCENT = '#03ff88'
const ACCENT_CONTRAST = '#06140d'

const GALERIA_HERO = '/images/darkalien/darkalien_02_promocional.png'

const GALERIA_THUMBS = [
  { src: '/images/darkalien/darkalien_02_promocional_B.png', alt: 'DarkAlien — ângulo 2' },
  { src: '/images/darkalien/darkalien_02_promocional_c.png', alt: 'DarkAlien — ângulo 3' },
  { src: '/images/darkalien/raff_02_topo_A.png', alt: 'Módulo Topo — ângulo A' },
  { src: '/images/darkalien/raff_02_topo_B.png', alt: 'Módulo Topo — ângulo B' },
  { src: '/images/darkalien/raff_02_topo_C.png', alt: 'Módulo Topo — ângulo C' },
  { src: '/images/darkalien/alien.png', alt: 'O espécime alienígena' },
  { src: '/images/darkalien/raff_02_basecompleta_A.png', alt: 'Módulo Base Completa — ângulo A' },
  { src: '/images/darkalien/raff_02_basecompleta_B.png', alt: 'Módulo Base Completa — ângulo B' },
]

const MODULOS = [
  {
    label: 'MOD. 01',
    nome: 'Topo / Lid',
    subtitulo: 'O ponto de emanação.',
    descricao:
      'Tampa de geometria octogonal impressa em 3D. Insert de acrílico leitoso difunde a luz sem queimar o olho — a intensidade é calculada para criar profundidade no cilindro, não para clarear o ambiente.',
    imagens: [
      '/images/darkalien/raff_02_topo_A.png',
      '/images/darkalien/raff_02_topo_B.png',
      '/images/darkalien/raff_02_topo_C.png',
    ],
    videoUrl: 'https://acervoandarilho.com.br/darkalien/videos/loops/landscape/01-boot.mp4',
  },
  {
    label: 'MOD. 02',
    nome: 'Corpo / Cylinder',
    subtitulo: 'O habitat.',
    descricao:
      'Tubo de acrílico verde pré-colorido — não pintado, não revestido. A cor está no material. Dentro: solução de água destilada com glicerina que mantém o espécime em suspensão estável. O espécime é impresso em 3D com anatomia autoral — nenhuma franquia, nenhum IP de terceiros.',
    imagens: ['/images/darkalien/alien.png'],
    videoUrl: 'https://acervoandarilho.com.br/darkalien/videos/loops/landscape/05-bio.mp4',
  },
  {
    label: 'MOD. 03',
    nome: 'Base / Contenção',
    subtitulo: 'O sistema de contenção.',
    descricao:
      'A base é onde as duas versões divergem. Na versão STD, alimentação USB-C direta — simples e limpa. Na versão PRO, a base acopla o módulo SCC-79/1A: iluminação colorida, bateria recarregável e o modo BREACH.',
    imagens: [
      '/images/darkalien/raff_02_basecompleta_A.png',
      '/images/darkalien/raff_02_basecompleta_B.png',
    ],
    videoUrl: 'https://acervoandarilho.com.br/darkalien/videos/loops/landscape/06-security.mp4',
  },
]

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

const FEATURES_BASE = [
  'Espécime 3D autoral em suspensão',
  'Cilindro acrílico verde pré-colorido',
  'Iluminação branca topo + base',
  'Alimentação USB-C',
  'Carta de autenticidade numerada',
]

const FEATURES_PRO = [
  'Módulo SCC-79/1A integrado na base',
  'Bateria recarregável via USB-C',
  'Iluminação colorida — 8 modos de cor',
  'Modo BREACH: vibração + alerta sonoro',
  'Operação 100% sem fio',
]

// ─────────────────────────────────────────────
// Sub-componente: Vídeo de módulo com lazy load
// ─────────────────────────────────────────────

function ModuloVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: '#0a0a0a',
        overflow: 'hidden',
        borderRadius: 8,
      }}
    >
      <video
        ref={ref}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-componente: Galeria interativa
// ─────────────────────────────────────────────

function Galeria() {
  const [ativa, setAtiva] = useState(0)

  return (
    <section aria-label="Galeria de fotos do DarkAlien" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <p
        style={{
          fontFamily: 'var(--font-data)',
          fontSize: '11px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: ACCENT,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Galeria do Produto
      </p>

      {/* Imagem principal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          maxWidth: 720,
          margin: '0 auto 16px',
          background: 'var(--ink)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      >
        <Image
          src={ativa === 0 ? GALERIA_HERO : GALERIA_THUMBS[ativa - 1].src}
          alt={ativa === 0 ? 'DarkAlien — foto principal' : GALERIA_THUMBS[ativa - 1].alt}
          fill
          style={{ objectFit: 'contain', padding: 16 }}
          sizes="(max-width: 768px) 100vw, 720px"
          priority={ativa === 0}
        />
      </div>

      {/* Thumbnails */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        {/* Thumb do hero */}
        <button
          onClick={() => setAtiva(0)}
          aria-label="Ver foto principal"
          style={{
            width: 72,
            height: 72,
            padding: 0,
            border: `2px solid ${ativa === 0 ? ACCENT : 'var(--border)'}`,
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--ink)',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Image
            src={GALERIA_HERO}
            alt="DarkAlien — foto principal"
            fill
            style={{ objectFit: 'cover' }}
            sizes="72px"
          />
        </button>

        {GALERIA_THUMBS.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setAtiva(i + 1)}
            aria-label={img.alt}
            style={{
              width: 72,
              height: 72,
              padding: 0,
              border: `2px solid ${ativa === i + 1 ? ACCENT : 'var(--border)'}`,
              borderRadius: 8,
              overflow: 'hidden',
              background: 'var(--ink)',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              transition: 'border-color 0.15s ease',
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="72px"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Sub-componente: Card de Módulo
// ─────────────────────────────────────────────

function ModuloCard({ modulo }: { modulo: (typeof MODULOS)[number] }) {
  return (
    <div
      style={{
        background: 'var(--ink)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ModuloVideo src={modulo.videoUrl} />
      <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          {modulo.label} — {modulo.nome}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 3vw, 22px)',
            lineHeight: 1.1,
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {modulo.subtitulo}
        </h3>
        <p
          style={{
            color: 'var(--text-soft)',
            fontSize: 14,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {modulo.descricao}
        </p>

        {/* Minigaleria de fotos do módulo */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {modulo.imagens.map((src) => (
            <div
              key={src}
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: '#0a0a0a',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Image
                src={src}
                alt={modulo.nome}
                fill
                style={{ objectFit: 'contain', padding: 4 }}
                sizes="64px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-componente: Boot Video Hero
// ─────────────────────────────────────────────

function BootVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !ref.current) return
    ref.current.play().catch(() => {})
  }, [])

  return (
    <video
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.12,
        pointerEvents: 'none',
      }}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src="/videos/darkalien-boot.mp4" type="video/mp4" />
    </video>
  )
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export function DarkAlienProductView() {
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
        <BootVideo />

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
          {/* Eyebrow */}
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

          {/* Título */}
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

          {/* Tagline */}
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

          {/* CTA Hero */}
          <a
            href="https://acervoandarilho.com.br/darkalien"
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

          {/* Stock indicator */}
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--text-mute)',
              marginTop: 16,
            }}
          >
            14 de 50 restantes · Produção manual
          </p>
        </div>
      </section>

      {/* ── GALERIA ──────────────────────────────── */}
      <Galeria />

      {/* ── ANATOMIA ─────────────────────────────── */}
      <section
        id="anatomia"
        aria-label="Anatomia do Specimen JAR"
        style={{
          background: '#0a0a0a',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
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
              Três módulos. Uma contenção.
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 6vw, 48px)',
                lineHeight: 1.0,
                color: 'var(--text)',
                marginBottom: 16,
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Anatomia do Specimen
            </h2>
            <p
              style={{
                color: 'var(--text-soft)',
                fontSize: 16,
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              Cada componente foi escolhido com intenção — não apenas para funcionar, mas para
              parecer que foi recuperado de algum lugar que não deveria ter sido aberto.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {MODULOS.map((mod) => (
              <ModuloCard key={mod.label} modulo={mod} />
            ))}
          </div>

          {/* Badge de produção */}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-mute)',
                border: '1px solid var(--border)',
                borderRadius: 32,
                padding: '8px 20px',
              }}
            >
              PRODUÇÃO MANUAL · CADA UNIDADE: 3 A 4 DIAS · LOTE 01 DE 50
            </span>
          </div>
        </div>
      </section>

      {/* ── ESPECIFICAÇÕES ───────────────────────── */}
      <section
        id="specs"
        aria-label="Especificações técnicas"
        style={{
          background: 'var(--abyss)',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 22,
                          color: 'var(--text)',
                          margin: 0,
                        }}
                      >
                        Versão STD
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-data)',
                          fontSize: 20,
                          color: 'var(--text)',
                          marginTop: 4,
                        }}
                      >
                        R$ 289
                      </p>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FEATURES_BASE.map((f) => (
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
                  {/* Glow top */}
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
                    <div>
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
                      <p
                        style={{
                          fontFamily: 'var(--font-data)',
                          fontSize: 20,
                          color: ACCENT,
                          marginTop: 4,
                        }}
                      >
                        R$ 329
                      </p>
                    </div>
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
                    {FEATURES_BASE.map((f) => (
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
                    {FEATURES_PRO.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: ACCENT }}>
                        <span style={{ flexShrink: 0, fontSize: 12, lineHeight: '1.6' }}>+</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section
        aria-label="Adquirir DarkAlien"
        style={{
          background: '#0a0a0a',
          padding: '80px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow backdrop */}
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
          {/* Imagem do produto */}
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
            Um artefato que não deveria ter chegado até você. Cada unidade, numerada e montada à mão em 3 a 4 dias.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://acervoandarilho.com.br/darkalien"
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
          </div>

          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--text-mute)',
              marginTop: 20,
            }}
          >
            14 de 50 restantes · Versão STD R$ 289 · Versão PRO R$ 329
          </p>
        </div>
      </section>

      {/* ── BACK LINK ───────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '40px 24px 80px', background: 'var(--abyss)' }}>
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
