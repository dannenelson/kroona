// Typografi enligt docs/design.md §4. Ett fontfamilj-namn per vikt.
// Familjen Grotesk bara för display, title1, title2.
import type { TextStyle } from 'react-native';

export const fonts = {
  display600: 'FamiljenGrotesk_600SemiBold',
  display700: 'FamiljenGrotesk_700Bold',
  ui400: 'GoogleSansFlex_400Regular',
  ui500: 'GoogleSansFlex_500Medium',
  ui600: 'GoogleSansFlex_600SemiBold',
} as const;

type TypeStyle = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight'>;

export const typography = {
  display: { fontFamily: fonts.display700, fontSize: 34, lineHeight: 38 },
  title1: { fontFamily: fonts.display600, fontSize: 26, lineHeight: 30 },
  title2: { fontFamily: fonts.display600, fontSize: 20, lineHeight: 24 },
  headline: { fontFamily: fonts.ui600, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.ui400, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.ui500, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.ui400, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fonts.ui500, fontSize: 10, lineHeight: 14 },
  price: { fontFamily: fonts.ui600 },
} satisfies Record<string, TypeStyle>;

export const letterSpacing = {
  wide: 0.5,
  caps: 1.5,
} as const;
