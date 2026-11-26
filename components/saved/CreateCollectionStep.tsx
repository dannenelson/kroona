import { useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, typography, fonts, spacing, radius, control } from '../../theme';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { SheetContent, useSheet, type SheetStep } from '../Sheet';
import { useSnackbar } from '../Snackbar';
import Button from '../Button';

const MAX_NAME = 40;

/** Steget "Skapa samling" (brief 33), kan öppnas ensamt eller pushas i ett flöde. */
export const createCollectionStep: SheetStep = {
  title: 'Skapa samling',
  render: () => <CreateCollectionStep />,
};

/**
 * Samma steg i ett flöde (brief 36): efter Spara anropas `onSaved` med den nya
 * samlingen (t.ex. för att lägga produkten i den) i stället för den egna
 * snackbaren; lagret stängs som vanligt.
 */
export function makeCreateCollectionStep(onSaved: (id: string, name: string) => void): SheetStep {
  return { title: 'Skapa samling', render: () => <CreateCollectionStep onSaved={onSaved} /> };
}

/**
 * Namn (autofokus, max 40 tecken) och "Håll samlingen privat" (på som
 * standard). Spara skapar samlingen, stänger lagret och visar en snackbar
 * "<namn> skapades · Visa".
 */
function CreateCollectionStep({ onSaved }: { onSaved?: (id: string, name: string) => void }) {
  const styles = useStyles();
  const router = useRouter();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { createCollection } = useUserCollections();
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [focused, setFocused] = useState(false);
  const trimmed = name.trim();

  const save = () => {
    if (!trimmed) return;
    const id = createCollection(trimmed, isPrivate ? 'private' : 'public');
    if (onSaved) {
      onSaved(id, trimmed);
      sheet.close();
      return;
    }
    sheet.close();
    snackbar.show({
      // Samlingsnamnet i fetstil, kortas med ellipsis (brief 61).
      subject: trimmed,
      text: 'skapades',
      action: { label: 'Visa', onPress: () => router.push({ pathname: '/collection/[id]', params: { id } }) },
    });
  };

  return (
    <SheetContent
      footer={
        <Button disabled={!trimmed} onPress={save}>
          Spara
        </Button>
      }
    >
      <Text style={styles.label} nativeID="collection-name-label">
        Namn på samlingen
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        maxLength={MAX_NAME}
        placeholder="Min samling"
        placeholderTextColor={styles.placeholder.color}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={save}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={styles.input.color}
        accessibilityLabelledBy="collection-name-label"
        accessibilityLabel="Namn på samlingen"
        style={[styles.input, focused && styles.inputFocused]}
      />
      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <Text style={styles.toggleTitle}>Håll samlingen privat</Text>
          <Text style={styles.toggleHint}>Bara du ser den. En publik samling kan andra se och följa.</Text>
        </View>
        <Switch
          value={isPrivate}
          onValueChange={setIsPrivate}
          accessibilityLabel="Håll samlingen privat"
          trackColor={{ false: styles.trackOff.backgroundColor, true: styles.trackOn.backgroundColor }}
          thumbColor={styles.thumb.backgroundColor}
          ios_backgroundColor={styles.trackOff.backgroundColor}
        />
      </View>
    </SheetContent>
  );
}

const useStyles = makeStyles((t) => ({
  label: {
    ...typography.label,
    color: t.colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.headline,
    fontFamily: fonts.ui400,
    height: control.fieldHeight,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: 1.5, // lokal linjetjocklek, som referensens fält
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    color: t.colors.textPrimary,
  },
  placeholder: {
    color: t.colors.textTertiary,
  },
  inputFocused: {
    borderColor: t.colors.textSecondary,
  },
  toggleRow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    backgroundColor: t.colors.surface,
  },
  toggleText: {
    flex: 1,
    gap: spacing.xs,
  },
  toggleTitle: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
  toggleHint: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
  trackOn: {
    backgroundColor: t.colors.textPrimary,
  },
  trackOff: {
    backgroundColor: t.colors.pressed,
  },
  thumb: {
    backgroundColor: t.colors.bg,
  },
}));
