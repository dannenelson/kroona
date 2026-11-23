import { useId } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../theme';
import {
  COLLECTIONS,
  RETAILER_COLLECTIONS,
  getCollectionProducts,
  getCurator,
  type Collection,
} from '../data/collections';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

// Kroonas egna samlingar först, sedan varumärkenas kollektioner (brief 43).
// Varumärkenas filtersamlingar (t.ex. "J.Lindeberg") är varumärken, inte
// samlingar, och visas som cirklar i "Fler i din stil" i stället.
const ITEMS: Collection[] = [
  ...COLLECTIONS.filter((c) => c.curator.kind === 'kroona'),
  ...RETAILER_COLLECTIONS,
].filter((c) => getCollectionProducts(c).length > 0);

/** "Samlingar för dig" (brief 43): stora stående kort, öppnar Samlingsdetalj med zoom. */
export default function CollectionsForYouRow() {
  if (ITEMS.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionTitle title="Samlingar för dig" style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {ITEMS.map((c) => (
          <CollectionItem key={c.id} collection={c} />
        ))}
      </ScrollView>
    </View>
  );
}

function CollectionItem({ collection }: { collection: Collection }) {
  const router = useRouter();
  const boundaryId = `${collection.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <EditorialCard
      variant="portraitLarge"
      title={collection.name}
      subtitle={`Av ${getCurator(collection).name} · ${countLabel(getCollectionProducts(collection).length)}`}
      imageUrl={collection.imageUrl}
      boundary={{ id: boundaryId, group: COLLECTION_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id, b: boundaryId } })}
    />
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
