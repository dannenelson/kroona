import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  images: string[];
};

export default function MixCard({ title, subtitle, images }: Props) {
  const styles = useStyles();
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imagesContainer}>
        <Image source={{ uri: images[0] }} style={styles.imageLarge} />
        <View style={styles.imagesSmall}>
          <Image source={{ uri: images[1] }} style={styles.imageSmall} />
          <Image source={{ uri: images[2] }} style={styles.imageSmall} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    width: 220,
    backgroundColor: t.colors.surface,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 160,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  imageLarge: {
    flex: 2,
    height: '100%',
  },
  imagesSmall: {
    flex: 1,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  imageSmall: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.body,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
}));