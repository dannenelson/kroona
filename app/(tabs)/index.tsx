import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import Header from '../../components/Header';
import FilterPills from '../../components/FilterPills';
import AskBar from '../../components/AskBar';
import ContinueDialogRow from '../../components/ContinueDialogRow';
import CollectionsRow from '../../components/CollectionRow';
import PopularCollectionsRow from '../../components/PopularCollectionsRow';
import RecommendedProductsRow from '../../components/RecommendedProductsRow';
import DiscoverBrandsRow from '../../components/DiscoverBrandsRow';
import DiscoveryMosaicCard from '../../components/DiscoveryMosaicCard';
import HeroRow from '../../components/HeroRow';
import DiscoveryPreviewCard from '../../components/DiscoveryPreviewCard';
import { TAB_BAR_HEIGHT } from '../../components/CustomTabBar';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}
      >
        <Header />
        <FilterPills />
        <AskBar />
        <ContinueDialogRow />
        <CollectionsRow />
        <PopularCollectionsRow />
        <RecommendedProductsRow />
        <DiscoverBrandsRow />
        <DiscoveryMosaicCard
          title="Inspiration just nu"
          images={[
            'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
            'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400',
            'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
          ]}
        />
        <HeroRow />
        <DiscoveryPreviewCard
          title="Sök i Hitta"
          subheader="Baserat på dina senaste chattar"
          images={[
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
            'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
