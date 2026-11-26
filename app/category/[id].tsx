// Kategorivy (brief 54): Kläder, Möbler eller Begagnat (data/categories.ts).
// "Fråga om …" öppnar dialogen avgränsad till kategorin; pillarna filtrerar
// (Alla + det datan stöder). Nås från Kategorier på Hitta och Alla kategorier.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, radius, iconSize, findCards } from '../../theme';
import EdgeFade from '../../components/EdgeFade';
import ScreenHeader from '../../components/ScreenHeader';
import FilterPills from '../../components/FilterPills';
import ProductGrid from '../../components/ProductGrid';
import Icon from '../../components/Icon';
import { getCategory, getCategoryPills, getCategoryProducts } from '../../data/categories';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const category = getCategory(id);
  const products = useMemo(() => (category ? getCategoryProducts(category) : []), [category]);
  const pills = useMemo(() => (category ? getCategoryPills(category) : []), [category]);
  const [selected, setSelected] = useState('Alla');

  if (!category) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScreenHeader title="Kategorin finns inte" />
      </View>
    );
  }

  const active = pills.find((p) => p.label === selected) ?? pills[0];
  const shown = products.filter(active.match);

  return (
    <View style={styles.container}>
      {/* Innehållet skrollar bakom statusfältet under den gemensamma kantblurren (EdgeFade). */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title={category.name}>
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => router.push({ pathname: '/dialog', params: { scope: category.name } })}
              accessibilityRole="button"
              style={({ pressed }) => [styles.ask, pressed && styles.askPressed]}
            >
              <Icon name="stars" color={colors.textPrimary} size={iconSize.sm} />
              <Text style={styles.askLabel}>Fråga om {category.name}</Text>
            </Pressable>
            <Text style={styles.count}>{countLabel(shown.length)}</Text>
          </View>
        </ScreenHeader>

        {pills.length > 1 ? (
          <FilterPills
            items={pills.map((p) => p.label)}
            selected={active.label}
            onSelect={setSelected}
            style={styles.pills}
          />
        ) : null}

        <View style={styles.grid}>
          <ProductGrid products={shown} compact />
        </View>
      </ScrollView>
      <EdgeFade position="top" />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  // "Fråga om …": pill 40 hög, surface2 med kant (brief 54).
  ask: {
    height: findCards.askChipHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: t.colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  askPressed: {
    backgroundColor: t.colors.pressed,
  },
  askLabel: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
  count: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  pills: {
    marginTop: spacing.lg,
    flexGrow: 0,
  },
  grid: {
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
  },
}));
