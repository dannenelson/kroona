import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../constants/spacing';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/product';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { getKnownSignals } from '../lib/personalizationSignals';
import SectionTitle from './SectionTitle';
import ProductCard from './ProductCard';

const TITLE = 'Kanske intressant för dig';
const MAX_PRODUCTS = 10;

// Statisk fallback — används ENDAST om inget sparat/följt ger några
// signaler. Samma "visa aldrig en tom sektion"-princip som MixRow.tsx redan
// följer (till skillnad från DiscoverBrandsRow, som medvetet döljer hela
// raden istället — den här raden är mer lik MixRow i syfte).
const FALLBACK_PRODUCT_IDS = ['1', '2', '3', '4'];

export default function RecommendedProductsRow() {
  const { savedProducts } = useSavedProducts();
  const { followedCollectionIds } = useFollowedCollections();

  const products = useMemo<Product[]>(() => {
    const knownSignals = getKnownSignals(followedCollectionIds, savedProducts);

    const seen = new Set<string>();
    const matches: Product[] = [];
    for (const signal of knownSignals) {
      for (const p of PRODUCTS) {
        const isMatch = signal.type === 'brand' ? p.brand === signal.value : p.style === signal.value;
        if (isMatch && !seen.has(p.id)) {
          seen.add(p.id);
          matches.push(p);
        }
      }
    }

    if (matches.length > 0) return matches.slice(0, MAX_PRODUCTS);
    return PRODUCTS.filter((p) => FALLBACK_PRODUCT_IDS.includes(p.id));
  }, [followedCollectionIds, savedProducts]);

  return (
    <View style={styles.section}>
      <SectionTitle title={TITLE} style={styles.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.cardWrapper}>
            <ProductCard {...product} fixedHeight={148} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  title: {
    paddingHorizontal: Spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: Spacing.screenMargin,
    gap: Spacing.gutter,
  },
  cardWrapper: {
    width: 140,
  },
});
