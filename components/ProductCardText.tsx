// Produktkortets textblock (brief 68): ETT block för alla produktkort. Stilen
// (vikt, färg) är gemensam: namnet 400, priset 600, "kr" mindre. Storleken är
// en variant (`size` M/L) som bara byter storlek och radhöjd: M = `body`
// (15/22), "kr" `micro`; L = `headline`-storleken (17/22), "kr" `caption`.
// Märket står överst. Med `showSave` (stora kort, en-kolumn i Följer) står den
// runda spara-knappen på namnraden, överjusterad med namnet, precis som på
// Produktdetalj (gemensam `NameWithSave`). Namnet radbryter före knappen,
// högst två rader, sedan ellipsis.
// Avstånd (brief 62): märke/namn/pris `productCard.textGap`, betyg `spacing.xs`.
import { useRef, useState } from 'react';
import { Text, View, type TextStyle } from 'react-native';
import { makeStyles, useTheme, typography, spacing, productCard } from '../theme';
import { formatPrice, formatScore } from '../utils/format';
import Icon from './Icon';
import NameWithSave from './product/NameWithSave';

type Props = {
  /** Produktens id (för Spara). */
  id: string;
  brand: string;
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  sustainabilityScore: number;
  /** Storleksvariant: M (små kort) eller L (stora kort). Byter bara storlek och radhöjd. */
  size?: 'M' | 'L';
  /** Spara-knappen på namnraden. Bara där kortet har den i dag (en-kolumn i Följer). */
  showSave?: boolean;
};

export default function ProductCardText({
  id,
  brand,
  name,
  price,
  rating,
  reviewCount,
  sustainabilityScore,
  size = 'M',
  showSave = false,
}: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const sized = TEXT_SIZES[size];
  // Namnets stil som ett objekt (NameWithSave läser radhöjden).
  const nameStyle: TextStyle = { ...styles.name, ...sized.name };
  // Märkesraden är vanlig text på korten (inte klickbar: risk för feltryck).
  // Varumärkets profil öppnas från märket på Produktdetalj.

  // Betygsraden radbryts aldrig (brief 60): får den inte plats utelämnas
  // antalet omdömen. Mäts mot radens bredd och lövgruppens slut.
  const [countFits, setCountFits] = useState(true);
  const ratingsRow = useRef({ width: 0, leafEnd: 0 });
  const checkRatingsFit = () => {
    const { width, leafEnd } = ratingsRow.current;
    if (countFits && width > 0 && leafEnd > width + 0.5) setCountFits(false);
  };

  return (
    <View style={styles.block}>
      {/* Märke, namn och pris tätt ihop (brief 62); betygsraden efter. */}
      <View style={styles.titleGroup}>
        <Text style={styles.brand} numberOfLines={1}>
          {brand}
        </Text>
        <NameWithSave
          name={name}
          nameStyle={nameStyle}
          numberOfLines={2}
          productId={showSave ? id : undefined}
        />
        <Text style={[styles.price, sized.price]}>
          {formatPrice(price)}
          <Text style={sized.currency}>{' '}kr</Text>
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
  );
}

/** Storleksvarianterna: bara storlek och radhöjd (stilen ligger i useStyles).
 *  "kr" ≈ 70 % av prisets storlek (design.md §4): M 15 → micro 10, L 17 → caption 12. */
const TEXT_SIZES = {
  M: {
    name: { fontSize: typography.body.fontSize, lineHeight: typography.body.lineHeight },
    price: { fontSize: typography.body.fontSize, lineHeight: typography.body.lineHeight },
    currency: { fontSize: typography.micro.fontSize },
  },
  L: {
    name: { fontSize: typography.headline.fontSize, lineHeight: typography.headline.lineHeight },
    price: { fontSize: typography.headline.fontSize, lineHeight: typography.headline.lineHeight },
    currency: { fontSize: typography.caption.fontSize },
  },
} as const;

const useStyles = makeStyles((t) => ({
  // 8 under bildens underkant.
  block: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  titleGroup: {
    gap: productCard.textGap,
  },
  brand: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  name: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  price: {
    ...typography.price,
    color: t.colors.textPrimary,
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
