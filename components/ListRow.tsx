import { useRef, type ComponentRef, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Transition from 'react-native-screen-transitions';
import { GestureDetector } from 'react-native-gesture-handler';
import { makeStyles, typography, fonts, spacing, listRow, iconSize, touchTarget } from '../theme';
import { useLongPressMenu } from '../hooks/useLongPressMenu';
import type { ContextMenuItem } from './ProductContextMenu';
import IconButton from './IconButton';
import { useAnchoredMenu } from './AnchoredMenu';
import Icon, { type IconName } from './Icon';

type Props = {
  title: string;
  subtitle?: string;
  /** Liten ikon före undertexten (t.ex. lås för privat). */
  subtitleIcon?: IconName;
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
  /** "Mer"-knapp (more-horizontal) till höger som öppnar samma meny som långt tryck. */
  menuButton?: boolean;
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
  subtitleIcon,
  thumb,
  thumbRadius,
  compact = false,
  onPress,
  boundary,
  menuItems = [],
  menuImageUri,
  trailing,
  menuButton = false,
  accessibilityLabel,
  accessibilityState,
}: Props) {
  const styles = useStyles();
  const anchoredMenu = useAnchoredMenu();
  const moreRef = useRef<ComponentRef<typeof View>>(null);
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
              {subtitleIcon ? <Icon name={subtitleIcon} color={styles.subtitle.color} size={iconSize.xs} /> : null}
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
          ) : null}
        </View>
        {trailing}
        {menuButton && menuItems.length > 0 ? (
          // Förankrad meny vid knappen (brief 70); långt tryck på raden behåller lyftet.
          <View ref={moreRef} collapsable={false} style={styles.moreButton}>
            <IconButton
              name="more-horizontal"
              variant="bare"
              accessibilityLabel={`Fler val för ${title}`}
              onPress={() =>
                moreRef.current?.measureInWindow((x, y, width, height) =>
                  anchoredMenu.open({ anchor: { x, y, width, height }, items: menuItems }),
                )
              }
            />
          </View>
        ) : null}
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
  // Ikonens kant (inte träffytans) linjerar med skärmmarginalen.
  moreButton: {
    marginRight: -(touchTarget - iconSize.lg) / 2,
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
