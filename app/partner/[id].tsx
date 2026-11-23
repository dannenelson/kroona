// Partnerdetalj (brief 29, wireframes.md §3): en återförsäljares sida. Byggd
// för varumärken; sedan brief 48 öppnas även butiker och andrahandstjänster
// (Nordic Nest, Royal Design m.fl.), med produkter via deras erbjudanden. Nås från varumärkeskort på Hem
// ("Du följer", "Fler varumärken i din stil") och från kuratorraden i
// Samlingsdetalj. Samma hierarkirörelse som Produkt- och Samlingsdetalj
// (partnerScreenOptions i components/product/productTransition.ts).
import { useMemo } from 'react';
import { Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
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
import { makeStyles, typography, spacing, touchTarget, edgeBlur, motion, overlay, logo } from '../../theme';
import BrandLogo from '../../components/BrandLogo';
import { getProductsForRetailer, getRetailer } from '../../lib/catalog';
import {
  getRetailerCoverImage,
  getCollectionProducts,
  getRetailerCollections,
  getRetailerFollowKey,
} from '../../data/collections';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { PARTNER_BOUNDARY_GROUP } from '../../components/product/productTransition';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import SectionTitle from '../../components/SectionTitle';
import PartnerCard from '../../components/PartnerCard';
import ProductGrid from '../../components/ProductGrid';
import Pill from '../../components/Pill';
import BackIcon from '../../assets/icons/BackIcon';

// Lokalt layoutmått: cover i samma proportion som övriga detaljvyer (4:5).
const COVER_ASPECT = 4 / 5;

export default function PartnerScreen() {
  // `b` = boundary-id för det kort man öppnade från (zoomen går från/till det).
  const { id, b } = useLocalSearchParams<{ id: string; b?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { isFollowed, toggleFollowed } = useFollowedCollections();

  const retailer = getRetailer(id);
  const products = useMemo(() => (retailer ? getProductsForRetailer(retailer.id) : []), [retailer]);
  const collections = useMemo(() => (retailer ? getRetailerCollections(retailer.id) : []), [retailer]);
  // Retailer har ingen egen bild (se getRetailerCoverImage).
  const coverUrl = retailer ? getRetailerCoverImage(retailer.id) : undefined;

  const coverHeight = width / COVER_ASPECT;
  const barHeight = touchTarget + spacing.sm * 2;
  const threshold = coverHeight - insets.top - barHeight;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [threshold - spacing.xl, threshold], [0, 1], Extrapolation.CLAMP),
  }));

  // Innehållet under covern tonas in på slutet av övergången (som övriga detaljvyer).
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

  if (!retailer) {
    return (
      <View style={[styles.container, styles.empty, { paddingTop: insets.top }]}>
        <TopBar tone="plain" left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }} />
        <Text style={styles.emptyText}>Återförsäljaren finns inte.</Text>
      </View>
    );
  }

  // Följ-målet är varumärket ({ kind: 'retailer' }), se getRetailerFollowKey.
  const followKey = getRetailerFollowKey(retailer.id);
  const followed = isFollowed(followKey);
  const presence = [
    ...(retailer.presence.online ? ['E-handel'] : []),
    ...(retailer.presence.stores.length > 0 ? [`Butiker: ${retailer.presence.stores.join(', ')}`] : []),
  ];

  return (
    <View style={styles.container}>
      <Transition.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        onScroll={onScroll}
      >
        {/* Covern är målet för zoomen från varumärkeskortet. */}
        <Transition.Boundary
          id={b ?? retailer.id}
          group={PARTNER_BOUNDARY_GROUP}
          style={[styles.cover, { width, height: coverHeight }]}
        >
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={{ width, height: coverHeight }} resizeMode="cover" />
          ) : null}
          <LinearGradient
            colors={overlay.scrimStops.colors}
            locations={overlay.scrimStops.locations}
            style={styles.coverScrim}
          >
            {/* Logotyp på platta ovanför namnet, om varumärket har en (brief 47). */}
            <BrandLogo retailerId={retailer.id} size={logo.headerCircle} />
            <Text style={styles.coverName} numberOfLines={2}>
              {retailer.name}
            </Text>
          </LinearGradient>
        </Transition.Boundary>

        <Reanimated.View style={[styles.body, revealStyle]}>
          <View style={styles.metaRow}>
            <Text style={styles.meta} numberOfLines={1}>
              {products.length} produkter
            </Text>
            <Pill variant="filled" selected={followed} onPress={() => toggleFollowed(followKey)}>
              {followed ? 'Följer' : 'Följ'}
            </Pill>
          </View>

          <SectionTitle
            title={
              retailer.retailerType === 'brand'
                ? 'Om varumärket'
                : retailer.retailerType === 'store'
                  ? 'Om butiken'
                  : 'Om tjänsten'
            }
            style={styles.sectionTitle}
          />
          <View style={styles.textBlock}>
            <Text style={styles.paragraph}>{retailer.description}</Text>
            <Text style={styles.paragraph}>{retailer.values}</Text>
          </View>

          {presence.length > 0 && (
            <>
              <SectionTitle title="Finns" style={styles.sectionTitle} />
              <View style={styles.textBlock}>
                {presence.map((line) => (
                  <Text key={line} style={styles.paragraph}>
                    {line}
                  </Text>
                ))}
              </View>
            </>
          )}

          {collections.length > 0 && (
            <>
              <SectionTitle title="Samlingar" style={styles.sectionTitle} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
                {collections.map((c) => (
                  <PartnerCard
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    tag={c.tag}
                    imageUrl={c.imageUrl}
                    itemCount={getCollectionProducts(c).length}
                    variant="style"
                  />
                ))}
              </ScrollView>
            </>
          )}

          {products.length > 0 && (
            <>
              <SectionTitle title="Alla produkter" style={styles.sectionTitle} />
              <View style={styles.grid}>
                <ProductGrid products={products} compact />
              </View>
            </>
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
          {retailer.name}
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
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xl,
  },
  coverName: {
    ...typography.display,
    color: overlay.onPhoto,
  },
  body: {
    paddingTop: spacing.lg,
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
  sectionTitle: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  textBlock: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  shelf: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
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
