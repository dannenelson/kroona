import { useToggleSaved } from '../../hooks/useToggleSaved';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { makeStyles, useTheme, typography, fonts, spacing, radius, motion, touchTarget, iconSize } from '../../theme';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { usePop } from '../../hooks/usePop';
import { haptic } from '../../utils/haptic';
import HeartIcon from '../../assets/icons/HeartIcon';
import HeartIconFilled from '../../assets/icons/HeartIcon_filled';

/**
 * Gilla-knappen på Produktdetalj (brief 13, hjärta sedan brief 38): snabbspar
 * till Gillade produkter. Gillad = fyllt hjärta och texten "Gillad"; ytan
 * inverteras inte (beslutad avvikelse från designen). Pop vid sparande,
 * lätt haptik, animerad press. Använder befintliga SavedProductsContext.
 */
export default function SaveButton({ productId }: { productId: string }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const { isSaved } = useSavedProducts();
  const toggleSaved = useToggleSaved();
  const saved = isSaved(productId);
  const press = usePressAnimation(motion.pressedScale);
  const pop = usePop(saved);
  const Icon = saved ? HeartIconFilled : HeartIcon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? 'Gillad, tryck för att ta bort' : 'Gilla'}
      onPress={() => {
        haptic.light();
        toggleSaved(productId);
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
    >
      <Animated.View style={[styles.button, press.scaleStyle]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.pressed, { opacity: press.progress }]}
        />
        <Animated.View style={{ transform: [{ scale: pop }] }}>
          <Icon color={colors.textPrimary} size={iconSize.md} />
        </Animated.View>
        <Text style={styles.label}>{saved ? 'Gillad' : 'Gilla'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  button: {
    minHeight: touchTarget,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    borderRadius: radius.full,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: t.colors.surfaceRaised,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  label: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
}));
