// Profil-hero (brief 65 med tillägg): gemensam för Partnerdetalj (företag) och
// Samlingsdetalj. Lägre cover (`profileHero`), parallax via `parallaxStyle`,
// svagare toning (`overlay.heroScrimSoft`). Längst ner på toningen: vänster
// innehållet (valfritt `leading` som logotypcirkel + namn, eller en
// samlingslogotyp i stället för namnet, och en undertext), höger Följ,
// linjerad i botten. Inget antal i hero. Coverns Boundary är zoommålet.
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, typography, spacing, overlay, logo as logoTokens } from '../theme';
import { LOGO_ASPECT, type LogoComponent } from '../data/logos';
import Pill from './Pill';

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
  /** Rad under namnet, t.ex. företagets områden eller samlingens typ. */
  subtitle?: string;
  /** Följ-knappen till höger; utelämnas för det som inte går att följa. */
  follow?: { followed: boolean; onPress: () => void };
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
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {follow ? (
          <Pill variant="glass" tone="photo" selected={follow.followed} onPress={follow.onPress}>
            {follow.followed ? 'Följer' : 'Följ'}
          </Pill>
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
  subtitle: {
    ...typography.label,
    color: overlay.onPhotoMuted,
  },
}));
