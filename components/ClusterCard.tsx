import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { makeStyles, typography, spacing, radius } from '../theme';

const PLATE_HEIGHT = 120;

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
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.card}>
          {/* successSubtle återanvänds som platshållar-"platta" — ingen
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

const useStyles = makeStyles((t) => ({
  section: {
    marginTop: spacing.xxl,
  },
  wrapper: {
    paddingHorizontal: spacing.screenMargin,
  },
  card: {
    width: '100%',
    backgroundColor: t.colors.surface,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  plate: {
    height: PLATE_HEIGHT,
    backgroundColor: t.colors.successSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    borderWidth: 3, // lokal: avatarring mot plattan
    borderColor: t.colors.successSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -AVATAR_OVERLAP,
  },
  avatarInitial: {
    ...typography.headline,
    color: t.colors.onAccent,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headline,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
  },
  related: {
    ...typography.caption,
    color: t.colors.textSecondary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
}));
