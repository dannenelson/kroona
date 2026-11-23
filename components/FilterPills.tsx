import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../theme';
import { haptic } from '../utils/haptic';
import Pill from './Pill';

type Props<T extends string> = {
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Filterpillar på Hem (brief 46): Pill i storleken `filter` (36 hög), vald
 * inverterad, 8 mellan, horisontell scroll vid behov och samma selection-haptik
 * som TextTabs. Övriga skärmar filtrerar med TextTabs.
 */
export default function FilterPills<T extends string>({ items, selected, onSelect, style }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={style}>
      {items.map((item) => (
        <Pill
          key={item}
          size="filter"
          haptics="selection"
          selected={item === selected}
          onPress={() => {
            if (item === selected) return;
            onSelect(item);
          }}
        >
          {item}
        </Pill>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.sm,
  },
});
