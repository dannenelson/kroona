// Hitta (brief 53): startsida för att hitta produkter på tre sätt. Fältet
// "Fråga eller sök" öppnar sökläget (sök direkt eller dialog), idéerna öppnar
// Sökresultat direkt och kategorierna leder till kategorivyn (brief 54).
// Dialogen (tidigare chatten här) är en egen stackskärm: app/dialog.tsx.
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, radius, overlay, findCards } from '../../theme';
import AskBar from '../../components/AskBar';
import SectionTitle from '../../components/SectionTitle';
import EditorialCard from '../../components/EditorialCard';
import { tabBarSpace } from '../../components/CustomTabBar';
import FindIcon from '../../assets/icons/FindIcon';
import { IDEAS } from '../../data/ideas';
import { AREAS } from '../../data/areas';
import { PRODUCT_IMAGES } from '../../data/productImages';
import { getProductsForArea } from '../../lib/catalog';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

// Kategorierna (brief 53). Tryck gör inget än: kategorivyn byggs i brief 54.
const CATEGORIES = [
  { id: 'klader', title: 'Kläder', image: PRODUCT_IMAGES.blazerRed },
  { id: 'mobler', title: 'Möbler', image: PRODUCT_IMAGES.chairArmchairWhite },
  { id: 'begagnat', title: 'Begagnat', image: PRODUCT_IMAGES.chairRattan },
];

// Sex områden och stilar med minst en produkt; första produktens bild är omslaget.
const AREA_ITEMS = AREAS.map((area) => ({ area, products: getProductsForArea(area) }))
  .filter((x) => x.products.length > 0)
  .slice(0, 6);

export default function FindScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useStyles();
  const { width } = useWindowDimensions();
  // Två kolumner inom skärmmarginalen (169 i skissen på 390 med marginal 20).
  const areaWidth = (width - spacing.screenMargin * 2 - spacing.gutter) / 2;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarSpace(insets.bottom) + spacing.xxl }}
      >
        <View style={styles.top}>
          <Text style={styles.title} accessibilityRole="header">
            Hitta
          </Text>
          <View style={styles.field}>
            <AskBar inline />
            <Text style={styles.help}>
              Sök på ett ord, eller beskriv vad du behöver, till exempel en bröllopspresent.
            </Text>
          </View>
        </View>

        {/* Idéer: inget "Visa fler" (ingen idélista finns än). */}
        <View style={styles.section}>
          <SectionTitle title="Idéer för dig" style={styles.sectionTitle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {IDEAS.map((idea) => (
              <EditorialCard
                key={idea.id}
                variant="landscape"
                size={{ ...findCards.idea, radius: radius.editorialMedium }}
                title={idea.title}
                imageUrl={idea.image}
                titleIcon={<FindIcon color={overlay.onPhoto} size={findCards.ideaIcon} />}
                accessibilityLabel={`Sök: ${idea.title}`}
                onPress={() => router.push({ pathname: '/results', params: { idea: idea.id } })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Kategorier" style={styles.sectionTitle} />
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => (
              <EditorialCard
                key={c.id}
                variant="portraitSmall"
                size={{ ...findCards.category, radius: radius.editorialSmall }}
                title={c.title}
                imageUrl={c.image}
              />
            ))}
          </View>
        </View>

        {/* Områden: inget "Visa fler" (Områden-listan finns inte än). */}
        <View style={styles.section}>
          <SectionTitle title="Områden och stilar" style={styles.sectionTitle} />
          <View style={styles.areaGrid}>
            {AREA_ITEMS.map(({ area, products }) => (
              <EditorialCard
                key={area.id}
                variant="portraitSmall"
                size={{ width: areaWidth, height: findCards.areaHeight, radius: radius.editorialSmall }}
                align="start"
                title={area.name}
                subtitle={countLabel(products.length)}
                imageUrl={products[0]?.imageUrl}
              />
            ))}
          </View>
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
  top: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  field: {
    gap: spacing.sm,
  },
  help: {
    ...typography.caption,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.lg, // linjerar med fältets text
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
}));
