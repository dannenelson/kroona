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

/** Knappar (brief 33): aldrig fullbredd, pill som följer innehållet.
 *  CTA minst 56 hög; kompakt (t.ex. snackbarens åtgärd) 36. Fält 56 höga. */
export const control = {
  ctaHeight: 56,
  ctaPaddingX: 44,
  compactHeight: 36,
  compactPaddingX: 16,
  fieldHeight: 56,
} as const;

/** Snackbar (brief 33): bredd följer innehållet upp till maxWidth, miniatyr 40,
 *  40 px från botten när flikfältet inte syns. */
export const snackbar = {
  maxWidth: 350,
  thumb: 40,
  padding: 10,
  bottomOffset: 40,
} as const;

/** Sidindikator (PagerDots, brief 19): cirkel 6, aktiv punkt 18 lång, avstånd 6. */
export const pagerDots = {
  size: 6,
  activeLength: 18,
  gap: 6,
  inactiveOpacity: 0.4,
  /** Direkt på foto (heron, brief 21): högre, eftersom ingen bakgrund ligger bakom. */
  inactiveOpacityOnPhoto: 0.55,
} as const;
