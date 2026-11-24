import { ReactNode } from 'react';
import { View, Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import { makeStyles, useTheme, typography, letterSpacing, spacing, touchTarget, sectionLink, motion } from '../theme';
import ChevronIcon from '../assets/icons/ChevronIcon';

type PreOrSubHeader =
  | { preheader?: string; subheader?: never }
  | { preheader?: never; subheader?: string };

type IconOrCta =
  | { icon?: ReactNode; cta?: never }
  | {
      icon?: never;
      /** "Visa fler ›" till höger i rubrikraden (brief 53). Visas bara när hyllan har en destination. */
      cta?: { label?: string; onPress: () => void };
    };

type Props = {
  title: string;
  style?: StyleProp<ViewStyle>;
} & PreOrSubHeader & IconOrCta;

export default function SectionTitle({ title, preheader, subheader, icon, cta, style }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const ctaLabel = cta?.label ?? 'Visa fler';
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.textBlock}>
        {preheader ? <Text style={styles.preheader}>{preheader}</Text> : null}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subheader ? <Text style={styles.subheader}>{subheader}</Text> : null}
      </View>
      {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
      {cta ? (
        <Pressable
          onPress={cta.onPress}
          hitSlop={(touchTarget - typography.label.lineHeight) / 2}
          accessibilityRole="link"
          accessibilityLabel={`${ctaLabel}, ${title}`}
          style={({ pressed }) => [styles.ctaSlot, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          <ChevronIcon color={colors.textSecondary} size={sectionLink.chevronSize} strokeWidth={sectionLink.chevronStroke} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  preheader: {
    ...typography.micro,
    color: t.colors.textSecondary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title2,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
  subheader: {
    ...typography.caption,
    color: t.colors.textTertiary,
    marginTop: 2, // lokal optisk justering: rubrik → underrubrik
  },
  iconSlot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // "Visa fler ›": 13/18 dämpad text + chevron 14 (brief 53).
  ctaSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sectionLink.gap,
  },
  ctaPressed: {
    opacity: motion.pressedOpacity,
  },
  ctaLabel: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
}));
