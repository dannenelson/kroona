import { useState, type ComponentType, type ReactElement } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewClass from '@react-native-masked-view/masked-view';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
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
  /** Toppkantens nedre gräns. 'wave' = organisk (test, brief 10), bara position="top". */
  shape?: 'straight' | 'wave';
  /**
   * Detaljvyer (brief 14): tonar mellan foto-toning (0) och tema-toning (1)
   * med scroll, i en och samma kant. Bara toningslagren tonas; blur-lagren
   * är konstanta (opacitet på en förälder till BlurView bryter blurren).
   * Utan prop: oförändrat beteende enligt `variant`.
   */
  fadeProgress?: Animated.AnimatedInterpolation<number>;
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
export default function EdgeFade({
  position,
  height,
  variant = 'theme',
  blur = true,
  shape = 'straight',
  fadeProgress,
  style,
}: Props) {
  const [width, setWidth] = useState(0);
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isTop = position === 'top';
  const h = height ?? (isTop ? insets.top + edgeBlur.topExtra : edgeBlur.bottomHeight);

  // Gradienter går uppifrån och ner. Botten vänds så att kanten är tätast.
  const start = isTop ? { x: 0, y: 0 } : { x: 0, y: 1 };
  const end = isTop ? { x: 0, y: 1 } : { x: 0, y: 0 };

  // Vågig form gäller bara toningen överst (inte blurren). Rak är oförändrad.
  const wave = shape === 'wave' && isTop;

  const fade = wave ? edgeFadeStops.topWave : isTop ? edgeFadeStops.top : edgeFadeStops.bottom;
  const fadeColors =
    variant === 'photo' && isTop
      ? (overlay.photoFade as Colors)
      : (fade.alphas.map((a) => withAlpha(colors.bg, a)) as Colors);
  const fadeLocations =
    variant === 'photo' && isTop ? undefined : ([...fade.locations] as Stops);

  // Blur-lagren är alltid de raka, mjukt maskade lagren (samma som Rak).
  // En mask på en förälder till BlurView (UIVisualEffectView) klipper blurren
  // med en hård kant (brief 11), så den vågiga masken läggs bara på toningen.
  const blurLayers = (
    <>
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
    </>
  );
  const fadeLayer = (
    <LinearGradient
      colors={fadeColors}
      locations={fadeLocations}
      start={start}
      end={end}
      style={StyleSheet.absoluteFill}
    />
  );

  return (
    <View
      pointerEvents="none"
      // Bredden mäts alltid, så att växling till vågig ritar direkt.
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.root, isTop ? styles.top : styles.bottom, { height: h }, style]}
    >
      {blurLayers}
      {fadeProgress && isTop ? (
        <>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: fadeProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              },
            ]}
          >
            <LinearGradient
              colors={overlay.photoFade as Colors}
              start={start}
              end={end}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeProgress }]}>
            <LinearGradient
              colors={edgeFadeStops.top.alphas.map((a) => withAlpha(colors.bg, a)) as Colors}
              locations={[...edgeFadeStops.top.locations] as Stops}
              start={start}
              end={end}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </>
      ) : wave ? (
        width > 0 && (
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={<OrganicMask width={width} height={h} />}
          >
            {fadeLayer}
          </MaskedView>
        )
      ) : (
        fadeLayer
      )}
    </View>
  );
}

/**
 * Mjukt alfa-fält för organisk toppkant: en bas-gradient över hela bredden
 * plus överlappande elliptiska radialgradienter från överkanten. Allt är
 * gradienter, så nedre gränsen syns bara som att toningen når olika djupt.
 */
function OrganicMask({ width, height }: { width: number; height: number }) {
  const { baseSolid, baseDepth, lobes, lobeSolid } = edgeBlur.wave;
  const solid = edgeBlur.maskColors[0];
  const clear = edgeBlur.maskColors[2];
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="edgeBase" x1="0" y1="0" x2="0" y2={height * baseDepth} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={solid} />
          <Stop offset={baseSolid / baseDepth} stopColor={solid} />
          <Stop offset={1} stopColor={clear} />
        </SvgLinearGradient>
        <RadialGradient id="edgeLobe" cx="50%" cy="50%" r="50%">
          <Stop offset={0} stopColor={solid} />
          <Stop offset={lobeSolid} stopColor={solid} />
          <Stop offset={1} stopColor={clear} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height * baseDepth} fill="url(#edgeBase)" />
      {lobes.map((lobe) => (
        <Ellipse
          key={lobe.x}
          cx={lobe.x * width}
          cy={0}
          rx={lobe.width * width}
          ry={lobe.depth * height}
          fill="url(#edgeLobe)"
        />
      ))}
    </Svg>
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
