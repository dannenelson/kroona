import { useId } from 'react';
import { Animated, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { COLLECTION_BOUNDARY_GROUP } from './product/productTransition';
import { useCardPress } from '../hooks/useCardPress';
import { makeStyles, typography, fonts, spacing, radius } from '../theme';

const AVATAR_SIZE = 32;

type Props = {
  id: string;
  title: string;
  curatorInitial: string;
  itemCount: number;
  updatedLabel: string;
  images: [string, string, string];
  /** Öppnar Samlingsdetalj med zoom (brief 37: personers samlingar). */
  collectionId?: string;
};

export default function CollectionCard({ title, curatorInitial, itemCount, updatedLabel, images, collectionId }: Props) {
  const styles = useStyles();
  const router = useRouter();
  // Samma tryckrespons som produktkorten (krympning, ingen opacitet).
  const press = useCardPress();
  const boundaryId = `${collectionId}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const imagesBlock = (
      <View style={styles.imagesContainer}>
        <Image source={{ uri: images[0] }} style={styles.imageLarge} />
        <View style={styles.imagesSmall}>
          <Image source={{ uri: images[1] }} style={styles.imageSmall} />
          <Image source={{ uri: images[2] }} style={styles.imageSmall} />
        </View>
        {/* Kuratorns profilfoto — samma avatar-mönster som Header.tsx
            (bokstavsavatar, ingen riktig foto-data finns ännu). */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{curatorInitial}</Text>
        </View>
      </View>
  );
  return (
    <Pressable
      disabled={!collectionId}
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={() =>
        collectionId && router.push({ pathname: '/collection/[id]', params: { id: collectionId, b: boundaryId } })
      }
      accessibilityRole={collectionId ? 'button' : undefined}
      accessibilityLabel={title}
    >
    <Animated.View style={[styles.wrapper, press.scaleStyle]}>
      {collectionId ? (
        <Transition.Boundary id={boundaryId} group={COLLECTION_BOUNDARY_GROUP}>
          {imagesBlock}
        </Transition.Boundary>
      ) : (
        imagesBlock
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.meta} numberOfLines={1}>{itemCount} objekt · {updatedLabel}</Text>
      </View>
    </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: {
    width: 220,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 160,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
    borderRadius: radius.collection, // samlingskort (design.md §0)
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  imageLarge: {
    flex: 2,
    height: '100%',
  },
  imagesSmall: {
    flex: 1,
    gap: StyleSheet.hairlineWidth, // tunn bildskarv
  },
  imageSmall: {
    flex: 1,
    width: '100%',
  },
  avatar: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    backgroundColor: t.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarText: {
    ...typography.label,
    color: t.colors.textPrimary,
  },
  content: {
    paddingTop: spacing.md,
  },
  title: {
    ...typography.body,
    color: t.colors.textPrimary,
    letterSpacing: 0.3, // lokal optisk spärrning
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.micro,
    fontFamily: fonts.ui400, // regular som tidigare
    color: t.colors.textSecondary,
    letterSpacing: 0.3, // lokal optisk spärrning
  },
}));
