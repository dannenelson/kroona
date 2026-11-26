import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../theme';
import { AREA_ITEMS as ITEMS, openArea } from './AreaGrid';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';
import { COLLECTION_LOGOS } from '../data/logos';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/**
 * "Områden" (brief 43): små stående kort från data/areas.ts. Tryck öppnar
 * Områdesdetalj och "Visa fler" Alla områden (brief 54).
 */
export default function AreasRow() {
  const router = useRouter();
  if (ITEMS.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionTitle title="Områden" cta={{ onPress: () => router.push('/areas') }} style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {ITEMS.map(({ area, products }) => (
          <EditorialCard
            key={area.id}
            variant="portraitSmall"
            title={area.name}
            subtitle={countLabel(products.length)}
            imageUrl={products[0]?.imageUrl}
            logo={COLLECTION_LOGOS[area.id]}
            prominentTitle
            onPress={() => openArea(router, area)}
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
