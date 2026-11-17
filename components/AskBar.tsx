import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

// "Fråga Kroona"-sökfält. Riktig inmatning — texten skickas till Hitta som
// en router-param (`query`) och auto-skickas där som första meddelandet i
// en ny konversation (se app/(tabs)/find.tsx). Pilen är bara aktiv när
// fältet innehåller text (samma disabled-mönster som find.tsx:s egen
// skicka-knapp) — en tom flik nås fortfarande via flikfältet.
export default function AskBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

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
          placeholderTextColor={Colors.textTertiary}
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

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.screenMargin,
    marginTop: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    fontFamily: 'GoogleSansFlex_400Regular',
    padding: 0,
  },
  arrowButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  arrow: {
    color: Colors.gold,
    fontSize: 15,
  },
});
