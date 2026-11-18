import type { ReactNode } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, motion, touchTarget, iconSize } from '../theme';
import EdgeFade from './EdgeFade';
import { usePressAnimation } from '../hooks/usePressAnimation';

import HomeIcon from '../assets/icons/HomeIcon';
import HomeIconFilled from '../assets/icons/HomeIcon_filled';
import FeedIcon from '../assets/icons/FeedIcon';
import FeedIconFilled from '../assets/icons/FeedIcon_filled';
import FindIcon from '../assets/icons/FindIcon';
import FindIconFilled from '../assets/icons/FindIcon_filled';
import SavedIcon from '../assets/icons/SavedIcon';
import SavedIconFilled from '../assets/icons/SavedIcon_filled';

const ICONS = {
  index: { outlined: HomeIcon, filled: HomeIconFilled },
  feed: { outlined: FeedIcon, filled: FeedIconFilled },
  find: { outlined: FindIcon, filled: FindIconFilled },
  saved: { outlined: SavedIcon, filled: SavedIconFilled },
};

const LABELS: Record<string, string> = {
  index: 'Hem',
  feed: 'Flöde',
  find: 'Hitta',
  saved: 'Sparat',
};

// Lokala mått för tab-baren (flikbredd och höjd är komponentmått, inte spacing).
// Referensen "Kroona Looken A": flik 56 hög, ikon 25 (här iconSize.lg 24),
// etikett 10,5/500 (här micro 10/14), ikonerna ligger lågt nära hemindikatorn.
const TAB_WIDTH = 80;
const TAB_ROW_HEIGHT = touchTarget + spacing.md; // 56
const TAB_GAP = 3; // lokal optisk justering: ikon → etikett (referensen)
// Hur långt in i hemindikatorns safe area flikarna sänks (referensen: 10 px
// från skärmkanten på en iPhone med 34 px safe area).
const NAV_LOWER = spacing.xl;

export default function CustomTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  // Flikarna sänks in i safe area, men aldrig närmare kanten än spacing.sm.
  const bottomPad = Math.max(insets.bottom - NAV_LOWER, spacing.sm);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]} pointerEvents="box-none">
      {/* Kantblur ersätter den tidigare toningen (brief 04). */}
      <EdgeFade position="bottom" />

      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconSet = ICONS[route.name as keyof typeof ICONS];
          const Icon = isFocused ? iconSet.filled : iconSet.outlined;
          const label = LABELS[route.name];

          const onPress = () => {
            // SDK 58: expo-router:s tab-bar-props ger emitter + navigateToTab i
            // stället för navigation (samma logik som expo-router:s BottomTabBar).
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          const color = isFocused ? colors.textPrimary : colors.textSecondary;

          return (
            <NavTab key={route.key} label={label} selected={isFocused} onPress={onPress}>
              <Icon color={color} size={iconSize.lg} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </NavTab>
          );
        })}
      </View>
    </View>
  );
}

/** En nav-flik med animerad nedskalning (0,92) vid tryck, brief 06. */
function NavTab({
  label,
  selected,
  onPress,
  children,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const styles = useStyles();
  const press = usePressAnimation(motion.navPressedScale);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
    >
      <Animated.View style={[styles.tab, press.scaleStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    width: TAB_WIDTH,
    height: TAB_ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: TAB_GAP,
  },
  label: {
    ...typography.micro,
    includeFontPadding: false,
    textAlign: 'center',
  },
}));

// Utrymme som skärmarnas innehåll lämnar för tab-baren, utöver insets.bottom.
// Flikraden plus luft. Flikarna sänks in i safe area på enheter med
// hemindikator, så på dem blir det lite extra luft (ofarligt).
export const TAB_BAR_HEIGHT = TAB_ROW_HEIGHT + spacing.sm;
