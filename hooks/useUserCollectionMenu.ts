// Menyn för en egen samling (Fas 0, lokalt): Byt namn, Redigera innehåll, Dela,
// Ta bort samling. Delas av Sparat (långt tryck och mer-knappen på raden) och
// ⋯-menyn på Samlingsdetalj (brief 74), så att flödena bara finns på ett ställe.
// Ta bort bekräftas med systemets dialogruta och följs av en snackbar.
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserCollections } from '../context/UserCollectionsContext';
import { useSheet } from '../components/Sheet';
import { useSnackbar } from '../components/Snackbar';
import { makeRenameCollectionStep } from '../components/saved/RenameCollectionStep';
import type { ContextMenuItem } from '../components/ProductContextMenu';
import type { UserCollection } from '../types/catalog';

type Options = {
  /** Miniatyr i Dela-snackbaren. */
  thumbUri?: string;
  /** Redigera innehåll; standard öppnar Samlingsdetalj i redigeringsläge. */
  onEditContent?: () => void;
  /** Efter att samlingen tagits bort (t.ex. tillbaka från Samlingsdetalj). */
  onDeleted?: () => void;
};

export function useUserCollectionMenu(): (c: UserCollection, options?: Options) => ContextMenuItem[] {
  const router = useRouter();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { deleteCollection } = useUserCollections();

  const confirmDelete = (c: UserCollection, onDeleted?: () => void) =>
    Alert.alert(`Ta bort ${c.name}?`, 'Samlingen tas bort. Produkterna finns kvar.', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Ta bort',
        style: 'destructive',
        onPress: () => {
          deleteCollection(c.id);
          onDeleted?.();
          snackbar.show({ subject: c.name, text: 'togs bort' });
        },
      },
    ]);

  return (c, { thumbUri, onEditContent, onDeleted } = {}) => [
    { label: 'Byt namn', icon: 'edit', onPress: () => sheet.open(makeRenameCollectionStep(c.id, c.name)) },
    {
      label: 'Redigera innehåll',
      icon: 'grid',
      onPress:
        onEditContent ?? (() => router.push({ pathname: '/collection/[id]', params: { id: c.id, edit: '1' } })),
    },
    { label: 'Dela', icon: 'share', onPress: () => snackbar.show({ text: 'Delning kommer senare', thumbUri }) },
    { label: 'Ta bort samling', icon: 'trash', onPress: () => confirmDelete(c, onDeleted) },
  ];
}
