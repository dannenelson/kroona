// Produktdetalj (brief 13): navet för Jämför och Köp. Nås från alla
// produktkort (ProductCard öppnar hit som standard). Ligger i rotens stack
// ovanför flikarna, så tab-baren syns inte och tillbaka går till skärmen man
// kom från. Öppning och stängning (zoom från kortet, drag nedåt, kantswipe)
// ägs av react-native-screen-transitions, se components/product/productTransition.ts. Delar som bara används här (erbjudanderad, faktarad, Spara-knapp)
// bor i components/product/ tills de behövs på fler ställen.
import { useMemo, useRef, useState } from 'react';
import { Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useGestureDebug } from '../../utils/devGestureDebug'; // TEMP-DEBUG-GEST
import Transition, { useScreenAnimation } from 'react-native-screen-transitions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PRODUCT_BOUNDARY_GROUP } from '../../components/product/productTransition';
import HeroPager from '../../components/product/HeroPager';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, radius, touchTarget, edgeBlur, motion } from '../../theme';
import { PRODUCTS } from '../../data/products';
import {
  getLowestPrice,
  getProductImages,
  getNewOffers,
  getRetailer,
  getSimilarProducts,
  getUsedOffersByService,
} from '../../lib/catalog';
import { formatPrice, formatScore } from '../../utils/format';
import { haptic } from '../../utils/haptic';
import { useToast } from '../../components/Toast';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import SectionTitle from '../../components/SectionTitle';
import ProductCard from '../../components/ProductCard';
import SaveButton from '../../components/product/SaveButton';
import { FactList, type Fact } from '../../components/product/FactList';
import OfferRow from '../../components/product/OfferRow';
import BackIcon from '../../assets/icons/BackIcon';
import ShareIcon from '../../assets/icons/ShareIcon';
import type { Offer } from '../../types/catalog';

// Lokala layoutmått: hero 4:5 (referensen 390 × 500), liknande-kort 140 × 176.
const HERO_ASPECT = 4 / 5;
const SIMILAR_WIDTH = 140;
const SIMILAR_IMAGE_HEIGHT = 176;

const STOCK_LABEL: Record<Offer['stock'], string> = {
  in_stock: 'I lager',
  few_left: 'Få kvar',
  out_of_stock: 'Slut',
};

