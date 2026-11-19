// Spacing, 4-punktsskala (docs/design.md §5).
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenMargin: 16,
  gutter: 8,
} as const;

export const touchTarget = 44;
export const iconSize = { md: 20, lg: 24 } as const;

/** Sidindikator (PagerDots, brief 19): cirkel 6, aktiv punkt 18 lång, avstånd 6. */
export const pagerDots = {
  size: 6,
  activeLength: 18,
  gap: 6,
  inactiveOpacity: 0.4,
  /** Direkt på foto (heron, brief 21): högre, eftersom ingen bakgrund ligger bakom. */
  inactiveOpacityOnPhoto: 0.55,
} as const;
