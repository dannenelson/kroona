import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

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
  return (
    <TouchableOpacity style={styles.wrapper}>
      <View style={styles.circle}>
        <Text style={styles.initial}>{initial}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    alignItems: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.cardBg,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  initial: {
    color: Colors.gold,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 22,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'GoogleSansFlex_500Medium',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
