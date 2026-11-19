import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Reanimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';
import { radius, spacing } from '../../theme';
import Glass from '../Glass';
import PagerDots from '../PagerDots';
import { LIGHTBOX_BOUNDARY_GROUP, lightboxBoundaryId } from './productTransition';
import { lightboxIndex, subscribeLightboxIndex } from '../../lib/lightboxStore';

type Props = {
  images: string[];
  /** Herons boundary-id (kortets id); lightboxens id byggs på det per bild. */
  heroBoundaryId: string;
  width: number;
  height: number;
  /** Tryck på en bild öppnar lightboxen på den bilden. */
  onOpen: (index: number) => void;
};

/**
 * Heron som bildbläddrare (brief 20). Fler än en bild: horisontell pager med
 * PagerDots nedtill i en mörk glaspill (läsbar mot ljusa och mörka foton). En
 * bild: bara bilden. Varje bild är en egen boundary (lb_<heroId>_<index>) så
 * att lightboxen öppnas från och stängs till rätt bild. Transition.ScrollView
 * gör att biblioteket vet pagerns läge: kantswipe stänger på första bilden,
 * och vertikala drag går vidare till detaljvyns scroll och stängningsgest.
 */
export default function HeroPager({ images, heroBoundaryId, width, height, onOpen }: Props) {
  const position = useSharedValue(0);
  const scrollRef = useRef<Reanimated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler((e) => {
    position.value = e.contentOffset.x / Math.max(1, width);
  });

  // Rätt bild tillbaka: lightboxen meddelar sitt index, heron hoppar dit utan animation.
  useEffect(
    () =>
      subscribeLightboxIndex((index) => {
        scrollRef.current?.scrollTo({ x: index * width, animated: false });
      }),
    [width],
  );

  const page = (uri: string, index: number) => (
    <Transition.Boundary
      key={uri + index}
      id={lightboxBoundaryId(heroBoundaryId, index)}
      group={LIGHTBOX_BOUNDARY_GROUP}
      onPress={() => {
        lightboxIndex.value = index;
        onOpen(index);
      }}
      accessibilityRole="imagebutton"
      accessibilityLabel={`Visa bild ${index + 1} av ${images.length} i helskärm`}
    >
      <Image source={{ uri }} style={{ width, height }} resizeMode="cover" />
    </Transition.Boundary>
  );

  if (images.length < 2) return images[0] ? page(images[0], 0) : null;

  return (
    <View style={{ width, height }}>
      <Transition.ScrollView
        ref={scrollRef as never}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {images.map(page)}
      </Transition.ScrollView>
      <View pointerEvents="none" style={styles.dotsRow}>
        <Glass tone="dark" style={styles.dotsPill}>
          <PagerDots count={images.length} position={position} />
        </Glass>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.md,
    alignItems: 'center',
  },
  dotsPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + spacing.xs / 2,
  },
});
