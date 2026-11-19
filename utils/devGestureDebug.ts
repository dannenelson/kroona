// TEMP-DEBUG-GEST: tillfällig diagnos av stängningsgesten på Produktdetalj.
// Slås på från dev-sidan (app/components.tsx) och visas bara när __DEV__.
// Ta bort hela filen och alla rader märkta TEMP-DEBUG-GEST när felet är hittat.
import { useSyncExternalStore } from 'react';

let enabled = false;
const listeners = new Set<() => void>();

export function setGestureDebug(on: boolean) {
  enabled = on;
  listeners.forEach((l) => l());
}

export function useGestureDebug(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => __DEV__ && enabled,
  );
}
