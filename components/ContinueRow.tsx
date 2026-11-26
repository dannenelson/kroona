import { useId, type ReactNode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, overlay, editorialCard } from '../theme';
import Icon, { type IconName } from './Icon';
import { useUserCollections } from '../context/UserCollectionsContext';
import { useArchive } from '../context/ArchiveContext';
import { useOpenArchiveEntry } from './ArchiveRow';
import type { ArchiveEntry } from '../lib/archive';
import { searchProducts } from '../lib/search';
import { PRODUCTS, knownProductIds } from '../data/products';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';
import CollectionMosaic from './CollectionMosaic';

/** Högst så många kort. */
const MAX_CARDS = 4;

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/** Typikon före titeln (brief 63), vit på toningen: dialog `stars`, sökning
 *  `search`, samling `folder` (produkt `tag` och företag `shield` när de finns). */
const typeIcon = (name: IconName) => <Icon name={name} color={overlay.onPhoto} size={editorialCard.typeIcon} />;

/** Stabil toning per post: samma id/text ger alltid samma toning (enkel hash). */
function gradientFor(key: string) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return overlay.continueGradients[h % overlay.continueGradients.length];
}

/** Toning i stället för bild (kort utan produktbild), diagonal. */
function GradientCover({ seed }: { seed: string }) {
  const [from, to] = gradientFor(seed);
  return (
    <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
  );
}

/** Produktbild för en arkivpost: första produkten i dialogen, första träffen i sökningen. */
function imageFor(entry: ArchiveEntry): string | undefined {
  if (entry.kind === 'dialog') {
    const id = entry.messages.flatMap((m) => m.productIds ?? [])[0];
    return PRODUCTS.find((p) => p.id === id)?.imageUrl;
  }
  return searchProducts(entry.query)[0]?.imageUrl;
}

type Card = { key: string; at: number; node: ReactNode };

/**
 * "Fortsätt där du var" (brief 43, 66 med uppföljning): liggande redaktionella
 * kort för det man senast använt, över alla typer: sparade dialoger
 * (återupptas med historiken), fritextsökningar (öppnar resultatet) och den
 * senast öppnade egna samlingen. Sorterat på senast använd, högst 4. Bild:
 * produktens (första träffen/första produkten), annars en stabil toning.
 * Hyllan döljs om inget finns att visa.
 */
export default function ContinueRow() {
  const router = useRouter();
  const openEntry = useOpenArchiveEntry();
  const { lastOpenedCollection, lastOpenedAt } = useUserCollections();
  const { entries } = useArchive();
  const boundaryId = `${lastOpenedCollection?.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const archiveCards: Card[] = entries.slice(0, MAX_CARDS).map((e) => {
    const isDialog = e.kind === 'dialog';
    const image = imageFor(e);
    return {
      key: e.id,
      at: e.at,
      node: (
        <EditorialCard
          key={e.id}
          variant="landscape"
          status={isDialog ? 'Pågående dialog' : 'Senaste sökning'}
          title={isDialog ? e.title : e.query}
          titleIcon={typeIcon(isDialog ? 'stars' : 'search')}
          subtitle={isDialog ? 'Fortsätt dialogen' : 'Visa resultat'}
          imageUrl={image}
          // Toningen härleds ur dialogens id eller sökordet (samma sökning, samma toning).
          cover={image ? undefined : <GradientCover seed={isDialog ? e.id : e.query.toLowerCase()} />}
          onPress={() => openEntry(e)}
        />
      ),
    };
  });

  const collectionImages = (lastOpenedCollection?.productIds ?? [])
    .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
    .filter((u): u is string => !!u)
    .slice(0, 4);

  const collectionCard: Card[] = lastOpenedCollection
    ? [
        {
          key: `c-${lastOpenedCollection.id}`,
          // Senast öppnad: tiden sparas sedan uppföljningen av brief 66; en
          // öppning från tidigare saknar tid (0) och hamnar sist.
          at: lastOpenedAt,
          node: (
            <EditorialCard
              key="collection"
              variant="landscape"
              status="Senast öppnad"
              title={lastOpenedCollection.name}
              titleIcon={typeIcon('folder')}
              subtitle={countLabel(knownProductIds(lastOpenedCollection.productIds).length)}
              cover={
                collectionImages.length > 0 ? (
                  <CollectionMosaic images={collectionImages} style={StyleSheet.absoluteFill} />
                ) : (
                  <GradientCover seed={lastOpenedCollection.id + lastOpenedCollection.name} />
                )
              }
              boundary={{ id: boundaryId, group: COLLECTION_BOUNDARY_GROUP }}
              onPress={() =>
                router.push({ pathname: '/collection/[id]', params: { id: lastOpenedCollection.id, b: boundaryId } })
              }
            />
          ),
        },
      ]
    : [];

  const cards = [...archiveCards, ...collectionCard].sort((a, b) => b.at - a.at).slice(0, MAX_CARDS);

  if (cards.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionTitle title="Fortsätt där du var" style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {cards.map((c) => c.node)}
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
    gap: spacing.gutter,
  },
});
