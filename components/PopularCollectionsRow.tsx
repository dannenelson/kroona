import { useId } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, typography, spacing, radius, editorialCard } from '../theme';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';
import Glass, { useGlass } from './Glass';
import Avatar from './Avatar';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import { PEOPLE_COLLECTIONS, getCollectionProducts, type Collection } from '../data/collections';
import { getPerson } from '../data/people';

const TITLE = 'Populära samlingar';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

// Personers publika samlingar (brief 37, DUMMYDATA i data/collections.ts).
// Brief 43: kollagekort 200 × 267 (en bred bild över två små), kuratorchip
// överst till vänster, titel och antal centrerade på bilden. Tryck öppnar
// Samlingsdetalj med zoom. CollectionCard (tidigare kort här) ligger kvar.
export default function PopularCollectionsRow() {
  if (PEOPLE_COLLECTIONS.length === 0) return null;
  return (
    <View style={rowStyles.section}>
      <SectionTitle title={TITLE} style={rowStyles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={rowStyles.scroll}>
        {PEOPLE_COLLECTIONS.map((c) => (
          <CollageCard key={c.id} collection={c} />
        ))}
      </ScrollView>
    </View>
  );
}

function CollageCard({ collection }: { collection: Collection }) {
  const styles = useStyles();
  const router = useRouter();
  const glass = useGlass('photo');
  const boundaryId = `${collection.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const products = getCollectionProducts(collection);
  const person = collection.curator.id ? getPerson(collection.curator.id) : undefined;
  const img = (i: number) => products[i]?.imageUrl ?? collection.imageUrl;

  const collage = (
    <View style={[StyleSheet.absoluteFill, styles.collage]}>
      <Image source={{ uri: collection.imageUrl }} style={styles.wide} resizeMode="cover" />
      <View style={styles.smallRow}>
        <Image source={{ uri: img(1) }} style={styles.small} resizeMode="cover" />
        <Image source={{ uri: img(2) }} style={styles.small} resizeMode="cover" />
      </View>
    </View>
  );

  const chip = person ? (
    <Glass tone="photo" style={styles.chip}>
      <Avatar initial={person.initial} size={editorialCard.chipAvatar} />
      <Text style={[styles.chipName, { color: glass.content }]} numberOfLines={1}>
        {person.name}
      </Text>
    </Glass>
  ) : undefined;

  return (
    <EditorialCard
      variant="portraitSmall"
      size={{ ...editorialCard.collage, radius: radius.editorialMedium }}
      title={collection.name}
      subtitle={countLabel(products.length)}
      cover={collage}
      chip={chip}
      boundary={{ id: boundaryId, group: COLLECTION_BOUNDARY_GROUP }}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id, b: boundaryId } })}
      accessibilityLabel={`${collection.name}, av ${person?.name ?? 'Kroona'}, ${countLabel(products.length)}`}
    />
  );
}

const useStyles = makeStyles((t) => ({
  collage: {
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
    backgroundColor: t.colors.placeholder,
  },
  wide: {
    flex: 3,
  },
  smallRow: {
    flex: 2,
    flexDirection: 'row',
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  small: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.xs,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    maxWidth: '100%',
  },
  chipName: {
    ...typography.caption,
    flexShrink: 1,
  },
}));

const rowStyles = StyleSheet.create({
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
