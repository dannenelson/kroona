import { View, ScrollView, StyleSheet } from 'react-native';
import PartnerCard from './PartnerCard';
import SectionTitle from './SectionTitle';
import { spacing } from '../theme';
import { COLLECTIONS, getCollectionProducts, getCollectionNewCount } from '../data/collections';

// Tryck på ett kort öppnar Samlingsdetalj (app/collection/[id], brief 28).
export default function CollectionsRow() {
  // Sortera på flest nytillkomna (isNew) produkter först — se
  // getCollectionNewCount i data/collections.ts för varför det är den bästa
  // tillgängliga proxyn för "senast påfylld samling". Spreadar till en ny
  // array; COLLECTIONS självt muteras aldrig.
  const sortedCollections = [...COLLECTIONS].sort(
    (a, b) => getCollectionNewCount(b) - getCollectionNewCount(a)
  );

  return (
    <View style={styles.section}>
      <SectionTitle title="Du följer" style={styles.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {sortedCollections.map((collection) => (
          <PartnerCard
            key={collection.id}
            id={collection.id}
            name={collection.name}
            tag={collection.tag}
            imageUrl={collection.imageUrl}
            itemCount={getCollectionProducts(collection).length}
            variant={collection.filter.type}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },
  title: {
    paddingHorizontal: spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
});