export default function ProductScreen() {
  // `b` = boundary-id för det kort man öppnade från (zoomen går från/till det).
  const { id, b } = useLocalSearchParams<{ id: string; b?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const toast = useToast();

  const product = PRODUCTS.find((p) => p.id === id);
  const heroHeight = width / HERO_ASPECT;
  // Toppen byter till nedscrollat läge när hero har passerat under toppbaren.
  const barHeight = touchTarget + spacing.sm * 2;
  const threshold = heroHeight - insets.top - barHeight;
  // Scroll-positionen på UI-tråden (Reanimated): toppen och stängningsgesten läser den.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [threshold - spacing.xl, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Informationen under heron tonas in på slutet av övergången, när bilden
  // landat (följer övergångens egen progress, även baklänges vid stängning).
  // Minska rörelse: tonas in direkt, utan att vänta på zoomen.
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

  // TEMP-DEBUG-GEST: visar för senaste draget scrollY vid start och om
  // stängningsgesten tog över eller avvisades (och trolig orsak).
  const gestureDebug = useGestureDebug();
  const [gestureNote, setGestureNote] = useState('');
  const dragStart = useRef({ y: 0, momentum: false, taken: false });
  const momentumRef = useRef(false);
  const markTaken = () => {
    if (dragStart.current.taken) return;
    dragStart.current.taken = true;
    setGestureNote(`start y=${dragStart.current.y.toFixed(1)}  → TOGS ÖVER av stängningsgesten`);
  };
  useAnimatedReaction(
    () => screenAnimation.value.current.gesture.dragging,
    (dragging, prev) => {
      if (gestureDebug && dragging === 1 && prev !== 1) scheduleOnRN(markTaken);
    },
  );
  const onDebugBeginDrag = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    if (!gestureDebug) return;
    dragStart.current = { y: e.nativeEvent.contentOffset.y, momentum: momentumRef.current, taken: false };
  };
  const onDebugEndDrag = () => {
    if (!gestureDebug || dragStart.current.taken) return;
    const { y, momentum } = dragStart.current;
    const reason =
      y > 1
        ? `scroll ej överst (y > 1 px)`
        : momentum
          ? 'momentum pågick vid start'
          : `sidled större än nedåt (|dx| > |dy|) efter ${motion.dismissActivationDistance} px, eller start på Liknande-raden/knapp`;
    setGestureNote(`start y=${y.toFixed(1)}  → AVVISAD: ${reason}`);
  };

  const data = useMemo(() => {
    if (!product) return null;
    const lowest = getLowestPrice(product.id);
    const lowestUsed = getLowestPrice(product.id, 'used');
    const lowestNew = getLowestPrice(product.id, 'new');
    return {
      lowest,
      lowestIsUsed:
        lowestUsed !== undefined && (lowestNew === undefined || lowestUsed < lowestNew),
      used: getUsedOffersByService(product.id),
      fresh: getNewOffers(product.id),
      similar: getSimilarProducts(product.id),
    };
  }, [product]);

  const back = () => router.back();
  const heroBoundaryId = b ?? id;
  // Valt bildindex delas via lib/lightboxStore (sätts av HeroPager vid tryck).
  // Index skickas som route-param (lightboxens första bild) och som shared value (HeroPager).
  const openLightbox = (index: number) =>
    router.push({
      pathname: '/lightbox/[id]',
      params: { id, index: String(index) },
    });
  const onOffer = (offer: Offer) => {
    const name = getRetailer(offer.retailerId)?.name ?? 'återförsäljaren';
    haptic.light();
    // Fas 0: ingen utlänk eller tracking, bara en bekräftelse.
    toast.show(`Du skulle nu gå till ${name}`);
  };

  if (!product || !data) {
    return (
      <View style={[styles.container, styles.empty, { paddingTop: insets.top }]}>
        <TopBar tone="plain" left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }} />
        <Text style={styles.emptyText}>Produkten finns inte.</Text>
      </View>
    );
  }

  const facts: Fact[] = [
    { label: 'Hållbarhetsindex', value: `${formatScore(product.sustainabilityScore)} av 5` },
    ...(product.facts?.material ? [{ label: 'Material', value: product.facts.material }] : []),
    ...(product.facts?.madeIn ? [{ label: 'Tillverkad i', value: product.facts.madeIn }] : []),
    ...(product.facts?.certification
      ? [{ label: 'Certifiering', value: product.facts.certification }]
      : []),
  ];

  // Titeln tonar in när hero passerat under toppbaren. Toppkanten och
  // statusfältet följer temat hela vägen (brief 15), inget byte vid scroll.
  return (
    <View style={styles.container}>
      {/* Transition.ScrollView samordnar scrollen med stängningsgesten:
          drag nedåt tar bara över när innehållet är överst. Studsar som vanligt. */}
      <Transition.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        // Exakt 0 överst (ingen automatisk inset).
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        onScroll={onScroll}
        onScrollBeginDrag={onDebugBeginDrag /* TEMP-DEBUG-GEST */}
        onScrollEndDrag={onDebugEndDrag /* TEMP-DEBUG-GEST */}
        onMomentumScrollBegin={() => (momentumRef.current = true) /* TEMP-DEBUG-GEST */}
        onMomentumScrollEnd={() => (momentumRef.current = false) /* TEMP-DEBUG-GEST */}
      >
        {/* Heron är målet för zoomen från kortet (samma id och grupp som kortets bild). */}
        <Transition.Boundary
          id={heroBoundaryId}
          group={PRODUCT_BOUNDARY_GROUP}
          style={[styles.hero, { width, height: heroHeight }]}
        >
          {/* Bildbläddrare (brief 20): tryck på den bild som visas öppnar
              lightboxen på den. Knapparna ovanpå ligger i en egen yta. */}
          <HeroPager
            images={getProductImages(product)}
            heroKey={heroBoundaryId}
            width={width}
            height={heroHeight}
            onOpen={openLightbox}
          />
        </Transition.Boundary>

        <Reanimated.View style={revealStyle}>
          <View style={styles.info}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceBlock}>
                {data.lowest !== undefined && (
                  <Text style={styles.price}>
                    <Text style={styles.from}>Från </Text>
                    {formatPrice(data.lowest)}
                    <Text style={styles.currency}> kr</Text>
                  </Text>
                )}
                {data.lowestIsUsed && <Text style={styles.usedTag}>Begagnat</Text>}
              </View>
              <SaveButton productId={product.id} />
            </View>
          </View>

          <SectionTitle title="Hållbarhet" style={styles.sectionTitle} />
          <FactList facts={facts} />

          {data.used.length > 0 && (
            <>
              <SectionTitle title="Finns begagnad hos" style={styles.sectionTitle} />
              <View style={styles.group}>
                {data.used
                  .flatMap((group) => group.offers.map((offer) => ({ group, offer })))
                  .map(({ group, offer }, i) => (
                    <OfferRow
                      key={offer.id}
                      divider={i > 0}
                      initial={group.retailer.initial}
                      name={group.retailer.name}
                      detail={[
                        offer.conditionNote,
                        offer.pricing === 'auction' ? 'Auktion, bud från' : 'Fast pris',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                      price={offer.price}
                      stock={STOCK_LABEL[offer.stock]}
                      onPress={() => onOffer(offer)}
                    />
                  ))}
              </View>
            </>
          )}

          {data.fresh.length > 0 && (
            <>
              <SectionTitle title="Köp hos" style={styles.sectionTitle} />
              <View style={styles.group}>
                {data.fresh.map((offer, i) => {
                  const retailer = getRetailer(offer.retailerId);
                  return (
                    <OfferRow
                      key={offer.id}
                      divider={i > 0}
                      initial={retailer?.initial ?? ''}
                      name={retailer?.name ?? ''}
                      detail={`Ny · ${offer.shipping}`}
                      price={offer.price}
                      stock={STOCK_LABEL[offer.stock]}
                      onPress={() => onOffer(offer)}
                    />
                  );
                })}
              </View>
            </>
          )}

          {data.similar.length > 0 && (
            <>
              <SectionTitle title="Liknande" style={styles.sectionTitle} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarRow}
              >
                {data.similar.map((p) => (
                  <View key={p.id} style={styles.similarCard}>
                    <ProductCard {...p} fixedHeight={SIMILAR_IMAGE_HEIGHT} />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </Reanimated.View>
      </Transition.ScrollView>

    {/* Toppen: en enda kant i temats toning (brief 15). Toningen täcker
        titelraden; blurren ligger kvar kort bakom statusfält/Dynamic Island. */}
    <EdgeFade
      position="top"
      height={insets.top + barHeight + spacing.lg}
      blurHeight={insets.top + edgeBlur.topExtra}
    />
    <View style={[styles.topChrome, { paddingTop: insets.top }]} pointerEvents="box-none">
      <Reanimated.Text numberOfLines={1} style={[styles.topTitle, { top: insets.top }, titleStyle]}>
        {product.name}
      </Reanimated.Text>
      {/* En glaston hela vägen: photo och theme skiljer sig bara lite (brief 14). */}
      <TopBar
        tone="photo"
        left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }}
        right={[{ icon: ShareIcon, accessibilityLabel: 'Dela', onPress: () => {} }]}
      />
    </View>
    {/* TEMP-DEBUG-GEST: diagnosrad längst ned (bara __DEV__ + växel på dev-sidan). */}
    {gestureDebug && gestureNote !== '' && (
      <View pointerEvents="none" style={[styles.debugBar, { bottom: insets.bottom }]}>
        <Text style={styles.debugText}>{gestureNote}</Text>
      </View>
    )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  // TEMP-DEBUG-GEST
  debugBar: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.control,
    backgroundColor: t.colors.surfaceRaised,
  },
  debugText: {
    ...typography.caption,
    color: t.colors.textPrimary,
  },
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
  hero: {
    backgroundColor: t.colors.placeholder,
  },
  info: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xl,
    gap: spacing.xs,
  },
  brand: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  name: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  priceRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  price: {
    ...typography.price,
    fontSize: typography.title2.fontSize,
    lineHeight: typography.title2.lineHeight,
    color: t.colors.textPrimary,
  },
  from: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  // "kr" ≈ 70 % av priset (design.md §4): närmaste typtoken är label (13 av 20).
  currency: {
    fontSize: typography.label.fontSize,
  },
  usedTag: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  sectionTitle: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  group: {
    marginHorizontal: spacing.screenMargin,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  similarRow: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.md,
  },
  similarCard: {
    width: SIMILAR_WIDTH,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topTitle: {
    position: 'absolute',
    left: touchTarget + spacing.screenMargin + spacing.sm,
    right: touchTarget + spacing.screenMargin + spacing.sm,
    ...typography.body,
    fontFamily: typography.headline.fontFamily,
    // Centrerad i toppbarens höjd (44 + 2 × 8).
    lineHeight: touchTarget + spacing.sm * 2,
    textAlign: 'center',
    color: t.colors.textPrimary,
  },
}));
