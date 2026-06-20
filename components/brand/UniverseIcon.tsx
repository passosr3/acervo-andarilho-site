import { CSSProperties } from 'react'
import { InlineGlyph } from './InlineGlyph'

export type UniverseIconName =
  | 'icon-filmes'
  | 'icon-terror'
  | 'icon-lendas'
  | 'icon-mitos'
  | 'icon-ficcao'
  | 'icon-series'
  | 'icon-handmade'
  | 'icon-tema'

const RATIOS: Record<UniverseIconName, number> = {
  'icon-filmes':   161.89 / 127.52,
  'icon-terror':   176.26 / 127.99,
  'icon-lendas':   147.49 / 134,
  'icon-mitos':    1.18,
  'icon-ficcao':   1.2,
  'icon-series':   1.2,
  'icon-handmade': 1.1,
  'icon-tema':     1.1,
}

interface UniverseIconProps {
  name?: UniverseIconName
  size?: number
  basePath?: string
  flameColor?: string
  structureColor?: string
  animate?: boolean
  glow?: boolean
  className?: string
  style?: CSSProperties
}

/** Category glyph for a universe. `.cls-1` in each SVG receives the accent color. */
export function UniverseIcon({
  name = 'icon-ficcao',
  size = 48,
  basePath = '/images/icons/',
  flameColor = 'var(--green)',
  structureColor = 'var(--text-primary)',
  animate = false,
  glow = true,
  className = '',
  style = {},
}: UniverseIconProps) {
  return (
    <InlineGlyph
      src={`${basePath}${name}.svg`}
      size={size}
      ratio={RATIOS[name] ?? 1.2}
      flameColor={flameColor}
      structureColor={structureColor}
      animate={animate}
      glow={glow}
      title={name.replace('icon-', '')}
      className={className}
      style={style}
    />
  )
}
