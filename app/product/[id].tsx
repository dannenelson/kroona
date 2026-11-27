// Produktdetalj (brief 13): navet för Jämför och Köp. Nås från alla
// produktkort (ProductCard öppnar hit som standard). Ligger i rotens stack
// ovanför flikarna, så tab-baren syns inte och tillbaka går till skärmen man
// kom från. Öppning och stängning (zoom från kortet, drag nedåt, kantswipe)
// ägs av react-native-screen-transitions, se components/product/productTransition.ts. Delar som bara används här (erbjudanderad, faktarad, Spara-knapp)
// bor i components/product/ tills de behövs på fler ställen.
import { useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
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
import { makeStyles, useTheme, typography, spacing, radius, touchTarget, edgeBlur, motion } from '../../theme';
import { PRODUCTS } from '../../data/products';
import {
  getLowestPrice,
  getProductImages,
  getNewOffers,
  getRetailer,
  getRetailerForBrand,
  getSimilarProducts,
  getUsedOffersByService,
} from '../../lib/catalog';
import { formatPrice, formatScore } from '../../utils/format';
import { haptic } from '../../utils/haptic';
import { useSnackbar } from '../../components/Snackbar';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import SectionTitle from '../../components/SectionTitle';
import ProductCard from '../../components/ProductCard';
import NameWithSave from '../../components/product/NameWithSave';
import { FactList, indexFact, type Fact } from '../../components/product/FactList';
import { useOpenIndexSheet } from '../../components/SustainabilityIndexSheet';
import { useAnchoredMenu } from '../../components/AnchoredMenu';
import type { ContextMenuItem } from '../../components/ProductContextMenu';
import { useSaveActions } from '../../components/saved/SaveSheet';
import { useBrandFollowItem } from '../../hooks/useBrandFollowItem';
import OfferRow from '../../components/product/OfferRow';
import Icon from '../../components/Icon';
import type { Offer } from '../../types/catalog';

// Lokala layoutmått: hero 4:5 (referensen 390 × 500), liknande-kort 140 × 176.
const HERO_ASPECT = 4 / 5;
const SIMILAR_WIDTH = 140;
const SIMILAR_IMAGE_HEIGHT = 176;

/** " (128 omdömen)" / " (1 omdöme)", tomt utan antal. */
const reviewsLabel = (n: number) => `(${n} ${n === 1 ? 'omdöme' : 'omdömen'})`;

const STOCK_LABEL: Record<Offer['stock'], string> = {
  in_stock: 'I lager',
  few_left: 'Få kvar',
  out_of_stock: 'Slut',
};

export default function ProductScreen() {
  // `b` = boundary-id för det kort man öppnade från (zoomen går från/till det).
  // `scrollTo=similar` (brief 72): öppnad via "Visa liknande" i kortmenyn.
  const { id, b, scrollTo } = useLocalSearchParams<{ id: string; b?: string; scrollTo?: 'similar' }>();
  const router = useRouter();
  // "Så räknar vi" (brief 70): tryck på indexraden.
  const openIndexSheet = useOpenIndexSheet();
  const anchoredMenu = useAnchoredMenu();
  // Mer-menyn (brief 71): samma val som kortets kontextmeny utom Spara.
  const save = useSaveActions(id ?? '');
  const scrollRef = useRef<any>(null);
  // Liknande-sektionens läge i innehållet (för "Visa liknande").
  const similarY = useRef<number | null>(null);
  const bodyY = useRef(0);
  const scrolledToSimilar = useRef(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = useStyles();
  const { colors } = useTheme();
  const snackbar = useSnackbar();

  const product = PRODUCTS.find((p) => p.id === id);
  const followItem = useBrandFollowItem(product?.brand ?? '');
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
    snackbar.show({ text: `Du skulle nu gå till ${name}` });
  };

  if (!product || !data) {
    return (
      <View style={[styles.container, styles.empty, { paddingTop: insets.top }]}>
        <TopBar tone="plain" left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }} />
        <Text style={styles.emptyText}>Produkten finns inte.</Text>
      </View>
    );
  }

  const brandProfile = getRetailerForBrand(product.brand);

  // Scrollar så att rubriken Liknande hamnar under toppbaren (mer-menyn och
  // `scrollTo=similar` från kortmenyn). När innehållet är kort stannar det vid botten.
  const scrollToSimilar = () =>
    similarY.current !== null &&
    scrollRef.current?.scrollTo({
      y: Math.max(0, bodyY.current + similarY.current - insets.top - barHeight),
    });

  // Mer-menyn förankrad vid knappen (brief 70–71). Knappens läge i toppbaren
  // (TopBar: skärmmarginal, spacing.sm över, 44 × 44).
  const openMoreMenu = () => {
    const items: ContextMenuItem[] = [
      { label: 'Spara i samling', icon: 'folder-add', onPress: save.openSheet },
      // Följ <märke> bara när märket har en profil (brief 71–72).
      ...(followItem ? [followItem] : []),
      // Dela är en platshållare i Fas 0 (samma som övriga menyer).
      { label: 'Dela', icon: 'share', onPress: () => snackbar.show({ text: 'Delning kommer senare' }) },
      ...(data.similar.length > 0
        ? [
            {
              label: 'Visa liknande',
              icon: 'layers',
              onPress: scrollToSimilar,
            } satisfies ContextMenuItem,
          ]
        : []),
    ];
    anchoredMenu.open({
      anchor: {
        x: width - spacing.screenMargin - touchTarget,
        y: insets.top + spacing.sm,
        width: touchTarget,
        height: touchTarget,
      },
      items,
    });
  };

  const facts: Fact[] = [
    // "Ej redovisat" om index saknas (brief 70–71), då ingen "Så räknar vi".
    indexFact(
      product.sustainabilityScore,
      'Produkten saknar redovisning av hållbarhet.',
      product.sustainabilityScore !== undefined
        ? () => openIndexSheet(product.sustainabilityScore!, product.id)
        : undefined,
    ),
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
        ref={scrollRef}
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

        <Reanimated.View style={revealStyle} onLayout={(e) => (bodyY.current = e.nativeEvent.layout.y)}>
          <View style={styles.info}>
            {/* Märket öppnar varumärkets profil om det finns en (brief 65, tillägg). */}
            {brandProfile ? (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`${product.brand}, öppna profil`}
                hitSlop={{ top: spacing.sm, bottom: spacing.xs, left: spacing.sm, right: spacing.lg }}
                onPress={() => router.push({ pathname: '/partner/[id]', params: { id: brandProfile.id } })}
                style={({ pressed }) => [styles.brandLink, pressed && styles.brandPressed]}
              >
                <Text style={styles.brand}>{product.brand}</Text>
              </Pressable>
            ) : (
              <Text style={styles.brand}>{product.brand}</Text>
            )}
            {/* Namnet och Spara på samma rad, överjusterade; samma lösning som
                stora produktkort (NameWithSave). */}
            <NameWithSave name={product.name} nameStyle={styles.name} productId={product.id} />
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
            </View>
            {/* Betyg direkt under namn och pris (brief 62), samma dämpade stil som
                på produktkortet. Inget betyg: ingen rad. Inte tryckbart i Fas 0. */}
            {product.rating !== undefined && (
              <View style={styles.rating}>
                <Icon name="star" color={colors.textSecondary} size={typography.caption.fontSize} />
                <Text style={styles.ratingText}>{formatScore(product.rating)}</Text>
                {product.reviewCount !== undefined && (
                  <Text style={styles.ratingCount}>{reviewsLabel(product.reviewCount)}</Text>
                )}
              </View>
            )}
          </View>

          <SectionTitle title="Hållbarhet" style={[styles.sectionTitle, styles.firstSectionTitle]} />
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
            <View
              onLayout={(e) => {
                similarY.current = e.nativeEvent.layout.y;
                // Från kortmenyn: scrolla en gång när öppningen är klar (brief 72).
                if (scrollTo === 'similar' && !scrolledToSimilar.current) {
                  scrolledToSimilar.current = true;
                  setTimeout(scrollToSimilar, motion.duration.slow);
                }
              }}
            >
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
            </View>
          )}
        </Reanimated.View>
      </Transition.ScrollView>

    {/* Toppen: bara kantblur bakom statusfält/Dynamic Island, ingen tonad
        övergång över bilden (tidigare temats toning, brief 15). */}
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
        {product.name}
      </Reanimated.Text>
      {/* En glaston hela vägen: photo och theme skiljer sig bara lite (brief 14). */}
      <TopBar
        tone="photo"
        left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }}
        // Mer-meny förankrad vid knappen (brief 70), ersätter Dela-knappen.
        right={[{ name: 'more-horizontal', accessibilityLabel: 'Fler val', onPress: openMoreMenu }]}
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
  brandLink: {
    alignSelf: 'flex-start',
  },
  brandPressed: {
    opacity: motion.disabledOpacity,
  },
  name: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  // Mer luft mellan namn och pris: `spacing.md` totalt (textblockets gap är `spacing.xs`).
  priceRow: {
    marginTop: spacing.md - spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
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
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  ratingCount: {
    ...typography.caption,
    color: t.colors.textTertiary,
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
  // Hållbarhet direkt efter textblocket: tätare än mellan sektionerna (brief 69).
  firstSectionTitle: {
    paddingTop: spacing.xl,
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
