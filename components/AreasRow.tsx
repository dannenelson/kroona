import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { AREAS } from '../data/areas';
import { getProductsForArea } from '../lib/catalog';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

// Områden med minst en produkt; första produktens bild är omslaget.
const ITEMS = AREAS.map((area) => ({ area, products: getProductsForArea(area) })).filter(
  (x) => x.products.length > 0,
);

/**
 * "Områden" (brief 43): små stående kort från data/areas.ts. Ingen
 * områdesvy finns ännu, så korten öppnar inget (flaggat i rapporten).
 */
export default function AreasRow() {
  if (ITEMS.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionTitle title="Områden" style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {ITEMS.map(({ area, products }) => (
          <EditorialCard
            key={area.id}
            variant="portraitSmall"
            title={area.name}
            subtitle={countLabel(products.length)}
            imageUrl={products[0]?.imageUrl}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxl,
  },
  title: {
    paddingHorizontal: spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
});
