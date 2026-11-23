import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, useTheme, typography, fonts, spacing, radius } from '../theme';

// "Fråga Kroona"-sökfält. Riktig inmatning — texten skickas till Hitta som
// en router-param (`query`) och auto-skickas där som första meddelandet i
// en ny konversation (se app/(tabs)/find.tsx). Pilen är bara aktiv när
// fältet innehåller text (samma disabled-mönster som find.tsx:s egen
// skicka-knapp) — en tom flik nås fortfarande via flikfältet.
export default function AskBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { colors } = useTheme();
  const styles = useStyles();

  const handleSend = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push({ pathname: '/find', params: { query: trimmed } });
    setQuery('');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Vad letar du efter idag?"
          placeholderTextColor={colors.textTertiary}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!query.trim()}
          style={[styles.arrowButton, !query.trim() && styles.arrowButtonDisabled]}
        >
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: t.colors.surfaceRaised,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.label,
    fontFamily: fonts.ui400, // regular som tidigare
    lineHeight: undefined, // TextInput: låt plattformen styra radhöjden
    color: t.colors.textPrimary,
    padding: 0,
  },
  arrowButton: {
    width: spacing.xl,
    height: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  arrow: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
}));
