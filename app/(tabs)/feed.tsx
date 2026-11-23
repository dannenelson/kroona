import { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, fonts, spacing } from '../../theme';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';
import { COLLECTIONS, getCollectionProducts } from '../../data/collections';
import { Product } from '../../types/product';
import ProductGrid from '../../components/ProductGrid';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
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
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: spacing.screenMargin, flexGrow: 1 }}
      >
        <Text style={styles.title}>Följer</Text>

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

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  title: {
    ...typography.headline,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    paddingVertical: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl + spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.body,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
  emptyHint: {
    ...typography.label,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
