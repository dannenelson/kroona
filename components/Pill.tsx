import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, darkColors, darkGlass, typography, spacing, radius, motion, touchTarget } from '../theme';
import Glass, { useGlass, type GlassTone } from './Glass';

type Props = {
  children: string;
  onPress?: () => void;
  /** 'glass' (standard) eller 'filled' (surfaceRaised). */
  variant?: 'glass' | 'filled';
  /** 'photo' ger fast mörkt glas och mörka temats cta, identiskt i båda teman. */
  tone?: GlassTone;
  selected?: boolean;
  disabled?: boolean;
  size?: 'md';
  style?: StyleProp<ViewStyle>;
};

// Höjden ges av innehållet: label-radhöjd + padding + kant (18 + 2×8 + 2×1 = 36).
// hitSlop fyller ut till minsta tryckyta 44.
// Samma kantbredd som glaset (lika i båda teman), så alla varianter blir lika höga.
const BORDER = darkGlass.borderWidth;
const PILL_HEIGHT = typography.label.lineHeight + spacing.sm * 2 + BORDER * 2;
const HIT = (touchTarget - PILL_HEIGHT) / 2;

/**
 * Pill: byter innehåll överst på en skärm (design.md §11). Används INTE för
 * filtrering, det gör TextTabs. States: default, pressed (opacity 0,8),
 * selected (cta-stil, omvänd mot temat), disabled (tertiär text).
 */
export default function Pill({
  children,
  onPress,
  variant = 'glass',
  tone = 'theme',
  selected = false,
  disabled = false,
  style,
}: Props) {
  const { colors } = useTheme();
  const g = useGlass(tone);
  const palette = tone === 'photo' ? darkColors : colors;

  const textColor = disabled
    ? palette.textTertiary
    : selected
      ? palette.onCta
      : variant === 'glass'
        ? g.content
        : palette.textPrimary;

  const label = <Text style={[styles.label, { color: textColor }]}>{children}</Text>;

  let body;
  if (selected) {
    body = (
      <View style={[styles.shape, { backgroundColor: palette.cta, borderColor: palette.cta }]}>
        {label}
      </View>
    );
  } else if (variant === 'glass') {
    body = (
      <Glass tone={tone} style={styles.shape}>
        {label}
      </Glass>
    );
  } else {
    body = (
      <View
        style={[
          styles.shape,
          { backgroundColor: palette.surfaceRaised, borderColor: palette.surfaceRaised },
        ]}
      >
        {label}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{ top: HIT, bottom: HIT }}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shape: {
    height: PILL_HEIGHT,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.label,
  },
  pressed: {
    opacity: motion.pressedOpacity,
  },
});
