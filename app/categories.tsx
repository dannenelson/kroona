// Alla kategorier (brief 54): en rad per kategori med bild, namn, antal och
// chevron. Inga undernivåer än. Nås via "Visa fler" på Kategorier (Hitta).
import { Image, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, spacing, radius, listRow } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import ListRow from '../components/ListRow';
import ChevronIcon from '../assets/icons/ChevronIcon';
import { CATEGORIES, getCategoryProducts } from '../data/categories';

const countLabel = (n: number) => `${n} ${n === 1 ? 'produkt' : 'produkter'}`;

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <ScreenHeader title="Kategorier" />
        <View style={styles.list}>
          {CATEGORIES.map((c) => {
            const products = getCategoryProducts(c);
            return (
              <ListRow
                key={c.id}
                title={c.name}
                subtitle={countLabel(products.length)}
                thumb={<Image source={{ uri: products[0]?.imageUrl ?? c.image }} style={styles.thumb} />}
                thumbRadius={radius.card}
                trailing={<ChevronIcon color={colors.textSecondary} />}
                onPress={() => router.push({ pathname: '/category/[id]', params: { id: c.id } })}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  list: {
    marginTop: spacing.lg,
  },
  thumb: {
    width: listRow.thumb,
    height: listRow.thumb,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    backgroundColor: t.colors.placeholder,
  },
}));
