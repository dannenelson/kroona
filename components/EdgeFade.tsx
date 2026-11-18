import type { ComponentType, ReactElement } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewClass from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, edgeBlur, edgeFadeStops, overlay, withAlpha } from '../theme';

type Props = {
  /** 'top' bakom statusfält/Dynamic Island, 'bottom' bakom navigationen. */
  position: 'top' | 'bottom';
  /** Höjd i px. Default: topp = safe area + 14 (≈ 68), botten = 128. */
  height?: number;
  /** 'theme' tonar mot bg, 'photo' tonar mörkt över foto (bara topp). */
  variant?: 'theme' | 'photo';
  /** Stäng av blur-lagren (bara toning), för prestandajämförelse. */
  blur?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Paketets klasstyper (byggda för äldre @types/react) passar inte React 19:s
// JSX-typer. Samma komponent, bara omtypad.
const MaskedView = MaskedViewClass as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

type Stops = [number, number, ...number[]];
type Colors = [string, string, ...string[]];

/**
 * Kantblur (design.md §0): kort toning + gradvis blur vid skärmens kant så
 * att innehållet syns under. Tre BlurView-lager (20 / 50 / 100 % av max 8 px),
 * vart och ett med en gradientmask, plus en toning mot bakgrunden överst.
 * Ligger absolut och släpper igenom tryck.
 */
export default function EdgeFade({ position, height, variant = 'theme', blur = true, style }: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isTop = position === 'top';
  const h = height ?? (isTop ? insets.top + edgeBlur.topExtra : edgeBlur.bottomHeight);

  // Gradienter går uppifrån och ner. Botten vänds så att kanten är tätast.
  const start = isTop ? { x: 0, y: 0 } : { x: 0, y: 1 };
  const end = isTop ? { x: 0, y: 1 } : { x: 0, y: 0 };

  const fade = isTop ? edgeFadeStops.top : edgeFadeStops.bottom;
  const fadeColors =
    variant === 'photo' && isTop
      ? (overlay.photoFade as Colors)
      : (fade.alphas.map((a) => withAlpha(colors.bg, a)) as Colors);
  const fadeLocations =
    variant === 'photo' && isTop ? undefined : ([...fade.locations] as Stops);

  return (
    <View
      pointerEvents="none"
      style={[styles.root, isTop ? styles.top : styles.bottom, { height: h }, style]}
    >
      {blur &&
        edgeBlur.layers.map((layer) => (
          <MaskedView
            key={layer.strength}
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                colors={edgeBlur.maskColors}
                locations={[...layer.maskStops] as Stops}
                start={start}
                end={end}
                style={StyleSheet.absoluteFill}
              />
            }
          >
            <BlurView
              tint={scheme}
              intensity={edgeBlur.maxBlur * layer.strength * edgeBlur.intensityPerPx}
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
        ))}
      <LinearGradient
        colors={fadeColors}
        locations={fadeLocations}
        start={start}
        end={end}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
