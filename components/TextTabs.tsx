import { Animated, Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, typography, spacing, motion, touchTarget } from '../theme';
import { usePressAnimation } from '../hooks/usePressAnimation';

type Props<T extends string> = {
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  /** Flikar som visas men inte går att välja. */
  disabledItems?: readonly T[];
  size?: 'md';
  style?: StyleProp<ViewStyle>;
};

const UNDERLINE = 2; // lokal linjetjocklek för understrykningen

/**
 * Text-flikar med understrykning (design.md §11), 44 px höga, scrollar
 * horisontellt vid många. Används för filtrering i stället för pillar.
 * States enligt design.md §0: default (mute), pressed (text-färg, opacitet 0,55, animerat),
 * selected (text-färg + understrykning i text-färg), disabled (35 % opacitet).
 */
export default function TextTabs<T extends string>({
  items,
  selected,
  onSelect,
  disabledItems,
  style,
}: Props<T>) {
  const styles = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={style}
    >
      {items.map((item) => (
        <Tab
          key={item}
          label={item}
          selected={item === selected}
          disabled={disabledItems?.includes(item) ?? false}
          onPress={() => onSelect(item)}
        />
      ))}
    </ScrollView>
  );
}

/**
 * En flik. Nedtryckt tonar en label i text-färg (opacitet upp till 0,55)
 * över mute-labeln, animerat (brief 06). Ingen skala på text-flikar.
 */
function Tab({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const press = usePressAnimation(1);
  const pressedOpacity = press.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, motion.pressedTextOpacity],
  });
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[styles.tab, disabled && styles.disabled]}
    >
      <View>
        <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
        {!selected && (
          <Animated.Text
            style={[styles.label, styles.labelActive, styles.overlay, { opacity: pressedOpacity }]}
          >
            {label}
          </Animated.Text>
        )}
      </View>
      {selected && <View style={styles.underline} />}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.xl,
  },
  tab: {
    height: touchTarget,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
  label: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  labelActive: {
    color: t.colors.textPrimary,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: UNDERLINE,
    borderRadius: UNDERLINE / 2,
    backgroundColor: t.colors.textPrimary,
  },
}));
