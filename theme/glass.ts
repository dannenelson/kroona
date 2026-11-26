// Glas (docs/design.md §0 och §3). Komponenten ligger i components/Glass.tsx.
//
// expo-blur tar inte blur-radie eller saturate direkt. `tint` och
// `blurIntensity` är översättningen till BlurView: blur 10 ≈ intensity 30,
// blur 20 ≈ intensity 50. Saturate saknas helt i expo-blur (närmast är
// tint-lagret). Värdena `blur` och `saturate` står kvar som designens källa.
//
// Opacitet (brief 06): fyllningen är sänkt till lägsta alfa som klarar
// kontrastkraven (text ≥ 4,5:1, ikoner ≥ 3:1) mot de ljusaste och mörkaste
// produktfotona, med golv 0,20 och utan att höja något. iOS systemmaterial
// som tint bär resten (dämpning + mättnad); dess bidrag bedöms på enhet.
export type GlassTint = 'systemThinMaterialDark' | 'systemThinMaterialLight';

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
  fill: 'rgba(42,45,51,0.28)', // ikoner: 3,1 / 5,9 mot ljusaste / mörkaste foto
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  content: '#F5F6F8',
  tint: 'systemThinMaterialDark',
  blurIntensity: 50,
};

export const lightGlass: Glass = {
  fill: 'rgba(255,255,255,0.20)', // ikoner: golv 0,20 (9,8 / 5,5)
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(21,23,27,0.10)',
  content: '#15171B',
  tint: 'systemThinMaterialLight',
  blurIntensity: 50,
};

// Glas på foto (design.md §0/§3, ändrat 2026-11-18): följer temat.
// Mörkt: mörkt och genomskinligt med vitt innehåll (referensen "Kroona Looken A").
export const darkPhotoGlass: Glass = {
  fill: 'rgba(20,22,26,0.34)', // text: tak 0,34 (4,2 / 7,7), tinten bär resten
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.24)',
  content: '#FFFFFF',
  tint: 'systemThinMaterialDark',
  blurIntensity: 50,
};

// Ljust: ljus fyllning, ljus kant och mörkt innehåll (brief 05).
export const lightPhotoGlass: Glass = {
  fill: 'rgba(255,255,255,0.20)', // text: golv 0,20 (9,8 / 5,5)
  blur: 20,
  saturate: 1.6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.60)',
  content: '#15171B',
  tint: 'systemThinMaterialLight',
  blurIntensity: 50,
};

// Kantblur (EdgeFade): max 8 px, tre lager på 20 / 50 / 100 % med mask.
// Intensiteten räknas om från px med samma översättning som glaset
// (ca 3,5 intensity per px blur).
export const edgeBlur = {
  /** Statusfältets tint (overlay.statusBarTint, mörkt läge): gradient som är starkast
   *  överst där statustexten står och fasas ut mjukt (ease-out) till 0 över `length`
   *  × statusfältets höjd. `locations` är andelar av sträckan, `strength` andel av
   *  toppvärdet i varje stopp. */
  statusTint: {
    length: 2.5,
    // Full styrka genom statustextens zon (ca 0–30 pt ≈ 20 % av sträckan), sedan ease-out.
    locations: [0, 0.2, 0.45, 0.65, 0.82, 1],
    strength: [1, 1, 0.7, 0.35, 0.12, 0],
  },
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
  /** Organisk toppkant (brief 10, test i dev-routen): hela kantlagret maskas
   *  med ett mjukt alfa-fält som når olika djupt över bredden. Bara gradienter,
   *  ingen ritad form, så det finns ingen kant att se. Andelar av bredd/höjd. */
  wave: {
    /** Bas över hela bredden: helt synlig till baseSolid, utfasad till baseDepth. */
    baseSolid: 0.3,
    baseDepth: 0.62,
    /** Mjuka "lober" från överkanten: mittpunkt x, halv bredd och djup. */
    lobes: [
      { x: 0.08, width: 0.34, depth: 0.92 },
      { x: 0.42, width: 0.3, depth: 0.8 },
      { x: 0.7, width: 0.36, depth: 1.0 },
      { x: 0.98, width: 0.28, depth: 0.84 },
    ],
    /** Andel av lobens radie som är helt synlig innan den fasas ut. */
    lobeSolid: 0.35,
  },
  /** Bakgrundsblur bakom kontextmenyn: lätt, ca hälften av referensens blur 18. */
  menuBackdropIntensity: 30,
  /** Menyns egen blur (blur 40). */
  menuIntensity: 90,
} as const;
