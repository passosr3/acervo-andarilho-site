'use client'

import { useState, useEffect, useId, CSSProperties } from 'react'

function useInlineSvg(src: string) {
  const [html, setHtml] = useState<string | null>(null)
  useEffect(() => {
    if (!src) return
    let alive = true
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error('svg'))))
      .then((t) => { if (alive) setHtml(t) })
      .catch(() => { if (alive) setHtml(null) })
    return () => { alive = false }
  }, [src])
  return { html, ready: html != null }
}

interface InlineGlyphProps {
  src: string
  size?: number
  ratio?: number
  flameColor?: string
  structureColor?: string
  animate?: boolean
  glow?: boolean
  title?: string
  className?: string
  style?: CSSProperties
}

export function InlineGlyph({
  src,
  size = 48,
  ratio = 1,
  flameColor = 'var(--green)',
  structureColor = 'var(--text-primary)',
  animate = false,
  glow = true,
  title = '',
  className = '',
  style = {},
}: InlineGlyphProps) {
  const { html } = useInlineSvg(src)
  const uid = useId().replace(/:/g, '')
  const glowFilter = glow ? 'drop-shadow(0 0 6px rgba(3,255,136,0.55))' : 'none'

  return (
    <span
      className={`gly-${uid} ${className}`}
      role="img"
      aria-label={title || undefined}
      style={{ display: 'inline-flex', width: size, height: size * ratio, lineHeight: 0, ...style }}
    >
      <style>{`
        .gly-${uid} svg { width: 100%; height: 100%; display: block; overflow: visible; }
        .gly-${uid} svg path, .gly-${uid} svg polygon, .gly-${uid} svg polyline { fill: ${structureColor}; }
        .gly-${uid} svg .cls-1 { fill: ${flameColor}; transform-box: fill-box; transform-origin: 50% 92%; ${glow ? `filter: ${glowFilter};` : ''} }
        ${animate ? `
        .gly-${uid} svg .cls-1 {
          animation: glySway-${uid} 3.4s ease-in-out infinite, glyGlow-${uid} 2.2s ease-in-out infinite;
          will-change: transform, filter;
        }
        @keyframes glySway-${uid} {
          0%, 100% { transform: scaleY(1) skewX(0deg) translateY(0); }
          25%       { transform: scaleY(1.06) skewX(2deg) translateY(-1%); }
          55%       { transform: scaleY(0.96) skewX(-1.4deg); }
          78%       { transform: scaleY(1.04) skewX(1.2deg); }
        }
        @keyframes glyGlow-${uid} {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(3,255,136,0.5)); }
          50%       { filter: drop-shadow(0 0 11px rgba(3,255,136,0.95)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gly-${uid} svg .cls-1 { animation: none; filter: ${glowFilter}; }
        }` : ''}
      `}</style>
      {html
        ? <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
        : <span style={{ width: '100%', height: '100%', borderRadius: 4, background: 'var(--accent-wash)' }} />}
    </span>
  )
}
