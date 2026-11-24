// Idéer (brief 54): alla idékort i en kolumn, fulla bredden. Tryck öppnar
// Sökresultat. Nås via "Visa fler" på Idéer för dig (Hitta).
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, spacing } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import IdeaCard from '../components/IdeaCard';
import { IDEAS } from '../data/ideas';

export default function IdeasScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title="Idéer för dig" />
        <View style={styles.list}>
          {IDEAS.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} width={width - spacing.screenMargin * 2} />
          ))}
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
  list: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.md,
  },
}));
