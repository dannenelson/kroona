import { useRouter } from 'expo-router';
import { useSavedProducts } from '../context/SavedProductsContext';
import { ALL_SAVED_ID, ALL_SAVED_NAME } from '../context/UserCollectionsContext';
import { useSnackbar } from '../components/Snackbar';
import { PRODUCTS } from '../data/products';

/**
 * Spara/ta bort en produkt i "Alla sparade" med bekräftelse (brief 33): när
 * produkten sparas visas en snackbar "<produkt> sparades i Alla sparade · Visa".
 * Används av produktkortets kontextmeny och Spara-knappen på Produktdetalj.
 */
export function useToggleSaved() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { isSaved, toggleSaved } = useSavedProducts();
  return (productId: string) => {
    const saving = !isSaved(productId);
    toggleSaved(productId);
    if (!saving) return;
    const product = PRODUCTS.find((p) => p.id === productId);
    snackbar.show({
      text: `${product?.name ?? 'Produkten'} sparades i ${ALL_SAVED_NAME}`,
      thumbUri: product?.imageUrl,
      action: { label: 'Visa', onPress: () => router.push({ pathname: '/collection/[id]', params: { id: ALL_SAVED_ID } }) },
    });
  };
}
