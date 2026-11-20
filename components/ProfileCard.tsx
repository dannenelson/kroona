import { useId } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { PARTNER_BOUNDARY_GROUP } from './product/productTransition';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';

const SIZE = 76;

type Props = {
  name: string;
  initial: string;
  /** Varumärke (brief 29): kortet öppnar Partnerdetalj, cirkeln zoomar till covern. */
  partnerId?: string;
};

// Länkar alltid till en profilsida per designsystemet (docs/designsystem.md,
// ProfileCard: "Alltid cirkel. Länkar alltid till en profilsida.") — men
// ingen sådan route finns i Fas 0 (bara fyra flikar, ingen dynamisk
// profil-URL i app/). Varumärken (partnerId) öppnar Partnerdetalj (brief 29).
export default function ProfileCard({ name, initial, partnerId }: Props) {
  const styles = useStyles();
  const router = useRouter();
  const boundaryId = `${partnerId}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const circle = (
    <View style={styles.circle}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
  return (
    <TouchableOpacity
      style={styles.wrapper}
      disabled={!partnerId}
      onPress={() => partnerId && router.push({ pathname: '/partner/[id]', params: { id: partnerId, b: boundaryId } })}
    >
      {partnerId ? (
        <Transition.Boundary id={boundaryId} group={PARTNER_BOUNDARY_GROUP}>
          {circle}
        </Transition.Boundary>
      ) : (
        circle
      )}
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    width: SIZE,
    alignItems: 'center',
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
