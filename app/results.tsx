// Sökresultat (brief 53): träffar för en fritextsökning (param `q`) eller en
// idé från Hitta (param `idea`, data/ideas.ts). Fältet överst öppnar sökläget
// igen; filterpillar Alla / Nytt / Begagnat; bannern leder till dialogen med
// söktermen som både första fråga och avgränsning (scope). Pris och Stil byggs inte än.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, radius, iconSize, touchTarget } from '../theme';
import IconButton from '../components/IconButton';
import AskBar from '../components/AskBar';
import FilterPills from '../components/FilterPills';
import ProductGrid from '../components/ProductGrid';
import Button from '../components/Button';
import StarIcon from '../assets/icons/StarIcon';
import Icon from '../components/Icon';
import ChevronIcon from '../assets/icons/ChevronIcon';
import { getIdea } from '../data/ideas';
import { searchProducts } from '../lib/search';
import { getProductsForFilter, hasUsedOffer } from '../lib/catalog';
import type { Product } from '../types/product';

// "Nytt" och "Begagnat" är skick: finns nytt erbjudande, finns begagnat
// erbjudande (en produkt kan ha båda).
const FILTERS = ['Alla', 'Nytt', 'Begagnat'] as const;
type Filter = (typeof FILTERS)[number];
const MATCH: Record<Filter, (p: Product) => boolean> = {
  Alla: () => true,
  Nytt: (p) => !p.isUsed,
  Begagnat: (p) => hasUsedOffer(p.id),
};

const hitsLabel = (n: number) => `${n} ${n === 1 ? 'träff' : 'träffar'}`;

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ q?: string; idea?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const [filter, setFilter] = useState<Filter>('Alla');

  const idea = getIdea(params.idea);
  const term = idea?.title ?? (typeof params.q === 'string' ? params.q.trim() : '');
  const all = useMemo(
    () => (idea ? getProductsForFilter(idea.filter) : searchProducts(term)),
    [idea, term],
  );
  const shown = all.filter(MATCH[filter]);

  const openDialog = (scoped: boolean) =>
    router.push({ pathname: '/dialog', params: scoped ? { query: term, scope: term } : { query: term } });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <IconButton icon="back-arrow" tone="theme" accessibilityLabel="Tillbaka" onPress={() => router.back()} />
        {/* Sök om (brief 54): sökläget ERSÄTTER resultatet, och den nya sökningen
            ersätter i sin tur sökläget, så att tillbaka går dit man var före
            första sökningen. "Avbryt" i sökläget återställer detta resultat. */}
        <AskBar
          inline
          icon="search"
          value={term}
          style={styles.field}
          onPress={() =>
            router.replace({
              pathname: '/search',
              params: idea ? { q: term, fromIdea: idea.id } : { q: term, fromQ: term },
            })
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        {all.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Inga träffar på ”{term}”</Text>
            <Button variant="secondary" icon={StarIcon} onPress={() => openDialog(false)}>
              {`Fråga om ”${term}”`}
            </Button>
          </View>
        ) : (
          <>
            <FilterPills items={FILTERS} selected={filter} onSelect={setFilter} style={styles.pills} />
            <Text style={styles.count}>{hitsLabel(shown.length)}</Text>

            <Pressable
              onPress={() => openDialog(true)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
            >
              <View style={styles.bannerIcon}>
                <Icon name="stars" color={colors.textPrimary} size={iconSize.md} />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Osäker på vad du behöver?</Text>
                <Text style={styles.bannerSubtitle} numberOfLines={2}>
                  Få hjälp att välja till ”{term}”
                </Text>
              </View>
              <ChevronIcon color={colors.textSecondary} />
            </Pressable>

            {shown.length > 0 ? (
              <View style={styles.grid}>
                <ProductGrid products={shown} compact />
              </View>
            ) : (
              <Text style={styles.filterEmpty}>Inga träffar med det filtret.</Text>
            )}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
  },
  field: {
    flex: 1,
  },
  pills: {
    marginTop: spacing.sm,
    flexGrow: 0,
  },
  count: {
    ...typography.caption,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.lg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.screenMargin,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    backgroundColor: t.colors.surface,
  },
  bannerPressed: {
    backgroundColor: t.colors.pressed,
  },
  bannerIcon: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    backgroundColor: t.colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    gap: 2, // lokal optisk luft: titel → undertext
  },
  bannerTitle: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
  bannerSubtitle: {
    ...typography.caption,
    color: t.colors.textSecondary,
  },
  grid: {
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
  },
  filterEmpty: {
    ...typography.body,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.xl,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.headline,
    color: t.colors.textPrimary,
    textAlign: 'center',
  },
}));
