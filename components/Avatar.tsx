import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, typography, fonts, radius } from '../theme';

type Props = {
  initial: string;
  size: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Rund avatar med initialer (brief 35, 37): varumärken och personer tills
 * riktiga bilder finns. Yta `surfaceRaised`; texten skalar med storleken
 * (`micro` under 32, `body` för små, `title1` från 64 och uppåt).
 */
export default function Avatar({ initial, size, style }: Props) {
  const styles = useStyles();
  const large = size >= LARGE;
  const tiny = size < SMALL;
  return (
    <View style={[styles.circle, { width: size, height: size }, style]}>
      <Text style={large ? styles.textLarge : tiny ? styles.textTiny : styles.text}>{initial}</Text>
    </View>
  );
}

// Från denna storlek får initialerna rubrikstorlek; under SMALL (t.ex. chip,
// brief 43) minsta textstorleken.
const LARGE = 64;
const SMALL = 32;

const useStyles = makeStyles((t) => ({
  circle: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
  text: {
    ...typography.body,
    fontFamily: fonts.ui600,
    color: t.colors.textPrimary,
  },
  textTiny: {
    ...typography.micro,
    fontFamily: fonts.ui600,
    color: t.colors.textPrimary,
  },
  textLarge: {
    ...typography.title1,
    color: t.colors.textPrimary,
  },
}));
