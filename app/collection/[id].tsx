// Samlingsdetalj (brief 28, wireframes.md §2): innehållet i en kuraterad
// samling (data/collections.ts: Kroona-teman och varumärkens kollektioner).
// Nås från temakorten på Hem (CollectionRow), Samlingar-hyllan på
// Partnerdetalj och Sparat ("Gillade produkter" med id `saved` och egna samlingar,
// brief 32). Ligger i rotens stack som Produktdetalj, med samma hierarkirörelse: kortets bild zoomar till covern, drag nedåt överst och
// kantswipe stänger (collectionScreenOptions i components/product/productTransition.ts).
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
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
import { ALL_COLLECTIONS, getCollectionProducts, getCurator } from '../../data/collections';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { ALL_SAVED_ID, ALL_SAVED_NAME, useUserCollections } from '../../context/UserCollectionsContext';
import { PRODUCTS } from '../../data/products';
import CollectionMosaic from '../../components/CollectionMosaic';
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
const ALL = 'Alla';
const NEW = 'Nytt';
const CATEGORY_LABEL: Record<Product['category'], string> = { kläder: 'Kläder', möbler: 'Möbler' };

type Filter = { label: string; match: (p: Product) => boolean };

/** Det skärmen visar, oavsett om samlingen är kuraterad, egen eller "Gillade produkter". */
type CollectionView = {
  id: string;
  name: string;
  products: Product[];
  /** Kuraterade samlingar har en bild; egna och "Gillade produkter" visar mosaik. */
  imageUrl?: string;
  curatorName: string;
  /** Kuratorns sida: Partnerdetalj (varumärke) eller profil (person). */
  curatorHref?: { pathname: '/partner/[id]' | '/profile/[id]'; id: string };
  /** Andra metadataraden efter antal produkter (tag, eller Privat/Publik). */
  detail: string;
  /** Bara kuraterade samlingar kan följas (egna har ingen Följ-knapp). */
  followable: boolean;
  byBrand: boolean;
  emptyTitle: string;
  emptyHint: string;
};

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
  const { savedProducts } = useSavedProducts();
  const { getUserCollection, markCollectionOpened } = useUserCollections();
  const userCollection = getUserCollection(id);
  // "Fortsätt där du var" på Hem visar senast öppnade egna samling (brief 43).
  const isUserCollection = !!userCollection;
  useEffect(() => {
    if (isUserCollection) markCollectionOpened(id);
  }, [id, isUserCollection, markCollectionOpened]);

  // "Gillade produkter" (id `saved`, ingen samling men samma vy), en egen samling eller en kuraterad.
  const collection = useMemo<CollectionView | undefined>(() => {
    if (id === ALL_SAVED_ID) {
      return {
        id,
        name: ALL_SAVED_NAME,
        products: savedProducts,
        curatorName: 'dig',
        detail: 'Privat',
        followable: false,
        byBrand: false,
        emptyTitle: 'Inga gillade produkter än',
        emptyHint: 'Tryck på Spara på en produkt för att spara den här.',
      };
    }
    if (userCollection) {
      return {
        id,
        name: userCollection.name,
        products: userCollection.productIds
          .map((pid) => PRODUCTS.find((p) => p.id === pid))
          .filter((p): p is Product => !!p),
        curatorName: 'dig',
        detail: userCollection.visibility === 'public' ? 'Publik' : 'Privat',
        followable: false,
        byBrand: false,
        emptyTitle: 'Samlingen är tom',
        emptyHint: 'Produkter du lägger här visas i den här samlingen.',
      };
    }
    const c = ALL_COLLECTIONS.find((x) => x.id === id);
    if (!c) return undefined;
    // Kurator (brief 29, 37): Kroona, ett varumärke (→ Partnerdetalj) eller en person (→ profil).
    const curator = getCurator(c);
    return {
      id,
      name: c.name,
      products: getCollectionProducts(c),
      imageUrl: c.imageUrl,
      curatorName: curator.name,
      curatorHref: curator.retailerId
        ? { pathname: '/partner/[id]', id: curator.retailerId }
        : curator.personId
          ? { pathname: '/profile/[id]', id: curator.personId }
          : undefined,
      detail: c.tag,
      followable: true,
      byBrand: c.filter.type === 'brand',
      emptyTitle: 'Samlingen är tom',
      emptyHint: '',
    };
  }, [id, savedProducts, userCollection]);
  const products = useMemo(() => collection?.products ?? [], [collection]);
  const filters = useMemo(() => buildFilters(products, !!collection?.byBrand), [products, collection]);
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
  const { curatorHref, curatorName } = collection;

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
          {collection.imageUrl ? (
            <Image source={{ uri: collection.imageUrl }} style={{ width, height: coverHeight }} resizeMode="cover" />
          ) : (
            <CollectionMosaic
              images={products.slice(0, 4).map((p) => p.imageUrl)}
              style={{ width, height: coverHeight }}
            />
          )}
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
            <View style={styles.metaText}>
              <Pressable
                disabled={!curatorHref}
                accessibilityRole={curatorHref ? 'link' : 'text'}
                onPress={() =>
                  curatorHref && router.push({ pathname: curatorHref.pathname, params: { id: curatorHref.id } })
                }
              >
                <Text style={[styles.curator, curatorHref && styles.curatorLink]} numberOfLines={1}>
                  Av {curatorName}
                </Text>
              </Pressable>
              <Text style={styles.meta} numberOfLines={1}>
                {products.length} produkter · {collection.detail}
              </Text>
            </View>
            {collection.followable && (
              <Pill variant="filled" selected={followed} onPress={() => toggleFollowed(collection.id)}>
                {followed ? 'Följer' : 'Följ'}
              </Pill>
            )}
          </View>

          {filters.length > 1 && (
            <TextTabs
              items={filters.map((f) => f.label)}
              selected={active.label}
              onSelect={setSelected}
              style={styles.tabs}
            />
          )}

          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{collection.emptyTitle}</Text>
              {collection.emptyHint ? <Text style={styles.emptyHint}>{collection.emptyHint}</Text> : null}
            </View>
          ) : (
            <View style={styles.grid}>
              <ProductGrid products={visible} compact />
            </View>
          )}
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
  metaText: {
    flexShrink: 1,
    gap: spacing.xs,
  },
  curator: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  curatorLink: {
    color: t.colors.textPrimary,
  },
  meta: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  tabs: {
    flexGrow: 0,
  },
  grid: {
    paddingHorizontal: spacing.screenMargin,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.body,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.label,
    color: t.colors.textSecondary,
    textAlign: 'center',
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
