// "Lägg till i samling" (brief 36, skiss SheetLaggTill): Sheet-steg från
// produktvyn och produktmenyn. Produktchip, sök bland egna samlingar och en
// lista där varje rad växlar direkt (lägger till/tar bort, lagret står kvar).
// "Klar" (primär) stänger; "Skapa ny" (sekundär) pushar Skapa samling,
// där Spara skapar samlingen och lägger produkten i den. När lagret stängs
// visas en sammanfattande snackbar om produkten lagts till någonstans (bara
// borttagningar: ingen). Listan skrollar bakom produktchip/sök och CTA-ytan och
// blurras där (brief 39).
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, typography, fonts, spacing, radius, control, listRow, snackbar as snackbarTokens, iconSize } from '../../theme';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { PRODUCTS } from '../../data/products';
import { SheetContent, useSheet, useSheetInsets, type SheetStep } from '../Sheet';
import type { UserCollection } from '../../types/catalog';
import { useSnackbar } from '../Snackbar';
import Button from '../Button';
import ListRow from '../ListRow';
import CollectionMosaic from '../CollectionMosaic';
import { makeCreateCollectionStep } from './CreateCollectionStep';
import FindIcon from '../../assets/icons/FindIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import CheckIcon from '../../assets/icons/CheckIcon';

/** Samlingar produkten lagts till i under ett öppet lager (id → namn). */
type Session = Map<string, string>;

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

/**
 * Öppnar "Lägg till i samling" för en produkt. Används av produktvyns knapp
 * och produktmenyns "Spara i samling".
 */
export function useOpenAddToCollection() {
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const router = useRouter();
  return (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const session: Session = new Map();
    const step: SheetStep = {
      title: 'Lägg till i samling',
      // Listan skrollar, så swipe nedåt stänger inte (X räcker).
      swipeToClose: false,
      render: () => <AddToCollectionStep productId={productId} session={session} />,
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
    };
    sheet.open(step);
  };
}

function AddToCollectionStep({ productId, session }: { productId: string; session: Session }) {
  const styles = useStyles();
  const sheet = useSheet();
  const { userCollections, addProductToCollection, removeProductFromCollection } = useUserCollections();
  const [query, setQuery] = useState('');
  const product = PRODUCTS.find((p) => p.id === productId);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('sv');
    return q ? userCollections.filter((c) => c.name.toLocaleLowerCase('sv').includes(q)) : userCollections;
  }, [query, userCollections]);

  const toggle = (id: string, name: string, added: boolean) => {
    if (added) {
      removeProductFromCollection(id, productId);
      session.delete(id);
    } else {
      addProductToCollection(id, productId);
      session.set(id, name);
    }
  };

  // Skapa ny samling: nytt steg; Spara där skapar samlingen och lägger produkten i den.
  const createNew = () =>
    sheet.push(
      makeCreateCollectionStep((id, name) => {
        addProductToCollection(id, productId);
        session.set(id, name);
      }),
    );

  // Klar är primär och stänger (snackbaren visas vid stängning); Skapa ny
  // samling sekundär. Ryms de inte på en rad staplas de centrerat, Klar överst
  // (row-reverse + wrap). Utan samlingar: bara Skapa ny samling, primär.
  const hasCollections = userCollections.length > 0;
  // Klar (primär) och Skapa ny (sekundär) alltid på en rad, centrerade som grupp
  // (brief 39). Utan samlingar: bara "Skapa ny samling", primär.
  const footer = hasCollections ? (
    <View style={styles.actions}>
      <Button variant="secondary" icon={PlusIcon} onPress={createNew}>
        Skapa ny
      </Button>
      <Button onPress={sheet.close}>Klar</Button>
    </View>
  ) : (
    <Button icon={PlusIcon} onPress={createNew}>
      Skapa ny samling
    </Button>
  );

  // Fast överst: produktchip och sök. Listan skrollar bakom dem och blurras.
  const header = (
    <View>
      {product ? (
        <View style={styles.chip}>
          <Image source={{ uri: product.imageUrl }} style={styles.chipThumb} />
          <View style={styles.chipText}>
            <Text style={styles.chipName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.chipBrand} numberOfLines={1}>
              {product.brand}
            </Text>
          </View>
        </View>
      ) : null}
      {hasCollections ? (
        <View style={styles.search}>
          <FindIcon color={styles.searchIcon.color} size={iconSize.md} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Sök samlingar"
            placeholderTextColor={styles.searchIcon.color}
            returnKeyType="search"
            accessibilityLabel="Sök samlingar"
            style={styles.searchInput}
          />
        </View>
      ) : null}
    </View>
  );

  if (!hasCollections) {
    return (
      <SheetContent header={header} footer={footer}>
        <Text style={styles.empty}>Du har inga samlingar än.</Text>
      </SheetContent>
    );
  }

  return (
    <SheetContent header={header} footer={footer} edgeToEdge>
      <CollectionList productId={productId} collections={visible} onToggle={toggle} />
    </SheetContent>
  );
}

/** Listan i lagret: skrollar hela höjden, med marginaler från SheetContent. */
function CollectionList({
  productId,
  collections,
  onToggle,
}: {
  productId: string;
  collections: UserCollection[];
  onToggle: (id: string, name: string, added: boolean) => void;
}) {
  const styles = useStyles();
  const insets = useSheetInsets();
  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {collections.map((c) => {
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
            subtitle={`${countLabel(c.productIds.length)}${added ? ' · redan tillagd' : ''}`}
            thumb={
              <CollectionMosaic
                images={images}
                style={[styles.thumb, { width: listRow.compactThumb, height: listRow.compactThumb }]}
              />
            }
            thumbRadius={radius.control}
            onPress={() => onToggle(c.id, c.name, added)}
            accessibilityLabel={`${c.name}, ${added ? 'tillagd' : 'inte tillagd'}`}
            accessibilityState={{ checked: added }}
            trailing={
              <View style={[styles.check, added ? styles.checkOn : styles.checkOff]}>
                {added ? <CheckIcon color={styles.checkMark.color} size={iconSize.xs + spacing.xs} /> : null}
              </View>
            }
          />
        );
      })}
    </ScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.colors.border,
  },
  chipThumb: {
    width: snackbarTokens.thumb,
    height: snackbarTokens.thumb,
    borderRadius: radius.tile,
    borderCurve: 'continuous',
    backgroundColor: t.colors.placeholder,
  },
  chipText: {
    flex: 1,
    minWidth: 0,
  },
  chipName: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
  chipBrand: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
  search: {
    marginTop: spacing.lg,
    height: control.fieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  searchIcon: {
    color: t.colors.textTertiary,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: t.colors.textPrimary,
  },
  list: {
    flex: 1,
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
  empty: {
    ...typography.body,
    color: t.colors.textSecondary,
    textAlign: 'center',
    paddingTop: spacing.xxl,
  },
}));
