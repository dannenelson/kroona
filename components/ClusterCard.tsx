import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, Radius } from '../constants/spacing';

const AVATAR_SIZE = 48;
const AVATAR_OVERLAP = 18; // pixlar de överlappande cirklarna kryper in i varandra

type ClusterAvatar = {
  initial: string;
  color: string;
};

type Props = {
  title: string;
  avatars: [ClusterAvatar, ClusterAvatar, ClusterAvatar];
  related: string[];
};

export default function ClusterCard({ title, avatars, related }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.card}>
          {/* sustainGreenBg återanvänds som platshållar-"platta" — ingen
              dedikerad ClusterCard-färgtoken finns ännu. */}
          <View style={styles.plate}>
            <View style={styles.avatarStack}>
              {avatars.map((avatar, i) => (
                <View
                  key={i}
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: avatar.color, zIndex: avatars.length - i },
                    i > 0 && styles.avatarOverlap,
                  ]}
                >
                  <Text style={styles.avatarInitial}>{avatar.initial}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.related} numberOfLines={2}>Relaterat: {related.join(', ')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  wrapper: {
    paddingHorizontal: Spacing.screenMargin,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.cardBorder,
  },
  plate: {
    height: 120,
    backgroundColor: Colors.sustainGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: Colors.sustainGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -AVATAR_OVERLAP,
  },
  avatarInitial: {
    color: Colors.background,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 18,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  related: {
    color: Colors.textSecondary,
    fontFamily: 'GoogleSansFlex_400Regular',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
