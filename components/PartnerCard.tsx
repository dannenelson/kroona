import { useId, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { makeStyles, overlay, typography, fonts, letterSpacing, spacing, radius, motion } from '../theme';
import { useFollowedCollections } from '../context/FollowedCollectionsContext';
import { useContextMenu, type AnchorRect, type ContextMenuItem } from './ProductContextMenu';
import { useToast } from './Toast';
import { COLLECTION_BOUNDARY_GROUP, PARTNER_BOUNDARY_GROUP } from './product/productTransition';
import FollowIcon from '../assets/icons/FollowIcon';
import ChevronIcon from '../assets/icons/ChevronIcon';
import ShareIcon from '../assets/icons/ShareIcon';

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
};

/**
 * Samlings-/varumärkeskort. Tryck öppnar Samlings- eller Partnerdetalj (zoom
 * från bilden). Långt tryck öppnar samma kontextmeny som produktkorten
 * (brief 30): Följ/Sluta följa, Öppna, Dela. Ingen synlig följ-indikator på kortet.
 */
export default function PartnerCard({ id, name, tag, itemCount, imageUrl, variant, partnerId }: Props) {
  const { isFollowed, toggleFollowed } = useFollowedCollections();
  const followed = isFollowed(id);
  const styles = useStyles();
  const router = useRouter();
  const toast = useToast();
  const contextMenu = useContextMenu();
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
  const imageRef = useRef<ComponentRef<typeof View>>(null);
  const [imageHidden, setImageHidden] = useState(false);

  // Följ använder samma toggle som den borttagna +/✓-knappen. Dela är en
  // platshållare i Fas 0 (ingen delning byggd).
  const menuItems: ContextMenuItem[] = [
    { label: followed ? 'Sluta följa' : 'Följ', icon: FollowIcon, onPress: () => toggleFollowed(id) },
    { label: 'Öppna', icon: ChevronIcon, onPress: open },
    { label: 'Dela', icon: ShareIcon, onPress: () => toast.show('Delning kommer senare') },
  ];

  const measureImage = (done: (rect: AnchorRect) => void) => {
    imageRef.current?.measureInWindow((x, y, width, height) => done({ x, y, width, height }));
  };

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
        <Text style={styles.brandName}>{name}</Text>
      ) : (
        <>
          <Text style={styles.tag}>{tag}</Text>
          <Text style={styles.name}>{name}</Text>
        </>
      )}
      <Text style={styles.count}>{itemCount} objekt</Text>
    </LinearGradient>
  );

  // Långt tryck som övergår i drag, samma gest som produktkorten (brief 05):
  // när den aktiveras avbryts kortets tryck, så att kortet inte öppnas.
  const longPress = usePanGesture({
    activateAfterLongPress: motion.longPressMs,
    runOnJS: true,
    disableReanimated: true,
    onActivate: () =>
      measureImage((anchor) =>
        contextMenu.open({
          anchor,
          imageSource,
          imageRadius: radius.collection,
          liftScale: motion.liftScale,
          renderOverlay: renderCaption,
          items: menuItems,
          measure: measureImage,
          setOriginalHidden: setImageHidden,
        }),
      ),
    onUpdate: (e) => contextMenu.move(e.absoluteX, e.absoluteY),
    onDeactivate: () => contextMenu.release(),
  });

  return (
    <GestureDetector gesture={longPress}>
      <TouchableOpacity
        style={styles.card}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={name}
        accessibilityHint="Håll in för fler val"
      >
        <Transition.Boundary
          id={boundaryId}
          group={partnerId ? PARTNER_BOUNDARY_GROUP : COLLECTION_BOUNDARY_GROUP}
          style={styles.image}
        >
          <View ref={imageRef} collapsable={false} style={[styles.image, imageHidden && styles.hidden]}>
            <ImageBackground source={imageSource} style={styles.image}>
              {renderCaption()}
            </ImageBackground>
          </View>
        </Transition.Boundary>
      </TouchableOpacity>
    </GestureDetector>
  );
}

// Allt innehåll ligger på foto + scrim, som är mörk i båda teman. Därför
// används fasta overlay-färger (onPhoto), identiska i båda teman.
const useStyles = makeStyles((t) => ({
  card: {
    width: 150,
    height: 310,
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
