// Spara (brief 40, 41, Instagram-mönstret):
// - Tryck = snabbspar: växlar produkten i Gillade produkter, med snackbar
//   "… sparades i Gillade produkter · Ändra" (Ändra öppnar kortet).
// - Långt tryck (eller "Spara i samling") = kortet "Spara i …" (Sheet
//   presentation 'card'): rubrik med länken "Ny samling" till höger, och en
//   lista där "Gillade produkter" alltid ligger överst följt av egna samlingar
//   (tryck växlar direkt, flera går). Ny samling öppnar Skapa samling i samma
//   kort; Spara där skapar samlingen och lägger produkten i den.
// När kortet stängs visas en snackbar om produkten lagts till någonstans
// ("<produkt> sparades i <samling>" eller "… i N samlingar"); bara
// borttagningar ger ingen snackbar.
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { makeStyles, spacing, radius, control, listRow, iconSize } from '../../theme';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { ALL_SAVED_ID, ALL_SAVED_NAME } from '../../context/UserCollectionsContext';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { PRODUCTS, knownProductIds } from '../../data/products';
import { sortByName } from '../../lib/sortByName';
import { SheetContent, SheetScrollView, useSheet, useSheetInsets, type SheetStep } from '../Sheet';
import { useSnackbar } from '../Snackbar';
import ListRow from '../ListRow';
import CollectionMosaic from '../CollectionMosaic';
import { makeCreateCollectionStep } from './CreateCollectionStep';
import CheckIcon from '../../assets/icons/CheckIcon';
import BookmarkIcon from '../../assets/icons/BookmarkIcon';

/** Samlingar (inkl. Gillade produkter) produkten lagts till i under ett öppet kort (id → namn). */
type Session = Map<string, string>;

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/** Sant om produkten ligger i Gillade produkter eller i någon egen samling (fylld Spara-ikon). */
export function useIsSaved(productId: string) {
  const { isSaved } = useSavedProducts();
  const { userCollections } = useUserCollections();
  return isSaved(productId) || userCollections.some((c) => c.productIds.includes(productId));
}

/** Öppnar "Spara i …" för en produkt (långt tryck på Spara, "Spara i samling", "Ändra"). */
export function useOpenSaveSheet() {
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const router = useRouter();
  const { addProductToCollection } = useUserCollections();
  return (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const session: Session = new Map();
    sheet.open({
      title: 'Spara i …',
      presentation: 'card',
      // Ny samling: Skapa samling i samma kort (full höjd, chevron tillbaka);
      // Spara där skapar samlingen och lägger produkten i den.
      headerAction: {
        label: 'Ny samling',
        onPress: () =>
          sheet.push(
            makeCreateCollectionStep((id, name) => {
              addProductToCollection(id, productId);
              session.set(id, name);
            }),
          ),
      },
      render: () => <SaveSheetStep productId={productId} session={session} />,
      onClose: () => {
        if (session.size === 0) return;
        const [[id, name]] = [...session.entries()];
        snackbar.show(
          session.size === 1
            ? {
                text: `${product.name} sparades i ${name}`,
                thumbUri: product.imageUrl,
                action: { label: 'Visa', onPress: () => router.push({ pathname: '/collection/[id]', params: { id } }) },
              }
            : {
                text: `${product.name} sparades i ${session.size} samlingar`,
                thumbUri: product.imageUrl,
                action: { label: 'Visa', onPress: () => router.navigate('/saved') },
              },
        );
      },
    } satisfies SheetStep);
  };
}

function SaveSheetStep({ productId, session }: { productId: string; session: Session }) {
  return (
    <SheetContent edgeToEdge>
      <SaveList productId={productId} session={session} />
    </SheetContent>
  );
}

/**
 * Spara-gesten (brief 41), samma på alla ställen: `quickSave` (tryck) växlar
 * produkten i Gillade produkter och visar "… sparades i Gillade produkter ·
 * Ändra" (ingen snackbar vid borttagning); `openSheet` (långt tryck) öppnar kortet.
 * `saved` = fylld bokmärkesikon (Gillade eller någon samling), `liked` = i Gillade.
 */
