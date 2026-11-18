// Färgtokens enligt docs/design.md §2. Råa värden används bara här.
// Komponenter läser semantiska roller via useTheme().colors.

const raw = {
  ink900: '#15171B',
  ink800: '#1B1E23',
  ink700: '#22262C',
  ink950: '#14181D',
  paper50: '#F5F6F8',
  white: '#FFFFFF',
  grey300: '#C4C4C4',
  grey400: '#A0A4AB',
  slate600: '#4B525C',
  slate500: '#5F6672',
  gold: '#B8965A',
  goldDeep: '#80602A',
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
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentText: string;
  onAccent: string;
  cta: string;
  onCta: string;
  success: string;
  successSubtle: string;
  warning: string;
};

export const darkColors: ColorRoles = {
  bg: raw.ink900,
  surface: raw.ink800,
  surfaceRaised: raw.ink700,
  border: 'rgba(255,255,255,0.08)',
  textPrimary: raw.white,
  textSecondary: raw.grey300,
  textTertiary: raw.grey400,
  accent: raw.gold,
  accentText: raw.gold,
  onAccent: raw.ink900,
  cta: raw.paper50,
  onCta: raw.ink900,
  success: raw.green,
  successSubtle: raw.greenNight,
  warning: raw.amber,
};

export const lightColors: ColorRoles = {
  bg: raw.paper50,
  surface: raw.white,
  surfaceRaised: raw.white,
  border: 'rgba(20,24,29,0.10)',
  textPrimary: raw.ink950,
  textSecondary: raw.slate600,
  textTertiary: raw.slate500,
  accent: raw.gold,
  accentText: raw.goldDeep,
  onAccent: raw.ink900,
  cta: raw.ink950,
  onCta: raw.paper50,
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
  // möter den bg #F5F6F8 med en tydlig mörk kant (öppen designfråga b).
  scrimStops: {
    colors: [
      'rgba(14,16,20,0)',
      'rgba(14,16,20,0.56)',
      'rgba(14,16,20,0.75)',
      'rgba(14,16,20,1)',
    ] as [string, string, ...string[]],
    locations: [0, 0.4, 0.65, 1] as [number, number, ...number[]],
  },
} as const;

/** Lägger alfa på en #RRGGBB-färg, t.ex. för gradienter mot bakgrundstoken. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
