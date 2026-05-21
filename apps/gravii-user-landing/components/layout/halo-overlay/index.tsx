import s from './halo-overlay.module.css'

/**
 * Fixed, viewport-sized halo overlay rendered behind all section content.
 * Provides continuous visual halo across the entire scroll — no breaks at section boundaries.
 * Subtle 60s drift animation adds organic "living" feel.
 */
export function HaloOverlay() {
  return <div className={s.overlay} aria-hidden="true" />
}