export function useSaveActions(productId: string) {
  const snackbar = useSnackbar();
  const { isSaved, toggleSaved } = useSavedProducts();
  const openSaveSheet = useOpenSaveSheet();
  const saved = useIsSaved(productId);
  const liked = isSaved(productId);
  const openSheet = () => openSaveSheet(productId);
  const quickSave = () => {
    toggleSaved(productId);
    if (liked) return;
    const product = PRODUCTS.find((p) => p.id === productId);
    snackbar.show({
      text: `${product?.name ?? 'Produkten'} sparades i ${ALL_SAVED_NAME}`,
      thumbUri: product?.imageUrl,
      action: { label: 'Ändra', onPress: openSheet },
    });
  };
  return { saved, liked, quickSave, openSheet };
}

/** Listan i kortet: Gillade produkter överst, sedan egna samlingar. Skrollar med kortets gest. */
function SaveList({ productId, session }: { productId: string; session: Session }) {
  const styles = useStyles();
  const insets = useSheetInsets();
  const { savedProducts, isSaved, toggleSaved } = useSavedProducts();
  const { userCollections, addProductToCollection, removeProductFromCollection } = useUserCollections();
  const liked = isSaved(productId);

  const check = (on: boolean) => (
    <View style={[styles.check, on ? styles.checkOn : styles.checkOff]}>
      {on ? <CheckIcon color={styles.checkMark.color} size={iconSize.xs + spacing.xs} /> : null}
    </View>
  );

  return (
    <SheetScrollView
      style={styles.list}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ListRow
        compact
        title={ALL_SAVED_NAME}
        subtitle={countLabel(savedProducts.length)}
        thumb={
          <View style={styles.likedTile}>
            <BookmarkIcon color={styles.likedIcon.color} size={iconSize.md} />
          </View>
        }
        thumbRadius={radius.control}
        onPress={() => {
          toggleSaved(productId);
          if (liked) session.delete(ALL_SAVED_ID);
          else session.set(ALL_SAVED_ID, ALL_SAVED_NAME);
        }}
        accessibilityLabel={`${ALL_SAVED_NAME}, ${liked ? 'tillagd' : 'inte tillagd'}`}
        accessibilityState={{ checked: liked }}
        trailing={check(liked)}
      />
      {sortByName(userCollections, (c) => c.name).map((c) => {
        const added = c.productIds.includes(productId);
        const images = c.productIds
          .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
          .filter((u): u is string => !!u)
          .slice(0, 4);
        return (
          <ListRow
            key={c.id}
            compact
            title={c.name}
            subtitle={`${c.visibility === 'public' ? 'Publik' : 'Privat'} · ${countLabel(knownProductIds(c.productIds).length)}`}
            thumb={
              <CollectionMosaic
                images={images}
                style={[styles.thumb, { width: listRow.compactThumb, height: listRow.compactThumb }]}
              />
            }
            thumbRadius={radius.control}
            onPress={() => {
              if (added) {
                removeProductFromCollection(c.id, productId);
                session.delete(c.id);
              } else {
                addProductToCollection(c.id, productId);
                session.set(c.id, c.name);
              }
            }}
            accessibilityLabel={`${c.name}, ${added ? 'tillagd' : 'inte tillagd'}`}
            accessibilityState={{ checked: added }}
            trailing={check(added)}
          />
        );
      })}
    </SheetScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  list: {
    flex: 1,
  },
  likedTile: {
    width: listRow.compactThumb,
    height: listRow.compactThumb,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
  likedIcon: {
    color: t.colors.textPrimary,
  },
  thumb: {
    borderRadius: radius.control,
    borderCurve: 'continuous',
  },
  check: {
    width: control.checkSize,
    height: control.checkSize,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOff: {
    borderWidth: 1.5, // lokal linjetjocklek, som referensens ring
    borderColor: t.colors.textTertiary,
  },
  checkOn: {
    backgroundColor: t.colors.textPrimary,
  },
  checkMark: {
    color: t.colors.bg,
  },
}));
