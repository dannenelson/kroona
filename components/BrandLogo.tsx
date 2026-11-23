import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { overlay, radius, logo } from '../theme';
import { RETAILER_LOGOS, LOGO_ASPECT } from '../data/logos';
import Avatar from './Avatar';

type Props = {
  retailerId?: string;
  /** Cirkelns diameter, eller plattans bredd (`shape="plate"`). */
  size: number;
  /** Initialer när logotyp saknas (dagens initialavatar). Utan: inget ritas. */
  initial?: string;
  /** 'circle' (avatar) eller 'plate' (liggande platta 2:1, t.ex. på varumärkeskortet). */
  shape?: 'circle' | 'plate';
  style?: StyleProp<ViewStyle>;
};

/** Sant om återförsäljaren har en logotyp i registret (data/logos.ts). */
export function hasBrandLogo(retailerId?: string): boolean {
  return !!retailerId && !!RETAILER_LOGOS[retailerId];
}

/**
 * Återförsäljarlogotyp (brief 47) på en mörk platta (`overlay.logoPlate`,
 * samma i båda teman) med 1 px kant, eftersom flera logotyper är vita.
 * Logotypen tar ca 60 % av bredden med bevarad proportion (filerna är 90 × 45,
 * Filippa K bryter själv i två rader inom ramen). Saknas logotyp: initialavatar.
 */
export default function BrandLogo({ retailerId, size, initial, shape = 'circle', style }: Props) {
  const Logo = retailerId ? RETAILER_LOGOS[retailerId] : undefined;
  if (!Logo) return initial ? <Avatar initial={initial} size={size} style={style} /> : null;
  const w = size * logo.plateShare;
  const plateHeight = shape === 'circle' ? size : size / LOGO_ASPECT;
  return (
    <View
      style={[
        styles.plate,
        { width: size, height: plateHeight, borderRadius: shape === 'circle' ? radius.full : radius.control },
        shape === 'plate' && styles.squircle,
        style,
      ]}
    >
      <Logo width={w} height={w / LOGO_ASPECT} />
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.logoPlate,
    borderWidth: 1,
    borderColor: overlay.logoPlateEdge,
    overflow: 'hidden',
  },
  squircle: {
    borderCurve: 'continuous',
  },
});
