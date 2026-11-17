import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { useSavedProducts } from '../../context/SavedProductsContext';
import ProductGrid from '../../components/ProductGrid';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { savedProducts } = useSavedProducts();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, flexGrow: 1 }}
      >
        <Text style={styles.title}>Sparat</Text>

        {savedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Inga sparade produkter än</Text>
            <Text style={styles.emptyHint}>
              Tryck på hjärtat på en produkt för att spara den här.
            </Text>
          </View>
        ) : (
          <ProductGrid products={savedProducts} />
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
    paddingHorizontal: Spacing.screenMargin,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenMargin,
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
