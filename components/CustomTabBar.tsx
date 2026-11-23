import type { ReactNode } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, typography, spacing, motion, iconSize, tabBar } from '../theme';
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
  feed: 'Följer',
  find: 'Hitta',
  saved: 'Sparat',
};

// Lokala mått för tab-baren (flikbredd är ett komponentmått, inte spacing).
// Referensen "Kroona Looken A": flik 56 hög, ikon 25 (här iconSize.lg 24),
// etikett 10,5/500 (här micro 10/14).
const TAB_WIDTH = 80;

// Ikon + avstånd + etikett, och luften under etiketten inne i den 56 höga raden.
const TAB_BLOCK = iconSize.lg + tabBar.iconLabelGap + typography.micro.lineHeight; // 41
const TAB_INNER_BELOW = (tabBar.rowHeight - TAB_BLOCK) / 2; // 7,5

/**
 * Avstånd från skärmkanten till flikradens underkant (brief 46, 49).
 * Etikettblockets underkant ligger `tabBar.labelBottom` (36) från kanten med
 * safe area nedtill, dvs. raden 28,5 från kanten; utan safe area
 * `tabBar.labelBottomNoInset` (24), raden 16,5 från kanten.
 */
export function tabBarBottomPad(insetBottom: number): number {
  return (insetBottom > 0 ? tabBar.labelBottom : tabBar.labelBottomNoInset) - TAB_INNER_BELOW;
}

/** Utrymme som skärmarnas innehåll lämnar nedtill för menyn (inklusive safe area). */
export function tabBarSpace(insetBottom: number): number {
  return tabBarBottomPad(insetBottom) + tabBar.rowHeight + spacing.sm;
}

export default function CustomTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const bottomPad = tabBarBottomPad(insets.bottom);

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
    // Flikarna samlas mot mitten (brief 49), fortfarande jämnt fördelade.
    paddingHorizontal: tabBar.sideInset,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    width: TAB_WIDTH,
    height: tabBar.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tabBar.iconLabelGap,
  },
  label: {
    ...typography.micro,
    includeFontPadding: false,
    textAlign: 'center',
  },
}));
