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
  /** Tryck in: snabb, mjuk övergång till nedtryckt (ms). */
  pressIn: 90,
  /** Släpp: lätt fjäder tillbaka. */
  pressOutSpring: { damping: 14, stiffness: 320, mass: 0.6 },
  /** Äldre tryck-feedback för komponenter som inte gjorts om än. */
  pressedOpacity: 0.8,
  /** Långt tryck öppnar kontextmenyn. */
  longPressMs: 450,
  /** Kontextmenyn: lyft kort och meny fjädrar in, stängning samma väg tillbaka. */
  menuSpring: { damping: 18, stiffness: 260, mass: 1 },
  /** Menyn växer från kortet: startskala och glidavstånd (px) mot kortet. */
  menuEnterScale: 0.6,
  menuOffset: 12,
  /** Stängning utan fjäder (reduce motion, och bakgrundens toning). */
  menuFadeDuration: 180,
} as const;
