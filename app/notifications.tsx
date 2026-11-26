// Notiser (brief 64): öppnas från klockan på Hem och glider in från höger.
// DUMMYDATA (data/notifications.ts), grupperade Idag / Tidigare, med tomläge.
// När skärmen öppnas markeras allt som läst och pricken på klockan försvinner.
// Inga riktiga notiser eller push i Fas 0.
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, radius, iconSize, touchTarget } from '../theme';
import { useNotifications } from '../context/NotificationsContext';
import type { AppNotification } from '../data/notifications';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';

const GROUPS: { key: AppNotification['group']; title: string }[] = [
  { key: 'today', title: 'Idag' },
  { key: 'earlier', title: 'Tidigare' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const { notifications, markAllRead } = useNotifications();

  useEffect(() => markAllRead(), [markAllRead]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        <ScreenHeader title="Notiser" />
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="notification" color={colors.textTertiary} size={iconSize.lg * 2} />
            <Text style={styles.emptyTitle}>Inga notiser än</Text>
            <Text style={styles.emptyHint}>Här hamnar nyheter från det du följer och sparar.</Text>
          </View>
        ) : (
          GROUPS.map(({ key, title }) => {
            const items = notifications.filter((n) => n.group === key);
            if (items.length === 0) return null;
            return (
              <View key={key} style={styles.group}>
                <Text style={styles.groupTitle} accessibilityRole="header">
                  {title}
                </Text>
                {items.map((n) => (
                  <View
                    key={n.id}
                    style={styles.row}
                    accessible
                    accessibilityLabel={`${n.title}. ${n.text}. ${n.time}`}
                  >
                    <View style={styles.iconCircle}>
                      <Icon name={n.icon} color={colors.textPrimary} size={iconSize.md} />
                    </View>
                    <View style={styles.texts}>
                      <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={2}>
                          {n.title}
                        </Text>
                        <Text style={styles.time}>{n.time}</Text>
                      </View>
                      <Text style={styles.text} numberOfLines={2}>
                        {n.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  group: {
    paddingTop: spacing.xl,
    gap: spacing.xs,
  },
  groupTitle: {
    ...typography.label,
    color: t.colors.textSecondary,
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  iconCircle: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceRaised,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    color: t.colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: t.colors.textTertiary,
  },
  text: {
    ...typography.label,
    color: t.colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.title2,
    color: t.colors.textPrimary,
  },
  emptyHint: {
    ...typography.body,
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
}));
