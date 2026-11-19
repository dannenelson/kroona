import * as Haptics from 'expo-haptics';

// Samlad haptik (brief 09). Sätt till false för att stänga av all haptik i appen.
const HAPTICS_ENABLED = true;

// Fel sväljs: haptik ska aldrig kunna krascha ett tryck (t.ex. enheter utan motor).
const run = (fn: () => Promise<void>) => {
  if (!HAPTICS_ENABLED) return;
  fn().catch(() => {});
};

export const haptic = {
  /** Lätt impact: knappar, IconButton, Pill. */
  light: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Valbyte: text-flikar, markering i kontextmenyn. */
  selection: () => run(() => Haptics.selectionAsync()),
  /** Bekräftelse: val i kontextmenyn. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
