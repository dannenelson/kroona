// Sökläget (brief 53): fullskärm med aktivt fält. Två rader speglar texten:
// "Sök efter" (Sökresultat direkt) och "Fråga om" (Dialog med texten som
// första fråga). Därunder förslag som matchar texten, eller senaste sökningar
// när fältet är tomt. Nås från fältet på Hem, Hitta och Sökresultat.
import { useEffect, useRef, useState, type ComponentRef, type ComponentType } from 'react';
import { Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, fonts, spacing, radius, control, iconSize, touchTarget } from '../theme';
import FindIcon from '../assets/icons/FindIcon';
import StarIcon from '../assets/icons/StarIcon';
import CloseIcon from '../assets/icons/CloseIcon';
import { searchSuggestions } from '../lib/search';
import { addRecentSearch, loadRecentSearches } from '../lib/recentSearches';

type IconProps = { color: string; size?: number };

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [text, setText] = useState(typeof q === 'string' ? q : '');
  const [recent, setRecent] = useState<string[]>([]);
  const trimmed = text.trim();

  useEffect(() => {
    loadRecentSearches().then(setRecent);
  }, []);

  // Sökläget ersätter sig självt med målet, så att tillbaka leder dit man kom ifrån.
  const search = (term: string) => {
    const t = term.trim();
    if (!t) return;
    addRecentSearch(t);
    Keyboard.dismiss();
    router.replace({ pathname: '/results', params: { q: t } });
  };
  const ask = (term: string) => {
    const t = term.trim();
    if (!t) return;
    Keyboard.dismiss();
    router.replace({ pathname: '/dialog', params: { query: t } });
  };

  const suggestions = trimmed ? searchSuggestions(trimmed) : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.fieldRow}>
        <View style={styles.field}>
          <FindIcon color={colors.textSecondary} size={iconSize.md} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Fråga eller sök"
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.textPrimary}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => search(text)}
            autoCorrect={false}
          />
          {text.length > 0 ? (
            <Pressable
              onPress={() => {
                setText('');
                inputRef.current?.focus();
              }}
              hitSlop={(touchTarget - iconSize.md) / 2}
              accessibilityRole="button"
              accessibilityLabel="Rensa"
              style={styles.clear}
            >
              <CloseIcon color={colors.bg} size={iconSize.xs} />
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={spacing.sm}>
          <Text style={styles.cancel}>Avbryt</Text>
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
        {trimmed ? (
          <>
            <ActionRow
              icon={FindIcon}
              title={`Sök efter ”${trimmed}”`}
              subtitle="Visa träffar direkt"
              onPress={() => search(trimmed)}
            />
            <ActionRow
              icon={StarIcon}
              title={`Fråga om ”${trimmed}”`}
              subtitle="Få hjälp att välja"
              onPress={() => ask(trimmed)}
            />
            {suggestions.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Förslag</Text>
                {suggestions.map((s) => (
                  <TermRow key={s} term={s} onPress={() => { setText(s); search(s); }} />
                ))}
              </View>
            ) : null}
          </>
        ) : recent.length > 0 ? (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Senaste sökningar</Text>
            {recent.map((s) => (
              <TermRow key={s} term={s} onPress={() => { setText(s); search(s); }} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function ActionRow({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowIcon}>
        <Icon color={colors.textPrimary} size={iconSize.md} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function TermRow({ term, onPress }: { term: string; onPress: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Sök efter ${term}`}
      style={({ pressed }) => [styles.termRow, pressed && styles.rowPressed]}
    >
      <FindIcon color={colors.textSecondary} size={iconSize.sm} />
      <Text style={styles.term} numberOfLines={1}>
        {term}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
  },
  field: {
    flex: 1,
    height: control.fieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: t.colors.surfaceRaised,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    ...typography.body,
    lineHeight: undefined, // TextInput: låt plattformen styra radhöjden
    color: t.colors.textPrimary,
    padding: 0,
  },
  clear: {
    width: iconSize.md,
    height: iconSize.md,
    borderRadius: radius.full,
    backgroundColor: t.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  rowPressed: {
    backgroundColor: t.colors.pressed,
  },
  rowIcon: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2, // lokal optisk luft: titel → undertext
  },
  rowTitle: {
    ...typography.headline,
    color: t.colors.textPrimary,
  },
  rowSubtitle: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  group: {
    marginTop: spacing.lg,
  },
  groupTitle: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xs,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touchTarget,
    paddingHorizontal: spacing.screenMargin,
  },
  term: {
    flex: 1,
    ...typography.body,
    fontFamily: fonts.ui400,
    color: t.colors.textPrimary,
  },
}));
