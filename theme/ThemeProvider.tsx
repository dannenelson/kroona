import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { darkColors, lightColors, type ColorRoles } from './colors';
import { darkShadows, lightShadows, type Shadows } from './shadows';
import { darkGlass, lightGlass, darkPhotoGlass, lightPhotoGlass, type Glass } from './glass';

export type ColorScheme = 'dark' | 'light';

export type Theme = {
  scheme: ColorScheme;
  colors: ColorRoles;
  shadows: Shadows;
  glass: Glass;
  /** Glas direkt på foto, följer temat (scrim är däremot fast). */
  photoGlass: Glass;
};

type ThemeContextValue = Theme & { setScheme: (scheme: ColorScheme) => void };

export function buildTheme(scheme: ColorScheme): Theme {
  return scheme === 'dark'
    ? { scheme, colors: darkColors, shadows: darkShadows, glass: darkGlass, photoGlass: darkPhotoGlass }
    : { scheme, colors: lightColors, shadows: lightShadows, glass: lightGlass, photoGlass: lightPhotoGlass };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  initialScheme = 'dark',
  children,
}: {
  initialScheme?: ColorScheme;
  children: ReactNode;
}) {
  const [scheme, setScheme] = useState<ColorScheme>(initialScheme);
  const value = useMemo(() => ({ ...buildTheme(scheme), setScheme }), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme måste användas inuti <ThemeProvider>');
  return ctx;
}
