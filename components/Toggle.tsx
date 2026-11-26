// Växel (brief 64, uppföljning): i vår palett i stället för iOS-grönt. iOS egen
// Switch ignorerar reglagets färg (thumbColor), så reglaget blev vitt även på
// det ljusa spåret i mörkt läge. Därför en egen växel med samma mått som iOS.
// Färglogik som vald pill: på = spår i textfärg (`switchTrackOn`) med reglaget
// i motsatt färg (`switchThumbOn`, bakgrunden); av = upphöjd yta med reglaget i
// textfärg. Reglaget glider med fjäder; Minska rörelse: direkt byte.
import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { makeStyles, useTheme, motion, toggle } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { haptic } from '../utils/haptic';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const TRAVEL = toggle.width - toggle.thumb - toggle.inset * 2;

export default function Toggle({ value, onValueChange, accessibilityLabel }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(value ? 1 : 0);
    } else {
      Animated.spring(progress, { toValue: value ? 1 : 0, ...motion.spring, useNativeDriver: false }).start();
    }
  }, [value, reduceMotion, progress]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.switchTrackOff, colors.switchTrackOn],
  });
  const thumbColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.switchThumbOn],
  });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      onPress={() => {
        haptic.selection();
        onValueChange(!value);
      }}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { backgroundColor: thumbColor, transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles(() => ({
  track: {
    width: toggle.width,
    height: toggle.height,
    borderRadius: toggle.height / 2,
    padding: toggle.inset,
    justifyContent: 'center',
  },
  thumb: {
    width: toggle.thumb,
    height: toggle.thumb,
    borderRadius: toggle.thumb / 2,
  },
}));
