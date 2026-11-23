import { View, Text, Pressable, StyleSheet } from 'react-native';
import { makeStyles, typography, spacing, touchTarget, iconSize, homeHeader } from '../theme';
import { DUMMY_USER } from '../data/user';
import Avatar from './Avatar';
import KroonaLogo from './KroonaLogo';
import NotificationIcon from './NotificationIcon';

/** "God morgon" 05–11, "God eftermiddag" 12–17, annars "God kväll". */
export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'God morgon';
  if (h >= 12 && h < 18) return 'God eftermiddag';
  return 'God kväll';
}

/**
 * Hem-toppen (brief 46): toppraden 44 med avatar (initialer), Kroona-logotypen
 * absolut centrerad (oberoende av sidoelementens bredd) och notisikonen i en
 * 44 × 44 träffyta, sedan hälsningen efter tid på dygnet.
 */
export default function Header() {
  const styles = useStyles();
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Logotypen ligger i ett eget lager över hela raden, så den står mitt på. */}
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <KroonaLogo height={homeHeader.logoHeight} />
        </View>
        {/* Avatar 40 (brief 51), träffyta 44 via hitSlop. Profilskärmen för
            användaren finns inte än (Fas 0): trycket gör ingenting. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Profil, ${DUMMY_USER.name}`}
          hitSlop={(touchTarget - homeHeader.avatar) / 2}
          onPress={() => {}}
        >
          <Avatar initial={DUMMY_USER.initials} size={homeHeader.avatar} initialStyle={styles.initials} />
        </Pressable>
        {/* Notisskärmen finns inte än (Fas 0): trycket gör ingenting. */}
        <Pressable
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel="Notiser"
          onPress={() => {}}
        >
          <NotificationIcon size={iconSize.lg} />
        </Pressable>
      </View>
      <Text style={styles.greeting}>
        {greetingFor(new Date())}, {DUMMY_USER.name}
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
