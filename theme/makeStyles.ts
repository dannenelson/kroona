import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme, type Theme } from './ThemeProvider';

// Egen motsvarighet till StyleSheet.NamedStyles. `T & NamedStyles<T>` i
// factory-parametern ger kontextuell typning, så att literal-värden som
// 'center' inte breddas till string (krävs av RN 0.88:s striktare stiltyper).
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Skapar en hook som bygger StyleSheet mot aktivt tema.
 *   const useStyles = makeStyles((t) => ({ root: { backgroundColor: t.colors.bg } }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends NamedStyles<T>>(factory: (theme: Theme) => T & NamedStyles<T>) {
  return function useStyles(): Readonly<T> {
    const theme = useTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => StyleSheet.create(factory(theme)), [theme.scheme]);
  };
}
