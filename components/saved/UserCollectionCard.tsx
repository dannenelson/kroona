import { useId, type ComponentType, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { GestureDetector } from 'react-native-gesture-handler';
import { makeStyles, typography, fonts, spacing, radius, iconSize } from '../../theme';
import { useCardPress } from '../../hooks/useCardPress';
import { useLongPressMenu } from '../../hooks/useLongPressMenu';
import type { ContextMenuItem } from '../ProductContextMenu';
import { COLLECTION_BOUNDARY_GROUP } from '../product/productTransition';
import CollectionMosaic from '../CollectionMosaic';

type IconProps = { color: string; size?: number };

type Props = {
  /** Route-id i Samlingsdetalj (`saved` eller en egen samlings id). */
  id: string;
  name: string;
  subtitle: string;
  /** Liten ikon före undertexten (lås för privat). */
  subtitleIcon?: ComponentType<IconProps>;
  images: string[];
  width: number;
  /** Ersätter mosaiken (t.ex. hjärtat för Gillade produkter). */
  cover?: ReactNode;
  menuItems?: ContextMenuItem[];
};

/**
 * Kort i Sparats kortvy (brief 32, 35): kvadratiskt omslag (mosaik, radie
 * `radius.collection`), namn och undertext under. Samma tryckrespons och
 * kontextmeny som övriga kort, zoom till Samlingsdetalj.
 */
export default function UserCollectionCard({
  id,
  name,
  subtitle,
  subtitleIcon: SubIcon,
  images,
  width,
  cover,
  menuItems = [],
}: Props) {
  const styles = useStyles();
  const router = useRouter();
  const press = useCardPress();
  const boundaryId = `${id}_${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const coverNode = cover ?? <CollectionMosaic images={images} style={[styles.cover, { width, height: width }]} />;
  const menu = useLongPressMenu({
    items: menuItems,
    imageUri: images[0],
    radius: radius.collection,
    renderOverlay: () => coverNode,
    press,
  });

  return (
    <GestureDetector gesture={menu.gesture}>
      <Pressable
        style={{ width }}
        onLayout={press.onLayout}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={() => router.push({ pathname: '/collection/[id]', params: { id, b: boundaryId } })}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${subtitle}`}
        accessibilityHint={menuItems.length ? 'Håll in för fler val' : undefined}
      >
        <Animated.View style={press.scaleStyle}>
          <Transition.Boundary id={boundaryId} group={COLLECTION_BOUNDARY_GROUP}>
            <View ref={menu.ref} collapsable={false} style={menu.hidden && styles.hidden}>
              {coverNode}
            </View>
          </Transition.Boundary>
          <View style={styles.text}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.subRow}>
              {SubIcon ? <SubIcon color={styles.meta.color} size={iconSize.xs} /> : null}
              <Text style={styles.meta} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  cover: {
    borderRadius: radius.collection,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.colors.border,
  },
  hidden: {
    opacity: 0,
  },
  text: {
    paddingTop: spacing.sm,
  },
  name: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  meta: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: t.colors.textSecondary,
  },
}));
