import { useId } from 'react';
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { useCardPress } from '../hooks/useCardPress';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { GestureDetector } from 'react-native-gesture-handler';
import { PARTNER_BOUNDARY_GROUP, PROFILE_BOUNDARY_GROUP } from './product/productTransition';
import { useFollowedPeople } from '../context/FollowedPeopleContext';
import { useLongPressMenu } from '../hooks/useLongPressMenu';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';
import BrandLogo, { hasBrandLogo } from './BrandLogo';

const SIZE = 76;

type Props = {
  name: string;
  initial: string;
  /** Varumärke (brief 29): kortet öppnar Partnerdetalj, cirkeln zoomar till covern. */
  partnerId?: string;
  /** Person (brief 37): kortet öppnar profilvyn; långt tryck ger Följ/Sluta följa och Öppna. */
  personId?: string;
};

// Länkar alltid till en profilsida per designsystemet (docs/designsystem.md,
// ProfileCard: "Alltid cirkel. Länkar alltid till en profilsida.") — men
// ingen sådan route finns i Fas 0 (bara fyra flikar, ingen dynamisk
// profil-URL i app/). Varumärken (partnerId) öppnar Partnerdetalj (brief 29),
// personer (personId) profilvyn (brief 37).
export default function ProfileCard({ name, initial, partnerId, personId }: Props) {
  const styles = useStyles();
  const router = useRouter();
  const { isFollowingPerson, toggleFollowPerson } = useFollowedPeople();
  // Samma tryckrespons som produktkorten (krympning, ingen opacitet).
  const press = useCardPress();
  const targetId = partnerId ?? personId;
  const boundaryId = `${targetId}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const open = () => {
    if (partnerId) router.push({ pathname: '/partner/[id]', params: { id: partnerId, b: boundaryId } });
    else if (personId) router.push({ pathname: '/profile/[id]', params: { id: personId, b: boundaryId } });
  };
  // Varumärke med logotyp (brief 47): logotypen på mörk platta i stället för initialer.
  const circle = hasBrandLogo(partnerId) ? (
    <BrandLogo retailerId={partnerId} size={SIZE} style={styles.logoCircle} />
  ) : (
    <View style={styles.circle}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
  // Kontextmeny för personer (samma meny som korten): Följ/Sluta följa, Öppna.
  const menu = useLongPressMenu({
    items: personId
      ? [
          {
            label: isFollowingPerson(personId) ? 'Sluta följa' : 'Följ',
            icon: 'user-add',
            onPress: () => toggleFollowPerson(personId),
          },
          { label: 'Öppna', icon: 'chevron-right', navigation: true, onPress: open },
        ]
      : [],
    radius: SIZE / 2,
    renderOverlay: () => circle,
    press,
  });
  return (
    <GestureDetector gesture={menu.gesture}>
      <Pressable
        style={styles.wrapper}
        disabled={!targetId}
        onLayout={press.onLayout}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={open}
        accessibilityRole={targetId ? 'button' : undefined}
        accessibilityLabel={name}
        accessibilityHint={personId ? 'Håll in för fler val' : undefined}
      >
        <Animated.View style={press.scaleStyle}>
          <View ref={menu.ref} collapsable={false} style={menu.hidden && styles.hidden}>
            {targetId ? (
              <Transition.Boundary id={boundaryId} group={partnerId ? PARTNER_BOUNDARY_GROUP : PROFILE_BOUNDARY_GROUP}>
                {circle}
              </Transition.Boundary>
            ) : (
              circle
            )}
          </View>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    width: SIZE,
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoCircle: {
    marginBottom: spacing.sm,
  },
  initial: {
    ...typography.headline,
    color: t.colors.textPrimary,
  },
  name: {
    ...typography.caption,
    fontFamily: fonts.ui500, // vikt 500 behålls, storlek från caption
    color: t.colors.textPrimary,
    letterSpacing: 0.2, // lokal optisk spärrning
    textAlign: 'center',
  },
}));
