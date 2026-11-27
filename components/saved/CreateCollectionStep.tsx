import { useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, typography, fonts, spacing, radius, control } from '../../theme';
import { useUserCollections } from '../../context/UserCollectionsContext';
import { SheetContent, useSheet, type SheetStep } from '../Sheet';
import { useSnackbar } from '../Snackbar';
import Button from '../Button';
import SegmentedIcons from '../SegmentedIcons';
import type { UserCollection } from '../../types/catalog';

export const MAX_NAME = 40;

/** Typvalet överst i Skapa (brief 75). */
const KINDS = [
  { value: 'collection', label: 'Samling', text: 'Samling' },
  { value: 'wishlist', label: 'Önskelista', text: 'Önskelista' },
] as const;
const WISHLIST_HINT = 'Önskelistor är alltid privata. Du kan dela dem med andra senare.';

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
 * Typ överst (brief 75: Samling | Önskelista, förvald Samling; rubriken byter
 * till "Skapa önskelista"), namn (autofokus, max 40 tecken) och "Håll
 * samlingen privat" (på som standard; låst på för önskelistor). Spara skapar
 * listan, stänger lagret och visar en snackbar "<namn> skapades · Visa".
 */
function CreateCollectionStep({ onSaved }: { onSaved?: (id: string, name: string) => void }) {
  const styles = useStyles();
  const router = useRouter();
  const sheet = useSheet();
  const snackbar = useSnackbar();
  const { createCollection } = useUserCollections();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<UserCollection['kind']>('collection');
  const [isPrivate, setIsPrivate] = useState(true);
  const [focused, setFocused] = useState(false);
  const trimmed = name.trim();
  const wishlist = kind === 'wishlist';
  const selectKind = (k: UserCollection['kind']) => {
    setKind(k);
    sheet.setTitle(k === 'wishlist' ? 'Skapa önskelista' : 'Skapa samling');
  };

  const save = () => {
    if (!trimmed) return;
    const id = createCollection(trimmed, wishlist || isPrivate ? 'private' : 'public', kind);
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
      <View style={styles.kind}>
        <SegmentedIcons items={KINDS} selected={kind} onSelect={selectKind} />
      </View>
      <Text style={styles.label} nativeID="collection-name-label">
        {wishlist ? 'Namn på önskelistan' : 'Namn på samlingen'}
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        maxLength={MAX_NAME}
        placeholder={wishlist ? 'Min önskelista' : 'Min samling'}
        placeholderTextColor={styles.placeholder.color}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={save}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={styles.input.color}
        accessibilityLabelledBy="collection-name-label"
        accessibilityLabel={wishlist ? 'Namn på önskelistan' : 'Namn på samlingen'}
        style={[styles.input, focused && styles.inputFocused]}
      />
      {wishlist ? (
        <PrivateToggleRow value onChange={() => {}} locked hint={WISHLIST_HINT} />
      ) : (
        <PrivateToggleRow value={isPrivate} onChange={setIsPrivate} />
      )}
    </SheetContent>
  );
}

/**
 * Raden "Håll samlingen privat" med växel, delad av Skapa och Redigera
 * (brief 75). `locked` = på och går inte att ändra, med egen hjälptext.
 */
export function PrivateToggleRow({
  value,
  onChange,
  locked = false,
  hint = 'Bara du ser den. En publik samling kan andra se och följa.',
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  locked?: boolean;
  hint?: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleTitle}>Håll samlingen privat</Text>
        <Text style={styles.toggleHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={locked}
        accessibilityLabel="Håll samlingen privat"
        trackColor={{ false: styles.trackOff.backgroundColor, true: styles.trackOn.backgroundColor }}
        thumbColor={styles.thumb.backgroundColor}
        ios_backgroundColor={styles.trackOff.backgroundColor}
      />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  // Typvalet: vänsterställt, luft till namnfältet.
  kind: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
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

/** Namnfältets stil, delad med Redigera (EditCollectionStep). */
export const useCollectionNameStyles = useStyles;
