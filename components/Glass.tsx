import { useState, type ReactNode } from 'react';
import { View, StyleSheet, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, motion, darkPhotoGlass, type Glass as GlassToken } from '../theme';

/**
 * 'theme': temats glas, över innehåll som scrollar under (t.ex. nedscrollad toppbar).
 * 'photo': glas direkt på foto. Följer temat (ljust glas i ljust tema).
 * 'dark': alltid mörkt glas med ljust innehåll, t.ex. över lightboxens mörka bakgrund.
 * 'plain': över ren yta. I ljust tema blir det surface + line utan blur.
 */
export type GlassTone = 'theme' | 'photo' | 'plain' | 'dark';

type Props = {
  tone?: GlassTone;
  /** Inaktiv: tonar innehåll och fyllning, inte blur-lagrets förälder (se nedan). */
  dimmed?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

type ResolvedGlass = GlassToken & { blurred: boolean };

/** Glastoken för en ton. Används också av komponenter som behöver innehållsfärgen. */
export function useGlass(tone: GlassTone = 'theme'): ResolvedGlass {
  const { glass, photoGlass, colors, scheme } = useTheme();
  if (tone === 'photo') return { ...photoGlass, blurred: true };
  if (tone === 'dark') return { ...darkPhotoGlass, blurred: true };
  // TODO(design): ljust glas över ren ljus yta syns knappt (öppen designfråga).
  // Tills vidare: surface + line, utan blur.
  if (tone === 'plain' && scheme === 'light') {
    return {
      ...glass,
      fill: colors.surface,
      borderColor: colors.border,
      content: colors.textPrimary,
      blurred: false,
    };
  }
  return { ...glass, blurred: true };
}

/**
 * Glasyta enligt docs/design.md §0/§3: blur, fyllning och EN kant på 1 px.
 * Form (radie, storlek) kommer från `style`, som slås ihop sist.
 *
 * Varför lagren klipper sig själva (brief 05, "hårda kanter"):
 * BlurView är en UIVisualEffectView. Dess backdrop klipps inte pålitligt av
 * en förälders hörnradie, och opacitet eller mask på en förälder bryter
 * effekten. Därför får blur-lagret, fyllningen och kanten var sin egen radie,
 * kanten ritas som ett eget lager (ingen border på den klippande vyn), och
 * radien kläms till halva höjden så att `radius.full` ger exakta cirklar och
 * pillar i stället för ett värde som Fabric måste räkna om.
 *
 * Approximation: expo-blur saknar saturate. Närmast är BlurViews tint-lager
 * plus vår fyllning.
 */
export default function Glass({ tone = 'theme', dimmed = false, style, children }: Props) {
  const g = useGlass(tone);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const flat = StyleSheet.flatten(style) ?? {};
  const requested = typeof flat.borderRadius === 'number' ? flat.borderRadius : 0;
  const r = size ? Math.min(requested, size.width / 2, size.height / 2) : requested;
  const shape = { borderRadius: r, overflow: 'hidden' as const };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!size || size.width !== width || size.height !== height) setSize({ width, height });
  };

  return (
    <View onLayout={onLayout} style={[style, shape]}>
      {g.blurred && (
        <BlurView
          tint={g.tint}
          intensity={g.blurIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={[StyleSheet.absoluteFill, shape]}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          shape,
          { backgroundColor: g.fill },
          dimmed && styles.dimmed,
        ]}
      />
      {dimmed ? <View style={[styles.content, styles.dimmed]}>{children}</View> : children}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: r, borderWidth: g.borderWidth, borderColor: g.borderColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Innehållet i en dimmed-wrapper fyller ytan och centreras, som utan wrapper.
  content: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: motion.disabledOpacity,
  },
});
