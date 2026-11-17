import { View, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, Radius } from '../constants/spacing';
import SectionTitle from './SectionTitle';

const MOSAIC_HEIGHT = 280;

type Props = {
  title: string;
  images: [string, string, string, string, string, string];
};

export default function DiscoveryMosaicCard({ title, images }: Props) {
  return (
    <View style={styles.section}>
      <SectionTitle title={title} style={styles.sectionTitleWrapper} />
      <View style={styles.gridWrapper}>
        <View style={styles.mosaic}>
          <View style={styles.column}>
            <Image source={{ uri: images[0] }} style={[styles.tile, styles.tileTop1]} resizeMode="cover" />
            <Image source={{ uri: images[1] }} style={[styles.tile, styles.tileBottom1]} resizeMode="cover" />
          </View>
          <View style={styles.column}>
            <Image source={{ uri: images[2] }} style={[styles.tile, styles.tileTop2]} resizeMode="cover" />
            <Image source={{ uri: images[3] }} style={[styles.tile, styles.tileBottom2]} resizeMode="cover" />
          </View>
          <View style={styles.column}>
            <Image source={{ uri: images[4] }} style={[styles.tile, styles.tileTop3]} resizeMode="cover" />
            <Image source={{ uri: images[5] }} style={[styles.tile, styles.tileBottom3]} resizeMode="cover" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  sectionTitleWrapper: {
    paddingHorizontal: Spacing.screenMargin,
  },
  gridWrapper: {
    paddingHorizontal: Spacing.screenMargin,
  },
  mosaic: {
    flexDirection: 'row',
    gap: Spacing.gutter,
    height: MOSAIC_HEIGHT,
  },
  column: {
    flex: 1,
    height: '100%',
    gap: Spacing.gutter,
  },
  tile: {
    width: '100%',
    borderRadius: Radius.tile,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  // Höjdfördelning skiljer sig medvetet mellan kolumnerna — det är det som
  // ger masonry-känslan istället för ett uniformt rutnät.
  tileTop1: { flex: 0.55 },
  tileBottom1: { flex: 0.45 },
  tileTop2: { flex: 0.35 },
  tileBottom2: { flex: 0.65 },
  tileTop3: { flex: 0.65 },
  tileBottom3: { flex: 0.35 },
});
