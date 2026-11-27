// Samlingsdetalj (brief 28, wireframes.md §2): innehållet i en kuraterad
// samling (data/collections.ts: Kroona-teman och varumärkens kollektioner).
// Nås från temakorten på Hem (CollectionRow), Samlingar-hyllan på
// Partnerdetalj och Sparat ("Sparade produkter" med id `saved` och egna samlingar,
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, touchTarget, edgeBlur, motion, profileHero, listRow, radius } from '../../theme';
import { ALL_COLLECTIONS, getCollectionProducts, getCurator } from '../../data/collections';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { ALL_SAVED_ID, ALL_SAVED_NAME, useUserCollections } from '../../context/UserCollectionsContext';
import { PRODUCTS } from '../../data/products';
import CollectionMosaic from '../../components/CollectionMosaic';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useParallaxHero } from '../../hooks/useParallaxHero';
import { COLLECTION_BOUNDARY_GROUP } from '../../components/product/productTransition';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import TextTabs from '../../components/TextTabs';
import ProductGrid from '../../components/ProductGrid';
import ProfileHero from '../../components/ProfileHero';
import { useSnackbar } from '../../components/Snackbar';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import SectionTitle from '../../components/SectionTitle';
import { COLLECTION_LOGOS } from '../../data/logos';
import type { Product } from '../../types/product';

// Lokalt layoutmått: cover i samma proportion som Produktdetaljens hero (4:5).
const ALL = 'Alla';
const NEW = 'Nytt';
const CATEGORY_LABEL: Record<Product['category'], string> = { kläder: 'Kläder', möbler: 'Möbler', elektronik: 'Elektronik' };

type Filter = { label: string; match: (p: Product) => boolean };

