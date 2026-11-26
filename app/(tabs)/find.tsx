// Hitta (brief 53): startsida för att hitta produkter på tre sätt. Fältet
// "Fråga eller sök" öppnar sökläget (sök direkt eller dialog), idéerna öppnar
// Sökresultat direkt och kategorierna leder till kategorivyn (brief 54).
// Alla tre hyllor har "Visa fler" (Idéer, Alla kategorier, Alla områden; brief 54).
// Dialogen (tidigare chatten här) är en egen stackskärm: app/dialog.tsx.
// Brief 66: hyllan "Tidigare" (senaste dialoger och sökningar, Visa fler → Arkiv).
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, radius, findCards } from '../../theme';
import AskBar from '../../components/AskBar';
import SectionTitle from '../../components/SectionTitle';
import EditorialCard from '../../components/EditorialCard';
import IdeaCard from '../../components/IdeaCard';
import AreaGrid from '../../components/AreaGrid';
import { tabBarSpace } from '../../components/CustomTabBar';
import { IDEAS } from '../../data/ideas';
import { CATEGORIES } from '../../data/categories';
import { useArchive } from '../../context/ArchiveContext';
import ArchiveRow from '../../components/ArchiveRow';

// Hyllan Tidigare visar så många poster; resten i Arkiv.
const RECENT_SHOWN = 3;

// Kategorihyllan visar högst så många kort.
const CATEGORY_LIMIT = 4;

// Hittas grid visar sex områden; resten nås via "Visa fler" (Alla områden, brief 54).
const AREA_LIMIT = 6;

export default function FindScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useStyles();
  const { entries } = useArchive();
  const { width } = useWindowDimensions();
  const categoryWidth = Math.min(
    findCards.category.width,
    (width - spacing.screenMargin * 2 - spacing.gutter * (CATEGORY_LIMIT - 1)) / CATEGORY_LIMIT,
  );
  const categoryHeight = (categoryWidth * findCards.category.height) / findCards.category.width;
  const recent = entries.slice(0, RECENT_SHOWN);

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
            <AskBar inline placeholder="Ställ en fråga eller sök" />
            <Text style={styles.help}>
              Sök efter en produkt eller berätta vad du behöver, till exempel en present till en kollega.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle
            title="Idéer för dig"
            cta={{ onPress: () => router.push('/ideas') }}
            style={styles.sectionTitle}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {IDEAS.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </ScrollView>
        </View>

        {/* Tidigare (brief 66): de senaste posterna ur arkivet, nyast först. */}
        {recent.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle
              title="Tidigare"
              cta={{ onPress: () => router.push('/archive') }}
              style={styles.sectionTitle}
            />
            {recent.map((e) => (
              <ArchiveRow key={e.id} entry={e} />
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionTitle
            title="Kategorier"
            cta={{ onPress: () => router.push('/categories') }}
            style={styles.sectionTitle}
          />
          {/* Högst fyra kategorikort i datans ordning, som delar på bredden (samma
              bildformat som findCards.category); resten i Alla kategorier. */}
          <View style={styles.categoryRow}>
            {CATEGORIES.slice(0, CATEGORY_LIMIT).map((c) => (
              <EditorialCard
                key={c.id}
                variant="portraitSmall"
                size={{ width: categoryWidth, height: categoryHeight, radius: radius.editorialSmall }}
                title={c.name}
                imageUrl={c.image}
                onPress={() => router.push({ pathname: '/category/[id]', params: { id: c.id } })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle
            title="Områden och stilar"
            cta={{ onPress: () => router.push('/areas') }}
            style={styles.sectionTitle}
          />
          <AreaGrid limit={AREA_LIMIT} />
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
}));
