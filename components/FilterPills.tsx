// VIKTIGT: rent visuell/statisk filterrad i nuläget. Byter bara vilken pill
// som visas som markerad — trådar INTE igenom någon faktisk filtrering av
// samlingar/mixar/produkter på Hem-skärmen. Att koppla på riktig
// filtreringslogik (mot CollectionsRow/MixRow/DiscoverBrandsRow etc.) är
// separat, framtida arbete.
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

const FILTERS = ['Allt', 'Kläder', 'Möbler', 'Begagnat'] as const;
type Filter = (typeof FILTERS)[number];

export default function FilterPills() {
  const [active, setActive] = useState<Filter>('Allt');

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

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenMargin,
    paddingBottom: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  pillActive: {
    backgroundColor: Colors.gold,
    borderWidth: 0,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'GoogleSansFlex_500Medium',
  },
  labelActive: {
    color: Colors.background,
  },
});
