import { View, Text, TouchableOpacity, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';

const THUMB_SIZE = 56;

type Props = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  variant: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function LinkCard({ title, subtitle, imageUrl, variant, style, onPress }: Props) {
  const styles = useStyles();
  if (variant === 'vertical') {
    return (
      <TouchableOpacity style={[styles.verticalWrapper, style]} onPress={onPress}>
        <Image source={{ uri: imageUrl }} style={styles.thumbnailVertical} resizeMode="cover" />
        <View style={styles.contentVertical}>
          <Text style={styles.titleVertical} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleVertical} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.horizontalCard, style]} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.thumbnailHorizontal} resizeMode="cover" />
      <View style={styles.textContainerHorizontal}>
        <Text style={styles.titleHorizontal} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitleHorizontal} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((t) => ({
  // Horizontal (Spotify-mönster): tumnagel vänster, text vertikalt centrerad höger.
  horizontalCard: {
    width: 220,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surface,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  thumbnailHorizontal: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    // radius.card (20) på en 56px yta blir nästan cirkulär — control (12)
    // har samma värde som tidigare.
    borderRadius: radius.control,
    borderCurve: 'continuous',
    backgroundColor: t.colors.surfaceRaised,
  },
  textContainerHorizontal: {
    flex: 1,
    justifyContent: 'center',
  },
  titleHorizontal: {
    ...typography.body,
    fontFamily: fonts.ui500, // vikt 500 behålls
    color: t.colors.textPrimary,
    letterSpacing: 0.2, // lokal optisk spärrning
  },
  subtitleHorizontal: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.3, // lokal optisk spärrning
  },

  // Vertical: tumnagel överst (samma bildyta-behandling som MixCard), text under.
  // Samma mönster som CollectionCard — bara bilden rundas/ramas in, texten
  // ligger plant under utan egen bakgrund/rundning.
  verticalWrapper: {
    width: 220,
  },
  thumbnailVertical: {
    width: '100%',
    height: 160,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  contentVertical: {
    paddingTop: spacing.md,
  },
  titleVertical: {
    ...typography.body,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
  },
  subtitleVertical: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
}));
