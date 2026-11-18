import type { ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, photoGlass, type Glass as GlassToken } from '../theme';

export type GlassTone = 'theme' | 'photo';

type Props = {
  /** 'theme' följer temat, 'photo' är fast mörkt glas för chrome på foto. */
  tone?: GlassTone;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Glastoken för en ton. Används också av komponenter som behöver innehållsfärgen. */
export function useGlass(tone: GlassTone = 'theme'): GlassToken {
  const { glass } = useTheme();
  return tone === 'photo' ? photoGlass : glass;
}

/**
 * Glasyta enligt docs/design.md §3: blur, fyllning och EN kant på 1 px.
 * Form (radie, storlek) kommer från `style`, som slås ihop sist.
 *
 * Approximation: expo-blur saknar saturate (180 %). Närmast är BlurViews
 * tint-lager plus vår fyllning.
 * TODO(design): ljust glas över ren ljus yta (vit 28 % på ljust bg) syns
 * knappt mer än kanten. Öppen designfråga (a), implementerat enligt tokens.
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
      <BlurView
        tint={g.tint}
        intensity={g.blurIntensity}
        blurMethod="dimezisBlurViewSdk31Plus"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: g.fill }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
});
