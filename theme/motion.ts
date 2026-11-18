// Rörelse (docs/design.md §0 och §8). Reduce motion ska alltid respekteras.
export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
  easing: [0.2, 0, 0, 1] as const,
  spring: { damping: 20, stiffness: 220, mass: 1 },
  /** Nedtryckt: djupare yta (colors.pressed) plus nedskalning. */
  pressedScale: 0.96,
  /** Nedtryckt i navigationen. */
  navPressedScale: 0.92,
  /** Lyft kort i kontextmenyn. */
  liftScale: 1.04,
  /** Inaktiv. */
  disabledOpacity: 0.35,
  /** Nedtryckt text-flik (text utan yta). */
  pressedTextOpacity: 0.55,
  /** Äldre tryck-feedback för komponenter som inte gjorts om än. */
  pressedOpacity: 0.8,
  /** Långt tryck öppnar kontextmenyn. */
  longPressMs: 450,
} as const;
