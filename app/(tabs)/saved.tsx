// Sparat (brief 32, wireframes.md §8): det man sparat och följer.
// Segment överst (text-flikar, design.md §11): Samlingar | Följer.
// - Samlingar: "Alla sparade" (systemsamling, SavedProductsContext, alltid först),
//   egna samlingar (UserCollectionsContext) och "Ny samling" sist, i 2 kolumner.
// - Följer: varumärken och samlingar man följer (FollowedCollectionsContext),
//   samma kort som på Hem; långt tryck ger Sluta följa.
import { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, fonts, spacing, radius } from '../../theme';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { ALL_SAVED_ID, ALL_SAVED_NAME, useUserCollections } from '../../context/UserCollectionsContext';
import { useCardPress } from '../../hooks/useCardPress';
import { PRODUCTS } from '../../data/products';
import {
  ALL_COLLECTIONS,
  getCollectionProducts,
  getRetailerCoverImage,
  getRetailerIdForBrandCollection,
} from '../../data/collections';
import { getProductsForRetailer, getRetailer } from '../../lib/catalog';
import { TAB_BAR_HEIGHT } from '../../components/CustomTabBar';
import TextTabs from '../../components/TextTabs';
import Pill from '../../components/Pill';
import PartnerCard from '../../components/PartnerCard';
import UserCollectionCard from '../../components/saved/UserCollectionCard';
import NewCollectionSheet from '../../components/saved/NewCollectionSheet';

const SEGMENTS = ['Samlingar', 'Följer'] as const;
const VISIBILITY_LABEL = { private: 'Privat', public: 'Publik' } as const;

type FollowedCard = {
  key: string;
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  itemCount: number;
  variant: 'brand' | 'style';
  partnerId?: string;
};

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { savedProducts } = useSavedProducts();
  const { userCollections, createCollection } = useUserCollections();
  const { followedCollectionIds } = useFollowedCollections();
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>('Samlingar');
  const [sheetOpen, setSheetOpen] = useState(false);

  const cardWidth = (width - spacing.screenMargin * 2 - spacing.gutter) / 2;

  // Följer: samlingar (teman, kollektioner, varumärkessamlingar) och varumärken
  // som följs direkt via Partnerdetalj (nyckeln är då återförsäljarens id).
  const followed = useMemo<FollowedCard[]>(
    () =>
      followedCollectionIds.flatMap((key): FollowedCard[] => {
        const c = ALL_COLLECTIONS.find((x) => x.id === key);
        if (c) {
          return [
            {
              key,
              id: c.id,
              name: c.name,
              tag: c.tag,
              imageUrl: c.imageUrl,
              itemCount: getCollectionProducts(c).length,
              variant: c.filter.type === 'brand' ? 'brand' : 'style',
              partnerId: getRetailerIdForBrandCollection(c),
            },
          ];
        }
        const r = getRetailer(key);
        const imageUrl = r ? getRetailerCoverImage(r.id) : undefined;
        if (!r || r.retailerType !== 'brand' || !imageUrl) return [];
        return [
          {
            key,
            id: key,
            name: r.name,
            tag: 'Varumärke',
            imageUrl,
            itemCount: getProductsForRetailer(r.id).length,
            variant: 'brand',
            partnerId: r.id,
          },
        ];
      }),
    [followedCollectionIds],
  );

  const imagesFor = (ids: string[]) =>
    ids
      .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
      .filter((u): u is string => !!u)
      .slice(0, 4);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: TAB_BAR_HEIGHT + insets.bottom, flexGrow: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sparat</Text>
          <Pill variant="filled" onPress={() => setSheetOpen(true)}>
            Ny samling
          </Pill>
        </View>
        <TextTabs items={SEGMENTS} selected={segment} onSelect={setSegment} style={styles.tabs} />

        {segment === 'Samlingar' ? (
          <View style={styles.grid}>
            <UserCollectionCard
              id={ALL_SAVED_ID}
              name={ALL_SAVED_NAME}
              count={savedProducts.length}
              images={savedProducts.slice(0, 4).map((p) => p.imageUrl)}
              width={cardWidth}
            />
            {userCollections.map((c) => (
              <UserCollectionCard
                key={c.id}
                id={c.id}
                name={c.name}
                count={c.productIds.length}
                visibilityLabel={VISIBILITY_LABEL[c.visibility]}
                images={imagesFor(c.productIds)}
                width={cardWidth}
              />
            ))}
            <NewCollectionCard width={cardWidth} onPress={() => setSheetOpen(true)} />
          </View>
        ) : followed.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Du följer inget än</Text>
            <Text style={styles.emptyHint}>Följ varumärken och samlingar för att se dem här.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {followed.map(({ key, ...card }) => (
              <PartnerCard key={key} {...card} width={cardWidth} />
            ))}
          </View>
        )}
      </ScrollView>

      <NewCollectionSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={(name, visibility) => createCollection(name, visibility)}
      />
    </View>
  );
}

/** "Ny samling" sist i gridden: tom kvadrat i samma form som samlingskorten. */
function NewCollectionCard({ width, onPress }: { width: number; onPress: () => void }) {
  const styles = useStyles();
  const press = useCardPress();
  return (
    <Pressable
      style={{ width }}
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Ny samling"
    >
      <Animated.View style={press.scaleStyle}>
        <View style={[styles.newCover, { width, height: width }]}>
          <Text style={styles.newPlus}>+</Text>
        </View>
        <Text style={styles.newLabel}>Ny samling</Text>
      </Animated.View>
    </Pressable>
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
    ...typography.headline,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
  tabs: {
    flexGrow: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.gutter,
    rowGap: spacing.xl,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
  },
  newCover: {
    borderRadius: radius.collection,
    borderCurve: 'continuous',
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPlus: {
    ...typography.display,
    color: t.colors.textSecondary,
  },
  newLabel: {
    ...typography.body,
    color: t.colors.textPrimary,
    paddingTop: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl + spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.body,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.label,
    fontFamily: fonts.ui400, // regular som tidigare, storlek från label
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
