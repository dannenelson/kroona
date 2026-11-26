// Följer (brief 59): ett Pinterest-flöde där det man följer och inspiration
// baserad på det blandas jämnt, i ny slumpad ordning när fliken öppnas och vid
// pull-to-refresh. Två vyer (masonry och en kolumn), pillar som filtrerar på
// riktigt (lib/productFilters.ts) och ett tomläge med områden när man inte
// följer något. Ingen text förklarar varför en produkt visas.
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, touchTarget, followFeed, productCard } from '../../theme';
import { tabBarSpace } from '../../components/CustomTabBar';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useFollowedPeople } from '../../context/FollowedPeopleContext';
import ProductCard from '../../components/ProductCard';
import FilterPills from '../../components/FilterPills';
import SegmentedIcons from '../../components/SegmentedIcons';
import AreaGrid from '../../components/AreaGrid';
import Button from '../../components/Button';
import type { IconName } from '../../components/Icon';
import { filterOptionsWithAreas, filterProducts } from '../../lib/productFilters';
import {
  buildFollowFeed,
  followsAnything,
  getFollowedAreas,
  layoutMasonry,
  masonryRatio,
  newFeedSeed,
} from '../../lib/followFeed';
import type { Product } from '../../types/product';

type ViewMode = 'masonry' | 'single';
const VIEW_MODES: { value: ViewMode; icon: IconName; label: string }[] = [
  { value: 'masonry', icon: 'masonry', label: 'Masonry' },
  { value: 'single', icon: 'one-column-grid', label: 'En kolumn' },
];

// Vyvalet hålls under sessionen (inte lagrat): överlever att fliken monteras om.
let sessionViewMode: ViewMode = 'masonry';

/** Ungefärlig texthöjd under bilden på ett M-kort (märke, två rader namn, pris, betyg),
 *  bara för att välja kortaste kolumn. */
const CARD_TEXT_HEIGHT =
  spacing.sm +
  typography.label.lineHeight +
  typography.body.lineHeight * 2 +
  typography.body.lineHeight +
  typography.caption.lineHeight +
  productCard.textGap * 2 +
  spacing.xs;

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { followedCollectionIds } = useFollowedCollections();
  const { followedPeopleIds } = useFollowedPeople();

  const [viewMode, setViewModeState] = useState<ViewMode>(sessionViewMode);
  const setViewMode = (m: ViewMode) => {
    sessionViewMode = m;
    setViewModeState(m);
  };
  // Ny blandning när fliken öppnas från ingenting (montering) och vid pull-to-refresh.
  const [seed, setSeed] = useState(newFeedSeed);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState('Alla');

  const follow = useMemo(
    () => ({ followedKeys: followedCollectionIds, followedPeopleIds }),
    [followedCollectionIds, followedPeopleIds],
  );
  const options = useMemo(() => filterOptionsWithAreas(getFollowedAreas(followedCollectionIds)), [followedCollectionIds]);
  // Slutar man följa området som är valt går pillen tillbaka till Alla.
  const option = options.find((o) => o.label === selected) ?? options[0];
  const feed = useMemo(() => buildFollowFeed(follow, seed), [follow, seed]);
  const shown = useMemo(() => filterProducts(feed, option.filter), [feed, option]);

  useEffect(() => {
    if (refreshing) setRefreshing(false);
  }, [seed, refreshing]);

  const refresh = () => {
    setRefreshing(true);
    setSeed(newFeedSeed());
  };

  const empty = !followsAnything(follow);
  const columnWidth = (width - spacing.screenMargin * 2 - spacing.gutter) / 2;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarSpace(insets.bottom) }}
        refreshControl={
          empty ? undefined : (
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.textSecondary} />
          )
        }
      >
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Följer
          </Text>
          {empty ? null : <SegmentedIcons items={VIEW_MODES} selected={viewMode} onSelect={setViewMode} />}
        </View>

        {empty ? (
          <EmptyFollow onAllAreas={() => router.push('/areas')} />
        ) : (
          <>
            <FilterPills
              items={options.map((o) => o.label)}
              selected={option.label}
              onSelect={setSelected}
              style={styles.pills}
            />
            {shown.length === 0 ? (
              <Text style={styles.noHits}>Inget här just nu.</Text>
            ) : viewMode === 'masonry' ? (
              <Masonry products={shown} columnWidth={columnWidth} />
            ) : (
              <View style={styles.single}>
                {shown.map((p) => (
                  // Kortet har flex: 1; en egen ruta per kort (som ProductGrid) ger rätt höjd.
                  <View key={p.id}>
                    <ProductCard {...p} size="L" aspectRatio={followFeed.singleRatio} saveButton />
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

/** Två kolumner; varje kort i den kolumn som för tillfället är kortast. */
function Masonry({ products, columnWidth }: { products: Product[]; columnWidth: number }) {
  const styles = useStyles();
  const columns = layoutMasonry(products, (p) => columnWidth / masonryRatio(p), CARD_TEXT_HEIGHT);
  return (
    <View style={styles.masonry}>
      {columns.map((col, i) => (
        <View key={i} style={styles.column}>
          {col.map((p) => (
            <View key={p.id}>
              <ProductCard {...p} aspectRatio={masonryRatio(p)} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Tomläget: följer inget. Fyra områdeskort och "Se alla områden". */
function EmptyFollow({ onAllAreas }: { onAllAreas: () => void }) {
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyText}>
        <Text style={styles.emptyTitle}>Följ något som du gillar</Text>
        <Text style={styles.emptyHint}>Här fylls det på med det du följer och sådant som liknar det.</Text>
      </View>
      <AreaGrid limit={4} />
      <Button onPress={onAllAreas} style={styles.emptyButton}>
        Se alla områden
      </Button>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  // Samma rad som Sparats rubrik (titel vänster, kontroll höger, 44 hög).
  header: {
    minHeight: touchTarget + spacing.md * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  pills: {
    flexGrow: 0,
    marginBottom: spacing.lg,
  },
  masonry: {
    flexDirection: 'row',
    gap: spacing.gutter,
    paddingHorizontal: spacing.screenMargin,
  },
  column: {
    flex: 1,
    gap: followFeed.masonryRowGap,
  },
  single: {
    gap: followFeed.singleRowGap,
    paddingHorizontal: spacing.screenMargin,
  },
  noHits: {
    ...typography.body,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xl,
  },
  empty: {
    gap: spacing.xl,
    paddingTop: spacing.sm,
  },
  emptyText: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
  },
  emptyTitle: {
    ...typography.title2,
    color: t.colors.textPrimary,
  },
  emptyHint: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  emptyButton: {
    alignSelf: 'center',
  },
}));
