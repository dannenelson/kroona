// Redigera en egen samling (brief 75, ersätter Byt namn): Sheet-steg med samma
// namnfält som Skapa samling och raden "Håll samlingen privat", förinställd
// efter samlingens läge. Spara är avstängt när namnet är tomt eller inget har
// ändrats; Avbryt = stäng lagret (X). Typen går inte att ändra; en önskelista
// är alltid privat och har bara namnfältet.
// Snackbar (fetstilta namn): namnbyte "<gammalt> heter nu <nytt>", annars
// "<namn> är nu privat/publik". Ändras båda visas snackbaren för namnet.
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { SheetContent, useSheet, type SheetStep } from '../Sheet';
import { useSnackbar } from '../Snackbar';
import Button from '../Button';
import { MAX_NAME, PrivateToggleRow, useCollectionNameStyles } from './CreateCollectionStep';
import type { UserCollection } from '../../types/catalog';

export function makeEditCollectionStep(collection: UserCollection): SheetStep {
  return {
    title: collection.kind === 'wishlist' ? 'Redigera önskelista' : 'Redigera samling',
    render: () => <EditCollectionStep collection={collection} />,
  };
}

function EditCollectionStep({ collection }: { collection: UserCollection }) {
  const styles = useCollectionNameStyles();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { updateCollection } = useUserCollections();
  const [name, setName] = useState(collection.name);
  const [isPrivate, setIsPrivate] = useState(collection.visibility === 'private');
  const [focused, setFocused] = useState(false);
  const trimmed = name.trim();
  const wishlist = collection.kind === 'wishlist';
  const visibility: UserCollection['visibility'] = isPrivate ? 'private' : 'public';
  const nameChanged = trimmed !== collection.name;
  const visibilityChanged = visibility !== collection.visibility;
  const canSave = trimmed.length > 0 && (nameChanged || visibilityChanged);

  const save = () => {
    if (!canSave) return;
    updateCollection(collection.id, { name: trimmed, visibility });
    sheet.close();
    if (nameChanged) {
      snackbar.show({ subject: collection.name, text: 'heter nu', object: trimmed });
    } else {
      snackbar.show({ subject: trimmed, text: isPrivate ? 'är nu privat' : 'är nu publik' });
    }
  };

  return (
    <SheetContent
      footer={
        <Button disabled={!canSave} onPress={save}>
          Spara
        </Button>
      }
    >
      <Text style={styles.label} nativeID="edit-collection-label">
        {wishlist ? 'Namn på önskelistan' : 'Namn på samlingen'}
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        maxLength={MAX_NAME}
        placeholder={wishlist ? 'Min önskelista' : 'Min samling'}
        placeholderTextColor={styles.placeholder.color}
        returnKeyType="done"
        onSubmitEditing={save}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={styles.input.color}
        accessibilityLabelledBy="edit-collection-label"
        accessibilityLabel={wishlist ? 'Namn på önskelistan' : 'Namn på samlingen'}
        style={[styles.input, focused && styles.inputFocused]}
      />
      {wishlist ? null : <PrivateToggleRow value={isPrivate} onChange={setIsPrivate} />}
    </SheetContent>
  );
}
