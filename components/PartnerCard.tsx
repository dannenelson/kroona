import { useId, useMemo } from 'react';
import { Animated, Text, Pressable, View, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector } from 'react-native-gesture-handler';
import { makeStyles, overlay, typography, fonts, letterSpacing, spacing, radius, logo } from '../theme';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { useCardPress } from '../hooks/useCardPress';
import { type ContextMenuItem } from './ProductContextMenu';
import { useLongPressMenu } from '../hooks/useLongPressMenu';
import { useSnackbar } from './Snackbar';
import { COLLECTION_BOUNDARY_GROUP, PARTNER_BOUNDARY_GROUP } from './product/productTransition';
import BrandLogo, { hasBrandLogo } from './BrandLogo';

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
  /** Varumärke (brief 29): kortet öppnar Partnerdetalj i stället för Samlingsdetalj. */
  partnerId?: string;
  /** Bredd i grid (Sparat › Följer); höjden följer kortets proportion. Standard 150 × 310. */
  width?: number;
};

const CARD_WIDTH = 150;
const CARD_HEIGHT = 310;

/**
 * Samlings-/varumärkeskort. Tryck öppnar Samlings- eller Partnerdetalj (zoom
 * från bilden). Långt tryck öppnar samma kontextmeny som produktkorten
 * (brief 30): Följ/Sluta följa, Öppna, Dela. Ingen synlig följ-indikator på kortet.
 */
export default function PartnerCard({ id, name, tag, itemCount, imageUrl, variant, partnerId, width = CARD_WIDTH }: Props) {
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const followed = isFollowed(id);
  const styles = useStyles();
  const router = useRouter();
  const snackbar = useSnackbar();
  // Unikt boundary-id per kortinstans (samma mönster som ProductCard), så att
  // zoomen till Samlings-/Partnerdetalj går från/till exakt det här kortet.
  const instanceKey = useId().replace(/[^a-zA-Z0-9]/g, '');
  const boundaryId = `${partnerId ?? id}_${instanceKey}`;
  const open = () =>
    partnerId
      ? router.push({ pathname: '/partner/[id]', params: { id: partnerId, b: boundaryId } })
      : router.push({ pathname: '/collection/[id]', params: { id, b: boundaryId } });

  // Samma source-objekt för kortet och menyns lyfta kopia (samma bildcache).
  const imageSource = useMemo(() => ({ uri: imageUrl }), [imageUrl]);
  // Samma tryckrespons som produktkorten (krympning, ingen opacitet).
  const press = useCardPress();

  // Följ använder samma toggle som den borttagna +/✓-knappen. Dela är en
  // platshållare i Fas 0 (ingen delning byggd).
  const menuItems: ContextMenuItem[] = [
    {
      label: followed ? 'Sluta följa' : 'Följ',
      // Följ-ikon (brief 67): företag company-add/-check efter läge; samlingar som förut.
      icon: partnerId ? (followed ? 'company-check' : 'company-add') : 'user-add',
      onPress: () => toggleFollowed(id),
    },
    { label: 'Öppna', icon: 'chevron-right', navigation: true, onPress: open },
    { label: 'Dela', icon: 'share', onPress: () => snackbar.show({ text: 'Delning kommer senare', thumbUri: imageUrl }) },
  ];

  // Namn och antal följer med den lyfta kopian (samma innehåll som på kortet).
  const renderCaption = () => (
    <LinearGradient
      colors={overlay.scrimStops.colors}
      locations={overlay.scrimStops.locations}
      style={styles.gradient}
    >
      {variant === 'brand' ? (
        // Varumärken: ingen tag-rad ("Varumärke" gav aldrig
        // differentierande värde). Namnet får istället en stor,
        // bold behandling, mer wordmark/logotyp än etikett.
        // Har varumärket en logotyp (brief 47) ersätter den namnet, på platta;
        // namnet är kvar som tillgänglighetsetikett på kortet.
        hasBrandLogo(partnerId) ? (
          <BrandLogo retailerId={partnerId} size={width * logo.plateShare} shape="plate" />
        ) : (
          <Text style={styles.brandName}>{name}</Text>
        )
      ) : (
        <>
          <Text style={styles.tag}>{tag}</Text>
          <Text style={styles.name}>{name}</Text>
        </>
      )}
      <Text style={styles.count}>{itemCount} objekt</Text>
    </LinearGradient>
  );

  // Långt tryck som övergår i drag, samma gest som produktkorten (brief 05),
  // via den delade hooken: när den aktiveras avbryts kortets tryck.
  const menu = useLongPressMenu({
    items: menuItems,
    imageUri: imageUrl,
    radius: radius.collection,
    renderOverlay: renderCaption,
    press,
  });

  return (
    <GestureDetector gesture={menu.gesture}>
      <Pressable
        onLayout={press.onLayout}
        onPress={open}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="button"
        accessibilityLabel={name}
        accessibilityHint="Håll in för fler val"
      >
        <Animated.View style={[styles.card, { width, height: (width * CARD_HEIGHT) / CARD_WIDTH }, press.scaleStyle]}>
        <Transition.Boundary
          id={boundaryId}
          group={partnerId ? PARTNER_BOUNDARY_GROUP : COLLECTION_BOUNDARY_GROUP}
          style={styles.image}
        >
          <View ref={menu.ref} collapsable={false} style={[styles.image, menu.hidden && styles.hidden]}>
            <ImageBackground source={imageSource} style={styles.image}>
              {renderCaption()}
            </ImageBackground>
          </View>
        </Transition.Boundary>
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
}

// Allt innehåll ligger på foto + scrim, som är mörk i båda teman. Därför
// används fasta overlay-färger (onPhoto), identiska i båda teman.
const useStyles = makeStyles((t) => ({
  card: {
    // Samlingskort: radius.collection (design.md §0), samma som menyns kopia.
    borderRadius: radius.collection,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: radius.collection,
    borderBottomRightRadius: radius.collection,
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
