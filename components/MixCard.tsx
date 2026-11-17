import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';

type Props = {
  title: string;
  subtitle: string;
  images: string[];
};

export default function MixCard({ title, subtitle, images }: Props) {
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

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 160,
    gap: 1,
  },
  imageLarge: {
    flex: 2,
    height: '100%',
  },
  imagesSmall: {
    flex: 1,
    gap: 1,
  },
  imageSmall: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
  },
});