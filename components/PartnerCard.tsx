import { useId } from 'react';
import { Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, overlay, typography, fonts, letterSpacing, spacing, radius } from '../theme';

import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';

const FOLLOW_SIZE = 28;

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
  const styles = useStyles();
  const router = useRouter();
  // Unikt boundary-id per kortinstans (samma mönster som ProductCard), så att
  // zoomen till Samlingsdetalj går från/till exakt det här kortet (brief 28).
  const boundaryId = `${id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const open = () => router.push({ pathname: '/collection/[id]', params: { id, b: boundaryId } });

  return (
    <TouchableOpacity style={styles.card} onPress={open} accessibilityRole="button" accessibilityLabel={name}>
      <Transition.Boundary id={boundaryId} group={COLLECTION_BOUNDARY_GROUP} style={styles.image}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.image}
      >
        <TouchableOpacity style={styles.followButton} onPress={() => toggleFollowed(id)}>
          <Text style={[styles.followIcon, followed && styles.followIconActive]}>
            {followed ? '✓' : '+'}
          </Text>
        </TouchableOpacity>

        <LinearGradient
            colors={overlay.scrimStops.colors}
            locations={overlay.scrimStops.locations}
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
      </Transition.Boundary>
    </TouchableOpacity>
  );
}

// Allt innehåll ligger på foto + scrim, som är mörk i båda teman. Därför
// används fasta overlay-färger (onPhoto), identiska i båda teman.
const useStyles = makeStyles((t) => ({
  card: {
    width: 150,
    height: 310,
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
  followButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: FOLLOW_SIZE,
    height: FOLLOW_SIZE,
    borderRadius: radius.full,
    backgroundColor: overlay.scrimSoft,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  followIcon: {
    ...typography.body,
    color: overlay.onPhoto,
  },
  followIconActive: {
    color: overlay.onPhoto,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    borderCurve: 'continuous',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  tag: {
    ...typography.micro,
    color: overlay.onPhotoSecondary,
    letterSpacing: letterSpacing.caps,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  name: {
    ...typography.body,
    color: overlay.onPhoto,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  brandName: {
    ...typography.title1,
    color: overlay.onPhoto,
    letterSpacing: 0.3, // lokal optisk spärrning
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: overlay.onPhotoSecondary,
    textAlign: 'center',
  },
}));
