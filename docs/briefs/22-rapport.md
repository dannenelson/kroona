# Rapport brief 22: Lightbox med fade i stället för zoom

**Byggt:** lightboxens öppning och stängning är en ren fade (`lightboxScreenOptions` i `components/product/productTransition.ts`).
- Öppning: opacitet 0 → 1 och skala 0,96 → 1 över mörk backdrop (`overlay.lightboxBg` till `motion.lightboxBackdropOpacity`). Detaljvyn bakom skalas lätt (`motion.zoomBackgroundScale`) som tidigare.
- Stängning (kryss, swipe ned, kantswipe) är omvänd. Vid drag följer lightboxen fingret (bibliotekets `gesture.handoff`) och tonar ut med drag-progressen. Tröskel och aktivering är oförändrade (samma gestDirection, `dismissVelocityImpact` och patchade regler).
- Nya tokens: `motion.lightboxFade` (öppning 240 ms, stängning 200 ms, `fromScale` 0,96).

**Borttaget:**
- boundary-id:n `lb_<heroId>_<index>`, `LIGHTBOX_BOUNDARY_GROUP` och `lightboxBoundaryId`;
- `lightboxTargetIndex` och förhämtningen med `Image.getSize`;
- contain-rektangeln som mål och `enabled`-logiken. Lightboxens bilder har helskärm med `contain`.
- Heron trycks via RNGH `Pressable` i stället för Boundary, och lightboxen får inte längre route-param `hero`.

**Kvar:** `lightboxIndex` och `lightboxHero` (heron hoppar till bilden man lämnade), route-param `index`, pager, nyp, pan och dubbeltryck, gestlåset och PagerDots. Kort → detalj-zoomen är orörd.

**Verifierat:**
- I simulatorn med tillfälligt långsam fade (borttagen): öppning från bild 2 visar en halvgenomskinlig lightbox i full storlek över dämpad detaljvy, stängningen är omvänd, och heron visar bild 2 efteråt.
- tsc, iOS-export och grep (inga hex eller siffror utanför `theme/`, inga debug-rester).

**Kräver enhet:** att swipe ned och kantswipe följer fingret och tonar ut, och att det känns rätt i normal hastighet.

**Dokument:** `docs/design.md` §8c har en ny punkt (lightbox: fade, inte zoom) och §8d är uppdaterad. CLAUDE.md nämner inte lightbox-zoom och är oförändrad.

**Flaggas, inte åtgärdat:**
- Fadens skala (0,96) och detaljvyns skala följer inte Minska rörelse.
- `docs/briefs/19–21-rapport.md` beskriver den gamla zoomen (historik).
- `motion.zoomBackgroundScale` delas nu av zoom och fade och kan behöva ett eget namn.
