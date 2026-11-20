import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';
import { makeStyles, radius, segmented, iconSize } from '../theme';
import { haptic } from '../utils/haptic';

type IconProps = { color: string; size?: number };

type Props<T extends string> = {
  items: readonly { value: T; icon: ComponentType<IconProps>; label: string }[];
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
      {items.map(({ value, icon: Icon, label }) => {
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
            style={[styles.item, active && styles.itemActive]}
          >
            <Icon color={active ? styles.on.color : styles.off.color} size={iconSize.sm} />
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
