// Produktdetalj (brief 13): navet för Jämför och Köp. Nås från alla
// produktkort (ProductCard öppnar hit som standard). Ligger i rotens Stack
// ovanför flikarna, så tab-baren syns inte och tillbaka går till skärmen man
// kom från. Delar som bara används här (erbjudanderad, faktarad, Spara-knapp)
// bor i components/product/ tills de behövs på fler ställen.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Link, useLocalSearchParams, useRouter, usePreventZoomTransitionDismissal } from 'expo-router';
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
  const scrollY = useRef(new Animated.Value(0)).current;
  // Spik (brief 16): zoom-stängningen (swipe ned) gäller bara heron och
  // toppbaren. Drag på texten scrollar alltid. Gränsen följer heronas nederkant
  // på skärmen, avrundad nedåt i steg så att skärmen inte renderas om per frame.
  const topBarBottom = insets.top + barHeight;
  const dismissStep = spacing.xxl;
  const [heroBottom, setHeroBottom] = useState(heroHeight);
  usePreventZoomTransitionDismissal({
    unstable_dismissalBoundsRect: { maxY: Math.max(topBarBottom, heroBottom) },
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
  const titleOpacity = scrollY.interpolate({
    inputRange: [threshold - spacing.xl, threshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        // Exakt 0 överst (ingen automatisk inset).
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => {
            const visible = heroHeight - Math.max(0, e.nativeEvent.contentOffset.y);
            const next = Math.max(0, Math.floor(visible / dismissStep) * dismissStep);
            if (next !== heroBottom) setHeroBottom(next);
          },
        })}
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
      </Animated.ScrollView>

      {/* Toppen: en enda kant i temats toning (brief 15). Toningen täcker
          titelraden; blurren ligger kvar kort bakom statusfält/Dynamic Island. */}
      <EdgeFade
        position="top"
        height={insets.top + barHeight + spacing.lg}
        blurHeight={insets.top + edgeBlur.topExtra}
      />
      <View style={[styles.topChrome, { paddingTop: insets.top }]} pointerEvents="box-none">
        <Animated.Text
          numberOfLines={1}
          style={[styles.topTitle, { top: insets.top, opacity: titleOpacity }]}
        >
          {product.name}
        </Animated.Text>
        {/* En glaston hela vägen: photo och theme skiljer sig bara lite (brief 14). */}
        <TopBar
          tone="photo"
          left={{ icon: BackIcon, accessibilityLabel: 'Tillbaka', onPress: back }}
          right={[{ icon: ShareIcon, accessibilityLabel: 'Dela', onPress: () => {} }]}
        />
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
