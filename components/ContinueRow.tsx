import { useId } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, overlay, editorialCard } from '../theme';
import Icon, { type IconName } from './Icon';
import { useUserCollections } from '../context/UserCollectionsContext';
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
 * "Fortsätt där du var" (brief 43): liggande redaktionella kort. Pågående
 * dialog (statisk dummy, som tidigare ContinueDialogRow: Hitta sparar inga
 * konversationer i Fas 0) och senast öppnade egna samling, om en finns.
 * Hyllan döljs om inget finns att visa.
 */
export default function ContinueRow() {
  const router = useRouter();
  const { lastOpenedCollection } = useUserCollections();
  const boundaryId = `${lastOpenedCollection?.id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const dialog = {
    title: 'Vinterjacka, hållbar, runt 2000 kr',
    subtitle: 'Fortsätt dialogen',
    imageUrl: PRODUCT_IMAGES.ponchoKnit,
  };

  const collectionImages = (lastOpenedCollection?.productIds ?? [])
    .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
    .filter((u): u is string => !!u)
    .slice(0, 4);

  const cards = [
    <EditorialCard
      key="dialog"
      variant="landscape"
      status="Pågående dialog"
      title={dialog.title}
      titleIcon={typeIcon('stars')}
      subtitle={dialog.subtitle}
      imageUrl={dialog.imageUrl}
      // Dialogen är en egen skärm sedan brief 53 (ingen sparad historik i Fas 0: öppnar tom).
      onPress={() => router.push('/dialog')}
    />,
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
