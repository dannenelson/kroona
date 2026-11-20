import { Animated, Pressable, StyleSheet } from 'react-native';
import { makeStyles, useTheme, radius, motion, touchTarget, iconSize } from '../../theme';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { haptic } from '../../utils/haptic';
import { useOpenAddToCollection } from '../saved/AddToCollectionStep';
import BookmarkPlusIcon from '../../assets/icons/BookmarkPlusIcon';

/**
 * "Spara i samling" på Produktdetalj (brief 36): rund sekundärknapp bredvid
 * Spara (snabbspar till Gillade produkter). Öppnar Sheet "Lägg till i samling".
 * Samma yta och tryckrespons som Spara-knappen.
 */
export default function AddToCollectionButton({ productId }: { productId: string }) {
  const { colors } = useTheme();
  const styles = useStyles();
  const press = usePressAnimation(motion.pressedScale);
  const openAddToCollection = useOpenAddToCollection();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Spara i samling"
      onPress={() => {
        haptic.light();
        openAddToCollection(productId);
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
    >
      <Animated.View style={[styles.button, press.scaleStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.pressed, { opacity: press.progress }]} />
        <BookmarkPlusIcon color={colors.textPrimary} size={iconSize.md} />
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  button: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
}));
