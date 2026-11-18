/**
 * ============================================================
 * TILLFÄLLIG SHOWCASE — TA BORT INNAN PRODUKTION
 * ============================================================
 * Demo-yta för att visuellt granska de nya korttyperna
 * (CollectionCard, DiscoveryMosaicCard, DiscoveryPreviewCard, LinkCard,
 * ClusterCard) innan de kopplas in på riktiga skärmar/data. All data
 * nedan är dummy (Unsplash-URL:er, påhittade titlar).
 *
 * Ta bort den här filen OCH dess mount-rad i app/(tabs)/index.tsx så
 * snart granskningen är klar. Ska ALDRIG hamna i produktion.
 * ============================================================
 */
import { View, ScrollView, Dimensions } from 'react-native';
import { makeStyles, useTheme, spacing } from '../theme';
import SectionTitle from './SectionTitle';
import CollectionCard from './CollectionCard';
import DiscoveryMosaicCard from './DiscoveryMosaicCard';
import DiscoveryPreviewCard from './DiscoveryPreviewCard';
import ClusterCard from './ClusterCard';
import LinkCard from './LinkCard';

const IMG = [
  'https://images.unsplash.com/photo-1516826957135-700dedea698c',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
  'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae',
];
const w = (i: number, width = 400) => `${IMG[i]}?w=${width}`;

const COLLECTION_CARDS: {
  id: string;
  title: string;
  curatorInitial: string;
  itemCount: number;
  updatedLabel: string;
  images: [string, string, string];
}[] = [
  { id: 'c1', title: 'Vardagsrum, mjuk minimalism', curatorInitial: 'A', itemCount: 24, updatedLabel: 'Uppdaterad förra veckan', images: [w(0), w(1), w(2)] },
  { id: 'c2', title: 'Höstens materialkänsla', curatorInitial: 'M', itemCount: 12, updatedLabel: 'Uppdaterad idag', images: [w(3), w(4), w(5)] },
  { id: 'c3', title: 'Kontor & arbetsyta', curatorInitial: 'S', itemCount: 31, updatedLabel: 'Uppdaterad för 3 dagar sedan', images: [w(6), w(7), w(8)] },
];

const LINK_CARDS = [
  { id: 'l1', title: 'Skandinavisk stil', subtitle: 'Kategori', imageUrl: w(0, 200) },
  { id: 'l2', title: 'HAY', subtitle: 'Varumärke', imageUrl: w(1, 200) },
  { id: 'l3', title: 'Senaste chatt', subtitle: 'Igår, 14:32', imageUrl: w(2, 200) },
  { id: 'l4', title: 'Minimalistisk', subtitle: 'Kategori', imageUrl: w(3, 200) },
  { id: 'l5', title: 'Rains', subtitle: 'Varumärke', imageUrl: w(4, 200) },
  { id: 'l6', title: 'Urban vardag', subtitle: 'Kategori', imageUrl: w(5, 200) },
];


const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - spacing.screenMargin * 2 - spacing.gutter) / 2;
const LIST_ITEM_WIDTH = SCREEN_WIDTH - spacing.screenMargin * 2;

export default function CardShowcase() {
  const { colors } = useTheme();
  const styles = useStyles();
  // Avatarfärger läses vid render så att de följer temat.
  const clusterAvatars: [
    { initial: string; color: string },
    { initial: string; color: string },
    { initial: string; color: string },
  ] = [
    { initial: 'J', color: colors.accent },
    { initial: 'F', color: colors.success },
    { initial: 'H', color: colors.warning },
  ];

  return (
    <View style={styles.showcaseWrapper}>
      <SectionTitle
        title="🚧 Kort-showcase (tillfällig)"
        subheader="Ta bort innan produktion — se kommentar högst upp i CardShowcase.tsx"
        style={styles.banner}
      />

      {/* CollectionCard — "en rad = alltid samma kortform", 3 instanser */}
      <View style={styles.section}>
        <SectionTitle title="Samlingar (CollectionCard)" style={styles.title} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {COLLECTION_CARDS.map((c) => <CollectionCard key={c.id} {...c} />)}
        </ScrollView>
      </View>

      {/* DiscoveryCard Mosaic — alltid ensam, egen sektion */}
      <DiscoveryMosaicCard
        title="Inspiration just nu (Mosaic)"
        images={[w(0), w(1), w(2), w(3), w(4), w(5)]}
      />

      {/* DiscoveryCard Preview — alltid ensam, egen sektion */}
      <DiscoveryPreviewCard
        title="Sök i Hitta (Preview)"
        subheader="Baserat på dina senaste chattar"
        images={[w(5), w(6), w(7), w(8)]}
      />

      {/* Samma korttyp, andra grenen — preheader istället för subheader,
          så båda varianterna syns i showcasen. */}
      <DiscoveryPreviewCard
        title="J.Lindeberg"
        preheader="MÄRKE"
        images={[w(0), w(4), w(7), w(9)]}
      />

      {/* ClusterCard — alltid ensam, egen sektion */}
      <ClusterCard
        title="Skandinavisk stil"
        avatars={clusterAvatars}
        related={['Minimalistisk', 'HAY', 'Ljusa toner']}
      />

      {/* LinkCard — tre visningssätt, samma komponent/kortform */}
      <View style={styles.section}>
        <SectionTitle title="LinkCard — Horizontal (scroll-rad)" style={styles.title} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {LINK_CARDS.map((c) => <LinkCard key={c.id} variant="horizontal" {...c} />)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionTitle title="LinkCard — Vertical (scroll-rad)" style={styles.title} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {LINK_CARDS.map((c) => <LinkCard key={c.id} variant="vertical" {...c} />)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionTitle
          title="LinkCard — Grid (samma kortform som Horizontal, 2 kolumner)"
          style={styles.title}
        />
        <View style={styles.grid}>
          {LINK_CARDS.map((c) => (
            <LinkCard key={c.id} variant="horizontal" style={{ width: GRID_ITEM_WIDTH }} {...c} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle
          title="LinkCard — List (samma kortform som Horizontal, en kolumn)"
          style={styles.title}
        />
        <View style={styles.list}>
          {LINK_CARDS.map((c) => (
            <LinkCard key={c.id} variant="horizontal" style={{ width: LIST_ITEM_WIDTH }} {...c} />
          ))}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  showcaseWrapper: {
    marginTop: spacing.xxl,
    borderTopWidth: 2, // lokal: tydlig streckad markering av tillfällig yta
    borderBottomWidth: 2, // lokal: se ovan
    borderColor: t.colors.warning,
    borderStyle: 'dashed',
    paddingVertical: spacing.lg,
  },
  banner: {
    paddingHorizontal: spacing.screenMargin,
  },
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
  grid: {
    paddingHorizontal: spacing.screenMargin,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
  },
  list: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.gutter,
  },
}));
