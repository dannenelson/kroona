import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles } from '../theme';

type Props = {
  /** Bild-URL:er; de fyra första används. Tom lista = neutral yta. */
  images: string[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Omslag för egna samlingar (brief 32): mosaik av de fyra första produkterna.
 * 1 bild fyller, 2 delas i höjdled, 3 = en stor och två små, 4 = 2 × 2.
 * Tunna bildskarvar som CollectionCard. Används av kortet i Sparat och som
 * cover i Samlingsdetalj (samma utseende, så zoomen mellan dem är sömlös).
 */
export default function CollectionMosaic({ images, style }: Props) {
  const styles = useStyles();
  const urls = images.slice(0, 4);
  const tile = (uri: string, i: number) => <Image key={i} source={{ uri }} style={styles.tile} resizeMode="cover" />;

  let content = null;
  if (urls.length === 1) content = tile(urls[0], 0);
  if (urls.length === 2) content = <View style={styles.row}>{urls.map(tile)}</View>;
  if (urls.length === 3) {
    content = (
      <View style={styles.row}>
        {tile(urls[0], 0)}
        <View style={styles.column}>{urls.slice(1).map((u, i) => tile(u, i + 1))}</View>
      </View>
    );
  }
  if (urls.length === 4) {
    content = (
      <View style={styles.column}>
        <View style={styles.row}>{urls.slice(0, 2).map((u, i) => tile(u, i))}</View>
        <View style={styles.row}>{urls.slice(2).map((u, i) => tile(u, i + 2))}</View>
      </View>
    );
  }
  return <View style={[styles.container, style]}>{content}</View>;
}

const useStyles = makeStyles((t) => ({
  container: {
    backgroundColor: t.colors.placeholder,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  column: {
    flex: 1,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  tile: {
    flex: 1,
  },
}));
