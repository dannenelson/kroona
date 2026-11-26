// Grupperade listor (brief 64): Profil, Inställningar. Samma språk som
// faktalistan på Produktdetalj: rundad grupp på `surface`, hårlinje mellan
// raderna, rader minst 44 höga. Valfri sektionsrubrik ovanför gruppen.
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { makeStyles, useTheme, typography, spacing, radius, touchTarget, iconSize } from '../theme';
import Icon, { type IconName } from './Icon';

/** En grupp rader, med valfri rubrik ("Utseende", "Notiser" …). */
export function GroupedSection({ title, children }: { title?: string; children: ReactNode }) {
  const styles = useStyles();
  const rows = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.section}>
      {title ? (
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <View style={styles.group}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={styles.divider} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

type RowProps = {
  label: string;
  /** Ikon 20 till vänster. */
  icon?: IconName;
  /** Värde till höger (t.ex. versionsnummer). */
  value?: string;
  /** Eget element till höger (växel, segmentkontroll). */
  trailing?: ReactNode;
  /** Tryckbar rad med chevron till höger. */
  onPress?: () => void;
};

/** En rad: ikon, text, och till höger värde, eget element eller chevron (tryckbar). */
export function GroupedRow({ label, icon, value, trailing, onPress }: RowProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const content = (
    <>
      {icon ? <Icon name={icon} color={colors.textPrimary} size={iconSize.md} /> : null}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {trailing}
      {onPress ? <Icon name="chevron-right" color={colors.textTertiary} size={iconSize.chevron} /> : null}
    </>
  );
  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin + spacing.lg,
  },
  group: {
    marginHorizontal: spacing.screenMargin,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.surface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.lg,
    backgroundColor: t.colors.sep,
  },
  row: {
    minHeight: touchTarget + spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  label: {
    ...typography.body,
    color: t.colors.textPrimary,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
}));
