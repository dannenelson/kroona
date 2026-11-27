// Profil-hero (brief 65 med tillägg): gemensam för Partnerdetalj (företag) och
// Samlingsdetalj. Lägre cover (`profileHero`), parallax via `parallaxStyle`,
// svagare toning (`overlay.heroScrimSoft`). Längst ner på toningen: vänster
// innehållet (valfritt `leading` som logotypcirkel + namn, eller en
// samlingslogotyp i stället för namnet, och en undertext), höger Följ,
// linjerad i botten. Coverns Boundary är zoommålet. Under Följ: antal följare
// (brief 74), i samma textstil som undertexten och på samma baslinje.
// Brief 74: undertexten kan ha en liten ikon före (lås för privat samling) och
// vara tryckbar (kuratorns profil på Samlingsdetalj).
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, typography, spacing, overlay, motion, iconSize, logo as logoTokens } from '../theme';
import { LOGO_ASPECT, type LogoComponent } from '../data/logos';
import Pill from './Pill';
import Icon, { type IconName } from './Icon';
import { formatFollowers } from '../utils/format';

type Props = {
  boundary: { id: string; group: string };
  width: number;
  height: number;
  /** Animerad stil från useParallaxHero. */
  parallaxStyle: object;
  /** Bilden (eller mosaiken), i full storlek. */
  cover: ReactNode;
  title: string;
  /** Vit logotyp som ersätter titeltexten (samlingar med logotyp). */
  logo?: LogoComponent;
  /** Före namnet, t.ex. företagets runda logotyp. */
  leading?: ReactNode;
  /** Rad under namnet, t.ex. företagets områden eller "Kollektion av Filippa K". */
  subtitle?: string;
  /** Liten ikon före undertexten, t.ex. `lock` för privat samling. */
  subtitleIcon?: IconName;
  /** Gör undertexten tryckbar (t.ex. kuratorns profil). */
  onSubtitlePress?: () => void;
  /** Följ-knappen till höger; utelämnas för det som inte går att följa. */
  follow?: { followed: boolean; onPress: () => void; /** Visat antal följare (inkl. användaren). */ count?: number };
};

export default function ProfileHero({
  boundary,
  width,
  height,
  parallaxStyle,
  cover,
  title,
  logo: Logo,
  leading,
  subtitle,
  subtitleIcon,
  onSubtitlePress,
  follow,
}: Props) {
  const styles = useStyles();
  const logoHeight = logoTokens.maxHeight;
  return (
    <Transition.Boundary id={boundary.id} group={boundary.group} style={[styles.cover, { width, height }]}>
      {/* Parallax: bilden glider bakom innehållet och skalas vid överscroll. */}
      <Reanimated.View style={[{ width, height }, parallaxStyle]}>{cover}</Reanimated.View>
      <LinearGradient
        colors={overlay.heroScrimSoft.colors}
        locations={overlay.heroScrimSoft.locations}
        style={styles.scrim}
      >
        <View style={styles.text}>
          {Logo ? (
            <Logo
              width={logoHeight * LOGO_ASPECT}
              height={logoHeight}
              accessibilityLabel={title}
              style={styles.logo}
            />
          ) : (
            <View style={styles.nameRow}>
              {leading}
              <Text style={styles.name} numberOfLines={2} accessibilityRole="header">
                {title}
              </Text>
            </View>
          )}
          {subtitle ? (
            <Pressable
              disabled={!onSubtitlePress}
              onPress={onSubtitlePress}
              accessibilityRole={onSubtitlePress ? 'link' : 'text'}
              hitSlop={spacing.sm}
              style={({ pressed }) => [styles.subtitleRow, pressed && styles.pressed]}
            >
              {subtitleIcon ? <Icon name={subtitleIcon} size={iconSize.xs} color={overlay.onPhotoMuted} /> : null}
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {follow ? (
          <View style={styles.followBlock}>
            <Pill variant="glass" tone="photo" selected={follow.followed} onPress={follow.onPress}>
              {follow.followed ? 'Följer' : 'Följ'}
            </Pill>
            {follow.count !== undefined ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {formatFollowers(follow.count)}
              </Text>
            ) : null}
          </View>
        ) : null}
      </LinearGradient>
    </Transition.Boundary>
  );
}

const useStyles = makeStyles((t) => ({
  cover: {
    backgroundColor: t.colors.placeholder,
  },
  // Svagare toning (fast, mörk i båda teman), texten i fast ljus färg ovanpå.
  // Rad: text vänster, Följ höger, linjerade i botten.
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.lg,
  },
  text: {
    flex: 1,
    gap: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  name: {
    ...typography.title1,
    color: overlay.onPhoto,
    flexShrink: 1,
  },
  logo: {
    alignSelf: 'flex-start',
  },
  // Följ och antal under, högerställda; antalet ligger på undertextens baslinje.
  followBlock: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  // Ikon (12) 4 px före texten, centrerad mot raden.
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  subtitle: {
    ...typography.label,
    color: overlay.onPhotoMuted,
    flexShrink: 1,
  },
  pressed: {
    opacity: motion.pressedOpacity,
  },
}));
