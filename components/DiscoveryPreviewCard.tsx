import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, Radius } from '../constants/spacing';
import SectionTitle from './SectionTitle';

type PreOrSubHeader =
  | { preheader?: string; subheader?: never }
  | { preheader?: never; subheader?: string };

type Props = {
  title: string;
  images: [string, string, string, string];
} & PreOrSubHeader;

export default function DiscoveryPreviewCard({ title, preheader, subheader, images }: Props) {
  // Pil = "fördjupa dig", inte en sökfunktion. Text-glyf, samma
  // lättviktsmönster som +/✓/♥ på följ-/spara-knapparna i appen.
  const icon = <Text style={styles.arrowIcon}>→</Text>;

  return (
    <View style={styles.section}>
      {preheader ? (
        <SectionTitle title={title} preheader={preheader} icon={icon} style={styles.header} />
      ) : (
        <SectionTitle title={title} subheader={subheader} icon={icon} style={styles.header} />
      )}
      <View style={styles.rowWrapper}>
        <View style={styles.row}>
          <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
          <Image source={{ uri: images[1] }} style={styles.image} resizeMode="cover" />
          <Image source={{ uri: images[2] }} style={styles.image} resizeMode="cover" />
          <Image source={{ uri: images[3] }} style={styles.image} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  header: {
    paddingHorizontal: Spacing.screenMargin,
  },
  arrowIcon: {
    color: Colors.textSecondary,
    fontSize: 20,
    fontFamily: 'GoogleSansFlex_500Medium',
  },
  rowWrapper: {
    paddingHorizontal: Spacing.screenMargin,
  },
  row: {
    flexDirection: 'row',
    height: 160,
    gap: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  image: {
    flex: 1,
    height: '100%',
  },
});
