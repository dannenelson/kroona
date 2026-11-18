import { useRef, useState, type ComponentRef } from 'react';
import { View, Text, Pressable, Image, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius, motion } from '../theme';
import { useSavedProducts } from '../context/SavedProductsContext';
import ProductContextMenu, { type AnchorRect, type ContextMenuItem } from './ProductContextMenu';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';
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

/** 1995 → "1 995" (hårt mellanslag som tusentalsavgränsare). */
function formatPrice(price: number): string {
  return String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** 4.2 → "4,2" */
function formatScore(score: number): string {
  return score.toFixed(1).replace('.', ',');
}

/**
 * ProductCard enligt referensen "Kroona Looken A" och design.md §0/§4. Bara
 * bilden är rundad (squircle), texten ligger under utan bakgrund.
 * Ingen Spara-knapp på kortet: Spara m.fl. ligger i menyn vid långt tryck.
 * States: default, pressed (skala 0,96), disabled (35 % opacitet).
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
  const { isSaved, toggleSaved } = useSavedProducts();
  const saved = isSaved(id);
  const imageRef = useRef<ComponentRef<typeof View>>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  const isSmall = size === 'S';
  const isLarge = size === 'L';

  const openMenu = () => {
    imageRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  };

  // Spara använder befintlig SavedProductsContext. Följ varumärke, Dela och
  // Visa liknande har ingen logik i Fas 0-steget, de stänger bara menyn.
  const menuItems: ContextMenuItem[] = [
    {
      label: saved ? 'Sparad' : 'Spara',
      icon: saved ? BookmarkIconFilled : BookmarkIcon,
      onPress: () => toggleSaved(id),
    },
    { label: 'Följ varumärke', icon: FollowIcon },
    { label: 'Dela', icon: ShareIcon },
    { label: 'Visa liknande', icon: SimilarIcon },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${brand} ${name}`}
      accessibilityHint={menu ? 'Håll in för fler val' : undefined}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onLongPress={menu ? openMenu : undefined}
      delayLongPress={motion.longPressMs}
      style={({ pressed }) => [
        styles.card,
        featured && styles.cardFeatured,
        pressed && styles.pressed,
        disabled && styles.disabled,
        containerStyle,
      ]}
    >
      <View
        ref={imageRef}
        collapsable={false}
        style={[
          styles.imageContainer,
          isSmall && styles.imageContainerSmall,
          fixedHeight ? { height: fixedHeight } : { aspectRatio: aspectRatio ?? 3 / 4 },
        ]}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

        {!isSmall && (isNew || isUsed) && (
          // Avvikelse från komponentsidan: badgen behålls (Daniels beslut).
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{isUsed ? 'Begagnad' : 'Nyhet'}</Text>
          </View>
        )}

      </View>

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

      {menu && (
        <ProductContextMenu
          visible={anchor !== null}
          anchor={anchor}
          imageUrl={imageUrl}
          items={menuItems}
          onClose={() => setAnchor(null)}
        />
      )}
    </Pressable>
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
  pressed: {
    transform: [{ scale: motion.pressedScale }],
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
