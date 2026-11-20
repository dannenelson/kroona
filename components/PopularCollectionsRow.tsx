import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import SectionTitle from './SectionTitle';
import CollectionCard from './CollectionCard';
import { PEOPLE_COLLECTIONS, getCollectionProducts } from '../data/collections';
import { getPerson } from '../data/people';

const TITLE = 'Populära samlingar';

// Personers publika samlingar (brief 37, DUMMYDATA i data/collections.ts).
// Tryck öppnar Samlingsdetalj, där kuratorraden leder till personens profil.
// Ersätter de statiska dummykorten som fanns här tidigare.
const POPULAR_COLLECTIONS = PEOPLE_COLLECTIONS.map((c) => {
  const products = getCollectionProducts(c);
  const person = c.curator.id ? getPerson(c.curator.id) : undefined;
  const img = (i: number) => products[i]?.imageUrl ?? c.imageUrl;
  return {
    id: c.id,
    collectionId: c.id,
    title: c.name,
    curatorInitial: person?.initial ?? '',
    itemCount: products.length,
    updatedLabel: `Av ${person?.name ?? 'Kroona'}`,
    images: [c.imageUrl, img(1), img(2)] as [string, string, string],
  };
});

export default function PopularCollectionsRow() {
  return (
    <View style={styles.section}>
      <SectionTitle title={TITLE} style={styles.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {POPULAR_COLLECTIONS.map((c) => (
          <CollectionCard key={c.id} {...c} />
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
