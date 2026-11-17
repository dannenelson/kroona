import { Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/spacing';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';

type Props = {
  id: string;
  name: string;
  tag: string;
  itemCount: number;
  imageUrl: string;
  // 'brand' ger namnet en större, bold "wordmark"-behandling (se
  // brandName nedan). 'style' behåller dagens tag+namn+antal, oförändrat.
  // Kortets form (hög rektangel, 150×310) är alltid densamma — inga cirklar
  // längre, se data/collections.ts.
  variant: 'brand' | 'style';
};

export default function PartnerCard({ id, name, tag, itemCount, imageUrl, variant }: Props) {
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const followed = isFollowed(id);

  return (
    <TouchableOpacity style={styles.card}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.image}
        imageStyle={{ borderRadius: Radius.card }}
      >
        <TouchableOpacity style={styles.followButton} onPress={() => toggleFollowed(id)}>
          <Text style={[styles.followIcon, followed && styles.followIconActive]}>
            {followed ? '✓' : '+'}
          </Text>
        </TouchableOpacity>

        <LinearGradient
            colors={[
                'rgba(26,28,33,0.0)',
                'rgba(26,28,33,0.56)',
                'rgba(26,28,33,0.75)',
                'rgba(26,28,33,1.0)',
            ]}
            locations={[0, 0.4, 0.65, 1]}
            style={styles.gradient}
        >
          {variant === 'brand' ? (
            // Varumärken: ingen tag-rad ("Varumärke" gav aldrig
            // differentierande värde). Namnet får istället en stor,
            // bold behandling, mer wordmark/logotyp än etikett.
            <Text style={styles.brandName}>{name}</Text>
          ) : (
            <>
              <Text style={styles.tag}>{tag}</Text>
              <Text style={styles.name}>{name}</Text>
            </>
          )}
          <Text style={styles.count}>{itemCount} objekt</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
card: {
    width: 150,
    height: 310,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    },
  image: {
    width: '100%',
    height: '100%',
  },
  followButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 18,
    backgroundColor: 'rgba(15,15,14,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  followIcon: {
    color: Colors.textPrimary,
    fontSize: 15,
  },
  followIconActive: {
    color: Colors.gold,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
  tag: {
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 14,
    letterSpacing: 0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  brandName: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 28,
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
});
