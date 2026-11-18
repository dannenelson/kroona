import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, type Theme } from './ThemeProvider';

/**
 * Skapar en hook som bygger StyleSheet mot aktivt tema.
 *   const useStyles = makeStyles((t) => ({ root: { backgroundColor: t.colors.bg } }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  return function useStyles(): T {
    const theme = useTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => StyleSheet.create(factory(theme)), [theme.scheme]);
  };
}
