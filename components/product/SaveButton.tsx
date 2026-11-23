import { useIsSaved, useOpenSaveSheet } from '../saved/SaveSheet';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { makeStyles, useTheme, typography, fonts, spacing, radius, motion, touchTarget, iconSize } from '../../theme';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { usePop } from '../../hooks/usePop';
import { haptic } from '../../utils/haptic';
import HeartIcon from '../../assets/icons/HeartIcon';
import HeartIconFilled from '../../assets/icons/HeartIcon_filled';

/**
 * Spara-knappen på Produktdetalj (brief 13, 38, 40): gemensam Spara-ingång
 * som öppnar kortet "Spara i …" (Gillade produkter + egna samlingar). Hjärta,
 * fyllt när produkten ligger i Gillade produkter eller någon samling; ytan
 * inverteras inte (beslutad avvikelse från designen). Pop vid sparande,
 * lätt haptik, animerad press. Använder befintliga SavedProductsContext.
 */
export default function SaveButton({ productId }: { productId: string }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const saved = useIsSaved(productId);
  const openSaveSheet = useOpenSaveSheet();
  const press = usePressAnimation(motion.pressedScale);
  const pop = usePop(saved);
  const Icon = saved ? HeartIconFilled : HeartIcon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? 'Spara, sparad' : 'Spara'}
      onPress={() => {
        haptic.light();
        openSaveSheet(productId);
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
        <Text style={styles.label}>Spara</Text>
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
