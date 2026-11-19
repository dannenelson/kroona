// Delat tillstånd mellan heron på Produktdetalj och lightboxen (brief 20).
// Shared values (UI-tråden) så att övergången och gesterna kan läsa dem utan
// JS-rundtur, plus en liten JS-prenumeration så att heron kan scrolla till
// den bild man var på i lightboxen, utan att hela skärmen renderas om.
import { makeMutable } from 'react-native-reanimated';

/** Index för bilden som visas/ska visas (hero ↔ lightbox). */
export const lightboxIndex = makeMutable(0);
/** 1 när lightboxbilden är inzoomad eller nyps: då är stängningsgesten av. */
export const lightboxGestureLock = makeMutable(0);

type Listener = (index: number) => void;
const listeners = new Set<Listener>();

/** Heron prenumererar: anropas när lightboxen byter bild. */
export function subscribeLightboxIndex(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Anropas från lightboxen (JS) när sidan har bytts. */
export function notifyLightboxIndex(index: number) {
  listeners.forEach((l) => l(index));
}
