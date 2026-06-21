import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AA_UNIVERSES } from '@/lib/content'
import { UniverseIcon } from '@/components/brand/UniverseIcon'
import { EditionSeal } from '@/components/brand/EditionSeal'
import type { UniverseIconName } from '@/components/brand/UniverseIcon'
import { CTALink } from './CTALink'
import { TeaserHero } from '@/components/sections/TeaserHero'
import { DarkAlienProductView } from './DarkAlienProductView'

const PB_URL = process.env.POCKETBASE_URL ?? 'http://129.121.35.179:8090'

interface PBProduct {
  id: string
  name: string
  price_std: number
  price_pro: number | null
  stock_std: number
  stock_pro: number | null
  images: string[]
  edition_number: number
  collectionId: string
}

async function fetchProduct(slug: string): Promise<PBProduct | null> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/products/records?filter=(universe='${slug}')&perPage=1`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0] ?? null
  } catch {
    return null
  }
}

function pbImageUrl(product: PBProduct, filename: string) {
  return `${PB_URL}/api/files/${product.collectionId}/${product.id}/${filename}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const universe = AA_UNIVERSES.find((u) => u.id === slug)
  if (!universe) return {}

  const title = `${universe.name} — Acervo Andarilho`
  const description = universe.blurb

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/universo/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    alternates: { canonical: `/universo/${slug}` },
  }
}

export default async function UniversoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const universe = AA_UNIVERSES.find((u) => u.id === slug)
  if (!universe) notFound()

  const product = universe.status === 'ativo' ? await fetchProduct(slug) : null

  const accent = universe.accent
  const stock = universe.stock

  if (universe.status === 'em-breve') {
    return <TeaserHero universe={universe} />
  }

  // ProductView customizada para DarkAlien
  if (slug === 'darkalien') {
    return <DarkAlienProductView />
  }

  // ProductView — ativo (genérica — fallback para outros universos)
  const editionNumber = product?.edition_number ?? (stock ? stock.total - stock.available + 1 : 1)
  const editionTotal = product ? Math.max(product.stock_std, 1) : (stock?.total ?? 50)
  const priceStd = product?.price_std ?? universe.priceFrom ?? 0
  const pricePro = product?.price_pro ?? null
  const images: string[] = product?.images?.length
    ? product.images.slice(0, 4).map((f) => pbImageUrl(product, f))
    : []

  return (
    <>
      {/* Hero */}
      <section
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
        }}
      >
        {/* Glow backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, width: '100%' }}>
          <UniverseIcon
            name={universe.icon as UniverseIconName}
            size={120}
            flameColor={accent}
            animate
            glow
            style={{ margin: '0 auto 32px' }}
          />

          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 12,
            }}
          >
            {universe.universe}
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 10vw, 96px)',
              lineHeight: 0.88,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            {universe.name}
          </h1>

          <p
            style={{
              color: 'var(--text-soft)',
              fontSize: 'var(--text-lg)',
              maxWidth: 520,
              margin: '0 auto 40px',
            }}
          >
            {universe.tagline}
          </p>

          {/* EditionSeal + CTA row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
              marginBottom: 48,
            }}
          >
            <EditionSeal
              number={editionNumber}
              total={editionTotal}
              label={universe.edition}
              size={148}
              animate
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
              {/* Prices */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: 'var(--text-xs)',
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
                      color: 'var(--text-primary)',
                    }}
                  >
                    R$ {priceStd.toLocaleString('pt-BR')}
                  </div>
                </div>

                {pricePro !== null && (
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-data)',
                        fontSize: 'var(--text-xs)',
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
                        color: accent,
                      }}
                    >
                      R$ {pricePro.toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock indicator */}
              {stock && (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-mute)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {stock.available} de {stock.total} restantes
                </p>
              )}

              {/* CTA */}
              {universe.landingUrl && (
                <CTALink href={universe.landingUrl} accent={accent} />
              )}
            </div>
          </div>

          <p
            style={{
              color: 'var(--text-soft)',
              maxWidth: 560,
              margin: '0 auto',
              fontStyle: 'italic',
            }}
          >
            {universe.blurb}
          </p>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 && (
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px 96px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              marginBottom: 28,
              textAlign: 'center',
            }}
          >
            Galeria
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${universe.name} — imagem ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div style={{ textAlign: 'center', padding: '0 24px 80px' }}>
        <Link
          href="/"
          style={{
            color: 'var(--text-mute)',
            fontSize: 'var(--text-sm)',
            textDecoration: 'underline',
          }}
        >
          ← Ver todos os universos
        </Link>
      </div>
    </>
  )
}
