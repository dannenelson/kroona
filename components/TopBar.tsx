import type { ComponentProps } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, spacing, radius } from '../theme';
import IconButton from './IconButton';
import Glass, { type GlassTone } from './Glass';

export type TopBarAction = Pick<
  ComponentProps<typeof IconButton>,
  'name' | 'accessibilityLabel' | 'onPress' | 'selected' | 'disabled'
>;

type Props = {
  /** Vänster slot: alltid navigation (tillbaka eller meny). */
  left: TopBarAction;
  /** Höger slot: 0–2 kontextåtgärder. Två åtgärder delar en glaskapsel. */
  right?: readonly [] | readonly [TopBarAction] | readonly [TopBarAction, TopBarAction];
  /** 'photo' när baren ligger på foto: fast mörkt glas och vita ikoner i båda teman. */
  tone?: GlassTone;
  style?: StyleProp<ViewStyle>;
};

/**
 * Delad toppbar (designsystem.md §8). Fast struktur: navigation till vänster,
 * 0–2 åtgärder till höger, glasbehandling enligt design.md §3.
 * Safe area hanteras av skärmen som placerar baren.
 */
export default function TopBar({ left, right = [], tone = 'theme', style }: Props) {
  const { shadows } = useTheme();
  return (
    <View style={[styles.bar, style]}>
      <IconButton {...left} tone={tone} />
      {right.length === 1 && <IconButton {...right[0]} tone={tone} />}
      {right.length === 2 && (
        // Samma subtila skugga som glasknapparna, på ett yttre lager (Glass klipper).
        <View style={[styles.capsuleShadow, { boxShadow: shadows.glassButton }]}>
          <Glass tone={tone} style={styles.capsule}>
            {right.map((action) => (
              <IconButton key={action.accessibilityLabel} {...action} tone={tone} variant="bare" />
            ))}
          </Glass>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
  },
  capsuleShadow: {
    borderRadius: radius.full,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
  },
});
