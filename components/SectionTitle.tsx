import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { makeStyles, typography, letterSpacing, spacing } from '../theme';

type PreOrSubHeader =
  | { preheader?: string; subheader?: never }
  | { preheader?: never; subheader?: string };

type IconOrCta =
  | { icon?: ReactNode; cta?: never }
  | { icon?: never; cta?: { label: string; onPress?: () => void } };

type Props = {
  title: string;
  style?: StyleProp<ViewStyle>;
} & PreOrSubHeader & IconOrCta;

export default function SectionTitle({ title, preheader, subheader, icon, cta, style }: Props) {
  const styles = useStyles();
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.textBlock}>
        {preheader ? <Text style={styles.preheader}>{preheader}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subheader ? <Text style={styles.subheader}>{subheader}</Text> : null}
      </View>
      {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
      {cta ? (
        <TouchableOpacity onPress={cta.onPress} style={styles.ctaSlot}>
          <Text style={styles.ctaLabel}>{cta.label}</Text>
        </TouchableOpacity>
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
  ctaSlot: {
    paddingVertical: spacing.xs,
  },
  ctaLabel: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
}));
