import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeStyles, typography, spacing, radius, iconSize } from '../theme';

const AVATAR_SIZE = 32;

export default function Header() {
  const styles = useStyles();
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.avatar}>
        <Text style={styles.avatarText}>D</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Kroona</Text>

      <TouchableOpacity style={styles.notifButton}>
        <Text style={styles.notifIcon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
  logo: {
    ...typography.title2,
    color: t.colors.textPrimary,
    letterSpacing: 2, // lokal: logotypens spärrning
    textTransform: 'uppercase',
  },
  notifButton: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: iconSize.md - 4, // lokal: emoji-ikon, optiskt 16 tills ikonbibliotek finns
  },
}));
