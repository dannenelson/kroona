// Delat tillstånd mellan heron på Produktdetalj och lightboxen (brief 20).
// Shared values (UI-tråden) så att gesterna och herons scroll kan läsa dem
// utan JS-rundtur och utan att hela skärmen renderas om. Heron hoppar till
// den bild man lämnade i lightboxen (brief 20, 22).
import { AccessibilityInfo } from 'react-native';
import { makeMutable } from 'react-native-reanimated';

/** Index för bilden som visas/ska visas (hero ↔ lightbox). */
export const lightboxIndex = makeMutable(0);
/** Id för den hero som öppnade lightboxen (bara den följer indexet). */
export const lightboxHero = makeMutable('');
/** 1 när lightboxbilden är inzoomad eller nyps: då är stängningsgesten av. */
export const lightboxGestureLock = makeMutable(0);
/** Progress när en swipe släpptes för stängning (-1 = ingen pågående), för bildens glidning efter släpp. */
export const lightboxReleaseProgress = makeMutable(-1);

/** "Minska rörelse" som shared value, så att övergångarnas interpolatorer kan läsa den (UI-tråden). */
export const reduceMotionShared = makeMutable(false);

/** Håller `reduceMotionShared` i synk med systeminställningen. Anropas en gång från app/_layout. */
export function installReduceMotionSync(): () => void {
  AccessibilityInfo.isReduceMotionEnabled().then((v) => {
    reduceMotionShared.value = v;
  });
  const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
    reduceMotionShared.value = v;
  });
  return () => sub.remove();
}
