// Alla områden (brief 54): samma områdeskort som på Hitta i 2-kolumnsgrid,
// alla områden. Nås via "Visa fler" på Områden (Hem) och Områden och stilar (Hitta).
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, spacing } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import AreaGrid from '../components/AreaGrid';

export default function AreasScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title="Områden och stilar" />
        <View style={styles.grid}>
          <AreaGrid />
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  grid: {
    marginTop: spacing.lg,
  },
}));
