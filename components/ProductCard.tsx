import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';
import { useSavedProducts } from '../context/SavedProductsContext';

type Props = {
    id: string;
    brand: string;
    name: string;
    price: number;
    imageUrl: string;
    sustainabilityScore: number;
    isNew?: boolean;
    isUsed?: boolean;
    featured?: boolean;
    aspectRatio?: number;
    // När satt: bilden får en FAST höjd istället för aspectRatio-driven
    // masonry-höjd. Till för horisontella rader (t.ex. RecommendedProductsRow)
    // där alla kort ska ha samma höjd — masonry hör bara hemma i grid-kontext
    // (ProductGrid/Flöde/Sparat), inte i en scroll-rad.
    fixedHeight?: number;
  };

  export default function ProductCard({
    id,
    brand,
    name,
    price,
    imageUrl,
    sustainabilityScore,
    isNew,
    isUsed,
    featured,
    aspectRatio,
    fixedHeight,
  }: Props) {
  const sustainColor =
    sustainabilityScore >= 4 ? Colors.sustainGreen : Colors.sustainAmber;

  const { isSaved, toggleSaved } = useSavedProducts();
  const saved = isSaved(id);

  return (
    <TouchableOpacity style={[styles.card, featured && styles.cardFeatured]}>
      <View
        style={[
          styles.imageContainer,
          fixedHeight ? { height: fixedHeight } : { aspectRatio: aspectRatio ?? 3 / 4 },
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge — Nyhet eller Begagnad */}
        {(isNew || isUsed) && (
          <View style={[styles.badge, isUsed && styles.badgeUsed]}>
            <Text style={styles.badgeText}>{isUsed ? 'Begagnad' : 'Nyhet'}</Text>
          </View>
        )}

        {/* Spara-knapp */}
        <TouchableOpacity style={styles.saveButton} onPress={() => toggleSaved(id)}>
          <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>
            {saved ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.infoTop}>
          <Text style={styles.brand}>{brand}</Text>
          <View style={[styles.sustainBadge, { borderColor: sustainColor }]}>
            <View style={[styles.sustainDot, { backgroundColor: sustainColor }]} />
            <Text style={[styles.sustainScore, { color: sustainColor }]}>
              {sustainabilityScore.toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{price} kr</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  cardFeatured: {
    flex: 0,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.badgeNew,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeUsed: {
    backgroundColor: Colors.badgeUsed,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'GoogleSansFlex_500Medium',
    letterSpacing: 0.5,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 18,
    backgroundColor: 'rgba(15,15,14,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  saveIconActive: {
    color: Colors.gold,
  },
  info: {
    paddingTop: 10,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontFamily: 'GoogleSansFlex_500Medium',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sustainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 3,
  },
  sustainDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  sustainScore: {
    fontSize: 9,
    fontFamily: 'GoogleSansFlex_500Medium',
  },
  name: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'GoogleSansFlex_400Regular',
    marginBottom: 4,
    lineHeight: 15,
  },
  price: {
    color: '#ccc8c0',
    fontSize: 13,
    fontFamily: 'GoogleSansFlex_500Medium',
  },
});