/** Det skärmen visar, oavsett om samlingen är kuraterad, egen eller "Sparade produkter". */
type CollectionView = {
  id: string;
  name: string;
  products: Product[];
  /** Kuraterade samlingar har en bild; egna och "Sparade produkter" visar mosaik. */
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
  const { id, b, edit } = useLocalSearchParams<{ id: string; b?: string; edit?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const { savedProducts } = useSavedProducts();
  const { getUserCollection, markCollectionOpened, removeProductFromCollection } = useUserCollections();
  const userCollection = getUserCollection(id);
  // "Fortsätt där du var" på Hem visar senast öppnade egna samling (brief 43).
  const isUserCollection = !!userCollection;
  // Redigera innehåll (egna samlingar, från menyn i Sparat): ta bort produkter, Klar avslutar.
  const [editing, setEditing] = useState(edit === '1');
  const snackbar = useSnackbar();
  useEffect(() => {
    if (isUserCollection) markCollectionOpened(id);
  }, [id, isUserCollection, markCollectionOpened]);

  // "Sparade produkter" (id `saved`, ingen samling men samma vy), en egen samling eller en kuraterad.
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
        emptyTitle: 'Inga sparade produkter än',
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

  // Lägre cover (brief 65): `profileHero`, samma som företagsprofilen.
  const coverHeight = (width / profileHero.aspect) * profileHero.heightShare;
  // Toppen visar namnet när covern har passerat under toppbaren (som Produktdetalj).
  const barHeight = touchTarget + spacing.sm * 2;
  const threshold = coverHeight - insets.top - barHeight;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const parallaxStyle = useParallaxHero(scrollY, coverHeight);
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
        <TopBar tone="plain" left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }} />
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
        {/* Profil-hero (brief 65, gemensam med företagsprofilen): covern är målet
            för zoomen från samlingskortet. Logotyp (om samlingen har en) eller
            titeln, typ som undertext och Följ; inget antal i hero. */}
        <ProfileHero
          boundary={{ id: b ?? collection.id, group: COLLECTION_BOUNDARY_GROUP }}
          width={width}
          height={coverHeight}
          parallaxStyle={parallaxStyle}
          cover={
            collection.imageUrl ? (
              <Image source={{ uri: collection.imageUrl }} style={{ width, height: coverHeight }} resizeMode="cover" />
            ) : (
              <CollectionMosaic
                images={products.slice(0, 4).map((p) => p.imageUrl)}
                style={{ width, height: coverHeight }}
              />
            )
          }
          title={collection.name}
          logo={COLLECTION_LOGOS[collection.id]}
          subtitle={collection.detail}
          follow={
            collection.followable
              ? { followed, onPress: () => toggleFollowed(collection.id) }
              : undefined
          }
        />

        <Reanimated.View style={[styles.body, revealStyle]}>
          {/* Samlingens egna uppgifter under hero (brief 65): kuratorn, i samma
              textstil som företagsprofilens avsnitt. Beskrivning saknas i datan. */}
          <View style={styles.textBlock}>
            <Pressable
              disabled={!curatorHref}
              accessibilityRole={curatorHref ? 'link' : 'text'}
              onPress={() =>
                curatorHref && router.push({ pathname: curatorHref.pathname, params: { id: curatorHref.id } })
              }
            >
              <Text style={styles.paragraph} numberOfLines={1}>
                Av <Text style={curatorHref ? styles.curatorLink : undefined}>{curatorName}</Text>
              </Text>
            </Pressable>
          </View>

          <SectionTitle title="Produkter" count={products.length} style={styles.sectionTitle} />

          {editing && isUserCollection ? (
            <View style={styles.editList}>
              <View style={styles.editHeader}>
                <Text style={styles.editHint}>Ta bort produkter ur samlingen.</Text>
                <Button size="compact" onPress={() => setEditing(false)}>
                  Klar
                </Button>
              </View>
              {products.length === 0 ? (
                <Text style={styles.emptyHint}>Samlingen är tom.</Text>
              ) : (
                products.map((p) => (
                  <View key={p.id} style={styles.editRow}>
                    <Image source={{ uri: p.imageUrl }} style={styles.editThumb} />
                    <View style={styles.editText}>
                      <Text style={styles.editBrand} numberOfLines={1}>
                        {p.brand}
                      </Text>
                      <Text style={styles.editName} numberOfLines={1}>
                        {p.name}
                      </Text>
                    </View>
                    <IconButton
                      name="trash"
                      variant="bare"
                      accessibilityLabel={`Ta bort ${p.name} ur samlingen`}
                      onPress={() => {
                        removeProductFromCollection(collection.id, p.id);
                        snackbar.show({
                          subject: p.name,
                          text: 'togs bort från',
                          object: collection.name,
                          thumbUri: p.imageUrl,
                          badge: 'remove',
                        });
                      }}
                    />
                  </View>
                ))
              )}
            </View>
          ) : null}

          {!editing && filters.length > 1 && (
            <TextTabs
              items={filters.map((f) => f.label)}
              selected={active.label}
              onSelect={setSelected}
              style={styles.tabs}
            />
          )}

          {editing && isUserCollection ? null : products.length === 0 ? (
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
        // Bara blur, ingen mörk toning över bilden överst (samma blurlager och styrka).
        variant="clear"
        statusTint
        position="top"
        height={insets.top + barHeight + spacing.lg}
        blurHeight={insets.top + edgeBlur.topExtra}
      />
      <View style={[styles.topChrome, { paddingTop: insets.top }]} pointerEvents="box-none">
        <Reanimated.Text numberOfLines={1} style={[styles.topTitle, { top: insets.top }, titleStyle]}>
          {collection.name}
        </Reanimated.Text>
        <TopBar tone="photo" left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }} />
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
  // Temats bakgrund: hero-bilden glider in bakom innehållet (parallax).
  body: {
    paddingTop: spacing.lg,
    gap: spacing.md,
    backgroundColor: t.colors.bg,
  },
  textBlock: {
    paddingHorizontal: spacing.screenMargin,
  },
  paragraph: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  curatorLink: {
    color: t.colors.textPrimary,
  },
  sectionTitle: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    marginBottom: 0,
  },
  tabs: {
    flexGrow: 0,
  },
  editList: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.sm,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  editHint: {
    ...typography.label,
    color: t.colors.textSecondary,
    flexShrink: 1,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  editThumb: {
    width: listRow.compactThumb,
    height: listRow.compactThumb,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    backgroundColor: t.colors.placeholder,
  },
  editText: {
    flex: 1,
  },
  editBrand: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  editName: {
    ...typography.body,
    color: t.colors.textPrimary,
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
