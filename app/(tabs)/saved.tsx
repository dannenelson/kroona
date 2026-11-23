// Sparat (brief 35, wireframes.md §8, skiss "Kroona Sparat – ny struktur"):
// det man sparat och följer.
// - Header: "Sparat" + "+" (Sheet: Skapa samling). Flikar: Mina samlingar | Följer.
// - Mina samlingar: "Gillade produkter" (specialrad, INTE en samling; Spara
//   sparar dit), avdelare, sedan egna samlingar. Rader (standard) eller kort,
//   valet sparas lokalt. Långt tryck: Öppna, Dela.
// - Följer: sektioner Varumärken, Personer (brief 37) och Samlingar som rader,
//   max 3 med "Visa alla" (expanderar på plats). Långt tryck: Öppna, Sluta
//   följa. Områden döljs (ingen följ-lagring för områden än).
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, fonts, spacing, radius, listRow, iconSize } from '../../theme';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useFollowedPeople } from '../../context/FollowedPeopleContext';
import { getPerson } from '../../data/people';
import { ALL_SAVED_ID, ALL_SAVED_NAME, useUserCollections } from '../../context/UserCollectionsContext';
import { PRODUCTS } from '../../data/products';
import { sortByName } from '../../lib/sortByName';
import {
  ALL_COLLECTIONS,
  getCollectionProducts,
  getCurator,
  getRetailerCollections,
  getRetailerFollowKey,
  getRetailerIdForBrandCollection,
  type Collection,
} from '../../data/collections';
import { getProductsForRetailer, getRetailer } from '../../lib/catalog';
import type { Person, Retailer, UserCollection } from '../../types/catalog';
import { tabBarSpace } from '../../components/CustomTabBar';
import {
  COLLECTION_BOUNDARY_GROUP,
  PARTNER_BOUNDARY_GROUP,
  PROFILE_BOUNDARY_GROUP,
} from '../../components/product/productTransition';
import Avatar from '../../components/Avatar';
import TextTabs from '../../components/TextTabs';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import ListRow from '../../components/ListRow';
import SegmentedIcons from '../../components/SegmentedIcons';
import CollectionMosaic from '../../components/CollectionMosaic';
import UserCollectionCard from '../../components/saved/UserCollectionCard';
import { useSheet } from '../../components/Sheet';
import { useSnackbar } from '../../components/Snackbar';
import { createCollectionStep } from '../../components/saved/CreateCollectionStep';
import type { ContextMenuItem } from '../../components/ProductContextMenu';
import PlusIcon from '../../assets/icons/PlusIcon';
import BookmarkIcon from '../../assets/icons/BookmarkIcon';
import LockIcon from '../../assets/icons/LockIcon';
import ListIcon from '../../assets/icons/ListIcon';
import GridIcon from '../../assets/icons/GridIcon';
import ChevronIcon from '../../assets/icons/ChevronIcon';
import ShareIcon from '../../assets/icons/ShareIcon';
import FollowIcon from '../../assets/icons/FollowIcon';

const TABS = ['Mina samlingar', 'Följer'] as const;
type ViewMode = 'rows' | 'cards';
const VIEW_MODES = [
  { value: 'rows' as const, icon: ListIcon, label: 'Rader' },
  { value: 'cards' as const, icon: GridIcon, label: 'Kort' },
];
const VIEW_MODE_KEY = '@kroona/savedViewMode';
/** Antal rader per Följer-sektion innan "Visa alla". */
const SECTION_PREVIEW = 3;

/** Rader eller kort, sparat lokalt (AsyncStorage). Standard: rader. */
function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>('rows');
  useEffect(() => {
    AsyncStorage.getItem(VIEW_MODE_KEY)
      .then((v) => {
        if (v === 'rows' || v === 'cards') setMode(v);
      })
      .catch(() => {});
  }, []);
  const set = (m: ViewMode) => {
    setMode(m);
    AsyncStorage.setItem(VIEW_MODE_KEY, m).catch(() => {});
  };
  return [mode, set];
}

