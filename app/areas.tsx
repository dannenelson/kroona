// Alla områden (brief 54): samma områdeskort som på Hitta i 2-kolumnsgrid,
// alla områden. Nås via "Visa fler" på Områden (Hem) och Områden och stilar (Hitta).
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, spacing } from '../theme';
import EdgeFade from '../components/EdgeFade';
import ScreenHeader from '../components/ScreenHeader';
import AreaGrid from '../components/AreaGrid';

export default function AreasScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {/* Innehållet skrollar bakom statusfältet under den gemensamma kantblurren (EdgeFade). */}
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title="Områden och stilar" />
        <View style={styles.grid}>
          <AreaGrid />
        </View>
      </ScrollView>
      <EdgeFade position="top" />
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
