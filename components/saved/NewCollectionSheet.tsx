import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing, radius, touchTarget } from '../../theme';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { UserCollection } from '../../types/catalog';
import TextTabs from '../TextTabs';
import Pill from '../Pill';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, visibility: UserCollection['visibility']) => void;
};

const VISIBILITY = ['Privat', 'Publik'] as const;

/**
 * Lager för "Ny samling" (brief 32): namn och Privat/Publik. Inbyggd Modal
 * (inget nytt paket) som glider upp från botten över temats scrim; Minska
 * rörelse tonar i stället. Tangentbordet skjuter upp lagret.
 */
export default function NewCollectionSheet({ visible, onClose, onCreate }: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState<(typeof VISIBILITY)[number]>('Privat');

  // Börja om varje gång lagret öppnas.
  useEffect(() => {
    if (visible) {
      setName('');
      setVisibility('Privat');
    }
  }, [visible]);

  const canCreate = name.trim().length > 0;
  const create = () => {
    if (!canCreate) return;
    onCreate(name, visibility === 'Publik' ? 'public' : 'private');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Stäng" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Text style={styles.title}>Ny samling</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Namn"
            placeholderTextColor={styles.placeholder.color}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={create}
            style={styles.input}
            accessibilityLabel="Samlingens namn"
          />
          <TextTabs items={VISIBILITY} selected={visibility} onSelect={setVisibility} style={styles.tabs} />
          <View style={styles.actions}>
            <Pill variant="filled" onPress={onClose}>
              Avbryt
            </Pill>
            <Pill variant="filled" selected disabled={!canCreate} onPress={create}>
              Skapa
            </Pill>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles((t) => ({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: t.colors.scrim,
  },
  sheet: {
    backgroundColor: t.colors.surfaceRaised,
    borderTopLeftRadius: radius.lifted,
    borderTopRightRadius: radius.lifted,
    borderCurve: 'continuous',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: t.colors.textPrimary,
  },
  input: {
    ...typography.body,
    height: touchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    backgroundColor: t.colors.surface,
    color: t.colors.textPrimary,
  },
  placeholder: {
    color: t.colors.textTertiary,
  },
  tabs: {
    flexGrow: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
}));
