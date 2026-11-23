import { useId } from 'react';
import { Animated, View, ScrollView, StyleSheet, Image, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { makeStyles, typography, spacing, radius, editorialCard } from '../theme';
import SectionTitle from './SectionTitle';
import Glass, { useGlass } from './Glass';
import Avatar from './Avatar';
import { useCardPress } from '../hooks/useCardPress';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import { PEOPLE_COLLECTIONS, getCollectionProducts, type Collection } from '../data/collections';
import { getPerson } from '../data/people';

const TITLE = 'Populära samlingar';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

// Personers publika samlingar (brief 37, DUMMYDATA i data/collections.ts).
// Kollagekort (brief 43, 52): bildytan 200 × 250 (en bred bild över två små),
// radie 20 och 1 px inre kant, kuratorchip överst till vänster på bilden.
// Flerbildskort har texten **under** bilden (brief 52: text på bild bara för
// ett enda foto): titel 14/500 och antal 12 dämpat, vänsterställda. Tryck
// öppnar Samlingsdetalj med zoom från bildytan. CollectionCard ligger kvar.
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
  const press = useCardPress();
  const glass = useGlass('photo');
  const boundaryId = `${collection.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const products = getCollectionProducts(collection);
  const person = collection.curator.id ? getPerson(collection.curator.id) : undefined;
  const img = (i: number) => products[i]?.imageUrl ?? collection.imageUrl;
  const { width, height } = editorialCard.collage;

  return (
    <Pressable
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id, b: boundaryId } })}
      accessibilityRole="button"
      accessibilityLabel={`${collection.name}, av ${person?.name ?? 'Kroona'}, ${countLabel(products.length)}`}
    >
      <Animated.View style={[styles.card, { width }, press.scaleStyle]}>
        <Transition.Boundary id={boundaryId} group={COLLECTION_BOUNDARY_GROUP}>
          <View style={[styles.collage, { width, height }]}>
            <Image source={{ uri: collection.imageUrl }} style={styles.wide} resizeMode="cover" />
            <View style={styles.smallRow}>
              <Image source={{ uri: img(1) }} style={styles.small} resizeMode="cover" />
              <Image source={{ uri: img(2) }} style={styles.small} resizeMode="cover" />
            </View>
            {person ? (
              <View style={styles.chipSlot} pointerEvents="none">
                <Glass tone="photo" style={styles.chip}>
                  <Avatar initial={person.initial} size={editorialCard.chipAvatar} />
                  <Text style={[styles.chipName, { color: glass.content }]} numberOfLines={1}>
                    {person.name}
                  </Text>
                </Glass>
              </View>
            ) : null}
            {/* Inre kantlinje ovanpå bilden, som övriga bildkort. */}
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.edge]} />
          </View>
        </Transition.Boundary>
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={2}>
            {collection.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {countLabel(products.length)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    gap: spacing.sm,
  },
  collage: {
    borderRadius: radius.editorialMedium,
    borderCurve: 'continuous',
    overflow: 'hidden',
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
  edge: {
    borderRadius: radius.editorialMedium,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: t.colors.imageEdge,
  },
  chipSlot: {
    position: 'absolute',
    top: editorialCard.paddingSmall,
    left: editorialCard.paddingSmall,
    right: editorialCard.paddingSmall,
    alignItems: 'flex-start',
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
  text: {
    gap: 2, // lokal optisk luft: titel → antal
  },
  title: {
    ...typography.cardTitle,
    color: t.colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: t.colors.textSecondary,
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
