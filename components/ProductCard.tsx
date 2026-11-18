import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme, overlay, typography, fonts, letterSpacing, spacing, radius } from '../theme';

const SAVE_SIZE = 28;
const SUSTAIN_DOT = 5;
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
  const { colors } = useTheme();
  const styles = useStyles();
  const sustainColor =
    sustainabilityScore >= 4 ? colors.success : colors.warning;

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
            <Text style={[styles.badgeText, isUsed && styles.badgeTextUsed]}>{isUsed ? 'Begagnad' : 'Nyhet'}</Text>
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

const useStyles = makeStyles((t) => ({
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
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: t.colors.accent,
    paddingHorizontal: 6, // lokal optisk justering: tät badge
    paddingVertical: 3, // lokal optisk justering: tät badge
    borderRadius: 4, // lokal: liten badge, under tile-radien
    borderCurve: 'continuous',
  },
  badgeUsed: {
    backgroundColor: t.colors.surfaceRaised,
  },
  badgeText: {
    ...typography.micro,
    color: t.colors.onAccent,
    letterSpacing: letterSpacing.wide,
  },
  badgeTextUsed: {
    color: t.colors.textPrimary,
  },
  saveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: SAVE_SIZE,
    height: SAVE_SIZE,
    borderRadius: radius.full,
    backgroundColor: overlay.scrimSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    ...typography.body,
    color: overlay.onPhoto, // på foto: fast vit i båda teman
  },
  saveIconActive: {
    color: t.colors.accent,
  },
  info: {
    paddingTop: spacing.sm,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brand: {
    ...typography.micro,
    color: t.colors.textSecondary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
  },
  sustainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.full,
    paddingHorizontal: 5, // lokal optisk justering: tät hållbarhetsbadge
    paddingVertical: 2, // lokal optisk justering
    gap: 3, // lokal optisk justering: prick → siffra
  },
  sustainDot: {
    width: SUSTAIN_DOT,
    height: SUSTAIN_DOT,
    borderRadius: radius.full,
  },
  sustainScore: {
    ...typography.micro,
  },
  name: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
}));