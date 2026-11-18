import { useEffect, useRef, type ComponentType } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, edgeBlur, typography, spacing, radius, motion, iconSize } from '../theme';

type IconProps = { color: string; size?: number };

export type ContextMenuItem = {
  label: string;
  icon: ComponentType<IconProps>;
  onPress?: () => void;
};

/** Bildens läge i fönstret när det långa trycket började. */
export type AnchorRect = { x: number; y: number; width: number; height: number };

type Props = {
  visible: boolean;
  anchor: AnchorRect | null;
  imageUrl: string;
  items: readonly ContextMenuItem[];
  onClose: () => void;
};

// Lokala mått från referensen "Kroona Looken A": menybredd 250, rad 46.
const MENU_WIDTH = 250;
const ROW_HEIGHT = 46;
// Lyft kort får högst denna höjd så att menyn ryms under.
const MAX_LIFT_HEIGHT = 250;

/**
 * Meny vid långt tryck på kort (iOS-kontextmeny-känsla): kortets bild lyfts
 * (skala 1,04, skugga), bakgrunden blurras och dämpas, menyn ligger under.
 * Egen lösning med Modal: expo-routers Link.Menu är iOS-only, kräver href
 * och tar bara SF Symbols.
 */
export default function ProductContextMenu({ visible, anchor, imageUrl, items, onClose }: Props) {
  const { scheme, shadows } = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    progress.setValue(0);
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        progress.setValue(1);
      } else {
        Animated.timing(progress, {
          toValue: 1,
          duration: motion.duration.fast,
          useNativeDriver: true,
        }).start();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [visible, progress]);

  if (!anchor) return null;

  // Placering: bilden står kvar där den var om allt ryms, annars flyttas den
  // in på skärmen. Menyn läggs under bilden, eller ovanför om den inte ryms.
  const menuHeight = items.length * ROW_HEIGHT;
  const scale = Math.min(1, MAX_LIFT_HEIGHT / anchor.height);
  const liftW = anchor.width * scale;
  const liftH = anchor.height * scale;
  const top = insets.top + spacing.lg;
  const bottom = winH - insets.bottom - spacing.lg;
  const needed = liftH + spacing.xl + menuHeight;
  const liftY = Math.min(Math.max(anchor.y, top), bottom - needed);
  const liftX = Math.min(
    Math.max(anchor.x + (anchor.width - liftW) / 2, spacing.screenMargin),
    winW - spacing.screenMargin - liftW,
  );
  const menuY = liftY + liftH + spacing.xl;
  const menuX = Math.min(
    Math.max(liftX + liftW / 2 - MENU_WIDTH / 2, spacing.screenMargin),
    winW - spacing.screenMargin - MENU_WIDTH,
  );

  const liftScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, motion.liftScale] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Pressable accessibilityLabel="Stäng meny" style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView
            tint={scheme}
            intensity={edgeBlur.menuBackdropIntensity}
            blurMethod="dimezisBlurViewSdk31Plus"
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.lift,
          {
            left: liftX,
            top: liftY,
            width: liftW,
            height: liftH,
            boxShadow: shadows.lift,
            transform: [{ scale: liftScale }],
          },
        ]}
      >
        <Image source={{ uri: imageUrl }} style={styles.liftImage} resizeMode="cover" />
      </Animated.View>

      <Animated.View
        style={[
          styles.menu,
          { left: menuX, top: menuY, width: MENU_WIDTH, boxShadow: shadows.menu, opacity: progress },
        ]}
      >
        <BlurView
          tint={scheme}
          intensity={edgeBlur.menuIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, styles.menuFill]} />
        {items.map((item, i) => (
          <MenuRow key={item.label} item={item} first={i === 0} onClose={onClose} />
        ))}
      </Animated.View>
    </Modal>
  );
}

function MenuRow({ item, first, onClose }: { item: ContextMenuItem; first: boolean; onClose: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="menuitem"
      onPress={() => {
        item.onPress?.();
        onClose();
      }}
      style={({ pressed }) => [styles.row, !first && styles.rowDivider, pressed && styles.rowPressed]}
    >
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Icon color={colors.textPrimary} size={iconSize.md} />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  scrim: {
    backgroundColor: t.colors.scrim,
  },
  lift: {
    position: 'absolute',
    borderRadius: radius.lifted,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.placeholder,
  },
  liftImage: {
    width: '100%',
    height: '100%',
  },
  menu: {
    position: 'absolute',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: t.glass.borderWidth,
    borderColor: t.glass.borderColor,
  },
  menuFill: {
    backgroundColor: t.colors.menu,
  },
  row: {
    height: ROW_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.border,
  },
  rowPressed: {
    backgroundColor: t.colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
}));
