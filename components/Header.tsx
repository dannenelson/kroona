import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../context/NotificationsContext';
import { makeStyles, typography, spacing, touchTarget, iconSize, homeHeader } from '../theme';
import { DUMMY_USER } from '../data/user';
import { sessionGreetingFor } from '../lib/greetings';
import Avatar from './Avatar';
import KroonaLogo from './KroonaLogo';
import NotificationIcon from './NotificationIcon';


/**
 * Hem-toppen (brief 46): toppraden 44 med avatar (initialer), Kroona-logotypen
 * absolut centrerad (oberoende av sidoelementens bredd) och notisikonen i en
 * 44 × 44 träffyta, sedan hälsningen efter tid på dygnet.
 */
export default function Header() {
  const styles = useStyles();
  const router = useRouter();
  const { hasUnread } = useNotifications();
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Logotypen ligger i ett eget lager över hela raden, så den står mitt på. */}
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <KroonaLogo height={homeHeader.logoHeight} />
        </View>
        {/* Avatar 40 (brief 51), träffyta 44 via hitSlop. Öppnar Profil, som glider
            in från vänster (brief 64). */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Profil, ${DUMMY_USER.name}`}
          hitSlop={(touchTarget - homeHeader.avatar) / 2}
          onPress={() => router.push('/me')}
        >
          <Avatar initial={DUMMY_USER.initials} size={homeHeader.avatar} initialStyle={styles.initials} />
        </Pressable>
        {/* Notiser (brief 64), glider in från höger. Prick när det finns olästa. */}
        <Pressable
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel={hasUnread ? 'Notiser, olästa' : 'Notiser'}
          onPress={() => router.push('/notifications')}
        >
          <NotificationIcon size={iconSize.lg} unread={hasUnread} />
        </Pressable>
      </View>
      {/* Varierande hälsning (lib/greetings.ts), samma hela sessionen; alltid en rad,
          en lång rad krymps hellre än bryts. */}
      <Text style={styles.greeting} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={homeHeader.greetingMinScale}>
        {sessionGreetingFor(DUMMY_USER.name)}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.xl, // toppraden → hälsning 24 (brief 49)
  },
  row: {
    height: homeHeader.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    // Ikonens kant (inte träffytans) linjerar med skärmmarginalen.
    marginRight: -(touchTarget - iconSize.lg) / 2,
  },
  // Initialerna skalas upp med avataren (body 15 vid 32 → headline 17 vid 40).
  initials: {
    ...typography.headline,
  },
  greeting: {
    ...typography.greeting,
    color: t.colors.textPrimary,
  },
}));
