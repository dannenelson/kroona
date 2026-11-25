import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, typography, spacing } from '../theme';
import TopBar from './TopBar';

type Props = {
  title: string;
  /** Rader under rubriken (beskrivning, knappar, antal). */
  children?: ReactNode;
};

/**
 * Topp för list- och filtervyer utan bild (brief 54: Kategorivy, Alla
 * kategorier, Alla områden, Områdesdetalj, Idéer): tillbakaknapp i TopBar och
 * rubrik i `screenTitle` (Familjen Grotesk 28). Safe area hanteras av skärmen.
 */
export default function ScreenHeader({ title, children }: Props) {
  const router = useRouter();
  const styles = useStyles();
  return (
    <View>
      <TopBar left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: () => router.back() }} />
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {children}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: t.colors.textPrimary,
  },
}));
