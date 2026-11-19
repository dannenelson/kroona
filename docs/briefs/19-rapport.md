# Rapport brief 19: Lightbox

**Byggt:** tryck på heron öppnar `app/lightbox/[id].tsx` ovanpå Produktdetalj. Lightboxen har egen route i rotens BlankStack, med `lightboxScreenOptions` i `components/product/productTransition.ts`.
- Bilden zoomar från heron via en egen boundary `lb_<heroId>` i gruppen `lightbox`, inne i herons befintliga boundary. Heron är fortfarande mål för zoomen från kortet.
- Bilderna visas med `contain` på mörk bakgrund (`overlay.lightboxBg`) med ljust statusfält.
- Stängning: kryss uppe till höger (IconButton med ny glaston `dark`), samt swipe ned och kantswipe med samma regler som Produktdetalj.
- Zoom (`components/lightbox/ZoomableImage.tsx`): nyp 1–4x, pan när inzoomad, dubbeltryck 1x ↔ 2,5x, fjädrar tillbaka under 1x. Inzoomad bild stänger av paging och swipe ned (`gestureEnabled` via `setOptions`).
- Paging i sidled (`Transition.ScrollView` med `pagingEnabled`).
- `PagerDots` (`components/PagerDots.tsx`): tar `count` och en shared value med positionen. Längd och opacitet följer swipen, och med Minska rörelse byter punkterna direkt.

**Verifierat i simulatorn (Expo Go):** öppning från heron (med ett tillfälligt automatiskt tryck, som nu är borttaget). Bilden visas hel i riktig proportion med mörk bakgrund, kryss, ljust statusfält och tre punkter. Tillbaka går till Produktdetalj utan krasch. tsc, iOS-export och grep är gröna.

**Kräver enhet:** hur zoomen från heron ser ut, nyp och pan, dubbeltryck, swipe mellan bilder och punkternas animation, swipe ned (inklusive att den är avstängd när bilden är inzoomad), kantswipe och detaljvyn som skymtar bakom.

**Val:**
- Bakgrunden använder samma zoom som kort → detalj (inzoomad bakgrund 1,05) men hårdare dämpning, 0,85 (`motion.lightboxBackdropOpacity`), så att den mörka lightboxen inte krockar med en ljus detaljvy.
- Glastonen `dark` är ny i `Glass`, eftersom foto-glaset blir ljust i ljust tema och inte syns mot den mörka bakgrunden.
- Nya tokens: `pagerDots` (6 / 18 / 6 / 0,4) i `theme/spacing.ts`, och `lightboxMaxZoom`, `lightboxDoubleTapZoom` och `lightboxBackdropOpacity` i `theme/motion.ts`.

**Dummydata:** produkt 1, 2 och 3 har 3, 2 respektive 4 extrabilder tagna från andra produkter, märkta `DUMMYBILDER (Fas 0)` i `data/products.ts`. Nytt fält `images?` i `CatalogProduct` och `getProductImages()` i `lib/catalog.ts`.

**Kända brister:**
- Stänger man från en annan bild än den första zoomar den ändå tillbaka mot heron, som alltid visar första bilden.
- Två fingrar kan i teorin starta skärmens drag nedåt i stället för nyp. Det är inte provat.

**Filer:** `app/lightbox/[id].tsx` (ny), `components/lightbox/ZoomableImage.tsx` (ny), `components/PagerDots.tsx` (ny), `assets/icons/CloseIcon.tsx` (ny), `app/product/[id].tsx`, `app/_layout.tsx`, `components/product/productTransition.ts`, `components/Glass.tsx`, `theme/colors.ts`, `theme/spacing.ts`, `theme/motion.ts`, `theme/index.ts`, `types/catalog.ts`, `lib/catalog.ts`, `data/products.ts`, `docs/design.md`, `docs/plan.md`.
