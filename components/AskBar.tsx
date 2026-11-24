import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, useTheme, typography, fonts, spacing, radius, control, iconSize } from '../theme';
import StarIcon from '../assets/icons/StarIcon';
import MicIcon from '../assets/icons/MicIcon';

type Props = {
  /** Söktermen som visas i fältet (Sökresultat); utan den visas platshållaren. */
  value?: string;
  /** Standard: öppna sökläget (med `value` ifyllt). */
  onPress?: () => void;
  /** Utan egen sidomarginal (när fältet ligger i en rad med annat). */
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * "Fråga eller sök" (brief 53): ett tryckbart fält, inte en riktig inmatning.
 * 56 högt, stjärna till vänster, mikrofon till höger (bara ikon i Fas 0).
 * Tryck öppnar sökläget (app/search.tsx), där man väljer sök eller dialog.
 * Används på Hem, Hitta och Sökresultat.
 */
export default function AskBar({ value, onPress, inline, style }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();

  const open = onPress ?? (() => router.push({ pathname: '/search', params: value ? { q: value } : {} }));

  return (
    <View style={[!inline && styles.wrapper, style]}>
      <Pressable
        onPress={open}
        accessibilityRole="search"
        accessibilityLabel={value ? `Sökning: ${value}. Ändra` : 'Fråga eller sök'}
        style={({ pressed }) => [styles.bar, pressed && styles.pressed]}
      >
        <StarIcon color={colors.textPrimary} size={iconSize.md} />
        <Text style={[styles.text, !value && styles.placeholder]} numberOfLines={1}>
          {value || 'Fråga eller sök'}
        </Text>
        <MicIcon color={colors.textSecondary} size={iconSize.lg} />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  bar: {
    height: control.fieldHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: t.colors.surfaceRaised,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    backgroundColor: t.colors.pressed,
  },
  text: {
    flex: 1,
    ...typography.body,
    color: t.colors.textPrimary,
  },
  placeholder: {
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
}));
