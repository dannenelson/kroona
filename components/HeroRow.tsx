import { useMemo } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, darkColors, overlay, typography, letterSpacing, spacing, radius } from '../theme';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { MixSignal, signalKey, getKnownSignals } from '../lib/personalizationSignals';
import SectionTitle from './SectionTitle';
import { PRODUCT_IMAGES } from '../data/productImages';

const SCREEN_WIDTH = Dimensions.get('window').width;
// 82% av skärmbredden — lämnar en tydlig ~18%-skymt av nästa kort synlig,
// per designsystemet (docs/designsystem.md, EditorialCard: "vid flera i
// rad görs korten smalare... så en skymt av nästa kort syns"). Ersätter
// tidigare SCREEN_WIDTH - 40, som bara lämnade en ~40px flik — knappt
// märkbar som "fler att scrolla till".
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
// Sänkt från 240 — tog för mycket vertikal plats i förhållande till appens
// övriga kort (MixCard/CollectionCard-bilder ligger på 160). 190 ger ett
// ~5:3-liggande förhållande vid dagens CARD_WIDTH — fortfarande rum för
// badge+eyebrow+titel+meta utan att kännas trångt.
const CARD_HEIGHT = 190;

type EditorialPost = {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  meta: string;
  imageUrl: string;
  // Endast för rankning — visas aldrig i UI:t.
  signals: MixSignal[];
};

// Liten pool redaktionella dummy-inlägg: 3 av användarens egna exempel +
// "Ytterplagg för hösten" tillagd för variation i rankningen.
const EDITORIAL_POSTS: EditorialPost[] = [
  {
    id: 'hostens-paletter',
    badge: 'Redaktionellt',
    eyebrow: 'SÄSONG',
    title: 'Höstens paletter',
    meta: 'Varma toner för kalla dagar',
    imageUrl: PRODUCT_IMAGES.sneakerBlackLow,
    signals: [
      { type: 'style', value: 'Skandinavisk' },
      { type: 'style', value: 'Minimalistisk' },
    ],
  },
  {
    id: 'traningsutrustning',
    badge: 'Redaktionellt',
    eyebrow: 'TEMA',
    title: 'Träningsutrustning',
    meta: 'Funktion möter form',
    imageUrl: PRODUCT_IMAGES.chairRattan,
    signals: [
      { type: 'style', value: 'Sportig' },
      { type: 'brand', value: 'Peak Performance' },
    ],
  },
  {
    id: 'kontor-ny-sasong',
    badge: 'Redaktionellt',
    eyebrow: 'TEMA',
    title: 'Kontor, ny säsong',
    meta: 'Uppdatera din arbetsplats',
    imageUrl: PRODUCT_IMAGES.sunglasses,
    signals: [
      { type: 'style', value: 'Minimalistisk' },
      { type: 'brand', value: 'HAY' },
    ],
  },
  {
    id: 'ytterplagg-for-hosten',
    badge: 'Redaktionellt',
    eyebrow: 'SÄSONG',
    title: 'Ytterplagg för hösten',
    meta: 'Regn- och vindtätt i urban stil',
    imageUrl: PRODUCT_IMAGES.backpackNavy,
    signals: [
      { type: 'style', value: 'Urban' },
      { type: 'brand', value: 'Rains' },
    ],
  },
];

export default function HeroRow() {
  const { savedProducts } = useSavedProducts();
  const { followedCollectionIds } = useFollowedCollections();
  const styles = useStyles();

  const knownSignals = useMemo(
    () => getKnownSignals(followedCollectionIds, savedProducts),
    [followedCollectionIds, savedProducts]
  );

  // Samma rankningslogik som MixRow.tsx: poäng = antal av inläggets
  // signaler som finns bland användarens kända signaler. Array.sort är
  // stabil i moderna JS-motorer, så lika poäng behåller poolens
  // ursprungsordning.
  const rankedPosts = useMemo(() => {
    const knownKeys = new Set(knownSignals.map(signalKey));
    return [...EDITORIAL_POSTS]
      .map((post) => ({
        post,
        score: post.signals.filter((s) => knownKeys.has(signalKey(s))).length,
      }))
      .sort((a, b) => b.score - a.score)
      .map((r) => r.post);
  }, [knownSignals]);

  return (
    <View style={styles.section}>
      <SectionTitle title="Utvalt" style={styles.sectionTitleWrapper} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + spacing.gutter}
        decelerationRate="fast"
        contentContainerStyle={styles.scroll}
      >
        {rankedPosts.map((post) => (
          <ImageBackground
            key={post.id}
            source={{ uri: post.imageUrl }}
            style={styles.card}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{post.badge}</Text>
            </View>
            <LinearGradient
              colors={overlay.scrimStops.colors}
              locations={overlay.scrimStops.locations}
              style={styles.gradient}
            >
              <Text style={styles.eyebrow}>{post.eyebrow}</Text>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.meta}>{post.meta}</Text>
            </LinearGradient>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}

// Innehållet ligger på foto + scrim, som är mörk i båda teman. Därför
// används fasta overlay-färger (onPhoto), identiska i båda teman.
const useStyles = makeStyles((t) => ({
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitleWrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: overlay.onPhoto, // inverterad badge på foto
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    zIndex: 1,
  },
  badgeText: {
    ...typography.micro,
    color: darkColors.bg,
    letterSpacing: 1, // lokal optisk spärrning
    textTransform: 'uppercase',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  eyebrow: {
    ...typography.micro,
    color: overlay.onPhotoSecondary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title1,
    color: overlay.onPhoto,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: overlay.onPhotoSecondary,
  },
}));
