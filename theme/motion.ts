// Rörelse (docs/design.md §8). Reduce motion ska alltid respekteras.
export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
  easing: [0.2, 0, 0, 1] as const,
  spring: { damping: 20, stiffness: 220, mass: 1 },
  pressedOpacity: 0.8,
} as const;
