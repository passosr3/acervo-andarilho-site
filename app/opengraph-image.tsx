import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Acervo Andarilho — Artefatos de Universos Infinitos'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0c0d',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(3,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(3,255,136,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow behind text */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(3,255,136,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#03ff88',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            ACERVO ANDARILHO
          </div>

          <div
            style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #03ff88, transparent)',
            }}
          />

          <div
            style={{
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              color: '#6b7280',
              textTransform: 'uppercase',
            }}
          >
            Artefatos de Universos Infinitos
          </div>
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '16px',
            letterSpacing: '0.2em',
            color: '#374151',
            textTransform: 'uppercase',
          }}
        >
          acervoandarilho.com.br
        </div>
      </div>
    ),
    { ...size }
  )
}
