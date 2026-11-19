import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { makeStyles, useTheme, typography, fonts, spacing, radius, touchTarget } from '../../theme';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { formatPrice } from '../../utils/format';
import ChevronIcon from '../../assets/icons/ChevronIcon';

type Props = {
  initial: string;
  name: string;
  /** Under namnet: "skick · prisläge" för begagnat, "Ny · frakt" för nytt. */
  detail: string;
  price: number;
  stock: string;
  /** Hårlinje ovanför (alla rader utom den första i gruppen). */
  divider?: boolean;
  onPress: () => void;
};

// Lokala mått enligt referensen: rad minst 64 hög, initialcirkel 36.
const ROW_MIN_HEIGHT = touchTarget + spacing.lg + spacing.xs;
const INITIAL_SIZE = touchTarget - spacing.sm;

/**
 * Erbjudanderad på Produktdetalj (brief 13): initialcirkel, återförsäljare,
 * detaljrad, pris och lager, chevron. Bara här tills den behövs på fler
 * ställen. Ytan tonar till pressed-färg vid tryck (ingen skala i en lista).
 */
export default function OfferRow({ initial, name, detail, price, stock, divider, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const press = usePressAnimation(1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${detail}, ${formatPrice(price)} kronor, ${stock}`}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[styles.row, divider && styles.divider]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.pressed, { opacity: press.progress }]} />
      <View style={styles.initial}>
        <Text style={styles.initialText}>{initial}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {detail}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>
          {formatPrice(price)}
          <Text style={styles.currency}> kr</Text>
        </Text>
        <Text style={styles.stock}>{stock}</Text>
      </View>
      <ChevronIcon color={colors.textSecondary} />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    minHeight: ROW_MIN_HEIGHT,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.sep,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  initial: {
    width: INITIAL_SIZE,
    height: INITIAL_SIZE,
    borderRadius: radius.full,
    backgroundColor: t.colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    ...typography.label,
    fontFamily: typography.title2.fontFamily,
    color: t.colors.textPrimary,
  },
  middle: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs / 2,
  },
  name: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
  detail: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.xs / 2,
  },
  price: {
    ...typography.body,
    fontFamily: fonts.ui600,
    color: t.colors.textPrimary,
  },
  currency: {
    fontSize: typography.caption.fontSize,
  },
  stock: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
}));
