import { View, Text, Pressable, StyleSheet, Image, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, useTheme, overlay, typography, letterSpacing, spacing, radius, motion } from '../theme';
import { useSavedProducts } from '../context/SavedProductsContext';
import IconButton from './IconButton';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkIconFilled from '../assets/icons/BookmarkIcon_filled';
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
 * ProductCard enligt komponentsidan och design.md §4. Bara bilden är rundad,
 * texten ligger under utan bakgrund. States: default, pressed (opacity 0,8),
 * selected (sparad, fyllt bokmärke), disabled (tertiär text).
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
  disabled = false,
  containerStyle,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { isSaved, toggleSaved } = useSavedProducts();
  const saved = isSaved(id);

  const isSmall = size === 'S';
  const isLarge = size === 'L';
  const metaColor = disabled ? colors.textTertiary : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${brand} ${name}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        featured && styles.cardFeatured,
        pressed && styles.pressed,
        containerStyle,
      ]}
    >
      <View
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

        {!isSmall && (
          <IconButton
            tone="photo"
            icon={BookmarkIcon}
            selectedIcon={BookmarkIconFilled}
            selected={saved}
            disabled={disabled}
            accessibilityLabel={saved ? 'Ta bort från sparat' : 'Spara'}
            onPress={() => toggleSaved(id)}
            style={styles.save}
          />
        )}
      </View>

      {!isSmall && (
        <View style={styles.info}>
          <Text style={[styles.brand, { color: metaColor }]} numberOfLines={1}>
            {brand}
          </Text>
          <Text
            style={[
              isLarge ? styles.nameLarge : styles.name,
              disabled && styles.textDisabled,
            ]}
            numberOfLines={2}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.price,
              isLarge ? styles.priceLarge : styles.priceMedium,
              disabled && styles.textDisabled,
            ]}
          >
            {formatPrice(price)}
            <Text style={isLarge ? styles.currencyLarge : styles.currency}>{' '}kr</Text>
          </Text>
          <View style={styles.ratings}>
            {rating !== undefined && (
              <View style={styles.rating}>
                <StarIcon color={metaColor} size={typography.caption.fontSize} />
                <Text style={[styles.ratingText, { color: metaColor }]}>{formatScore(rating)}</Text>
                {reviewCount !== undefined && (
                  <Text style={styles.ratingCount}>({reviewCount})</Text>
                )}
              </View>
            )}
            {/* Hållbarhet visas neutralt (textSecondary), inte med success/warning. */}
            <View style={styles.rating}>
              <LeafIcon color={metaColor} size={typography.caption.fontSize} />
              <Text style={[styles.ratingText, { color: metaColor }]}>
                {formatScore(sustainabilityScore)}
              </Text>
            </View>
          </View>
        </View>
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
    opacity: motion.pressedOpacity,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
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
  save: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  info: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  brand: {
    ...typography.label,
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
  textDisabled: {
    color: t.colors.textTertiary,
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
  },
  ratingCount: {
    ...typography.caption,
    color: t.colors.textTertiary,
  },
}));
