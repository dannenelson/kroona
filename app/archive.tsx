// Arkiv (brief 66): alla tidigare dialoger och sökningar, lokalt på enheten
// (Fas 0). Nås via "Visa fler" på hyllan Tidigare på Hitta. Grupperat Idag /
// Igår / Tidigare, pillar Alla / Dialoger / Sökningar. Ta bort en post: långt
// tryck → Ta bort. "Rensa allt" med bekräftelse. Synk, sök i historiken och
// namngivning är Fas 1+.
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, iconSize, touchTarget, motion } from '../theme';
import { useArchive } from '../context/ArchiveContext';
import { archiveDay, type ArchiveDay, type ArchiveEntry } from '../lib/archive';
import ScreenHeader from '../components/ScreenHeader';
import FilterPills from '../components/FilterPills';
import ArchiveRow from '../components/ArchiveRow';
import Icon from '../components/Icon';

const FILTERS = ['Alla', 'Dialoger', 'Sökningar'] as const;
type Filter = (typeof FILTERS)[number];

const DAYS: { key: ArchiveDay; title: string }[] = [
  { key: 'today', title: 'Idag' },
  { key: 'yesterday', title: 'Igår' },
  { key: 'earlier', title: 'Tidigare' },
];

const matches = (e: ArchiveEntry, f: Filter) =>
  f === 'Alla' || (f === 'Dialoger' ? e.kind === 'dialog' : e.kind === 'search');

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const { entries, remove, clear } = useArchive();
  const [filter, setFilter] = useState<Filter>('Alla');
  const shown = entries.filter((e) => matches(e, filter));
  const now = Date.now();

  const confirmClear = () =>
    Alert.alert('Rensa allt?', 'Alla sparade dialoger och sökningar tas bort från den här enheten.', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Rensa allt', style: 'destructive', onPress: clear },
    ]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        <ScreenHeader title="Arkiv" />
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="clock" color={colors.textTertiary} size={iconSize.lg * 2} />
            <Text style={styles.emptyText}>Inget här än. Dina sökningar och dialoger sparas här.</Text>
          </View>
        ) : (
          <>
            <View style={styles.toolbar}>
              <FilterPills items={FILTERS} selected={filter} onSelect={setFilter} style={styles.pills} />
            </View>
            {DAYS.map(({ key, title }) => {
              const items = shown.filter((e) => archiveDay(e.at, now) === key);
              if (items.length === 0) return null;
              return (
                <View key={key} style={styles.group}>
                  <Text style={styles.groupTitle} accessibilityRole="header">
                    {title}
                  </Text>
                  {items.map((e) => (
                    <ArchiveRow key={e.id} entry={e} onRemove={() => remove(e.id)} />
                  ))}
                </View>
              );
            })}
            {shown.length === 0 ? <Text style={styles.noHits}>Inget här just nu.</Text> : null}
            <Pressable
              accessibilityRole="button"
              onPress={confirmClear}
              style={({ pressed }) => [styles.clear, pressed && styles.clearPressed]}
            >
              <Icon name="trash" color={colors.textSecondary} size={iconSize.md} />
              <Text style={styles.clearText}>Rensa allt</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  toolbar: {
    paddingTop: spacing.lg,
  },
  pills: {
    flexGrow: 0,
  },
  group: {
    paddingTop: spacing.xl,
  },
  groupTitle: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xs,
  },
  noHits: {
    ...typography.body,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xl,
  },
  clear: {
    alignSelf: 'center',
    minHeight: touchTarget,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clearPressed: {
    opacity: motion.disabledOpacity,
  },
  clearText: {
    ...typography.body,
    color: t.colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
