import { View, Text, Image, StyleSheet } from 'react-native';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';
import SectionTitle from './SectionTitle';

type PreOrSubHeader =
  | { preheader?: string; subheader?: never }
  | { preheader?: never; subheader?: string };

type Props = {
  title: string;
  images: [string, string, string, string];
} & PreOrSubHeader;

export default function DiscoveryPreviewCard({ title, preheader, subheader, images }: Props) {
  const styles = useStyles();
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

const useStyles = makeStyles((t) => ({
  section: {
    marginTop: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.screenMargin,
  },
  arrowIcon: {
    ...typography.title2,
    fontFamily: fonts.ui500, // pil-glyf: UI-typsnitt, storlek från title2
    color: t.colors.textSecondary,
  },
  rowWrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  row: {
    flexDirection: 'row',
    height: 160,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  image: {
    flex: 1,
    height: '100%',
  },
}));
