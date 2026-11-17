import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MixCard from './MixCard';
import SectionTitle from './SectionTitle';
import { Spacing } from '../constants/spacing';
import { PRODUCTS } from '../data/products';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { MixSignal, signalKey, getKnownSignals } from '../lib/personalizationSignals';

type Mix = {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
};

// Statisk fallback-data — används ENDAST när den riktiga, personaliserade
// listan för en rad blir tom (t.ex. inget sparat/följt alls, eller — för
// rad 2 — allt i katalogen redan känt). Oförändrat innehåll/id:n.
const MIXES: Mix[] = [
  {
    id: '1',
    title: 'Minimalistisk vardag',
    subtitle: '24 produkter',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
    ],
  },
  {
    id: '2',
    title: 'Höstens lager',
    subtitle: '18 produkter',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=200',
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=200',
    ],
  },
  {
    id: '3',
    title: 'Skandinavisk stil',
    subtitle: '31 produkter',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200',
    ],
  },
];

const MIXES_WEEKLY: Mix[] = [
  {
    id: '4',
    title: 'Lyxig finish',
    subtitle: '15 produkter',
    images: [
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=200',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200',
    ],
  },
  {
    id: '5',
    title: 'Sportig vardag',
    subtitle: '22 produkter',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=200',
    ],
  },
  {
    id: '6',
    title: 'Vintage-fynd',
    subtitle: '9 produkter',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200',
    ],
  },
];

// Under den här gränsen har en signal (varumärke/stil) för få matchande
// produkter för att fylla MixCards tre fasta bild-slots (images[0..2],
// ingen fallback där) — mixen hoppas då över istället för att visa trasiga
// bildplatser.
const MIN_PRODUCTS_FOR_MIX = 3;

type MixBuildResult = { mix: Mix; count: number };

function buildMixFromSignal(signal: MixSignal): MixBuildResult | null {
  const matches = PRODUCTS.filter((p) =>
    signal.type === 'brand' ? p.brand === signal.value : p.style === signal.value
  );
  if (matches.length < MIN_PRODUCTS_FOR_MIX) return null;
  return {
    count: matches.length,
    mix: {
      id: signalKey(signal),
      title: signal.type === 'style' ? `${signal.value} stil` : signal.value,
      subtitle: `${matches.length} produkter`,
      images: matches.slice(0, 3).map((p) => p.imageUrl),
    },
  };
}

function MixSection({
  title,
  subtitle,
  mixes,
}: {
  title: string;
  subtitle?: string;
  mixes: Mix[];
}) {
  return (
    <View style={styles.section}>
      <SectionTitle title={title} subheader={subtitle} style={styles.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {mixes.map((mix) => (
          <MixCard key={mix.id} {...mix} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function MixRow() {
  const { savedProducts } = useSavedProducts();
  const { followedCollectionIds } = useFollowedCollections();

  const knownSignals = useMemo(
    () => getKnownSignals(followedCollectionIds, savedProducts),
    [followedCollectionIds, savedProducts]
  );

  // Rad 1 "Skapat för dig": en mix per känd signal (sparat/följt). Ingen
  // cap behövs — naturligt begränsad av antal följda samlingar + distinkta
  // sparade varumärken/stilar. Faller tillbaka till statisk MIXES om
  // användaren varken sparat eller följer något.
  const row1Mixes = useMemo(() => {
    const personalized = knownSignals
      .map(buildMixFromSignal)
      .filter((r): r is MixBuildResult => r !== null)
      .map((r) => r.mix);
    return personalized.length > 0 ? personalized : MIXES;
  }, [knownSignals]);

  // Rad 2 "Veckans mix": hela katalogens varumärken/stilar minus redan
  // kända signaler, rankat på antal matchande produkter, topp 4. Faller
  // tillbaka till statisk MIXES_WEEKLY om upptäckt-listan blir tom (t.ex.
  // användaren har sparat/följt bokstavligen allt).
  const row2Mixes = useMemo(() => {
    const knownKeys = new Set(knownSignals.map(signalKey));

    const allBrandSignals: MixSignal[] = Array.from(new Set(PRODUCTS.map((p) => p.brand))).map(
      (value) => ({ type: 'brand', value })
    );
    const allStyleSignals: MixSignal[] = Array.from(new Set(PRODUCTS.map((p) => p.style))).map(
      (value) => ({ type: 'style', value })
    );

    const discovered = [...allBrandSignals, ...allStyleSignals]
      .filter((signal) => !knownKeys.has(signalKey(signal)))
      .map(buildMixFromSignal)
      .filter((r): r is MixBuildResult => r !== null)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((r) => r.mix);

    return discovered.length > 0 ? discovered : MIXES_WEEKLY;
  }, [knownSignals]);

  return (
    <>
      <MixSection title="Skapat för dig" subtitle="Uppdateras varje vecka" mixes={row1Mixes} />
      <MixSection title="Veckans mix" mixes={row2Mixes} />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  title: {
    paddingHorizontal: Spacing.screenMargin,
  },
  scroll: {
    paddingHorizontal: Spacing.screenMargin,
    gap: Spacing.gutter,
  },
});
