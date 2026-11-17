import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';

type Props = {
  id: string;
  title: string;
  curatorInitial: string;
  itemCount: number;
  updatedLabel: string;
  images: [string, string, string];
};

export default function CollectionCard({ title, curatorInitial, itemCount, updatedLabel, images }: Props) {
  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.imagesContainer}>
        <Image source={{ uri: images[0] }} style={styles.imageLarge} />
        <View style={styles.imagesSmall}>
          <Image source={{ uri: images[1] }} style={styles.imageSmall} />
          <Image source={{ uri: images[2] }} style={styles.imageSmall} />
        </View>
        {/* Kuratorns profilfoto — samma avatar-mönster som Header.tsx
            (bokstavsavatar, ingen riktig foto-data finns ännu). */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{curatorInitial}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{itemCount} objekt · {updatedLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 160,
    gap: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
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
  avatar: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBg,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    paddingTop: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'GoogleSansFlex_400Regular',
    letterSpacing: 0.3,
  },
});
