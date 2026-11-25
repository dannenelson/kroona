// GENERERAD FIL – ändra inte för hand. Kör `node scripts/generate-icon-registry.js`.
// Märkesikoner/SoMe (assets/svg/brands). Officiella former, egen fyllning, ingen linje.
import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import I_some_facebook from '../assets/svg/brands/some-facebook.svg';
import I_some_instagram from '../assets/svg/brands/some-instagram.svg';
import I_some_linkedin from '../assets/svg/brands/some-linkedin.svg';
import I_some_pinterest from '../assets/svg/brands/some-pinterest.svg';
import I_some_tiktok from '../assets/svg/brands/some-tiktok.svg';
import I_some_x from '../assets/svg/brands/some-x.svg';
import I_some_youtube from '../assets/svg/brands/some-youtube.svg';

export const brandIconRegistry = {
  'some-facebook': I_some_facebook,
  'some-instagram': I_some_instagram,
  'some-linkedin': I_some_linkedin,
  'some-pinterest': I_some_pinterest,
  'some-tiktok': I_some_tiktok,
  'some-x': I_some_x,
  'some-youtube': I_some_youtube,
} as const satisfies Record<string, FC<SvgProps>>;

export type BrandIconName = keyof typeof brandIconRegistry;
