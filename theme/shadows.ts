// Elevation (docs/design.md §7). Mörkt tema: ingen skugga för vanliga ytor,
// men lyft kort och kontextmeny har skugga i båda teman (referens "Kroona Looken A").
export type Shadows = {
  card?: string;
  raised?: string;
  overlay?: string;
  lift: string;
  menu: string;
  /** Glasknappar (brief 15): subtil, så klickytan syns mot ljus bakgrund. Knappt märkbar i mörkt. */
  glassButton: string;
};

export const darkShadows: Shadows = {
  lift: '0 30px 70px rgba(0,0,0,0.55)',
  menu: '0 20px 50px rgba(0,0,0,0.25)',
  glassButton: '0 1px 3px rgba(0,0,0,0.18)',
};

export const lightShadows: Shadows = {
  card: '0 1px 2px rgba(20,24,29,0.06)',
  raised: '0 4px 12px rgba(20,24,29,0.10)',
  overlay: '0 8px 24px rgba(20,24,29,0.18)',
  lift: '0 30px 70px rgba(21,23,27,0.22)',
  menu: '0 20px 50px rgba(0,0,0,0.25)',
  glassButton: '0 2px 8px rgba(21,23,27,0.14)',
};
