import type { ComponentType } from 'react';
import { Animated, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, typography, fonts, spacing, radius, control, motion, iconSize } from '../theme';
import { useCardPress } from '../hooks/useCardPress';
import { haptic } from '../utils/haptic';

type IconProps = { color: string; size?: number };

type Props = {
  children: string;
  onPress?: () => void;
  /** primary = ljus yta (inverterad text-färg), secondary = tonad yta. */
  variant?: 'primary' | 'secondary';
  /** cta = minst 56 hög (17/600), compact = 36 hög (t.ex. snackbarens åtgärd). */
  size?: 'cta' | 'compact';
  disabled?: boolean;
  icon?: ComponentType<IconProps>;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Knapp (brief 33, design.md §9): aldrig fullbredd, pill som följer sitt
 * innehåll (centreras av föräldern). Tryckrespons som korten (useCardPress:
 * krympning, ingen opacitet), lätt haptik. Inaktiv: tonad (`disabledOpacity`).
 */
export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'cta',
  disabled = false,
  icon: Icon,
  accessibilityLabel,
  style,
}: Props) {
  const styles = useStyles();
  const press = useCardPress();
  const primary = variant === 'primary';
  const compact = size === 'compact';
  const tone = primary ? styles.onPrimary : styles.onSecondary;
  const textStyle = [compact ? styles.labelCompact : styles.label, tone];
  return (
    <Pressable
      disabled={disabled}
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() => {
        haptic.light();
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled }}
      style={style}
    >
      <Animated.View
        style={[
          styles.shape,
          compact ? styles.compact : styles.cta,
          primary ? styles.primary : styles.secondary,
          disabled && styles.disabled,
          press.scaleStyle,
        ]}
      >
        {Icon ? <Icon color={tone.color} size={iconSize.md} /> : null}
        <Text style={textStyle} numberOfLines={1}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  shape: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
  },
  cta: {
    minHeight: control.ctaHeight,
    paddingHorizontal: control.ctaPaddingX,
  },
  compact: {
    height: control.compactHeight,
    paddingHorizontal: control.compactPaddingX,
  },
  primary: {
    backgroundColor: t.colors.textPrimary,
  },
  secondary: {
    backgroundColor: t.colors.pressed,
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
  label: {
    ...typography.headline,
  },
  labelCompact: {
    ...typography.body,
    fontFamily: fonts.ui600,
  },
  onPrimary: {
    color: t.colors.bg,
  },
  onSecondary: {
    color: t.colors.textPrimary,
  },
}));
