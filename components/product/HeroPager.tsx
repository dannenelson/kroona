import { Image, StyleSheet, View } from 'react-native';
import Reanimated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';
import { Pressable } from 'react-native-gesture-handler';
import { spacing } from '../../theme';
import PagerDots from '../PagerDots';
import { lightboxHero, lightboxIndex } from '../../lib/lightboxStore';

type Props = {
  images: string[];
  /** Identifierar heron (dess boundary-id från kortet), så att bara den hero som öppnade lightboxen följer indexet. */
  heroKey: string;
  width: number;
  height: number;
  /** Tryck på en bild öppnar lightboxen på den bilden. */
  onOpen: (index: number) => void;
};

/**
 * Heron som bildbläddrare (brief 20). Fler än en bild: horisontell pager med
 * PagerDots nedtill direkt på fotot (mjuk skugga, läsbar mot ljusa och mörka foton). En
 * bild: bara bilden. Tryck öppnar lightboxen (fade, brief 22) på den bild som
 * visas. Transition.ScrollView
 * gör att biblioteket vet pagerns läge: kantswipe stänger på första bilden,
 * och vertikala drag går vidare till detaljvyns scroll och stängningsgest.
 */
export default function HeroPager({ images, heroKey, width, height, onOpen }: Props) {
  const position = useSharedValue(0);
  const scrollRef = useAnimatedRef<Reanimated.ScrollView>();

  const onScroll = useAnimatedScrollHandler((e) => {
    position.value = e.contentOffset.x / Math.max(1, width);
  });

  // Rätt bild tillbaka: när man bläddrar i lightboxen hoppar heron till samma
  // bild utan animation (UI-tråden), så att man landar på den bild man lämnade.
  // Bara den hero som öppnade lightboxen (andra detaljvyer i stacken rörs inte).
  useAnimatedReaction(
    () => lightboxIndex.value,
    (index, previous) => {
      if (index === previous || lightboxHero.value !== heroKey) return;
      scrollTo(scrollRef, index * width, 0, false);
    },
    [heroKey, width],
  );

  const page = (uri: string, index: number) => (
    <Pressable
      key={uri + index}
      onPress={() => {
        lightboxHero.value = heroKey;
        lightboxIndex.value = index;
        onOpen(index);
      }}
      accessibilityRole="imagebutton"
      accessibilityLabel={`Visa bild ${index + 1} av ${images.length} i helskärm`}
    >
      <Image source={{ uri }} style={{ width, height }} resizeMode="cover" />
    </Pressable>
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
        <PagerDots count={images.length} position={position} onPhoto />
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
});
