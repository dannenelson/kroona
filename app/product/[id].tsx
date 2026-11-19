// Produktdetalj (brief 13): navet för Jämför och Köp. Nås från alla
// produktkort (ProductCard öppnar hit som standard). Ligger i rotens Stack
// ovanför flikarna, så tab-baren syns inte och tillbaka går till skärmen man
// kom från. Delar som bara används här (erbjudanderad, faktarad, Spara-knapp)
// bor i components/product/ tills de behövs på fler ställen.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  GestureDetector,
  GestureStateManager,
  useNativeGesture,
  usePanGesture,
} from 'react-native-gesture-handler';
import { Link, Stack, useLocalSearchParams, useRouter, usePreventZoomTransitionDismissal } from 'expo-router';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, radius, touchTarget, edgeBlur, motion } from '../../theme';
import { PRODUCTS } from '../../data/products';
import {
  getLowestPrice,
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

// iOS tillbakagest bara i kantremsan (spik brief 17). Konstant objekt: ett nytt
// objekt per render får Stack.Screen att anropa setOptions i en oändlig loop.
const SCREEN_OPTIONS = {
  fullScreenGestureEnabled: false,
  gestureResponseDistance: { end: motion.dismissEdgeWidth },
};

const STOCK_LABEL: Record<Offer['stock'], string> = {
  in_stock: 'I lager',
  few_left: 'Få kvar',
  out_of_stock: 'Slut',
};

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  // Spik (brief 17): native zoom-stängning bara från en smal remsa vid
  // vänsterkanten, så att iOS egen kantswipe finns kvar på hela höjden men inte
  // tävlar med vår egen nedåtgest nedan.
  usePreventZoomTransitionDismissal({
    unstable_dismissalBoundsRect: { maxX: motion.dismissEdgeWidth },
  });

  // Egen stängningsgest (brief 17): överst i innehållet följer hela skärmen
  // fingret nedåt, krymper lätt och får rundade hörn. Släpp förbi tröskeln
  // (avstånd eller fart) stänger, annars fjädrar den tillbaka.
  const dragY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const closing = useSharedValue(false);
  const close = () => router.back();
  const scrollGesture = useNativeGesture({});
  const dismissGesture = usePanGesture({
    manualActivation: true,
    simultaneousWith: scrollGesture,
    onTouchesDown: (e) => {
      const t = e.allTouches[0];
      if (!t) return;
      startX.value = t.absoluteX;
      startY.value = t.absoluteY;
    },
    onTouchesMove: (e) => {
      const t = e.allTouches[0];
      if (!t || closing.value) return;
      const dx = t.absoluteX - startX.value;
      const dy = t.absoluteY - startY.value;
      if (Math.abs(dx) < motion.dismissSlop && Math.abs(dy) < motion.dismissSlop) return;
      // Bara överst i innehållet, nedåt och mer vertikalt än horisontellt.
      if (scrollY.value <= 0 && dy > 0 && dy > Math.abs(dx)) {
        GestureStateManager.activate(e.handlerTag);
      } else {
        GestureStateManager.fail(e.handlerTag);
      }
    },
    onUpdate: (e) => {
      // Drar man upp igen följer skärmen tillbaka, aldrig förbi utgångsläget.
      dragY.value = Math.max(0, e.translationY);
    },
    onDeactivate: (e) => {
      const shouldClose =
        dragY.value > motion.dismissDistance || e.velocityY > motion.dismissVelocity;
      if (shouldClose) {
        closing.value = true;
        // Överlämning: vårt drag står kvar (försvinner när skärmen avmonteras),
        // så native zoomen börjar från draget läge i stället för helskärm.
        scheduleOnRN(close);
      } else {
        dragY.value = withSpring(0, motion.dismissSpring);
      }
    },
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [threshold - spacing.xl, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Telefonens egen hörnradie under dragningen (ingen annan rundning ska synas),
  // uppskattad från safe area: Dynamic Island ger större inset än notch.
  const screenRadius =
    insets.top >= radius.screenNotch + spacing.sm ? radius.screenDynamicIsland : radius.screenNotch;
  const dismissStyle = useAnimatedStyle(() => {
    const p = interpolate(dragY.value, [0, motion.dismissDistance * 2], [0, 1], Extrapolation.CLAMP);
    return {
      // Rundningen kommer direkt vid dragets början (inom några px).
      borderRadius: interpolate(dragY.value, [0, spacing.xs], [0, screenRadius], Extrapolation.CLAMP),
      transform: [
        { translateY: dragY.value },
        { scale: interpolate(p, [0, 1], [1, motion.dismissScale]) },
      ],
    };
  });

  // Spik (brief 16): informationen under heron tonas in när bilden hunnit
  // landa från zoom-övergången. Fördröjningen är en uppskattning.
  const reduceMotion = useReduceMotion();
  const reveal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      delay: reduceMotion ? 0 : motion.detailRevealDelay,
      duration: reduceMotion ? motion.duration.fast : motion.detailRevealDuration,
      useNativeDriver: true,
    }).start();
  }, [reveal, reduceMotion]);

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
    <GestureDetector gesture={dismissGesture}>
      <Reanimated.View style={[styles.container, styles.dismissable, dismissStyle]}>
        {/* iOS tillbakagest bara i kantremsan: annars stänger iOS 26:s
            helskärms-tillbakagest (interactiveContentPopGestureRecognizer)
            vid högersvep mitt på skärmen. */}
        <Stack.Screen options={SCREEN_OPTIONS} />
        <GestureDetector gesture={scrollGesture}>
          <Reanimated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            // Exakt 0 överst (ingen automatisk inset). Ingen studs: drag nedåt
            // överst flyttar hela skärmen (stängningsgesten) i stället.
            contentInsetAdjustmentBehavior="never"
            bounces={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
            onScroll={onScroll}
          >
            {/* Zoom-målet (spik brief 16) är bilden själv, inte vyn runt den: med en
                View som målets barn ritades inte bilden i den (laddad och med rätt
                mått men osynlig). Heron-vyn ger platshållarfärgen runt. */}
            <View style={[styles.hero, { width, height: heroHeight }]}>
              <Link.AppleZoomTarget>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width, height: heroHeight }}
                  resizeMode="cover"
                />
              </Link.AppleZoomTarget>
            </View>

            <Animated.View style={{ opacity: reveal }}>
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
            </Animated.View>
          </Reanimated.ScrollView>
        </GestureDetector>

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
      </Reanimated.View>
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  // Skärmen som dras vid stängning: rundade hörn klipper innehållet.
  dismissable: {
    overflow: 'hidden',
    borderCurve: 'continuous',
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
