import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { RETAILERS } from '../data/retailers';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import SectionTitle from './SectionTitle';
import ProfileCard from './ProfileCard';

const TITLE = 'Fler varumärken i din stil';

// Kurerad cap, inte en hård databasgräns. Med alla 4 default-följda
// samlingar finns upp till 16 kandidatvarumärken totalt (11 för
// Skandinavisk stil + 5 för Urban stil). 6 valdes för att raden ska kännas
// kurerad snarare än en fullständig lista.
const MAX_TILES = 6;

type BrandTile = { brand: string; count: number };

export default function DiscoverBrandsRow() {
  const { followedCollectionIds } = useFollowedCollections();

  const tiles = useMemo<BrandTile[]>(() => {
    const followedStyleValues = COLLECTIONS.filter(
      (c) => c.filter.type === 'style' && followedCollectionIds.includes(c.id)
    ).map((c) => (c.filter as { type: 'style'; value: string }).value);

    // Ingen följd stilsamling -> ingen bas att räkna "varumärken inom din
    // stil" ifrån. Döljs helt (ingen statisk fallback) — för smalt
    // use-case för att motivera en.
    if (followedStyleValues.length === 0) return [];

    const followedBrandValues = new Set(
      COLLECTIONS.filter(
        (c) => c.filter.type === 'brand' && followedCollectionIds.includes(c.id)
      ).map((c) => (c.filter as { type: 'brand'; value: string }).value)
    );

    // Grupperat per varumärke (inte per stil) så att ett varumärke som
    // förekommer i flera följda stilar bara visas en gång, med summerat
    // antal och bilden från första träffen som representativ bild.
    const byBrand = new Map<string, BrandTile>();
    for (const product of PRODUCTS) {
      if (!followedStyleValues.includes(product.style)) continue;
      if (followedBrandValues.has(product.brand)) continue;
      const existing = byBrand.get(product.brand);
      if (existing) {
        existing.count += 1;
      } else {
        byBrand.set(product.brand, { brand: product.brand, count: 1 });
      }
    }

    return Array.from(byBrand.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_TILES);
  }, [followedCollectionIds]);

  if (tiles.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionTitle title={TITLE} style={styles.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tiles.map((tile) => (
          // Tryck öppnar varumärkets Partnerdetalj (brief 29).
          <ProfileCard
            key={tile.brand}
            name={tile.brand}
            initial={tile.brand[0].toUpperCase()}
            partnerId={RETAILERS.find((r) => r.retailerType === 'brand' && r.brandName === tile.brand)?.id}
          />
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
    gap: spacing.lg,
  },
});
