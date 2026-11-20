import type { ComponentType, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Transition from 'react-native-screen-transitions';
import { GestureDetector } from 'react-native-gesture-handler';
import { makeStyles, typography, fonts, spacing, listRow, iconSize } from '../theme';
import { useLongPressMenu } from '../hooks/useLongPressMenu';
import type { ContextMenuItem } from './ProductContextMenu';

type IconProps = { color: string; size?: number };

type Props = {
  title: string;
  subtitle?: string;
  /** Liten ikon före undertexten (t.ex. lås för privat). */
  subtitleIcon?: ComponentType<IconProps>;
  /** Bild/mosaik/avatar till vänster, i `thumbSize`. */
  thumb: ReactNode;
  thumbRadius: number;
  /** Kompakt rad (64 hög, 48-thumb) för Följer; standard 76/56. */
  compact?: boolean;
  onPress: () => void;
  /** Zoom till detaljvyn från thumben (samma mönster som korten). */
  boundary?: { id: string; group: string };
  /** Kontextmeny vid långt tryck; thumben lyfts. */
  menuItems?: ContextMenuItem[];
  menuImageUri?: string;
  /** Element längst till höger (t.ex. val-cirkel). */
  trailing?: ReactNode;
  accessibilityLabel?: string;
  /** T.ex. { checked } för valbara rader. */
  accessibilityState?: { checked?: boolean; selected?: boolean };
};

/**
 * Listrad (brief 35, designsystem.md §13): thumb till vänster, titel och
 * undertext. Tryck = `pressed`-yta (rader krymper inte, som iOS-listor).
 * Långt tryck: samma kontextmeny som korten, med thumben som lyft kopia.
 */
export default function ListRow({
  title,
  subtitle,
  subtitleIcon: SubIcon,
  thumb,
  thumbRadius,
  compact = false,
  onPress,
  boundary,
  menuItems = [],
  menuImageUri,
  trailing,
  accessibilityLabel,
  accessibilityState,
}: Props) {
  const styles = useStyles();
  const menu = useLongPressMenu({
    items: menuItems,
    imageUri: menuImageUri,
    radius: thumbRadius,
    renderOverlay: () => thumb,
  });
  const thumbView = (
    <View ref={menu.ref} collapsable={false} style={menu.hidden && styles.hidden}>
      {thumb}
    </View>
  );

  return (
    <GestureDetector gesture={menu.gesture}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? [title, subtitle].filter(Boolean).join(', ')}
        accessibilityHint={menuItems.length ? 'Håll in för fler val' : undefined}
        accessibilityState={accessibilityState}
        style={({ pressed }) => [
          styles.row,
          { height: compact ? listRow.compactHeight : listRow.height },
          pressed && styles.pressed,
        ]}
      >
        {boundary ? (
          <Transition.Boundary id={boundary.id} group={boundary.group}>
            {thumbView}
          </Transition.Boundary>
        ) : (
          thumbView
        )}
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <View style={styles.subRow}>
              {SubIcon ? <SubIcon color={styles.subtitle.color} size={iconSize.xs} /> : null}
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
          ) : null}
        </View>
        {trailing}
      </Pressable>
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  hidden: {
    opacity: 0,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subtitle: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
}));
