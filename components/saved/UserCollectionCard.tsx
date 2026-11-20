import { useId } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { makeStyles, typography, fonts, spacing, radius } from '../../theme';
import { useCardPress } from '../../hooks/useCardPress';
import { COLLECTION_BOUNDARY_GROUP } from '../product/productTransition';
import CollectionMosaic from '../CollectionMosaic';

type Props = {
  /** Route-id i Samlingsdetalj (`saved` eller en egen samlings id). */
  id: string;
  name: string;
  count: number;
  /** "Privat"/"Publik", eller inget för systemsamlingen. */
  visibilityLabel?: string;
  images: string[];
  width: number;
};

/**
 * Kort för "Alla sparade" och egna samlingar i Sparat (brief 32): kvadratiskt
 * mosaikomslag, namn och antal (+ Privat/Publik). Samma tryckrespons som
 * övriga kort och zoom till Samlingsdetalj (unik boundary per kortinstans).
 */
export default function UserCollectionCard({ id, name, count, visibilityLabel, images, width }: Props) {
  const styles = useStyles();
  const router = useRouter();
  const press = useCardPress();
  const boundaryId = `${id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const meta = [`${count} produkter`, ...(visibilityLabel ? [visibilityLabel] : [])].join(' · ');

  return (
    <Pressable
      style={{ width }}
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id, b: boundaryId } })}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${meta}`}
    >
      <Animated.View style={press.scaleStyle}>
        <Transition.Boundary id={boundaryId} group={COLLECTION_BOUNDARY_GROUP}>
          <CollectionMosaic images={images} style={[styles.cover, { width, height: width }]} />
        </Transition.Boundary>
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  cover: {
    borderRadius: radius.collection,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  text: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
  meta: {
    ...typography.micro,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
}));
