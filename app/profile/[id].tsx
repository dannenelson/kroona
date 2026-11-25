// Profilvy (brief 37, wireframes.md §4): en person man kan följa. Fas 0:
// dummydata (data/people.ts), inga konton. Partnerdetaljens språk men liten:
// avatar, namn, @handle, följare, bio, Följ och hyllan Samlingar (personens
// publika samlingar). Samma hierarkirörelse som övriga detaljvyer: avataren
// är zoommålet (profileScreenOptions i components/product/productTransition.ts).
import { ScrollView, Text, View } from 'react-native';
import Reanimated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Transition, { useScreenAnimation } from 'react-native-screen-transitions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, fonts, spacing, touchTarget, edgeBlur, motion, profileAvatar } from '../../theme';
import { getPerson } from '../../data/people';
import { getCollectionProducts, getPersonCollections } from '../../data/collections';
import { useFollowedPeople } from '../../context/FollowedPeopleContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { PROFILE_BOUNDARY_GROUP } from '../../components/product/productTransition';
import TopBar from '../../components/TopBar';
import EdgeFade from '../../components/EdgeFade';
import SectionTitle from '../../components/SectionTitle';
import PartnerCard from '../../components/PartnerCard';
import Avatar from '../../components/Avatar';
import Pill from '../../components/Pill';

const formatCount = (n: number) => n.toLocaleString('sv-SE');

export default function ProfileScreen() {
  // `b` = boundary-id för avataren man öppnade från (zoomen går från/till den).
  const { id, b } = useLocalSearchParams<{ id: string; b?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { isFollowingPerson, toggleFollowPerson } = useFollowedPeople();
  const person = getPerson(id);
  const collections = person ? getPersonCollections(person.id) : [];
  const barHeight = touchTarget + spacing.sm * 2;

  // Innehållet under avataren tonas in på slutet av övergången (som övriga detaljvyer).
  const reduceMotion = useReduceMotion();
  const screenAnimation = useScreenAnimation();
  const revealStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion
      ? 1
      : interpolate(
          screenAnimation.value.current.transitionProgress,
          [motion.detailRevealFrom, 1],
          [0, 1],
          Extrapolation.CLAMP,
        ),
  }));

  const back = () => router.back();

  if (!person) {
    return (
      <View style={[styles.container, styles.empty, { paddingTop: insets.top }]}>
        <TopBar tone="plain" left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }} />
        <Text style={styles.emptyText}>Personen finns inte.</Text>
      </View>
    );
  }

  const following = isFollowingPerson(person.id);

  return (
    <View style={styles.container}>
      <Transition.ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingTop: insets.top + barHeight, paddingBottom: insets.bottom + spacing.xxxl }}
      >
        <View style={styles.head}>
          {/* Avataren är målet för zoomen från raden/kortet. */}
          <Transition.Boundary id={b ?? person.id} group={PROFILE_BOUNDARY_GROUP}>
            <Avatar initial={person.initial} size={profileAvatar} />
          </Transition.Boundary>
          <Reanimated.View style={[styles.headText, revealStyle]}>
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.handle}>@{person.handle}</Text>
            <Text style={styles.meta}>
              {formatCount(person.followers)} följare · {collections.length}{' '}
              {collections.length === 1 ? 'samling' : 'samlingar'}
            </Text>
            <Text style={styles.bio}>{person.bio}</Text>
            <Pill variant="filled" selected={following} onPress={() => toggleFollowPerson(person.id)}>
              {following ? 'Följer' : 'Följ'}
            </Pill>
          </Reanimated.View>
        </View>

        {collections.length > 0 && (
          <Reanimated.View style={revealStyle}>
            <SectionTitle title="Samlingar" style={styles.sectionTitle} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
              {collections.map((c) => (
                <PartnerCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  tag={c.tag}
                  imageUrl={c.imageUrl}
                  itemCount={getCollectionProducts(c).length}
                  variant="style"
                />
              ))}
            </ScrollView>
          </Reanimated.View>
        )}
      </Transition.ScrollView>

      <EdgeFade
        position="top"
        height={insets.top + barHeight + spacing.lg}
        blurHeight={insets.top + edgeBlur.topExtra}
      />
      <View style={[styles.topChrome, { paddingTop: insets.top }]} pointerEvents="box-none">
        <TopBar tone="theme" left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: back }} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  empty: {
    gap: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
  },
  head: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  headText: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.title1,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
  handle: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  meta: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
  bio: {
    ...typography.body,
    color: t.colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  shelf: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}));
