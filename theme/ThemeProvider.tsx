import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, type ColorRoles } from './colors';
import { darkShadows, lightShadows, type Shadows } from './shadows';
import { darkGlass, lightGlass, darkPhotoGlass, lightPhotoGlass, type Glass } from './glass';

export type ColorScheme = 'dark' | 'light';
/** Användarens val i Inställningar → Utseende (brief 64). */
export type ThemePreference = ColorScheme | 'system';

export type Theme = {
  scheme: ColorScheme;
  colors: ColorRoles;
  shadows: Shadows;
  glass: Glass;
  /** Glas direkt på foto, följer temat (scrim är däremot fast). */
  photoGlass: Glass;
};

type ThemeContextValue = Theme & {
  /** Valet: ljust, mörkt eller systemets läge. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Kortform för ett fast läge (samma som setPreference med 'light'/'dark'). */
  setScheme: (scheme: ColorScheme) => void;
  /** Sant när det sparade valet är inläst (undviker att fel tema blinkar vid start). */
  ready: boolean;
};

const STORAGE_KEY = '@kroona/themePreference';

export function buildTheme(scheme: ColorScheme): Theme {
  return scheme === 'dark'
    ? { scheme, colors: darkColors, shadows: darkShadows, glass: darkGlass, photoGlass: darkPhotoGlass }
    : { scheme, colors: lightColors, shadows: lightShadows, glass: lightGlass, photoGlass: lightPhotoGlass };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Tema (brief 64): valet Ljust / Mörkt / System sparas lokalt (AsyncStorage) och
 * gäller direkt i hela appen. System följer enhetens läge (`useColorScheme`,
 * kräver `userInterfaceStyle: "automatic"` i app.json). Standard innan något
 * valts: `defaultPreference` (mörkt, som tidigare).
 */
export function ThemeProvider({
  defaultPreference = 'dark',
  children,
}: {
  defaultPreference?: ThemePreference;
  children: ReactNode;
}) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw === 'light' || raw === 'dark' || raw === 'system') setPreferenceState(raw);
      })
      .catch((error) => console.warn('Kunde inte läsa temavalet', error))
      .finally(() => setReady(true));
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => console.warn('Kunde inte spara temavalet', error));
  }, []);

  const scheme: ColorScheme = preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo(
    () => ({ ...buildTheme(scheme), preference, setPreference, setScheme: setPreference, ready }),
    [scheme, preference, setPreference, ready],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme måste användas inuti <ThemeProvider>');
  return ctx;
}
