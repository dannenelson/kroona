import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { makeStyles, useTheme, withAlpha, typography, fonts, spacing, motion } from '../theme';

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

// Lokala mått för tab-baren (ikonens storlek och flikbredd är komponentmått,
// inte spacing).
const ICON_SIZE = 30;
const TAB_WIDTH = 80;
// Etikettens radhöjd följer typography.caption, så TAB_BAR_HEIGHT kan räknas
// exakt i stället för att uppskattas.
const LABEL_LINE_HEIGHT = typography.caption.lineHeight;

const CONTAINER_PADDING_TOP = spacing.xxl;
const CONTAINER_PADDING_BOTTOM = spacing.xs;
const TAB_GAP = 6; // lokal optisk justering: ikon → etikett

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {/* Gradient mot bakgrundstoken (bg med alfa), så att den möter
          skärmens bakgrund utan söm i båda teman. */}
      <LinearGradient
        colors={[withAlpha(colors.bg, 0), withAlpha(colors.bg, 0.8), colors.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Meny-rad, se TAB_BAR_HEIGHT nedan — ej påverkad av insets */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconSet = ICONS[route.name as keyof typeof ICONS];
          const Icon = isFocused ? iconSet.filled : iconSet.outlined;
          const label = LABELS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={motion.pressedOpacity}
            >
              <Icon color={colors.textPrimary} size={ICON_SIZE} />
              <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Safe area spacer under menyn */}
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: CONTAINER_PADDING_TOP,
    paddingBottom: CONTAINER_PADDING_BOTTOM,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: TAB_GAP,
  },
  label: {
    ...typography.caption,
    fontFamily: fonts.ui500, // vikt 500 behålls, storlek från caption
    color: t.colors.textPrimary,
    includeFontPadding: false,
    textAlign: 'center',
  },
}));

// Summerar tab-barens egna kända mått från samma konstanter som stilen
// använder, så en ändring av padding/gap/etikett slår igenom automatiskt.
// insets.bottom ingår INTE här (det varierar per enhet/skärm) — varje
// anropande skärm lägger till sin egen insets.bottom separat.
export const TAB_BAR_HEIGHT =
  CONTAINER_PADDING_TOP + ICON_SIZE + TAB_GAP + LABEL_LINE_HEIGHT + CONTAINER_PADDING_BOTTOM;
