import { CSSProperties } from 'react'
import { InlineGlyph } from './InlineGlyph'

interface BrandLogoProps {
  src?: string
  width?: number
  ratio?: number
  letteringColor?: string
  flameColor?: string
  animate?: boolean
  glow?: boolean
  title?: string
  className?: string
  style?: CSSProperties
}

/** Official Acervo Andarilho lockup. Never typeset the brand name as text — use this. */
export function BrandLogo({
  src = '/images/brand/logo-horizontal-color.svg',
  width = 220,
  ratio = 180.13 / 576.92,
  letteringColor = 'var(--text-primary)',
  flameColor = 'var(--green)',
  animate = false,
  glow = false,
  title = 'Acervo Andarilho',
  className = '',
  style = {},
}: BrandLogoProps) {
  return (
    <InlineGlyph
      src={src}
      size={width}
      ratio={ratio}
      structureColor={letteringColor}
      flameColor={flameColor}
      animate={animate}
      glow={glow}
      title={title}
      className={className}
      style={style}
    />
  )
}
