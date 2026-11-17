import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function Header() {
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBg,
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '500',
  },
  logo: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 18,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  notifButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
});