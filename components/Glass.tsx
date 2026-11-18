import type { ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, photoGlass, type Glass as GlassToken } from '../theme';

/**
 * 'theme': temats glas, över innehåll som scrollar under (t.ex. nedscrollad toppbar).
 * 'photo': fast mörkt glas med vitt innehåll, för chrome direkt på foto.
 * 'plain': över ren yta. I ljust tema blir det surface + line utan blur.
 */
export type GlassTone = 'theme' | 'photo' | 'plain';

type Props = {
  tone?: GlassTone;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

type ResolvedGlass = GlassToken & { blurred: boolean };

/** Glastoken för en ton. Används också av komponenter som behöver innehållsfärgen. */
export function useGlass(tone: GlassTone = 'theme'): ResolvedGlass {
  const { glass, colors, scheme } = useTheme();
  if (tone === 'photo') return { ...photoGlass, blurred: true };
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
 * Form (radie, storlek) kommer från `style`, som slås ihop sist. Den som ger
 * en icke-rund radie lägger själv till borderCurve: 'continuous'.
 *
 * Approximation: expo-blur saknar saturate. Närmast är BlurViews tint-lager
 * plus vår fyllning.
 */
export default function Glass({ tone = 'theme', style, children }: Props) {
  const g = useGlass(tone);
  return (
    <View
      style={[
        styles.base,
        { borderWidth: g.borderWidth, borderColor: g.borderColor },
        style,
      ]}
    >
      {g.blurred && (
        <BlurView
          tint={g.tint}
          intensity={g.blurIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: g.fill }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
