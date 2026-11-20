import { useId, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { PRODUCT_BOUNDARY_GROUP } from './product/productTransition';
import { Animated, StyleSheet, View, Text, Pressable, Image, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius, motion } from '../theme';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useCardPress } from '../hooks/useCardPress';
import { useToggleSaved } from '../hooks/useToggleSaved';
import { formatPrice, formatScore } from '../utils/format';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { useContextMenu, type ContextMenuItem } from './ProductContextMenu';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';
import BookmarkPlusIcon from '../assets/icons/BookmarkPlusIcon';
import { useOpenAddToCollection } from './saved/AddToCollectionStep';
import FollowIcon from '../assets/icons/FollowIcon';
import ShareIcon from '../assets/icons/ShareIcon';
import SimilarIcon from '../assets/icons/SimilarIcon';
import StarIcon from '../assets/icons/StarIcon';
import LeafIcon from '../assets/icons/LeafIcon';

export type ProductCardSize = 'S' | 'M' | 'L';

type Props = {
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  sustainabilityScore: number;
  isNew?: boolean;
  isUsed?: boolean;
  featured?: boolean;
  aspectRatio?: number;
  // När satt: bilden får en FAST höjd istället för aspectRatio-driven
  // masonry-höjd. Till för horisontella rader (t.ex. RecommendedProductsRow)
  // där alla kort ska ha samma höjd — masonry hör bara hemma i grid-kontext
  // (ProductGrid/Flöde/Sparat), inte i en scroll-rad.
  fixedHeight?: number;
  /** S = bara bild (radie tile), M och L = bild + text under (radie card). */
  size?: ProductCardSize;
  /** Kundbetyg. Visas bara när det finns (produktdata saknar det i Fas 0). */
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
  /** Långt tryck öppnar menyn Spara · Följ varumärke · Dela · Visa liknande. */
  menu?: boolean;
  disabled?: boolean;
  // Heter inte `style`: produktdata har ett eget fält `style` (Minimalistisk
  // osv.) och skickas in med spread. Slås ihop sist enligt kontraktet.
  containerStyle?: StyleProp<ViewStyle>;
};


/**
 * ProductCard enligt referensen "Kroona Looken A" och design.md §0/§4. Bara
 * bilden är rundad (squircle), texten ligger under utan bakgrund.
 * Ingen Spara-knapp på kortet: Spara m.fl. ligger i menyn vid långt tryck.
 * States: default, pressed (skala 0,96, animerat), disabled (35 % opacitet).
 */
