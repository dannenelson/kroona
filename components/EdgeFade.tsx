import { useState, type ComponentType, type ReactElement } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewClass from '@react-native-masked-view/masked-view';
import Svg, { Defs, Filter, FeGaussianBlur, Path } from 'react-native-svg';
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
  /** Toppkantens form. 'wave' (test, brief 08) gäller bara position="top". */
  shape?: 'straight' | 'wave';
  style?: StyleProp<ViewStyle>;
};

// Paketets klasstyper (byggda för äldre @types/react) passar inte React 19:s
// JSX-typer. Samma komponent, bara omtypad.
const MaskedView = MaskedViewClass as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

type Stops = [number, number, ...number[]];

/**
 * Path för vågig toppkant i pixlar: fyllt ovanför en lugn, organisk våg.
 * Två sinusar (huvudvåg + svagare överton) ger en form som inte är perfekt
 * regelbunden. Pathen börjar ovanför vyn och går ut förbi sidorna, så att
 * utsuddningen bara mjukar upp den nedre kanten.
 */
function wavePath(w: number, h: number): string {
  const { baseline, amplitude, waves, phase, softness, samples } = edgeBlur.wave;
  const pad = softness * 2;
  const y = (x: number) => {
    const t = x / w;
    return (
      baseline * h +
      amplitude *
        (0.75 * Math.sin(2 * Math.PI * waves * t + phase) +
          0.25 * Math.sin(2 * Math.PI * waves * 2.3 * t))
    );
  };
  const x0 = -pad;
  const x1 = w + pad;
  const pts = Array.from({ length: samples + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / samples;
    return { x, y: y(x) };
  });
  // Mjuk kurva: kvadratiska Bézier med samplepunkterna som kontrollpunkter
  // och mittpunkterna mellan dem som ändpunkter.
  let d = `M${x1} ${-softness * 3} L${x0} ${-softness * 3} L${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x} ${pts[i].y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last.x} ${last.y} Z`;
  return d;
}
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

  const fade = isTop ? edgeFadeStops.top : edgeFadeStops.bottom;
  const fadeColors =
    variant === 'photo' && isTop
      ? (overlay.photoFade as Colors)
      : (fade.alphas.map((a) => withAlpha(colors.bg, a)) as Colors);
  const fadeLocations =
    variant === 'photo' && isTop ? undefined : ([...fade.locations] as Stops);

  // Vågig form maskar hela lagret (blur + toning). Bara överst; rak är oförändrad.
  const wave = shape === 'wave' && isTop;

  const layers = (
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
      <LinearGradient
        colors={fadeColors}
        locations={fadeLocations}
        start={start}
        end={end}
        style={StyleSheet.absoluteFill}
      />
    </>
  );

  return (
    <View
      pointerEvents="none"
      onLayout={wave ? (e) => setWidth(e.nativeEvent.layout.width) : undefined}
      style={[styles.root, isTop ? styles.top : styles.bottom, { height: h }, style]}
    >
      {wave ? (
        width > 0 && (
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <Svg width={width} height={h}>
                <Defs>
                  <Filter
                    id="edgeWaveSoft"
                    filterUnits="userSpaceOnUse"
                    x={-edgeBlur.wave.softness * 4}
                    y={-edgeBlur.wave.softness * 4}
                    width={width + edgeBlur.wave.softness * 8}
                    height={h + edgeBlur.wave.softness * 8}
                  >
                    <FeGaussianBlur stdDeviation={edgeBlur.wave.softness} />
                  </Filter>
                </Defs>
                <Path d={wavePath(width, h)} fill={edgeBlur.maskColors[0]} filter="url(#edgeWaveSoft)" />
              </Svg>
            }
          >
            {layers}
          </MaskedView>
        )
      ) : (
        layers
      )}
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
