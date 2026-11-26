// Byt namn på en egen samling (redigera samlingar, Fas 0 lokalt): Sheet-steg
// med samma namnfält som Skapa samling. Spara är avstängt för tomt namn;
// Avbryt = stäng lagret (X). Snackbar "<gammalt> heter nu <nytt>" med fetstil.
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { SheetContent, useSheet, type SheetStep } from '../Sheet';
import { useSnackbar } from '../Snackbar';
import Button from '../Button';
import { MAX_NAME, useCollectionNameStyles } from './CreateCollectionStep';

export function makeRenameCollectionStep(collectionId: string, currentName: string): SheetStep {
  return {
    title: 'Byt namn',
    render: () => <RenameCollectionStep collectionId={collectionId} currentName={currentName} />,
  };
}

function RenameCollectionStep({ collectionId, currentName }: { collectionId: string; currentName: string }) {
  const styles = useCollectionNameStyles();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { renameCollection } = useUserCollections();
  const [name, setName] = useState(currentName);
  const [focused, setFocused] = useState(false);
  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && trimmed !== currentName;

  const save = () => {
    if (!canSave) return;
    renameCollection(collectionId, trimmed);
    sheet.close();
    snackbar.show({ subject: currentName, text: 'heter nu', object: trimmed });
  };

  return (
    <SheetContent
      footer={
        <Button disabled={!canSave} onPress={save}>
          Spara
        </Button>
      }
    >
      <Text style={styles.label} nativeID="rename-collection-label">
        Namn på samlingen
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        maxLength={MAX_NAME}
        placeholder="Min samling"
        placeholderTextColor={styles.placeholder.color}
        autoFocus
        selectTextOnFocus
        returnKeyType="done"
        onSubmitEditing={save}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={styles.input.color}
        accessibilityLabelledBy="rename-collection-label"
        accessibilityLabel="Namn på samlingen"
        style={[styles.input, focused && styles.inputFocused]}
      />
    </SheetContent>
  );
}
