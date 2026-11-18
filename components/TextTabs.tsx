import { Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, typography, spacing, motion, touchTarget } from '../theme';

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
 * States: default, pressed (opacity 0,8), selected (accentText + understrykning),
 * disabled (tertiär text).
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
      {items.map((item) => {
        const isSelected = item === selected;
        const isDisabled = disabledItems?.includes(item) ?? false;
        return (
          <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            disabled={isDisabled}
            onPress={() => onSelect(item)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
                isDisabled && styles.labelDisabled,
              ]}
            >
              {item}
            </Text>
            {isSelected && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </ScrollView>
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
  pressed: {
    opacity: motion.pressedOpacity,
  },
  label: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  labelSelected: {
    color: t.colors.accentText,
  },
  labelDisabled: {
    color: t.colors.textTertiary,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: UNDERLINE,
    borderRadius: UNDERLINE / 2,
    backgroundColor: t.colors.accent,
  },
}));
