import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

type PreOrSubHeader =
  | { preheader?: string; subheader?: never }
  | { preheader?: never; subheader?: string };

type IconOrCta =
  | { icon?: ReactNode; cta?: never }
  | { icon?: never; cta?: { label: string; onPress?: () => void } };

type Props = {
  title: string;
  style?: StyleProp<ViewStyle>;
} & PreOrSubHeader & IconOrCta;

export default function SectionTitle({ title, preheader, subheader, icon, cta, style }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.textBlock}>
        {preheader ? <Text style={styles.preheader}>{preheader}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subheader ? <Text style={styles.subheader}>{subheader}</Text> : null}
      </View>
      {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
      {cta ? (
        <TouchableOpacity onPress={cta.onPress} style={styles.ctaSlot}>
          <Text style={styles.ctaLabel}>{cta.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  textBlock: {
    flex: 1,
  },
  preheader: {
    color: Colors.gold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'GoogleSansFlex_500Medium',
    marginBottom: 4,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: 'GoogleSansFlex_700Bold',
    fontSize: 20,
    letterSpacing: 0.3,
  },
  subheader: {
    color: Colors.textTertiary,
    fontFamily: 'GoogleSansFlex_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  iconSlot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSlot: {
    paddingVertical: 4,
  },
  ctaLabel: {
    color: Colors.gold,
    fontSize: 13,
    fontFamily: 'GoogleSansFlex_500Medium',
  },
});
