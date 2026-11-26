import { useId } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, overlay, editorialCard } from '../theme';
import Icon, { type IconName } from './Icon';
import { useUserCollections } from '../context/UserCollectionsContext';
import { useArchive } from '../context/ArchiveContext';
import type { ArchivedDialog } from '../lib/archive';
import { PRODUCTS, knownProductIds } from '../data/products';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import SectionTitle from './SectionTitle';
import EditorialCard from './EditorialCard';
import CollectionMosaic from './CollectionMosaic';
import { PRODUCT_IMAGES } from '../data/productImages';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/** Typikon före titeln (brief 63), vit på toningen. Typerna i Fas 0: dialog och
 *  samling (`folder`); sökning `search`, produkt `tag` och företag `shield` när de finns. */
const typeIcon = (name: IconName) => <Icon name={name} color={overlay.onPhoto} size={editorialCard.typeIcon} />;

/**
 * "Fortsätt där du var" (brief 43): liggande redaktionella kort. Senaste
 * sparade dialogen (arkivet, brief 66; öppnas med hela historiken och kan
 * fortsätta) och senast öppnade egna samling, om de finns. Hyllan döljs om
 * inget finns att visa.
 */
export default function ContinueRow() {
  const router = useRouter();
  const { lastOpenedCollection } = useUserCollections();
  const { entries } = useArchive();
  const lastDialog = entries.find((e): e is ArchivedDialog => e.kind === 'dialog');
  const boundaryId = `${lastOpenedCollection?.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // Bilden: första produkten dialogen visat, annars en neutral produktbild.
  const dialogProductId = lastDialog?.messages.flatMap((m) => m.productIds ?? [])[0];
  const dialogImage = PRODUCTS.find((p) => p.id === dialogProductId)?.imageUrl ?? PRODUCT_IMAGES.ponchoKnit;

  const collectionImages = (lastOpenedCollection?.productIds ?? [])
    .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
    .filter((u): u is string => !!u)
    .slice(0, 4);

  const cards = [
    lastDialog ? (
      <EditorialCard
        key="dialog"
        variant="landscape"
        status="Pågående dialog"
        title={lastDialog.title}
        titleIcon={typeIcon('stars')}
        subtitle="Fortsätt dialogen"
        imageUrl={dialogImage}
        // Återupptar den sparade dialogen (brief 66).
        onPress={() => router.push({ pathname: '/dialog', params: { id: lastDialog.id } })}
      />
    ) : null,
    lastOpenedCollection ? (
      <EditorialCard
        key="collection"
        variant="landscape"
        status="Senast öppnad"
        title={lastOpenedCollection.name}
        titleIcon={typeIcon('folder')}
        subtitle={countLabel(knownProductIds(lastOpenedCollection.productIds).length)}
        cover={<CollectionMosaic images={collectionImages} style={StyleSheet.absoluteFill} />}
        boundary={{ id: boundaryId, group: COLLECTION_BOUNDARY_GROUP }}
        onPress={() =>
          router.push({ pathname: '/collection/[id]', params: { id: lastOpenedCollection.id, b: boundaryId } })
        }
      />
    ) : null,
  ].filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionTitle title="Fortsätt där du var" style={styles.title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {cards}
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
