import { View, ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../constants/spacing';
import SectionTitle from './SectionTitle';
import CollectionCard from './CollectionCard';

const TITLE = 'Populära samlingar';

// Ingen riktig board-data finns i Fas 0 — "riktiga" samlingar kräver
// konto/backend (docs/kroona_status_roadmap.md, avsnitt 8 "Egna samlingar
// — saknas helt" + avsnitt 12). Statisk dummy tills dess.
const POPULAR_COLLECTIONS: {
  id: string;
  title: string;
  curatorInitial: string;
  itemCount: number;
  updatedLabel: string;
  images: [string, string, string];
}[] = [
  {
    id: 'popular-1',
    title: 'Vinterlook 2026',
    curatorInitial: 'E',
    itemCount: 18,
    updatedLabel: 'Uppdaterad idag',
    images: [
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    ],
  },
  {
    id: 'popular-2',
    title: 'Present till pappa',
    curatorInitial: 'N',
    itemCount: 9,
    updatedLabel: 'Uppdaterad förra veckan',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
    ],
  },
  {
    id: 'popular-3',
    title: 'Hemmakontor på budget',
    curatorInitial: 'K',
    itemCount: 14,
    updatedLabel: 'Uppdaterad för 2 dagar sedan',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    ],
  },
  {
    id: 'popular-4',
    title: 'Klassiker som aldrig dör',
    curatorInitial: 'A',
    itemCount: 27,
    updatedLabel: 'Uppdaterad idag',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400',
    ],
  },
];

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
    marginTop: 32,
  },
  title: {
    paddingHorizontal: Spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: Spacing.screenMargin,
    gap: Spacing.gutter,
  },
});
