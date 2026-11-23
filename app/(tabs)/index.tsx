import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, typography, spacing } from '../../theme';
import Header from '../../components/Header';
import TextTabs from '../../components/TextTabs';
import AskBar from '../../components/AskBar';
import ContinueRow from '../../components/ContinueRow';
import MixRow from '../../components/MixRow';
import CollectionsForYouRow from '../../components/CollectionsForYouRow';
import MoreInYourStyleRow from '../../components/MoreInYourStyleRow';
import AreasRow from '../../components/AreasRow';
import PopularCollectionsRow from '../../components/PopularCollectionsRow';
import RecommendedProductsRow from '../../components/RecommendedProductsRow';
import { TAB_BAR_HEIGHT } from '../../components/CustomTabBar';

// Rent visuell filterrad, som tidigare FilterPills: byter bara vald flik och
// filtrerar ingenting ännu.
const FILTERS = ['Allt', 'Kläder', 'Möbler', 'Begagnat'] as const;
type Filter = (typeof FILTERS)[number];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [filter, setFilter] = useState<Filter>('Allt');

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xxl,
        }}
      >
        <Header />
        <TextTabs items={FILTERS} selected={filter} onSelect={setFilter} />
        <AskBar />
        {/* Dev-länk till komponentsidan, bara i utvecklingsläge.
            Flyttas eller tas bort när Hem byggs om. */}
        {__DEV__ && (
          <Link href="/components" style={styles.devLink}>
            <Text style={styles.devLinkText}>Komponenter (dev)</Text>
          </Link>
        )}
        {/* Hyllor (brief 43), uppifrån och ned. Varje hylla döljer sig själv när
            den saknar innehåll. Borttagna från Hem men kvar i filsystemet:
            ContinueDialogRow, CollectionRow ("Du följer"), DiscoverBrandsRow,
            DiscoveryMosaicCard, HeroRow, DiscoveryPreviewCard. */}
        <ContinueRow />
        <MixRow weekly={false} />
        <CollectionsForYouRow />
        <MoreInYourStyleRow />
        <AreasRow />
        <PopularCollectionsRow />
        <RecommendedProductsRow />
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  devLink: {
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
  },
  devLinkText: {
    ...typography.caption,
    color: t.colors.textTertiary,
  },
}));
