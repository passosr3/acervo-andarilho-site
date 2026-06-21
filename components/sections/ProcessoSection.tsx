'use client'

import { UniverseIcon } from '@/components/brand/UniverseIcon'
import type { UniverseIconName } from '@/components/brand/UniverseIcon'
import { AA_PAGE } from '@/lib/content'

interface Step {
  n: string
  icon: UniverseIconName
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    n: '01',
    icon: 'icon-filmes',
    title: 'Cruza a porta',
    description: 'Cada universo tem uma entrada. Pode ser um mito, um filme, uma lenda enterrada.',
  },
  {
    n: '02',
    icon: 'icon-handmade',
    title: 'Coleta a prova',
    description: 'De cada travessia volta com um objeto. Não uma lembrança — uma prova de que aquilo existe.',
  },
  {
    n: '03',
    icon: 'icon-tema',
    title: 'Sela à mão',
    description: 'Modela, imprime, monta, pinta e numera na bancada. Lote fechado, sem segunda chance.',
  },
  {
    n: '04',
    icon: 'icon-series',
    title: 'Chega até você',
    description: 'Uma peça. Um número. Um dono. O que era de outro mundo agora tem endereço.',
  },
]

export function ProcessoSection() {
  return (
    <section
      id="processo"
      aria-label="O Processo"
      style={{
        background: 'var(--paper)',
        padding: 'var(--section-y) clamp(20px,4vw,56px)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green-deep)',
              marginBottom: 12,
            }}
          >
            {AA_PAGE.processoEyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-d2)',
              color: 'var(--ink-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              lineHeight: 0.95,
              maxWidth: 620,
              margin: 0,
            }}
          >
            {AA_PAGE.processoTitle}
          </h2>
        </div>

        {/* Cards grid */}
        <div
          className="aa-process-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          {STEPS.map((step, i) => {
            const isGreen = i % 2 === 0
            return (
              <div
                key={step.n}
                style={{
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: isGreen ? 'var(--green)' : 'var(--ink)',
                  borderRadius: 20,
                  padding: 'clamp(20px, 2vw, 26px)',
                }}
              >
                {/* Top row: number + icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(52px, 5vw, 76px)',
                      lineHeight: 0.8,
                      color: isGreen ? '#06140d' : 'var(--accent)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {step.n}
                  </span>
                  {/* Icon chip */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: isGreen
                        ? 'rgba(6,20,13,0.14)'
                        : 'rgba(3,255,136,0.14)',
                      flexShrink: 0,
                    }}
                  >
                    <UniverseIcon
                      name={step.icon}
                      size={30}
                      flameColor={isGreen ? '#06140d' : 'var(--green)'}
                      structureColor={isGreen ? '#06140d' : 'var(--text)'}
                      animate={false}
                      glow={false}
                    />
                  </span>
                </div>

                {/* Bottom: title + description */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-d3)',
                      color: isGreen ? '#06140d' : 'var(--text)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: isGreen ? 'rgba(6,20,13,0.72)' : 'var(--text-soft)',
                      lineHeight: 1.5,
                      marginTop: 8,
                      marginBottom: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          .aa-process-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 479px) {
          .aa-process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
