import { ReactNode } from 'react';
import { View, Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import { makeStyles, useTheme, typography, letterSpacing, spacing, touchTarget, sectionLink, motion, iconSize } from '../theme';
import Icon, { type IconName } from './Icon';

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
  /** Antal i dämpad text efter rubriken, t.ex. "Samlingar · 4" (brief 65). */
  count?: number;
  /**
   * Liten dekorativ ikon framför rubriktexten (brief 73), t.ex. `leaf` för
   * Hållbarhet. Valfri: rubriker utan den ser ut som förut.
   */
  leadingIcon?: IconName;
  style?: StyleProp<ViewStyle>;
} & PreOrSubHeader & IconOrCta;

export default function SectionTitle({ title, count, leadingIcon, preheader, subheader, icon, cta, style }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const ctaLabel = cta?.label ?? 'Visa fler';
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.textBlock}>
        {preheader ? <Text style={styles.preheader}>{preheader}</Text> : null}
        <View style={styles.titleRow}>
          {/* Ikonen centreras mot rubrikens första rad (rutan = radhöjden); dold för skärmläsare. */}
          {leadingIcon ? (
            <View
              style={styles.leadingIcon}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Icon name={leadingIcon} size={iconSize.md} color={colors.textPrimary} />
            </View>
          ) : null}
          <Text style={styles.title} accessibilityRole="header">
            {title}
            {count !== undefined ? <Text style={styles.count}>{` · ${count}`}</Text> : null}
          </Text>
        </View>
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
          <Icon name="chevron-right" color={colors.textSecondary} size={sectionLink.chevronSize} />
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
  // Ikon + rubrik (brief 73): spacing.sm emellan, toppställda så att ikonen
  // ligger mot första raden om rubriken bryts.
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  leadingIcon: {
    height: typography.title2.lineHeight,
    justifyContent: 'center',
  },
  title: {
    flexShrink: 1,
    ...typography.title2,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
  // Antalet efter rubriken: samma storlek, dämpad (brief 65).
  count: {
    color: t.colors.textSecondary,
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
