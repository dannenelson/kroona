import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../constants/spacing';

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

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Gradient bakgrund */}
      <LinearGradient
        colors={[
          'rgba(15,15,14,0.0)',
          'rgba(15,15,14,0.8)',
          'rgba(15,15,14,1.0)',
        ]}
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
              activeOpacity={0.7}
            >
              <Icon color="#ffffff" size={30} />
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenMargin,
    paddingTop: 36,
    paddingBottom: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: 'GoogleSansFlex_500Medium',
    color: '#ffffff',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

// Beräknad, inte gissad — summerar tab-barens egna kända mått, så en
// framtida ändring av paddingTop/gap/paddingBottom automatiskt uppdaterar
// den här konstanten istället för att bli ännu en manuellt underhållen
// gissning. insets.bottom ingår INTE här (det varierar per enhet/skärm) —
// varje anropande skärm lägger till sin egen insets.bottom separat.
export const TAB_BAR_HEIGHT =
  styles.container.paddingTop! +
  30 + // ikonstorlek, se <Icon size={30}> ovan
  styles.tab.gap! +
  16 + // uppskattad radhöjd för label (fontSize 12) — går ej läsa statiskt
  styles.container.paddingBottom!;