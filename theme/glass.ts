// Glas (docs/design.md §3). Bara tokens, komponenten kommer i steg 1b.
export type Glass = {
  fill: string;
  blur: number;
  saturate: number;
  borderWidth: number;
  borderColor: string;
  content: string;
};

export const darkGlass: Glass = {
  fill: 'rgba(14,16,20,0.24)',
  blur: 10,
  saturate: 1.8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  content: '#FFFFFF',
};

export const lightGlass: Glass = {
  fill: 'rgba(255,255,255,0.28)',
  blur: 10,
  saturate: 1.8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.40)',
  content: '#14181D',
};
