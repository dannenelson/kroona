// Produktkortets textblock (brief 68): ETT block för alla produktkort, i två
// kolumner. Vänster: märke, namn, pris och betyg, vänsterjusterade mot bildens
// vänsterkant. Höger (bara med `showSave`): spara-knappen med fast bredd, vars
// högerkant linjerar med bildens. Båda kolumnerna är överjusterade, och
// bokmärkets synliga överkant linjerar med märkesradens överkant.
// Namnet radbryter i vänsterkolumnen (högst två rader, sedan ellipsis) och går
// aldrig in under knappen. Utan knapp tar vänsterkolumnen hela bredden.
// Avstånd och typografi är desamma överallt (brief 62): märke/namn/pris
// `productCard.textGap`, betyg `spacing.xs`.
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { makeStyles, useTheme, typography, spacing, motion, touchTarget, iconSize, productCard } from '../theme';
import { haptic } from '../utils/haptic';
import { formatPrice, formatScore } from '../utils/format';
import Icon from './Icon';

/** Spara-gesten (useSaveActions) som knappen använder. */
export type ProductCardSave = {
  /** Fyllt bokmärke (i Sparade produkter eller någon samling). */
  saved: boolean;
  /** I Sparade produkter (etiketten "Sparad"). */
  inSavedProducts: boolean;
  quickSave: () => void;
  openSheet: () => void;
};

type Props = {
  brand: string;
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  sustainabilityScore: number;
  /** L = större namn och pris (fullbreddskort). */
  large?: boolean;
  /** Spara-knappen i högerkolumnen. Bara där kortet har den i dag (en-kolumn i Följer). */
  showSave?: boolean;
  save?: ProductCardSave;
};

// Tryckytan runt den 24 stora ikonrutan, så att den blir 44 utan att rutan
// växer och skjuter ikonen nedåt.
const SAVE_HIT_SLOP = (touchTarget - iconSize.lg) / 2;

export default function ProductCardText({
  brand,
  name,
  price,
  rating,
  reviewCount,
  sustainabilityScore,
  large = false,
  showSave = false,
  save,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();

  // Betygsraden radbryts aldrig (brief 60): får den inte plats utelämnas
  // antalet omdömen. Mäts mot radens bredd och lövgruppens slut.
  const [countFits, setCountFits] = useState(true);
  const ratingsRow = useRef({ width: 0, leafEnd: 0 });
  const checkRatingsFit = () => {
    const { width, leafEnd } = ratingsRow.current;
    if (countFits && width > 0 && leafEnd > width + 0.5) setCountFits(false);
  };

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        {/* Märke, namn och pris tätt ihop (brief 62); betygsraden efter. */}
        <View style={styles.titleGroup}>
          <Text style={styles.brand} numberOfLines={1}>
            {brand}
          </Text>
          <Text style={large ? styles.nameLarge : styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[styles.price, large ? styles.priceLarge : styles.priceMedium]}>
            {formatPrice(price)}
            <Text style={large ? styles.currencyLarge : styles.currency}>{' '}kr</Text>
          </Text>
        </View>
        <View
          style={styles.ratings}
          onLayout={(e) => {
            ratingsRow.current.width = e.nativeEvent.layout.width;
            checkRatingsFit();
          }}
        >
          {rating !== undefined && (
            <View style={styles.rating}>
              {/* Kontur som lövet (brief 61), inte fylld. */}
              <Icon name="star" color={colors.textSecondary} size={typography.caption.fontSize} />
              <Text style={styles.ratingText}>{formatScore(rating)}</Text>
              {reviewCount !== undefined && countFits && (
                <Text style={styles.ratingCount}>({reviewCount})</Text>
              )}
            </View>
          )}
          {/* Hållbarhet visas neutralt (textSecondary), inte med success/warning. */}
          <View
            style={styles.rating}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              ratingsRow.current.leafEnd = x + width;
              checkRatingsFit();
            }}
          >
            <Icon name="leaf" color={colors.textSecondary} size={typography.caption.fontSize} />
            <Text style={styles.ratingText}>{formatScore(sustainabilityScore)}</Text>
          </View>
        </View>
      </View>

      {showSave && save ? (
        <Pressable
          onPress={() => {
            haptic.light();
            save.quickSave();
          }}
          onLongPress={save.openSheet}
          hitSlop={SAVE_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={save.inSavedProducts ? 'Sparad' : 'Spara'}
          accessibilityHint="Håll in för att spara i en samling"
          accessibilityState={{ selected: save.saved }}
          style={({ pressed }) => [styles.save, pressed && styles.savePressed]}
        >
          <Icon name="bookmark" filled={save.saved} color={colors.textPrimary} size={iconSize.lg} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  // 8 under bildens underkant; två kolumner, överjusterade, 8 mellan.
  row: {
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  titleGroup: {
    gap: productCard.textGap,
  },
  // Fast bredd (ikonrutan), ingen marginal utöver den optiska justeringen:
  // bokmärkets synliga överkant mot märkesradens överkant och synliga
  // högerkant mot bildens högerkant.
  save: {
    width: iconSize.lg,
    height: iconSize.lg,
    alignSelf: 'flex-start',
    marginTop: productCard.saveOffsetY,
    marginRight: -productCard.saveOffsetX,
  },
  savePressed: {
    opacity: motion.disabledOpacity,
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
    flexWrap: 'nowrap',
    overflow: 'hidden',
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
