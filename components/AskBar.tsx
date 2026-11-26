import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { makeStyles, useTheme, typography, fonts, spacing, radius, control, iconSize } from '../theme';
import Icon from './Icon';

type Props = {
  /** Söktermen som visas i fältet (Sökresultat); utan den visas platshållaren. */
  value?: string;
  /** Standard: öppna sökläget (med `value` ifyllt). */
  onPress?: () => void;
  /** Ikonen till vänster (brief 57): `find` (förstoringsglas + stjärna, standard:
   *  Hem och Hitta) eller `search` (förstoringsglas, Sökresultat, där fältet visar en sökning). */
  icon?: 'find' | 'search';
  /** Platshållaren när fältet är tomt (standard "Fråga eller sök"; Hem har egen, brief 63). */
  placeholder?: string;
  /** Utan egen sidomarginal (när fältet ligger i en rad med annat). */
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * "Fråga eller sök" (brief 53): ett tryckbart fält, inte en riktig inmatning.
 * 56 högt, sök + stjärna till vänster, mikrofon till höger (bara ikon i Fas 0).
 * Tryck öppnar sökläget (app/search.tsx), där man väljer sök eller dialog.
 * Används på Hem, Hitta och Sökresultat.
 */
export default function AskBar({ value, onPress, icon = 'find', placeholder = 'Fråga eller sök', inline, style }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();

  const open = onPress ?? (() => router.push({ pathname: '/search', params: value ? { q: value } : {} }));

  return (
    <View style={[!inline && styles.wrapper, style]}>
      <Pressable
        onPress={open}
        accessibilityRole="search"
        accessibilityLabel={value ? `Sökning: ${value}. Ändra` : placeholder}
        style={({ pressed }) => [styles.bar, pressed && styles.pressed]}
      >
        <Icon
          name={icon}
          color={icon === 'search' ? colors.textSecondary : colors.textPrimary}
          size={iconSize.md}
        />
        <Text style={[styles.text, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="microphone" color={colors.textSecondary} size={iconSize.lg} />
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
