import { View, Image, StyleSheet } from 'react-native';
import { makeStyles, spacing, radius } from '../theme';
import SectionTitle from './SectionTitle';

const MOSAIC_HEIGHT = 280;

type Props = {
  title: string;
  images: [string, string, string, string, string, string];
};

export default function DiscoveryMosaicCard({ title, images }: Props) {
  const styles = useStyles();
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

const useStyles = makeStyles((t) => ({
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitleWrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  gridWrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  mosaic: {
    flexDirection: 'row',
    gap: spacing.gutter,
    height: MOSAIC_HEIGHT,
  },
  column: {
    flex: 1,
    height: '100%',
    gap: spacing.gutter,
  },
  tile: {
    width: '100%',
    borderRadius: radius.tile,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  // Höjdfördelning skiljer sig medvetet mellan kolumnerna — det är det som
  // ger masonry-känslan istället för ett uniformt rutnät.
  tileTop1: { flex: 0.55 },
  tileBottom1: { flex: 0.45 },
  tileTop2: { flex: 0.35 },
  tileBottom2: { flex: 0.65 },
  tileTop3: { flex: 0.65 },
  tileBottom3: { flex: 0.35 },
}));
