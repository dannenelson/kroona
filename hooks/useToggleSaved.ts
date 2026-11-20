import { useRouter } from 'expo-router';
import { useSavedProducts } from '../context/SavedProductsContext';
import { ALL_SAVED_ID } from '../context/UserCollectionsContext';
import { useSnackbar } from '../components/Snackbar';
import { PRODUCTS } from '../data/products';

/**
 * Gilla/ta bort en produkt i "Gillade produkter" med bekräftelse (brief 33, 38):
 * när produkten gillas visas en snackbar "<produkt> gillades · Visa" (→ Gillade produkter).
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
      text: `${product?.name ?? 'Produkten'} gillades`,
      thumbUri: product?.imageUrl,
      action: { label: 'Visa', onPress: () => router.push({ pathname: '/collection/[id]', params: { id: ALL_SAVED_ID } }) },
    });
  };
}