const imagesFor = (ids: string[]) =>
  ids
    .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
    .filter((u): u is string => !!u)
    .slice(0, 4);

const countLabel = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const router = useRouter();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { savedProducts } = useSavedProducts();
  const { userCollections } = useUserCollections();
  // A–Ö i svensk ordning vid visning (brief 42); Gillade produkter ligger fast först.
  const sortedCollections = useMemo(() => sortByName(userCollections, (c) => c.name), [userCollections]);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Mina samlingar');
  const [viewMode, setViewMode] = useViewMode();
  const openCreate = () => sheet.open(createCollectionStep);

  const cardWidth = (width - spacing.screenMargin * 2 - spacing.gutter) / 2;
  const collectionMenu = (id: string, thumb?: string): ContextMenuItem[] => [
    {
      label: 'Öppna',
      icon: ChevronIcon,
      onPress: () => router.push({ pathname: '/collection/[id]', params: { id } }),
    },
    { label: 'Dela', icon: ShareIcon, onPress: () => snackbar.show({ text: 'Delning kommer senare', thumbUri: thumb }) },
  ];
  const visibility = (c: UserCollection) => ({
    subtitle: `${c.visibility === 'public' ? 'Publik' : 'Privat'} · ${countLabel(c.productIds.length, 'produkt', 'produkter')}`,
    icon: c.visibility === 'public' ? undefined : LockIcon,
  });
  const likedSubtitle = countLabel(savedProducts.length, 'produkt', 'produkter');

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: tabBarSpace(insets.bottom), flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Sparat
          </Text>
          <IconButton tone="theme" icon={PlusIcon} accessibilityLabel="Ny samling" onPress={openCreate} />
        </View>
        <TextTabs items={TABS} selected={tab} onSelect={setTab} style={styles.tabs} />

        {tab === 'Mina samlingar' ? (
          <>
            <View style={styles.toolbar}>
              <Text style={styles.count}>{countLabel(userCollections.length, 'samling', 'samlingar')}</Text>
              <SegmentedIcons items={VIEW_MODES} selected={viewMode} onSelect={setViewMode} />
            </View>

            {viewMode === 'rows' ? (
              <View>
                <LikedRow subtitle={likedSubtitle} />
                <View style={styles.divider} />
                {sortedCollections.map((c) => (
                  <CollectionListRow
                    key={c.id}
                    id={c.id}
                    title={c.name}
                    subtitle={visibility(c).subtitle}
                    subtitleIcon={visibility(c).icon}
                    images={imagesFor(c.productIds)}
                    menuItems={collectionMenu(c.id, imagesFor(c.productIds)[0])}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.grid}>
                <UserCollectionCard
                  id={ALL_SAVED_ID}
                  name={ALL_SAVED_NAME}
                  subtitle={likedSubtitle}
                  images={[]}
                  width={cardWidth}
                  cover={<LikedTile size={cardWidth} tileRadius={radius.collection} large />}
                />
                {sortedCollections.map((c) => (
                  <UserCollectionCard
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    subtitle={visibility(c).subtitle}
                    subtitleIcon={visibility(c).icon}
                    images={imagesFor(c.productIds)}
                    width={cardWidth}
                    menuItems={collectionMenu(c.id, imagesFor(c.productIds)[0])}
                  />
                ))}
              </View>
            )}

            {userCollections.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Samla produkter du vill komma tillbaka till.</Text>
                <Button onPress={openCreate}>Skapa samling</Button>
              </View>
            )}
          </>
        ) : (
          <FollowingTab />
        )}
      </ScrollView>
    </View>
  );
}

/** "Gillade produkter": bokmärke i upphöjd ruta (rad 56/r14, kort kvadrat/r18), brief 41. */
function LikedTile({ size, tileRadius, large = false }: { size: number; tileRadius: number; large?: boolean }) {
  const styles = useStyles();
  return (
    <View style={[styles.likedTile, { width: size, height: size, borderRadius: tileRadius }]}>
      <BookmarkIcon color={styles.likedIcon.color} size={large ? iconSize.lg * 2 : iconSize.lg} />
    </View>
  );
}

