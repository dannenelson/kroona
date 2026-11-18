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
  /** Pillar och cirkelknappar. */
  full: 999,
} as const;
