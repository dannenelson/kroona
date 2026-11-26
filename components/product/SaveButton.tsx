import { useSaveActions } from '../saved/SaveSheet';
import IconButton from '../IconButton';

/**
 * Spara-knappen på Produktdetalj (brief 13, 40, 41, 69): rund ikonknapp med
 * bara bokmärket, samma storlek och glasstil som toppens tillbaka/dela
 * (`IconButton`, 44). Står på raden med produktnamnet. Tryck = snabbspar till
 * Sparade produkter (snackbar enligt brief 61), långt tryck = kortet
 * "Spara i …" (useSaveActions). Bokmärket är fyllt när produkten ligger i
 * Sparade produkter eller någon samling, med pop och lätt haptik.
 */
export default function SaveButton({ productId }: { productId: string }) {
  const { saved, inSavedProducts, quickSave, openSheet } = useSaveActions(productId);
  return (
    <IconButton
      name="bookmark"
      selected={saved}
      accessibilityLabel={inSavedProducts ? 'Sparad' : 'Spara'}
      accessibilityHint="Håll in för att spara i en samling"
      onPress={quickSave}
      onLongPress={openSheet}
    />
  );
}