/** Specialraden "Gillade produkter" överst, med zoom till samma vy som samlingar. */
function LikedRow({ subtitle }: { subtitle: string }) {
  const router = useRouter();
  const b = `${ALL_SAVED_ID}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <ListRow
      title={ALL_SAVED_NAME}
      subtitle={subtitle}
      thumb={<LikedTile size={listRow.thumb} tileRadius={radius.card} />}
      thumbRadius={radius.card}
      boundary={{ id: b, group: COLLECTION_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: ALL_SAVED_ID, b } })}
    />
  );
}

/** Samling som rad: mosaikthumb 56/r14 (kompakt 48/r12), zoom till Samlingsdetalj. */
function CollectionListRow({
  id,
  title,
  subtitle,
  subtitleIcon,
  images,
  menuItems,
  compact = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  subtitleIcon?: typeof LockIcon;
  images: string[];
  menuItems: ContextMenuItem[];
  compact?: boolean;
}) {
  const router = useRouter();
  const styles = useStyles();
  const b = `${id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const size = compact ? listRow.compactThumb : listRow.thumb;
  const thumbRadius = compact ? radius.control : radius.card;
  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      subtitleIcon={subtitleIcon}
      compact={compact}
      thumb={
        <CollectionMosaic
          images={images}
          style={[styles.thumbMosaic, { width: size, height: size, borderRadius: thumbRadius }]}
        />
      }
      thumbRadius={thumbRadius}
      boundary={{ id: b, group: COLLECTION_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id, b } })}
      menuItems={menuItems}
      menuImageUri={images[0]}
    />
  );
}

/** Följer: Varumärken och Samlingar som rader i sektioner (brief 35). */
function FollowingTab() {
  const styles = useStyles();
  const router = useRouter();
  const { followedCollectionIds, toggleFollowed } = useFollowedCollections();
  const { followedPeopleIds, toggleFollowPerson } = useFollowedPeople();
  const people = useMemo(
    () => sortByName(followedPeopleIds.map(getPerson).filter((p): p is Person => !!p), (p) => p.name),
    [followedPeopleIds],
  );

  // Varumärken: följda direkt (återförsäljar-id) eller via sin varumärkessamling.
  // Samlingar: teman och kollektioner (inte varumärkens filtersamlingar).
  const { brands, collections } = useMemo(() => {
    const brandMap = new Map<string, Retailer>();
    const cols: Collection[] = [];
    for (const key of followedCollectionIds) {
      const c = ALL_COLLECTIONS.find((x) => x.id === key);
      if (c && c.filter.type !== 'brand') {
        cols.push(c);
        continue;
      }
      const retailerId = c ? getRetailerIdForBrandCollection(c) : key;
      const r = retailerId ? getRetailer(retailerId) : undefined;
      if (r && r.retailerType === 'brand') brandMap.set(r.id, r);
    }
    // A–Ö (brief 42); "Visa alla" visar då de tre första alfabetiskt först.
    return { brands: sortByName([...brandMap.values()], (r) => r.name), collections: sortByName(cols, (c) => c.name) };
  }, [followedCollectionIds]);

  if (brands.length === 0 && people.length === 0 && collections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Det du följer samlas här.</Text>
        <Button onPress={() => router.navigate('/find')}>Utforska</Button>
      </View>
    );
  }

  return (
    <View>
      <Section
        title="Varumärken"
        items={brands}
        render={(r) => {
          const nCollections = getRetailerCollections(r.id).length;
          return (
            <BrandRow
              key={r.id}
              retailer={r}
              subtitle={
                nCollections > 0
                  ? countLabel(nCollections, 'samling', 'samlingar')
                  : countLabel(getProductsForRetailer(r.id).length, 'produkt', 'produkter')
              }
              onUnfollow={() => toggleFollowed(getRetailerFollowKey(r.id))}
            />
          );
        }}
      />
      <Section
        title="Personer"
        items={people}
        render={(p) => <PersonRow key={p.id} person={p} onUnfollow={() => toggleFollowPerson(p.id)} />}
      />
      <Section
        title="Samlingar"
        items={collections}
        render={(c) => {
          const curator = getCurator(c).name;
          const images = getCollectionProducts(c)
            .slice(0, 4)
            .map((p) => p.imageUrl);
          return (
            <CollectionListRow
              key={c.id}
              id={c.id}
              title={c.name}
              subtitle={`Av ${curator}`}
              images={images}
              compact
              menuItems={[
                {
                  label: 'Öppna',
                  icon: ChevronIcon,
                  onPress: () => router.push({ pathname: '/collection/[id]', params: { id: c.id } }),
                },
                { label: 'Sluta följa', icon: FollowIcon, onPress: () => toggleFollowed(c.id) },
              ]}
            />
          );
        }}
      />
    </View>
  );
}

