import { useMemo } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Spacing, Radius } from '../constants/spacing';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { MixSignal, signalKey, getKnownSignals } from '../lib/personalizationSignals';
import SectionTitle from './SectionTitle';

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
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
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
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800',
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
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
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
    imageUrl: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800',
    signals: [
      { type: 'style', value: 'Urban' },
      { type: 'brand', value: 'Rains' },
    ],
  },
];

export default function HeroRow() {
  const { savedProducts } = useSavedProducts();
  const { followedCollectionIds } = useFollowedCollections();

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
        snapToInterval={CARD_WIDTH + Spacing.gutter}
        decelerationRate="fast"
        contentContainerStyle={styles.scroll}
      >
        {rankedPosts.map((post) => (
          <ImageBackground
            key={post.id}
            source={{ uri: post.imageUrl }}
            style={styles.card}
            imageStyle={styles.cardImage}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{post.badge}</Text>
            </View>
            <LinearGradient
              colors={[
                'rgba(26,28,33,0.0)',
                'rgba(26,28,33,0.56)',
                'rgba(26,28,33,0.75)',
                'rgba(26,28,33,1.0)',
              ]}
              locations={[0, 0.4, 0.65, 1]}
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

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  sectionTitleWrapper: {
    paddingHorizontal: Spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: Spacing.screenMargin,
    gap: Spacing.gutter,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  cardImage: {
    borderRadius: Radius.card,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'GoogleSansFlex_500Medium',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'GoogleSansFlex_500Medium',
    marginBottom: 4,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 27,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'GoogleSansFlex_400Regular',
  },
});
