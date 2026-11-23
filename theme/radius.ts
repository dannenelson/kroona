// Radie (docs/design.md §0 och §6). Icke-runda radier kombineras med
// borderCurve: 'continuous' (squircle). Cirklar och pillar använder `full`
// utan borderCurve.
export const radius = {
  /** Täta flerbildsgrid. */
  tile: 10,
  /** Knappar och fält med rak form. */
  control: 12,
  /** Bildkort, grupperad lista, meny. */
  card: 14,
  /** Lyft kort i kontextmeny, flödesbilder. */
  lifted: 16,
  /** Samlingskort, jämförelse. */
  collection: 18,
  /** Chattbubbla. */
  bubble: 20,
  /** Kort-sheet (brief 40, YouTube-stil), squircle. */
  sheetCard: 28,
  /** Skärmens egen hörnradie (inget officiellt API): iPhone med Dynamic Island
   *  ca 55, med notch ca 44. Används när en hel skärm dras (spik brief 17). */
  screenDynamicIsland: 55,
  screenNotch: 44,
  /** Pillar och cirkelknappar. */
  full: 999,
} as const;