/** Sektion med rubrik och "Visa alla" (bara vid fler än 3), expanderar på plats. */
function Section<T>({ title, items, render }: { title: string; items: T[]; render: (item: T) => ReactNode }) {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);
  if (items.length === 0) return null;
  const shown = expanded ? items : items.slice(0, SECTION_PREVIEW);
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {items.length > SECTION_PREVIEW && (
          <Pressable accessibilityRole="button" hitSlop={spacing.md} onPress={() => setExpanded((e) => !e)}>
            <Text style={styles.showAll}>{expanded ? 'Visa färre' : 'Visa alla'}</Text>
          </Pressable>
        )}
      </View>
      {shown.map(render)}
    </View>
  );
}

/** Varumärke som rad: rund avatar 48 (initialer), zoom till Partnerdetalj. */
function BrandRow({ retailer, subtitle, onUnfollow }: { retailer: Retailer; subtitle: string; onUnfollow: () => void }) {
  const router = useRouter();
  const b = `${retailer.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const size = listRow.compactThumb;
  return (
    <ListRow
      title={retailer.name}
      subtitle={subtitle}
      compact
      thumb={<Avatar initial={retailer.initial} size={size} />}
      thumbRadius={size / 2}
      boundary={{ id: b, group: PARTNER_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/partner/[id]', params: { id: retailer.id, b } })}
      menuItems={[
        {
          label: 'Öppna',
          icon: ChevronIcon,
          onPress: () => router.push({ pathname: '/partner/[id]', params: { id: retailer.id } }),
        },
        { label: 'Sluta följa', icon: FollowIcon, onPress: onUnfollow },
      ]}
    />
  );
}

/** Person som rad (brief 37): rund avatar 48, "@handle", zoom till profilvyn. */
function PersonRow({ person, onUnfollow }: { person: Person; onUnfollow: () => void }) {
  const router = useRouter();
  const b = `${person.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const size = listRow.compactThumb;
  return (
    <ListRow
      title={person.name}
      subtitle={`@${person.handle}`}
      compact
      thumb={<Avatar initial={person.initial} size={size} />}
      thumbRadius={size / 2}
      boundary={{ id: b, group: PROFILE_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/profile/[id]', params: { id: person.id, b } })}
      menuItems={[
        {
          label: 'Öppna',
          icon: ChevronIcon,
          onPress: () => router.push({ pathname: '/profile/[id]', params: { id: person.id } }),
        },
        { label: 'Sluta följa', icon: FollowIcon, onPress: onUnfollow },
      ]}
    />
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  header: {
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
  tabs: {
    flexGrow: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  count: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
  divider: {
    height: 1, // hårlinje som skissens avdelare
    marginHorizontal: spacing.screenMargin,
    marginVertical: spacing.xs,
    backgroundColor: t.colors.sep,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.gutter,
    rowGap: spacing.xl,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
  },
  likedTile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    backgroundColor: t.colors.surfaceRaised,
  },
  likedIcon: {
    color: t.colors.textPrimary,
  },
  thumbMosaic: {
    borderCurve: 'continuous',
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.title2,
    color: t.colors.textPrimary,
  },
  showAll: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
