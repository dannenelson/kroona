// Spara (brief 40, 41, 61, Instagram-mönstret):
// - Tryck = snabbspar: växlar produkten i Sparade produkter, med snackbar
//   "<produkt> lades till i sparade produkter · Ändra" (Ändra öppnar kortet)
//   och vid borttagning "<produkt> togs bort från sparade produkter".
//   Produkt- och samlingsnamn i fetstil (Snackbar `subject`/`object`).
// - Långt tryck (eller "Spara i samling") = kortet "Spara i …" (Sheet
//   presentation 'card'): rubrik med länken "Ny samling" till höger, och en
//   lista där "Sparade produkter" alltid ligger överst följt av egna samlingar
//   (tryck växlar direkt, flera går). Ny samling öppnar Skapa samling i samma
//   kort; Spara där skapar samlingen och lägger produkten i den.
// När kortet stängs visas en snackbar om produkten lagts till någonstans
// ("<produkt> lades till i <samling>" eller "… i N samlingar"); bara
// borttagningar ger ingen snackbar.
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { makeStyles, spacing, radius, control, listRow, iconSize, typography } from '../../theme';
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
import Icon from '../Icon';

/** Samlingar (inkl. Sparade produkter) produkten lagts till i under ett öppet kort (id → namn). */
type Session = Map<string, string>;

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/** Sant om produkten ligger i Sparade produkter eller i någon egen samling (fylld Spara-ikon). */
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
        const visa = { label: 'Visa', onPress: () => router.push({ pathname: '/collection/[id]', params: { id } }) };
        snackbar.show(
          session.size === 1
            ? id === ALL_SAVED_ID
              ? { subject: product.name, text: ADDED_TEXT, thumbUri: product.imageUrl, badge: 'add', action: visa }
              : { subject: product.name, text: 'lades till i', object: name, thumbUri: product.imageUrl, badge: 'add', action: visa }
            : {
                subject: product.name,
                text: `lades till i ${session.size} samlingar`,
                thumbUri: product.imageUrl,
                badge: 'add',
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

// Snackbar-texterna för Sparade produkter (brief 61); namnet står före i fetstil.
const ADDED_TEXT = 'lades till i sparade produkter';
const REMOVED_TEXT = 'togs bort från sparade produkter';

/**
 * Spara-gesten (brief 41, 61), samma på alla ställen: `quickSave` (tryck) växlar
 * produkten i Sparade produkter och visar "<produkt> lades till i sparade
 * produkter · Ändra" eller "<produkt> togs bort från sparade produkter";
 * `openSheet` (långt tryck) öppnar kortet.
 * `saved` = fylld bokmärkesikon (Sparade produkter eller någon samling),
 * `inSavedProducts` = i Sparade produkter.
 */
export function useSaveActions(productId: string) {
  const snackbar = useSnackbar();
  const { isSaved, toggleSaved } = useSavedProducts();
  const openSaveSheet = useOpenSaveSheet();
  const saved = useIsSaved(productId);
  const inSavedProducts = isSaved(productId);
  const openSheet = () => openSaveSheet(productId);
  const quickSave = () => {
    toggleSaved(productId);
    const product = PRODUCTS.find((p) => p.id === productId);
    const subject = product?.name ?? 'Produkten';
    snackbar.show(
      inSavedProducts
        ? { subject, text: REMOVED_TEXT, thumbUri: product?.imageUrl, badge: 'remove' }
        : { subject, text: ADDED_TEXT, thumbUri: product?.imageUrl, badge: 'add', action: { label: 'Ändra', onPress: openSheet } },
    );
  };
  return { saved, inSavedProducts, quickSave, openSheet };
}

/**
 * Listan i kortet: Sparade produkter överst, sedan egna samlingar och
 * önskelistor (brief 75; en liten etikett före varje grupp när båda finns,
 * önskelistor med gåva). Skrollar med kortets gest.
 */
function SaveList({ productId, session }: { productId: string; session: Session }) {
  const styles = useStyles();
  const insets = useSheetInsets();
  const { savedProducts, isSaved, toggleSaved } = useSavedProducts();
  const { userCollections, addProductToCollection, removeProductFromCollection } = useUserCollections();
  const inSavedProducts = isSaved(productId);
  const sorted = sortByName(userCollections, (c) => c.name);
  const groups = [
    { label: 'Samlingar', items: sorted.filter((c) => c.kind === 'collection') },
    { label: 'Önskelistor', items: sorted.filter((c) => c.kind === 'wishlist') },
  ].filter((g) => g.items.length > 0);

  const check = (on: boolean) => (
    <View style={[styles.check, on ? styles.checkOn : styles.checkOff]}>
      {on ? <Icon name="check" color={styles.checkMark.color} size={iconSize.xs + spacing.xs} /> : null}
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
          <View style={styles.savedTile}>
            <Icon name="bookmark" color={styles.savedIcon.color} size={iconSize.md} />
          </View>
        }
        thumbRadius={radius.control}
        onPress={() => {
          toggleSaved(productId);
          if (inSavedProducts) session.delete(ALL_SAVED_ID);
          else session.set(ALL_SAVED_ID, ALL_SAVED_NAME);
        }}
        accessibilityLabel={`${ALL_SAVED_NAME}, ${inSavedProducts ? 'tillagd' : 'inte tillagd'}`}
        accessibilityState={{ checked: inSavedProducts }}
        trailing={check(inSavedProducts)}
      />
      {groups.map((g) => (
        <View key={g.label}>
          {groups.length > 1 ? <Text style={styles.groupLabel}>{g.label}</Text> : null}
          {g.items.map((c) => {
            const added = c.productIds.includes(productId);
            const images = c.productIds
              .map((id) => PRODUCTS.find((p) => p.id === id)?.imageUrl)
              .filter((u): u is string => !!u)
              .slice(0, 4);
            const n = countLabel(knownProductIds(c.productIds).length);
            const wishlist = c.kind === 'wishlist';
            return (
              <ListRow
                key={c.id}
                compact
                title={c.name}
                subtitle={wishlist ? `Önskelista · ${n}` : `${c.visibility === 'public' ? 'Publik' : 'Privat'} · ${n}`}
                subtitleIcon={wishlist ? 'gift' : undefined}
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
        </View>
      ))}
    </SheetScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  list: {
    flex: 1,
  },
  savedTile: {
    width: listRow.compactThumb,
    height: listRow.compactThumb,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
  savedIcon: {
    color: t.colors.textPrimary,
  },
  // Etikett före varje grupp när både samlingar och önskelistor finns (brief 75).
  groupLabel: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
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
