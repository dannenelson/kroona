// Alla kategorier (brief 54, rutnät sedan uppföljningen av brief 66): alla
// kategorier i ett rutnät med 3 kolumner, i bokstavsordning (svensk sortering:
// Å, Ä, Ö sist). Korten är som kategorikorten på Hitta (samma bildformat och
// titelstil, bredden delad på tre inom skärmmarginalen). Nås via "Visa fler"
// på Kategorier (Hitta).
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, spacing, radius, findCards } from '../theme';
import { CATEGORIES } from '../data/categories';
import ScreenHeader from '../components/ScreenHeader';
import EditorialCard from '../components/EditorialCard';

const COLUMNS = 3;
const SORTED = [...CATEGORIES].sort((a, b) => a.name.localeCompare(b.name, 'sv'));

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  // Samma bildformat som på Hitta (findCards.category), bredden delad på tre.
  const cardWidth = (width - spacing.screenMargin * 2 - spacing.gutter * (COLUMNS - 1)) / COLUMNS;
  const cardHeight = (cardWidth * findCards.category.height) / findCards.category.width;
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title="Kategorier" />
        <View style={styles.grid}>
          {SORTED.map((c) => (
            <EditorialCard
              key={c.id}
              variant="portraitSmall"
              size={{ width: cardWidth, height: cardHeight, radius: radius.editorialSmall }}
              title={c.name}
              imageUrl={c.image}
              onPress={() => router.push({ pathname: '/category/[id]', params: { id: c.id } })}
            />
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
  grid: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
  },
}));
