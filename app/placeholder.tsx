// Platshållare (brief 64) för rader som saknar innehåll i Fas 0 (t.ex. Hjälp
// i Profil). Rubriken kommer från parametern `title`.
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, iconSize } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';

export default function PlaceholderScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title={title ?? 'Kommer snart'} />
      <View style={styles.empty}>
        <Icon name="clock" color={colors.textTertiary} size={iconSize.lg * 2} />
        <Text style={styles.emptyTitle}>Kommer snart</Text>
        <Text style={styles.emptyHint}>Den här delen finns inte i demot än.</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.title2,
    color: t.colors.textPrimary,
  },
  emptyHint: {
    ...typography.body,
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
