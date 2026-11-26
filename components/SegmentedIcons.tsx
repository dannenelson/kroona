import { Pressable, Text, View } from 'react-native';
import { makeStyles, typography, spacing, radius, segmented, iconSize } from '../theme';
import { haptic } from '../utils/haptic';
import Icon, { type IconName } from './Icon';

type Props<T extends string> = {
  /** Segment med ikon, eller med kort text (`text`, t.ex. "System" i Utseende, brief 64). */
  items: readonly { value: T; label: string; icon?: IconName; text?: string }[];
  selected: T;
  onSelect: (value: T) => void;
};

/**
 * Vy-växlare (brief 35, designsystem.md §13): segmentkontroll med ikoner.
 * Pill-bakgrund `surface`, aktivt segment `surfaceRaised` och text-färg,
 * övriga mute. Byter direkt (ingen animation), selection-haptik.
 */
export default function SegmentedIcons<T extends string>({ items, selected, onSelect }: Props<T>) {
  const styles = useStyles();
  return (
    <View style={styles.track} accessibilityRole="radiogroup">
      {items.map(({ value, icon, label, text }) => {
        const active = value === selected;
        return (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (active) return;
              haptic.selection();
              onSelect(value);
            }}
            style={[styles.item, text ? styles.itemText : null, active && styles.itemActive]}
          >
            {text ? (
              <Text style={[styles.text, active ? styles.on : styles.off]}>{text}</Text>
            ) : icon ? (
              <Icon name={icon} color={active ? styles.on.color : styles.off.color} size={iconSize.sm} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  track: {
    flexDirection: 'row',
    padding: segmented.padding,
    gap: segmented.gap,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
  },
  item: {
    width: segmented.itemWidth,
    height: segmented.itemHeight,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Textsegment: följer textens bredd, minst ett ikonsegments.
  itemText: {
    width: undefined,
    minWidth: segmented.itemWidth,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.label,
  },
  itemActive: {
    backgroundColor: t.colors.surfaceRaised,
  },
  on: {
    color: t.colors.textPrimary,
  },
  off: {
    color: t.colors.textSecondary,
  },
}));
