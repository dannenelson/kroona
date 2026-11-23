import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { RETAILERS } from '../data/retailers';
import { PEOPLE } from '../data/people';
import { useFollowedPeople } from '../context/FollowedPeopleContext';
import { useDiscoverBrandTiles } from './DiscoverBrandsRow';
import SectionTitle from './SectionTitle';
import ProfileCard from './ProfileCard';

type Circle =
  | { kind: 'brand'; key: string; name: string; initial: string; partnerId: string }
  | { kind: 'person'; key: string; name: string; initial: string; personId: string };

/**
 * "Fler i din stil" (brief 43): cirklar (76 px, namn under) för varumärken och
 * personer, blandade. Cirkel betyder identitet: inga samlingar eller innehåll
 * här. Varumärkena väljs som i DiscoverBrandsRow (i din följda stil, inte redan
 * följda); personerna är de du inte följer än. Tryck öppnar Partnerdetalj
 * respektive profil. Hyllan döljs om inget finns.
 */
export default function MoreInYourStyleRow() {
  const brandTiles = useDiscoverBrandTiles();
  const { isFollowingPerson } = useFollowedPeople();

  const brands: Circle[] = brandTiles.flatMap((tile) => {
    const partnerId = RETAILERS.find((r) => r.retailerType === 'brand' && r.brandName === tile.brand)?.id;
    return partnerId
      ? [{ kind: 'brand', key: `b-${tile.brand}`, name: tile.brand, initial: tile.brand[0].toUpperCase(), partnerId }]
      : [];
  });
  const people: Circle[] = PEOPLE.filter((p) => !isFollowingPerson(p.id)).map((p) => ({
    kind: 'person',
    key: `p-${p.id}`,
    name: p.name,
    initial: p.initial,
    personId: p.id,
  }));

  // Blanda: varannan varumärke, varannan person, resten sist.
  const circles: Circle[] = [];
  for (let i = 0; i < Math.max(brands.length, people.length); i++) {
    if (brands[i]) circles.push(brands[i]);
    if (people[i]) circles.push(people[i]);
  }

  if (circles.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionTitle title="Fler i din stil" style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {circles.map((c) =>
          c.kind === 'brand' ? (
            <ProfileCard key={c.key} name={c.name} initial={c.initial} partnerId={c.partnerId} />
          ) : (
            <ProfileCard key={c.key} name={c.name} initial={c.initial} personId={c.personId} />
          ),
        )}
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
    gap: spacing.lg,
  },
});
