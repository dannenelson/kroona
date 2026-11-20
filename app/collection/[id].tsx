// Samlingsdetalj (brief 28, wireframes.md §2): innehållet i en kuraterad
// samling (data/collections.ts, varumärke eller tema). Nås från samlingskorten
// på Hem (CollectionRow). Ligger i rotens stack som Produktdetalj, med samma
// hierarkirörelse: kortets bild zoomar till covern, drag nedåt överst och
// kantswipe stänger (collectionScreenOptions i components/product/productTransition.ts).
import { useMemo, useState } from 'react';
import { Image, Text, View, useWindowDimensions } from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Transition, { useScreenAnimation } from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, touchTarget, edgeBlur, motion, overlay } from '../../theme';
import { COLLECTIONS, getCollectionProducts } from '../../data/collections';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { COLLECTION_BOUNDARY_GROUP } from '../../components/product/productTransition';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import TextTabs from '../../components/TextTabs';
import ProductGrid from '../../components/ProductGrid';
import Pill from '../../components/Pill';
import BackIcon from '../../assets/icons/BackIcon';
import type { Product } from '../../types/product';

// Lokalt layoutmått: cover i samma proportion som Produktdetaljens hero (4:5).
const COVER_ASPECT = 4 / 5;
const CURATOR = 'Kroona';
const ALL = 'Alla';
const NEW = 'Nytt';
const CATEGORY_LABEL: Record<Product['category'], string> = { kläder: 'Kläder', möbler: 'Möbler' };

type Filter = { label: string; match: (p: Product) => boolean };

/**
 * Flikar härledda ur datan (design.md §11), aldrig tomma: Alla, kategori om
 * samlingen har fler än en, stil om en varumärkessamling har fler än en
 * (en temasamling har redan en stil), och Nytt om något är nytt.
 */
function buildFilters(products: Product[], byBrand: boolean): Filter[] {
  const filters: Filter[] = [{ label: ALL, match: () => true }];
  const categories = [...new Set(products.map((p) => p.category))];
  if (categories.length > 1) {
    categories.forEach((c) => filters.push({ label: CATEGORY_LABEL[c], match: (p) => p.category === c }));
  }
  const styles = [...new Set(products.map((p) => p.style))];
  if (byBrand && styles.length > 1) {
    styles.forEach((s) => filters.push({ label: s, match: (p) => p.style === s }));
  }
  if (products.some((p) => p.isNew)) filters.push({ label: NEW, match: (p) => !!p.isNew });
  return filters;
}

export default function CollectionScreen() {
  // `b` = boundary-id för det kort man öppnade från (zoomen går från/till det).
  const { id, b } = useLocalSearchParams<{ id: string; b?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { isFollowed, toggleFollowed } = useFollowedCollections();

  const collection = COLLECTIONS.find((c) => c.id === id);
  const products = useMemo(() => (collection ? getCollectionProducts(collection) : []), [collection]);
  const filters = useMemo(
    () => buildFilters(products, collection?.filter.type === 'brand'),
    [products, collection],
  );
  const [selected, setSelected] = useState(ALL);
  const active = filters.find((f) => f.label === selected) ?? filters[0];
  const visible = useMemo(() => products.filter(active.match), [products, active]);

  const coverHeight = width / COVER_ASPECT;
  // Toppen visar namnet när covern har passerat under toppbaren (som Produktdetalj).
  const barHeight = touchTarget + spacing.sm * 2;
  const threshold = coverHeight - insets.top - barHeight;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [threshold - spacing.xl, threshold], [0, 1], Extrapolation.CLAMP),
  }));

  // Innehållet under covern tonas in på slutet av övergången (som Produktdetalj).
  const reduceMotion = useReduceMotion();
  const screenAnimation = useScreenAnimation();
  const revealStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion
      ? 1
      : interpolate(
          screenAnimation.value.current.transitionProgress,
          [motion.detailRevealFrom, 1],
          [0, 1],
          Extrapolation.CLAMP,
        ),
  }));

  const back = () => router.back();

  if (!collection) {
    return (
      <View style={[styles.container, styles.empty, { paddingTop: insets.top }]}>
        <TopBar tone="plain" left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }} />
        <Text style={styles.emptyText}>Samlingen finns inte.</Text>
      </View>
    );
  }

  const followed = isFollowed(collection.id);

  return (
    <View style={styles.container}>
      {/* Transition.ScrollView samordnar scrollen med stängningsgesten:
          drag nedåt tar bara över när innehållet är överst. */}
      <Transition.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        onScroll={onScroll}
      >
        {/* Covern är målet för zoomen från samlingskortet. */}
        <Transition.Boundary
          id={b ?? collection.id}
          group={COLLECTION_BOUNDARY_GROUP}
          style={[styles.cover, { width, height: coverHeight }]}
        >
          <Image source={{ uri: collection.imageUrl }} style={{ width, height: coverHeight }} resizeMode="cover" />
          <LinearGradient
            colors={overlay.scrimStops.colors}
            locations={overlay.scrimStops.locations}
            style={styles.coverScrim}
          >
            <Text style={styles.coverName} numberOfLines={2}>
              {collection.name}
            </Text>
          </LinearGradient>
        </Transition.Boundary>

        <Reanimated.View style={[styles.body, revealStyle]}>
          {/* Metadata och åtgärd. Beskrivning saknas i datan (Collection har ingen), så den hoppas över. */}
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              {products.length} produkter · {CURATOR} · {collection.tag}
            </Text>
            <Pill variant="filled" selected={followed} onPress={() => toggleFollowed(collection.id)}>
              {followed ? 'Följer' : 'Följ'}
            </Pill>
          </View>

          {filters.length > 1 && (
            <TextTabs
              items={filters.map((f) => f.label)}
              selected={active.label}
              onSelect={setSelected}
              style={styles.tabs}
            />
          )}

          <View style={styles.grid}>
            <ProductGrid products={visible} compact />
          </View>
        </Reanimated.View>
      </Transition.ScrollView>

      <EdgeFade
        position="top"
        height={insets.top + barHeight + spacing.lg}
        blurHeight={insets.top + edgeBlur.topExtra}
      />
      <View style={[styles.topChrome, { paddingTop: insets.top }]} pointerEvents="box-none">
        <Reanimated.Text numberOfLines={1} style={[styles.topTitle, { top: insets.top }, titleStyle]}>
          {collection.name}
        </Reanimated.Text>
        <TopBar tone="photo" left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }} />
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
    gap: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
  },
  cover: {
    backgroundColor: t.colors.placeholder,
  },
  // Scrim mörk i båda teman (foto), namnet i fast ljus färg ovanpå.
  coverScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xl,
  },
  coverName: {
    ...typography.display,
    color: overlay.onPhoto,
  },
  body: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
  },
  meta: {
    ...typography.label,
    color: t.colors.textSecondary,
    flexShrink: 1,
  },
  tabs: {
    flexGrow: 0,
  },
  grid: {
    paddingHorizontal: spacing.screenMargin,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topTitle: {
    ...typography.body,
    fontFamily: typography.headline.fontFamily,
    position: 'absolute',
    left: spacing.screenMargin + touchTarget + spacing.sm,
    right: spacing.screenMargin + touchTarget + spacing.sm,
    height: touchTarget + spacing.sm * 2,
    lineHeight: touchTarget + spacing.sm * 2,
    textAlign: 'center',
    color: t.colors.textPrimary,
  },
}));
