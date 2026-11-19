// Delat tillstånd mellan heron på Produktdetalj och lightboxen (brief 20).
// Shared values (UI-tråden) så att övergången, gesterna och herons scroll kan
// läsa dem utan JS-rundtur och utan att hela skärmen renderas om.
import { Image } from 'react-native';
import { makeMutable } from 'react-native-reanimated';

/** Index för bilden som visas/ska visas (hero ↔ lightbox). */
export const lightboxIndex = makeMutable(0);
/**
 * Index som zoomen (interpolatorn) går till och från. Följer `lightboxIndex`
 * men uppdateras först när heron har scrollat till bilden och lightboxens nya
 * mål är aktivt, så att biblioteket mäter herons bild på rätt plats (brief 21).
 */
export const lightboxTargetIndex = makeMutable(0);
/** Herons boundary-id för den hero som öppnade lightboxen (bara den följer indexet). */
export const lightboxHero = makeMutable('');
/** 1 när lightboxbilden är inzoomad eller nyps: då är stängningsgesten av. */
export const lightboxGestureLock = makeMutable(0);

// Bildstorlekar (brief 21): zoomens mål i lightboxen är bildens contain-rektangel,
// och den måste vara känd när lightboxen monteras. Image.getSize är asynkron, så
// heron hämtar storlekarna i förväg när detaljvyn monteras.
export type ImageSize = { w: number; h: number };
const sizes = new Map<string, ImageSize>();
const pending = new Set<string>();

export function getCachedImageSize(uri: string): ImageSize | undefined {
  return sizes.get(uri);
}

export function prefetchImageSizes(uris: string[], onSize?: (uri: string, size: ImageSize) => void) {
  uris.forEach((uri) => {
    const known = sizes.get(uri);
    if (known) {
      onSize?.(uri, known);
      return;
    }
    if (pending.has(uri) && !onSize) return;
    pending.add(uri);
    Image.getSize(
      uri,
      (w, h) => {
        sizes.set(uri, { w, h });
        pending.delete(uri);
        onSize?.(uri, { w, h });
      },
      () => pending.delete(uri),
    );
  });
}
