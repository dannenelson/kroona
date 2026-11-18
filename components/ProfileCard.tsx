import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';

const SIZE = 76;

type Props = {
  name: string;
  initial: string;
};

// Länkar alltid till en profilsida per designsystemet (docs/designsystem.md,
// ProfileCard: "Alltid cirkel. Länkar alltid till en profilsida.") — men
// ingen sådan route finns i Fas 0 (bara fyra flikar, ingen dynamisk
// profil-URL i app/). Ingen onPress kopplas in idag.
export default function ProfileCard({ name, initial }: Props) {
  const styles = useStyles();
  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.circle}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    width: SIZE,
    alignItems: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  initial: {
    ...typography.headline,
    color: t.colors.accentText,
  },
  name: {
    ...typography.caption,
    fontFamily: fonts.ui500, // vikt 500 behålls, storlek från caption
    color: t.colors.textPrimary,
    letterSpacing: 0.2, // lokal optisk spärrning
    textAlign: 'center',
  },
}));
