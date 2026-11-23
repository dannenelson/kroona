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
export const iconSize = { xs: 12, sm: 18, md: 20, lg: 24 } as const;

/** Knappar (brief 33, 39): aldrig fullbredd, pill som följer innehållet.
 *  CTA minst 56 hög med sidpadding 28 (två CTA:er ryms på en rad);
 *  kompakt (t.ex. snackbarens åtgärd) 36. Fält 56 höga. */
export const control = {
  ctaHeight: 56,
  ctaPaddingX: 28,
  compactHeight: 36,
  compactPaddingX: 16,
  fieldHeight: 56,
  /** Val-cirkel i listor (tom ring / fylld med bock), brief 36. */
  checkSize: 28,
  /** Sheet: höjd där innehållet tonas ut ovanför den sticky CTA-ytan (brief 38). */
  sheetFadeHeight: 48,
} as const;

/** Listrader (brief 35): samlingsrad 76 hög med 56-thumb, följ-rad 64 med 48. */
export const listRow = {
  height: 76,
  thumb: 56,
  compactHeight: 64,
  compactThumb: 48,
} as const;

/** Kort-sheet (brief 40): luft runt kortet (sidor och botten, plus safe area)
 *  och snapp-läget i mitten som andel av skärmhöjden. */
export const sheetCard = {
  inset: 8,
  midRatio: 2 / 3,
} as const;

/** Redaktionella kort (brief 43, skissens mått på 390 bred skärm).
 *  Text på bilden; toning över nedre `fadeShare`, blur över nedre `blurShare`.
 *  `mix` (Skapat för dig) och `collage` (Populära samlingar) är härledda format. */
export const editorialCard = {
  portraitLarge: { width: 280, height: 373 },
  portraitSmall: { width: 150, height: 225 },
  landscape: { width: 320, height: 213 },
  mix: { width: 160, height: 160 },
  collage: { width: 200, height: 267 },
  /** Andel av höjden som toningen täcker (stor/liggande, liten). */
  fadeShare: 0.58,
  fadeShareSmall: 0.56,
  /** Andel av höjden som blurren täcker, och blurradie i px (≈ 3,5 intensity per px). */
  blurShare: 0.48,
  blurPx: 12,
  /** Progressiv blur: fyra lager à 25 % av `blurPx`; lagren staplas, så blurren ökar nedåt
   *  (maskens start/slut som andel av blurzonen). */
  blurLayers: [
    { strength: 0.25, maskStops: [0, 0.3] },
    { strength: 0.25, maskStops: [0.2, 0.5] },
    { strength: 0.25, maskStops: [0.4, 0.7] },
    { strength: 0.25, maskStops: [0.6, 0.9] },
  ],
  /** Inre luft för texten på bilden (stor/liggande, liten). */
  padding: 16,
  paddingSmall: 12,
  /** Kuratorchippet överst till vänster (kollagekort): avatar 20. */
  chipAvatar: 20,
} as const;

/** Nedre menyn (brief 46, 49). Etikettblockets underkant ligger `labelBottom`
 *  (36) från skärmkanten på enheter med safe area nedtill, `labelBottomNoInset`
 *  (24) utan. Flikraden har `sideInset` (28) sidomarginal så att flikarna samlas. */
export const tabBar = {
  rowHeight: 56,
  iconLabelGap: 3,
  labelBottom: 36,
  labelBottomNoInset: 24,
  sideInset: 28,
} as const;

/** Hem-toppen (brief 46, 49): toppraden 44, avatar 32, logotyp 12 (™ visas från 40),
 *  filterpillar 36. */
export const homeHeader = {
  rowHeight: 44,
  avatar: 32,
  logoHeight: 12,
  logoTrademarkMinHeight: 40,
  filterPillHeight: 36,
} as const;

/** Avatar på profilvyn (brief 37). Rader använder `listRow.compactThumb` (48). */
export const profileAvatar = 96;

/** Vy-växlare (segmentkontroll med ikoner, brief 35): knapp 38 × 30, inre luft 3. */
export const segmented = {
  itemWidth: 38,
  itemHeight: 30,
  padding: 3,
  gap: 2,
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
