// Produktkortets textblock (brief 68): ETT block för alla produktkort, med
// samma textstilar i alla storlekar: namnet `body` 400 och priset `body`-storlek
// i 600, så att pris och namn skiljer sig på samma sätt på små och stora kort.
// Märket står överst. Med `showSave` (stora kort, en-kolumn i Följer) står den
// runda spara-knappen på namnraden, överjusterad med namnet, precis som på
// Produktdetalj (gemensam `NameWithSave`). Namnet radbryter före knappen,
// högst två rader, sedan ellipsis.
// Avstånd (brief 62): märke/namn/pris `productCard.textGap`, betyg `spacing.xs`.
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
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
  showSave = false,
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
    <View style={styles.block}>
      {/* Märke, namn och pris tätt ihop (brief 62); betygsraden efter. */}
      <View style={styles.titleGroup}>
        <Text style={styles.brand} numberOfLines={1}>
          {brand}
        </Text>
        <NameWithSave
          name={name}
          nameStyle={styles.name}
          numberOfLines={2}
          productId={showSave ? id : undefined}
        />
        <Text style={styles.price}>
          {formatPrice(price)}
          <Text style={styles.currency}>{' '}kr</Text>
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
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: t.colors.textPrimary,
  },
  // "kr" ≈ 70 % av prisets storlek (design.md §4): närmaste typtoken micro 10 (67 %).
  currency: {
    fontSize: typography.micro.fontSize,
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
