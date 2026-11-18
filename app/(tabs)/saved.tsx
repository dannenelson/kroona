import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, fonts, spacing } from '../../theme';
import { useSavedProducts } from '../../context/SavedProductsContext';
import ProductGrid from '../../components/ProductGrid';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
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

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  title: {
    ...typography.headline,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenMargin,
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
    fontFamily: fonts.ui400, // regular som tidigare, storlek från label
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
