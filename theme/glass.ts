// Glas (docs/design.md §3). Komponenten ligger i components/Glass.tsx.
//
// expo-blur tar inte blur-radie eller saturate direkt. `tint` och
// `blurIntensity` är översättningen till BlurView: blur 10 ≈ intensity 30,
// och saturate 180 % saknas helt i expo-blur (närmast är tint-lagret).
// Värdena `blur` och `saturate` står kvar som designens källa.
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
  fill: 'rgba(14,16,20,0.24)',
  blur: 10,
  saturate: 1.8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  content: '#FFFFFF',
  tint: 'dark',
  blurIntensity: 30,
};

export const lightGlass: Glass = {
  fill: 'rgba(255,255,255,0.28)',
  blur: 10,
  saturate: 1.8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.40)',
  content: '#14181D',
  tint: 'light',
  blurIntensity: 30,
};

// Glas på foto: fast mörkt glas med vitt innehåll i båda teman
// (foto-overlayer är identiska i båda teman, design.md §2).
export const photoGlass: Glass = darkGlass;
