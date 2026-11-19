// Delat tillstånd mellan heron på Produktdetalj och lightboxen (brief 20).
// Shared values (UI-tråden) så att gesterna och herons scroll kan läsa dem
// utan JS-rundtur och utan att hela skärmen renderas om. Heron hoppar till
// den bild man lämnade i lightboxen (brief 20, 22).
import { makeMutable } from 'react-native-reanimated';

/** Index för bilden som visas/ska visas (hero ↔ lightbox). */
export const lightboxIndex = makeMutable(0);
/** Id för den hero som öppnade lightboxen (bara den följer indexet). */
export const lightboxHero = makeMutable('');
/** 1 när lightboxbilden är inzoomad eller nyps: då är stängningsgesten av. */
export const lightboxGestureLock = makeMutable(0);