export default function ProductCard({
  id,
  brand,
  name,
  price,
  imageUrl,
  sustainabilityScore,
  isNew,
  isUsed,
  featured,
  aspectRatio,
  fixedHeight,
  size = 'M',
  rating,
  reviewCount,
  onPress,
  menu = true,
  disabled = false,
  containerStyle,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { isSaved } = useSavedProducts();
  const toggleSaved = useToggleSaved();
  const openAddToCollection = useOpenAddToCollection();
  const saved = isSaved(id);
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const contextMenu = useContextMenu();
  // Standard: öppna Produktdetalj, där kortets bild zoomar till heron (brief 13,
  // spik brief 18). Skickar anroparen egen onPress används den, utan zoom.
  const navigates = onPress === undefined;
  const router = useRouter();
  // Unikt boundary-id per kortinstans: samma produkt kan ligga på flera ställen
  // samtidigt (hyllor, Liknande, Sparat, Hitta), och zoomen ska gå från/till
  // exakt det kort man tryckte på. Skickas till detaljvyn som param `b`.
  // Avgränsare `_`, inte `:` (biblioteket tolkar `:` som grupp:id).
  const instanceKey = useId().replace(/[^a-zA-Z0-9]/g, '');
  const boundaryId = `${id}_${instanceKey}`;
  const handlePress =
    onPress ?? (() => router.push({ pathname: '/product/[id]', params: { id, b: boundaryId } }));
  // Samma source-objekt för originalet och menyns kopia (samma bildcache).
  const imageSource = useMemo(() => ({ uri: imageUrl }), [imageUrl]);

  // Kortens tryckrespons, delad med samlingskorten (hooks/useCardPress).
  const press = useCardPress();
  // Bildytans storlek ur layout (utan transform), för menyns kopia.
  const imageSize = useRef({ width: 0, height: 0 });
  // Medan menyn är öppen syns bara den lyfta kopian, inte originalbilden.
  const [imageHidden, setImageHidden] = useState(false);

  const isSmall = size === 'S';
  const isLarge = size === 'L';

  // Spara använder befintlig SavedProductsContext. Följ varumärke, Dela och
  // Visa liknande har ingen logik i Fas 0-steget, de stänger bara menyn.
  const menuItems: ContextMenuItem[] = [
    {
      label: saved ? 'Sparad' : 'Spara',
      icon: saved ? BookmarkIconFilled : BookmarkIcon,
      onPress: () => toggleSaved(id),
    },
    { label: 'Spara i samling', icon: BookmarkPlusIcon, onPress: () => openAddToCollection(id) },
    { label: 'Följ varumärke', icon: FollowIcon },
    { label: 'Dela', icon: ShareIcon },
    { label: 'Visa liknande', icon: SimilarIcon },
  ];

  // Mäter bilden utan tryck-skalan: Pressable bär ingen transform (skalan
  // ligger på det inre Animated.View) och bildytan ligger överst i kortet,
  // så läget tas från Pressable och storleken från bildytans layout.
  const measureImage = (done: (rect: { x: number; y: number; width: number; height: number }) => void) => {
    cardRef.current?.measureInWindow((x, y) => done({ x, y, ...imageSize.current }));
  };

  const setOriginalHidden = (hidden: boolean) => {
    if (!hidden) press.menuClosed();
    setImageHidden(hidden);
  };

  const badgeLabel = !isSmall && (isNew || isUsed) ? (isUsed ? 'Begagnad' : 'Nyhet') : null;
  const renderBadge = () =>
    badgeLabel ? (
      // Avvikelse från komponentsidan: badgen behålls (Daniels beslut).
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
    ) : null;

  const openMenu = () => {
    // Kortet går direkt till skala 1 (ingen fjäder), så kopian börjar och
    // slutar i exakt originalstorlek.
    press.liftForMenu();
    measureImage((anchor) =>
      contextMenu.open({
        anchor,
        imageSource,
        imageRadius: isSmall ? radius.tile : radius.card,
        liftScale: isLarge ? motion.liftScaleLarge : motion.liftScale,
        renderOverlay: renderBadge,
        items: menuItems,
        measure: measureImage,
        setOriginalHidden,
      }),
    );
  };

  // Långt tryck som övergår i drag (brief 05): gesten stannar på kortet så att
  // fingret kan dras till en menyrad. När den aktiveras avbryts kortets
  // Pressable (inget onPress), och listan bakom tar inte över touchen.
  const longPress = usePanGesture({
    activateAfterLongPress: motion.longPressMs,
    enabled: menu && !disabled,
    runOnJS: true,
    disableReanimated: true,
    onActivate: () => openMenu(),
    onUpdate: (e) => contextMenu.move(e.absoluteX, e.absoluteY),
    onDeactivate: () => contextMenu.release(),
  });

  const imageBlock = (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        imageSize.current = { width, height };
      }}
      style={StyleSheet.flatten([
        styles.imageContainer,
        isSmall && styles.imageContainerSmall,
        fixedHeight ? { height: fixedHeight } : { aspectRatio: aspectRatio ?? 3 / 4 },
        imageHidden && styles.hidden,
      ])}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      {renderBadge()}
    </View>
  );

  const card = (
      <Pressable
        ref={cardRef}
        collapsable={false}
        onLayout={press.onLayout}
        accessibilityRole="button"
        accessibilityLabel={`${brand} ${name}`}
        accessibilityHint={menu ? 'Håll in för fler val' : undefined}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={StyleSheet.flatten([
          styles.card,
          featured && styles.cardFeatured,
          disabled && styles.disabled,
          containerStyle,
        ])}
      >
        <Animated.View style={press.scaleStyle}>
          {/* Spik (brief 18): bilden är källan för zoomen till Produktdetaljs hero. */}
          {navigates ? (
            <Transition.Boundary id={boundaryId} group={PRODUCT_BOUNDARY_GROUP}>
              {imageBlock}
            </Transition.Boundary>
          ) : (
            imageBlock
          )}

          {!isSmall && (
            <View style={styles.info}>
              <Text style={styles.brand} numberOfLines={1}>
                {brand}
              </Text>
              <Text style={isLarge ? styles.nameLarge : styles.name} numberOfLines={2}>
                {name}
              </Text>
              <Text style={[styles.price, isLarge ? styles.priceLarge : styles.priceMedium]}>
                {formatPrice(price)}
                <Text style={isLarge ? styles.currencyLarge : styles.currency}>{' '}kr</Text>
              </Text>
              <View style={styles.ratings}>
                {rating !== undefined && (
                  <View style={styles.rating}>
                    <StarIcon color={colors.textSecondary} size={typography.caption.fontSize} />
                    <Text style={styles.ratingText}>{formatScore(rating)}</Text>
                    {reviewCount !== undefined && (
                      <Text style={styles.ratingCount}>({reviewCount})</Text>
                    )}
                  </View>
                )}
                {/* Hållbarhet visas neutralt (textSecondary), inte med success/warning. */}
                <View style={styles.rating}>
                  <LeafIcon color={colors.textSecondary} size={typography.caption.fontSize} />
                  <Text style={styles.ratingText}>
                    {formatScore(sustainabilityScore)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>
  );

  return (
    <GestureDetector gesture={longPress}>
      {card}
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    flex: 1,
  },
  cardFeatured: {
    flex: 0,
    width: '100%',
  },
  hidden: {
    opacity: 0,
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.placeholder,
  },
  imageContainerSmall: {
    borderRadius: radius.tile,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: overlay.scrimSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.micro,
    color: overlay.onPhoto, // på foto: fast vit i båda teman
    letterSpacing: letterSpacing.wide,
  },
  info: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  brand: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  name: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  nameLarge: {
    ...typography.headline,
    color: t.colors.textPrimary,
  },
  price: {
    ...typography.price,
    color: t.colors.textPrimary,
  },
  priceMedium: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  priceLarge: {
    fontSize: typography.headline.fontSize,
    lineHeight: typography.headline.lineHeight,
  },
  // "kr" ≈ 70 % av prisets storlek (design.md §4), närmaste typtoken:
  // M 15 → micro 10 (67 %), L 17 → caption 12 (71 %).
  currency: {
    fontSize: typography.micro.fontSize,
  },
  currencyLarge: {
    fontSize: typography.caption.fontSize,
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
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
}));
