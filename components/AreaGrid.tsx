import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, radius, findCards } from '../theme';
import { AREAS } from '../data/areas';
import { getProductsForArea } from '../lib/catalog';
import EditorialCard from './EditorialCard';
import type { Area } from '../types/catalog';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/** Områden med minst en produkt; första produktens bild är omslaget. */
export const AREA_ITEMS = AREAS.map((area) => ({ area, products: getProductsForArea(area) })).filter(
  (x) => x.products.length > 0,
);

/**
 * Områdeskort i 2-kolumnsgrid (brief 53, 54): 92 höga, bredden räknas fram
 * inom skärmmarginalen, titel + "N produkter" vänsterställda på bilden.
 * Tryck öppnar Områdesdetalj. Används på Hitta (sex första) och Alla områden.
 */
export default function AreaGrid({ limit }: { limit?: number }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - spacing.screenMargin * 2 - spacing.gutter) / 2;
  const items = limit ? AREA_ITEMS.slice(0, limit) : AREA_ITEMS;
  return (
    <View style={styles.grid}>
      {items.map(({ area, products }) => (
        <EditorialCard
          key={area.id}
          variant="portraitSmall"
          size={{ width: cardWidth, height: findCards.areaHeight, radius: radius.editorialSmall }}
          align="start"
          title={area.name}
          subtitle={countLabel(products.length)}
          imageUrl={products[0]?.imageUrl}
          onPress={() => openArea(router, area)}
        />
      ))}
    </View>
  );
}

export function openArea(router: ReturnType<typeof useRouter>, area: Area) {
  router.push({ pathname: '/area/[id]', params: { id: area.id } });
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
});
