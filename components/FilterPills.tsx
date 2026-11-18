// VIKTIGT: rent visuell/statisk filterrad i nuläget. Byter bara vilken pill
// som visas som markerad — trådar INTE igenom någon faktisk filtrering av
// samlingar/mixar/produkter på Hem-skärmen. Att koppla på riktig
// filtreringslogik (mot CollectionsRow/MixRow/DiscoverBrandsRow etc.) är
// separat, framtida arbete.
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeStyles, typography, spacing, radius } from '../theme';

const FILTERS = ['Allt', 'Kläder', 'Möbler', 'Begagnat'] as const;
type Filter = (typeof FILTERS)[number];

export default function FilterPills() {
  const [active, setActive] = useState<Filter>('Allt');
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => setActive(filter)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{filter}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  pillActive: {
    backgroundColor: t.colors.accent,
    borderWidth: 0,
  },
  label: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  labelActive: {
    color: t.colors.onAccent,
  },
}));
