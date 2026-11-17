import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { COLLECTIONS, getCollectionProducts } from '../../data/collections';
import { Product } from '../../types/product';
import ProductGrid from '../../components/ProductGrid';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { followedCollectionIds } = useFollowedCollections();

  const feedProducts = useMemo(() => {
    const followedSet = new Set(followedCollectionIds);
    const followedCollections = COLLECTIONS.filter((c) => followedSet.has(c.id));

    const seen = new Set<string>();
    const deduped: Product[] = [];
    for (const collection of followedCollections) {
      for (const product of getCollectionProducts(collection)) {
        if (!seen.has(product.id)) {
          seen.add(product.id);
          deduped.push(product);
        }
      }
    }
    return deduped;
  }, [followedCollectionIds]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: Spacing.screenMargin, flexGrow: 1 }}
      >
        <Text style={styles.title}>Flöde</Text>

        {feedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Inget att visa än</Text>
            <Text style={styles.emptyHint}>
              Följ en samling på Hem för att se produkter här.
            </Text>
          </View>
        ) : (
          <ProductGrid products={feedProducts} compact />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    letterSpacing: 0.3,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyHint: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
