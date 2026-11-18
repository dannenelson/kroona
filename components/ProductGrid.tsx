import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';
import { spacing } from '../theme';
import { TAB_BAR_HEIGHT } from './CustomTabBar';

type Props = {
  products: Product[];
  title?: string;
  compact?: boolean;
};

export default function ProductGrid({ products, title, compact }: Props) {
  const insets = useSafeAreaInsets();
  const leftColumn = products.filter((_, i) => i % 2 === 0);
  const rightColumn = products.filter((_, i) => i % 2 !== 0);

  return (
    <View
      style={[
        styles.section,
        compact && styles.sectionCompact,
        !compact && { paddingBottom: TAB_BAR_HEIGHT + insets.bottom },
      ]}
    >
      {title && <SectionTitle title={title} />}
      <View style={styles.grid}>
        <View style={styles.column}>
          {leftColumn.map((product) => (
            <View key={product.id} style={styles.cardWrapper}>
              <ProductCard {...product} />
            </View>
          ))}
        </View>
        <View style={styles.column}>
          {rightColumn.map((product) => (
            <View key={product.id} style={styles.cardWrapper}>
              <ProductCard {...product} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenMargin,
  },
  sectionCompact: {
    marginTop: spacing.md,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.gutter,
  },
  column: {
    flex: 1,
    gap: spacing.lg,
  },
  cardWrapper: {
    width: '100%',
  },
});
