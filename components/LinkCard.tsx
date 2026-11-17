import { View, Text, TouchableOpacity, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';

type Props = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  variant: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function LinkCard({ title, subtitle, imageUrl, variant, style, onPress }: Props) {
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

const styles = StyleSheet.create({
  // Horizontal (Spotify-mönster): tumnagel vänster, text vertikalt centrerad höger.
  horizontalCard: {
    width: 220,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.card,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    padding: 12,
    gap: 12,
  },
  thumbnailHorizontal: {
    width: 56,
    height: 56,
    // Radius.card (20) på en 56px yta blir nästan cirkulär — ett dedikerat
    // mindre värde används här istället. Kandidat för en framtida
    // Radius.thumbnail-token.
    borderRadius: 12,
    backgroundColor: Colors.cardBgAlt,
  },
  textContainerHorizontal: {
    flex: 1,
    justifyContent: 'center',
  },
  titleHorizontal: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_500Medium',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  subtitleHorizontal: {
    color: Colors.textSecondary,
    fontFamily: 'GoogleSansFlex_400Regular',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.3,
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
    borderRadius: Radius.card,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  contentVertical: {
    paddingTop: 12,
  },
  titleVertical: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitleVertical: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
  },
});
