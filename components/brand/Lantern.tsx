import { CSSProperties } from 'react'
import { InlineGlyph } from './InlineGlyph'

interface LanternProps {
  size?: number
  src?: string
  animate?: boolean
  flameColor?: string
  structureColor?: string
  glow?: boolean
  title?: string
  className?: string
  style?: CSSProperties
}

/** The Acervo Andarilho mark — lantern with animated green flame. */
export function Lantern({
  size = 96,
  src = '/images/brand/icon-color-branco.svg',
  animate = true,
  flameColor = 'var(--green)',
  structureColor = 'var(--text-primary)',
  glow = true,
  title = 'Acervo Andarilho',
  className = '',
  style = {},
}: LanternProps) {
  return (
    <InlineGlyph
      src={src}
      size={size}
      ratio={180.13 / 136.42}
      flameColor={flameColor}
      structureColor={structureColor}
      animate={animate}
      glow={glow}
      title={title}
      className={className}
      style={style}
    />
  )
}
