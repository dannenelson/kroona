// Elevation (docs/design.md §7). Mörkt tema: ingen skugga.
export type Shadows = { card?: string; raised?: string; overlay?: string };

export const darkShadows: Shadows = {};

export const lightShadows: Shadows = {
  card: '0 1px 2px rgba(20,24,29,0.06)',
  raised: '0 4px 12px rgba(20,24,29,0.10)',
  overlay: '0 8px 24px rgba(20,24,29,0.18)',
};
