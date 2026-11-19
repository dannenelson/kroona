// Färgtokens enligt docs/design.md §0 och §2 (Apple-ren). Råa värden används
// bara här. Komponenter läser semantiska roller via useTheme().colors.
// Ingen märkesfärg: neutral gråskala, fotot är enda färgen.

const raw = {
  ink900: '#15171B',
  ink850: '#1F2227',
  ink800: '#24272D',
  ink700: '#2A2D33',
  ink600: '#353840',
  grey500: '#9298A2',
  slate500: '#686E78',
  paper50: '#F5F6F8',
  paper100: '#E9EBEE',
  paper150: '#E2E5E9',
  paper200: '#DCDFE3',
  white: '#FFFFFF',
  grey300: '#C4C4C4',
  // Används bara av system-states i Hitta och av CardShowcase/ClusterCard.
  // Hållbarhet visas neutralt (design.md §0). Städas när de filerna tas bort.
  green: '#4A9E5C',
  greenDeep: '#2F7D43',
  greenNight: '#0C1A0E',
  greenMist: '#E4F1E7',
  amber: '#C08A4A',
  amberDeep: '#8A5A1C',
} as const;

export type ColorRoles = {
  bg: string;
  surface: string;
  /** §0 `surface2`: pill, sekundär knapp, bubbla. */
  surfaceRaised: string;
  /** Nedtryckt yta. */
  pressed: string;
  /** §0 `line`: hårlinjer och kanter. */
  border: string;
  /** §0 `sep`: avdelare i grupperade listor och menyer. */
  sep: string;
  /** Bakgrund bakom bilder innan de laddat. */
  placeholder: string;
  /** §0 `text`. Används också som yta för vald (inverterad) state. */
  textPrimary: string;
  /** §0 `mute`: sekundär text, ej vald flik. */
  textSecondary: string;
  /** §0 har bara två textnivåer, tertiär = `mute`. */
  textTertiary: string;
  /** Kontextmenyns yta (över blur). */
  menu: string;
  /** Dämpning bakom en lyft meny. */
  scrim: string;
  success: string;
  successSubtle: string;
  warning: string;
};

export const darkColors: ColorRoles = {
  bg: raw.ink900,
  surface: raw.ink850,
  surfaceRaised: raw.ink700,
  pressed: raw.ink600,
  border: 'rgba(255,255,255,0.10)',
  sep: 'rgba(255,255,255,0.07)',
  placeholder: raw.ink800,
  textPrimary: raw.paper50,
  textSecondary: raw.grey500,
  textTertiary: raw.grey500,
  menu: 'rgba(44,46,52,0.80)',
  scrim: 'rgba(8,9,11,0.40)',
  success: raw.green,
  successSubtle: raw.greenNight,
  warning: raw.amber,
};

export const lightColors: ColorRoles = {
  bg: raw.paper50,
  surface: raw.white,
  surfaceRaised: raw.paper100,
  pressed: raw.paper200,
  border: 'rgba(21,23,27,0.10)',
  sep: 'rgba(21,23,27,0.07)',
  placeholder: raw.paper150,
  textPrimary: raw.ink900,
  textSecondary: raw.slate500,
  textTertiary: raw.slate500,
  menu: 'rgba(255,255,255,0.82)',
  scrim: 'rgba(21,23,27,0.12)',
  success: raw.greenDeep,
  successSubtle: raw.greenMist,
  warning: raw.amberDeep,
};

// Foto-overlayer: fasta och identiska i båda teman (design.md §2).
// Innehåll på foto är alltid vitt (onPhoto).
export const overlay = {
  onPhoto: raw.white,
  onPhotoSecondary: raw.grey300,
  scrimSoft: 'rgba(14,16,20,0.6)',
  // TODO(design): scrimen slutar i solid rgba(14,16,20,1). I ljust tema
  // möter den bg med en tydlig mörk kant (öppen designfråga).
  scrimStops: {
    colors: [
      'rgba(14,16,20,0)',
      'rgba(14,16,20,0.56)',
      'rgba(14,16,20,0.75)',
      'rgba(14,16,20,1)',
    ] as [string, string, ...string[]],
    locations: [0, 0.4, 0.65, 1] as [number, number, ...number[]],
  },
  // Kantblurens toning över foto (överst på Produktdetalj).
  photoFade: ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)'] as [string, string],
} as const;

// Kantblurens toning mot bakgrunden (EdgeFade). Alfa på bg vid stoppen.
export const edgeFadeStops = {
  top: { alphas: [0.8, 0.5, 0], locations: [0, 0.45, 1] },
  /** Vågig toppkant (brief 11): glesare toning så den inte känns som ett lock
   *  över ljusa foton. Vit statusfälttext över helt vitt foto i mörkt tema: ca 4,7:1. */
  topWave: { alphas: [0.6, 0.3, 0], locations: [0, 0.45, 1] },
  bottom: { alphas: [0.96, 0.8, 0], locations: [0, 0.45, 1] },
} as const;

/** Lägger alfa på en #RRGGBB-färg, t.ex. för gradienter mot bakgrundstoken. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
