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

/** Ikonsystemet (brief 57): `stroke` är den SYNLIGA linjen i px, lika i alla storlekar.
 *  Icon räknar om den till ritrutan 24: strokeWidth = stroke × 24 / size. */
export const icon = {
  stroke: 1.5,
  /** Ritrutan som SVG-filerna är ritade i (viewBox 24 × 24). */
  grid: 24,
} as const;

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
  portraitLarge: { width: 240, height: 320 }, // 280 × 373 före brief 51
  portraitSmall: { width: 150, height: 225 },
  landscape: { width: 320, height: 213 },
  mix: { width: 160, height: 160 },
  collage: { width: 200, height: 250 }, // bildytan, 4:5 (brief 52; 200 × 267 med text på bild förut)
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

/** Logotyper (brief 47). Återförsäljare: logotypen tar `plateShare` av plattans
 *  bredd. Samlingar på EditorialCard: `largeShare` / `smallShare` av kortets
 *  bredd, högst `maxHeight` hög. */
export const logo = {
  plateShare: 0.6,
  largeShare: 0.65, // brief 51 (0,6 i brief 47)
  smallShare: 0.85, // brief 51 (0,75 i brief 47)
  maxHeight: 72, // brief 51 (36 i brief 47)
  /** Logotypcirkeln i Partnerdetaljens huvud. */
  headerCircle: 64,
} as const;

/** Nedre menyn (brief 46, 49, 50). Etikettblockets underkant ligger `labelBottom`
 *  (36) från skärmkanten på enheter med safe area nedtill, `labelBottomNoInset`
 *  (24) utan. Flikraden har `sideInset` (18 sedan brief 50, 28 i brief 49) sidomarginal. */
export const tabBar = {
  rowHeight: 56,
  /** Flikikonernas ruta (brief 50; prova 28 eller 32). Glyfen fyller ca 73 %, dvs. ca 23 synligt vid 32.
   *  Ikon + 3 + etikettens radhöjd 14 måste rymmas i `rowHeight` (högst 39). */
  iconSize: 28, // brief 52 (32 i brief 50)
  iconLabelGap: 3,
  labelBottom: 36,
  labelBottomNoInset: 24,
  sideInset: 18,
} as const;

/** Hem-toppen (brief 46, 49, 51): toppraden 44, avatar 40, logotyp 12 (™ visas från 40),
 *  filterpillar 36. */
export const homeHeader = {
  rowHeight: 44,
  avatar: 40, // 32 före brief 51
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

/** "Visa fler ›" i hyllrubriker (brief 53, 57): `chevron-right` 14 med ikonsystemets
 *  linje (`icon.stroke`; 2,2 i brief 53), 2 mellan text och chevron. */
export const sectionLink = {
  chevronSize: 14,
  gap: 2,
} as const;

/** Hitta (brief 53): idékort 240 × 160, kategorikort 109 × 150, områdeskort 92 höga
 *  (bredden räknas fram: två kolumner inom skärmmarginalen). */
export const findCards = {
  idea: { width: 240, height: 160 },
  category: { width: 109, height: 150 },
  areaHeight: 92,
  /** Förstoringsglaset före idékortets titel. */
  ideaIcon: 16,
  /** "Fråga om …" i kategorivyn (brief 54): pill 40 hög. */
  askChipHeight: 40,
} as const;
