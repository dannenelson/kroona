// Lightbox (brief 19): produktens bilder i helskärm och riktig proportion.
// Öppnas från heron på Produktdetalj och ligger ovanpå den i rotens BlankStack
// (lightboxScreenOptions i components/product/productTransition.ts): bilden
// zoomar från heron, stängs med swipe ned, kantswipe eller krysset, och
// detaljvyn står kvar bakom (bara ett steg bakom syns).
import { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';
import { overlay, spacing } from '../../theme';
import { PRODUCTS } from '../../data/products';
import { getProductImages } from '../../lib/catalog';
import { LIGHTBOX_BOUNDARY_GROUP } from '../../components/product/productTransition';
import ZoomableImage from '../../components/lightbox/ZoomableImage';
import PagerDots from '../../components/PagerDots';
import IconButton from '../../components/IconButton';
import CloseIcon from '../../assets/icons/CloseIcon';

export default function LightboxScreen() {
  const { id, lb } = useLocalSearchParams<{ id: string; lb?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const product = PRODUCTS.find((p) => p.id === id);
  const images = product ? getProductImages(product) : [];

  // Sidposition som flyttal för PagerDots (följer swipen, inte bara stopp).
  const position = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    position.value = e.contentOffset.x / Math.max(1, width);
  });

  // Inzoomad bild: drag panorerar bilden, så paging och stängning stängs av.
  const [zoomed, setZoomed] = useState(false);
  const onZoomChange = useCallback(
    (next: boolean) => {
      setZoomed(next);
      navigation.setOptions({ gestureEnabled: !next } as object);
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Transition.ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={!zoomed}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {images.map((uri, index) => {
          const page = <ZoomableImage uri={uri} width={width} height={height} onZoomChange={onZoomChange} />;
          // Första bilden (den som syns i heron) är zoomens mål.
          return index === 0 && lb ? (
            <Transition.Boundary
              key={uri + index}
              id={lb}
              group={LIGHTBOX_BOUNDARY_GROUP}
              style={{ width, height }}
            >
              {page}
            </Transition.Boundary>
          ) : (
            <View key={uri + index} style={{ width, height }}>
              {page}
            </View>
          );
        })}
      </Transition.ScrollView>

      <View style={[styles.close, { top: insets.top + spacing.sm }]}>
        <IconButton tone="dark" icon={CloseIcon} accessibilityLabel="Stäng bild" onPress={() => router.back()} />
      </View>

      <PagerDots
        count={images.length}
        position={position}
        style={[styles.dots, { bottom: insets.bottom + spacing.lg }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: overlay.lightboxBg,
  },
  close: {
    position: 'absolute',
    right: spacing.screenMargin,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
