// Profil (brief 64): den inloggade användarens sida, öppnas från avataren på
// Hem och glider in från vänster (slideFromLeftScreenOptions). DUMMYDATA i
// Fas 0 (data/user.ts): avatar, namn, @handle, räknare och en lista. Raderna
// öppnar det som finns (Sparade produkter, Sparat, Inställningar); Hjälp har
// ingen sida än och visar en platshållare. Ingen inloggning eller redigering.
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, profileAvatar } from '../theme';
import { DUMMY_USER } from '../data/user';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { useFollowedPeople } from '../context/FollowedPeopleContext';
import { ALL_SAVED_ID } from '../context/UserCollectionsContext';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import { GroupedRow, GroupedSection } from '../components/GroupedList';

export default function MeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { savedProducts } = useSavedProducts();
  const { followedCollectionIds } = useFollowedCollections();
  const { followedPeopleIds } = useFollowedPeople();
  const following = followedCollectionIds.length + followedPeopleIds.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar left={{ name: 'back-arrow', accessibilityLabel: 'Tillbaka', onPress: () => router.back() }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <View style={styles.head}>
          <Avatar initial={DUMMY_USER.initials} size={profileAvatar} />
          <View style={styles.names}>
            <Text style={styles.name} accessibilityRole="header">
              {DUMMY_USER.fullName}
            </Text>
            <Text style={styles.handle}>{DUMMY_USER.handle}</Text>
          </View>
          <View style={styles.stats}>
            <Stat value={following} label="Följer" />
            <Stat value={savedProducts.length} label="Sparade" />
          </View>
        </View>

        <GroupedSection>
          <GroupedRow
            icon="bookmark"
            label="Sparade produkter"
            onPress={() => router.push({ pathname: '/collection/[id]', params: { id: ALL_SAVED_ID } })}
          />
          <GroupedRow icon="folders" label="Mina samlingar" onPress={() => router.navigate('/saved')} />
          <GroupedRow icon="settings" label="Inställningar" onPress={() => router.push('/settings')} />
          <GroupedRow
            icon="info"
            label="Hjälp"
            onPress={() => router.push({ pathname: '/placeholder', params: { title: 'Hjälp' } })}
          />
        </GroupedSection>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  content: {
    gap: spacing.xxl,
    paddingTop: spacing.lg,
  },
  head: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
  },
  names: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
  handle: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.headline,
    color: t.colors.textPrimary,
  },
  statLabel: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
}));
