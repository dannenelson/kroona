import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MixCard from './MixCard';
import SectionTitle from './SectionTitle';
import { spacing } from '../theme';
import { PRODUCTS } from '../data/products';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { MixSignal, signalKey, getKnownSignals } from '../lib/personalizationSignals';
import { PRODUCT_IMAGES } from '../data/productImages';

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
      PRODUCT_IMAGES.ponchoKnit,
      PRODUCT_IMAGES.bootsSuede,
      PRODUCT_IMAGES.toteWovenLeather,
      PRODUCT_IMAGES.sneakerRedRunner,
    ],
  },
  {
    id: '2',
    title: 'Höstens lager',
    subtitle: '18 produkter',
    images: [
      PRODUCT_IMAGES.backpackLeather,
      PRODUCT_IMAGES.headphonesBlack,
      PRODUCT_IMAGES.lampsBrass,
      PRODUCT_IMAGES.ponchoKnit,
    ],
  },
  {
    id: '3',
    title: 'Skandinavisk stil',
    subtitle: '31 produkter',
    images: [
      PRODUCT_IMAGES.sneakerRedRunner,
      PRODUCT_IMAGES.sneakerBlackLow,
      PRODUCT_IMAGES.headphonesRetro,
      PRODUCT_IMAGES.bootsSuede,
    ],
  },
];

const MIXES_WEEKLY: Mix[] = [
  {
    id: '4',
    title: 'Lyxig finish',
    subtitle: '15 produkter',
    images: [
      PRODUCT_IMAGES.chairLoungeDark,
      PRODUCT_IMAGES.sneakerBlackStudio,
      PRODUCT_IMAGES.sunglasses,
      PRODUCT_IMAGES.backpackLeather,
    ],
  },
  {
    id: '5',
    title: 'Sportig vardag',
    subtitle: '22 produkter',
    images: [
      PRODUCT_IMAGES.chairRattan,
      PRODUCT_IMAGES.speakerSmart,
      PRODUCT_IMAGES.backpackNavy,
      PRODUCT_IMAGES.sneakerBlackLow,
    ],
  },
  {
    id: '6',
    title: 'Vintage-fynd',
    subtitle: '9 produkter',
    images: [
      PRODUCT_IMAGES.sneakerOrange,
      PRODUCT_IMAGES.toteWovenLeather,
      PRODUCT_IMAGES.backpackLeather,
      PRODUCT_IMAGES.sneakerBlackStudio,
    ],
  },
];

// Under den här gränsen har en signal (varumärke/stil) för få matchande
// produkter för att ge MixCard ett omslag — mixen hoppas då över. Omslaget
// är en 2 × 2-mosaik (brief 43); med 3 produkter blir det en stor och två små.
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
      images: matches.slice(0, 4).map((p) => p.imageUrl),
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

type Props = {
  /** Visa även "Veckans mix" (Hem visar bara "Skapat för dig" sedan brief 43). */
  weekly?: boolean;
};

export default function MixRow({ weekly = true }: Props) {
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
      {weekly ? <MixSection title="Veckans mix" mixes={row2Mixes} /> : null}
    </>
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
    gap: spacing.gutter,
  },
});
