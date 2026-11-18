// Glas (docs/design.md §0 och §3). Komponenten ligger i components/Glass.tsx.
//
// expo-blur tar inte blur-radie eller saturate direkt. `tint` och
// `blurIntensity` är översättningen till BlurView: blur 10 ≈ intensity 30,
// blur 20 ≈ intensity 50. Saturate saknas helt i expo-blur (närmast är
// tint-lagret). Värdena `blur` och `saturate` står kvar som designens källa.
export type GlassTint = 'dark' | 'light';

export type Glass = {
  fill: string;
  blur: number;
  saturate: number;
  borderWidth: number;
  borderColor: string;
  content: string;
  tint: GlassTint;
  blurIntensity: number;
};

export const darkGlass: Glass = {
  fill: 'rgba(42,45,51,0.72)',
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  content: '#F5F6F8',
  tint: 'dark',
  blurIntensity: 50,
};

export const lightGlass: Glass = {
  fill: 'rgba(255,255,255,0.72)',
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(21,23,27,0.10)',
  content: '#15171B',
  tint: 'light',
  blurIntensity: 50,
};

// Glas på foto: mörkt och genomskinligt med vitt innehåll, identiskt i båda
// teman. Värden från referensen "Kroona Looken A" (knappar på produktfoto).
export const photoGlass: Glass = {
  fill: 'rgba(20,22,26,0.34)',
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.24)',
  content: '#FFFFFF',
  tint: 'dark',
  blurIntensity: 50,
};

// Kantblur (EdgeFade): max 8 px, tre lager på 20 / 50 / 100 % med mask.
// Intensiteten räknas om från px med samma översättning som glaset
// (ca 3,5 intensity per px blur).
export const edgeBlur = {
  maxBlur: 8,
  layers: [
    // Lager med starkast blur täcker kortast sträcka.
    { strength: 1, maskStops: [0, 0.2, 0.55] },
    { strength: 0.5, maskStops: [0, 0.4, 0.8] },
    { strength: 0.2, maskStops: [0, 0.6, 1] },
  ],
  intensityPerPx: 3.5,
  /** Maskens färger: helt synlig → helt synlig → osynlig (bara alfa räknas). */
  maskColors: ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0)'] as [string, string, string],
  /** Standardhöjder: topp ca 68 (något högre än statusfält/Dynamic Island), botten 128. */
  topExtra: 14,
  bottomHeight: 128,
  /** Bakgrundsblur bakom kontextmenyn (blur 18). */
  menuBackdropIntensity: 60,
  /** Menyns egen blur (blur 40). */
  menuIntensity: 90,
} as const;
