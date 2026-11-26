// Områdesdetalj (brief 54): rubrik, beskrivning, Följ (samma mekanism som
// samlingar och varumärken: nyckeln är områdets id i FollowedCollectionsContext,
// visas i Sparat → Följer → Områden), antal och produktgrid med områdets urval.
// Nås från områdeskorten på Hem och Hitta och från Alla områden.
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing } from '../../theme';
import EdgeFade from '../../components/EdgeFade';
import ScreenHeader from '../../components/ScreenHeader';
import ProductGrid from '../../components/ProductGrid';
import Pill from '../../components/Pill';
import { AREAS } from '../../data/areas';
import { getProductsForArea } from '../../lib/catalog';
import { useFollowedCollections } from '../../context/FollowedCollectionsContext';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

export default function AreaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const area = AREAS.find((a) => a.id === id);
  const products = useMemo(() => (area ? getProductsForArea(area) : []), [area]);

  if (!area) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Området finns inte" />
      </View>
    );
  }

  const followed = isFollowed(area.id);

  return (
    <View style={styles.container}>
      {/* Innehållet skrollar bakom statusfältet under den gemensamma kantblurren (EdgeFade). */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title={area.name}>
          <Text style={styles.description}>{area.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.count}>{countLabel(products.length)}</Text>
            <Pill variant="filled" selected={followed} onPress={() => toggleFollowed(area.id)}>
              {followed ? 'Följer' : 'Följ'}
            </Pill>
          </View>
        </ScreenHeader>
        <View style={styles.grid}>
          <ProductGrid products={products} compact />
        </View>
      </ScrollView>
      <EdgeFade position="top" />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  description: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  grid: {
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
  },
}));
