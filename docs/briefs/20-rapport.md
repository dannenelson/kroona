# Rapport brief 20: Lightbox 2

**Byggt:**
- Heron är en bildbläddrare (`components/product/HeroPager.tsx`, en `Transition.ScrollView` med paging) med `PagerDots` i en mörk glaspill nedtill. En bild ger ingen pager och inga punkter. Heron är fortfarande zoommål från kortet.
- Tryck öppnar lightboxen på den bild som visas.
- Varje bild har en egen boundary `lb_<heroId>_<index>` i både hero och lightbox. Interpolatorn väljer id utifrån det delade indexet (`lib/lightboxStore.ts`: shared value + liten prenumeration, inga router-params).
- När man bläddrar i lightboxen hoppar heron till samma bild utan animation.
- Zoomens mål i lightboxen är bildens contain-rektangel (`Image.getSize`), inte hela vyn.

**Varför den "dök upp" (brief 19):** lightboxens mål var hela skärmen med `contain`-bild inuti. Zoomen gick alltså mellan herons utsnitt och en helskärmsruta, och blev mest en toning. Dessutom var bara bild 0 en boundary.

**Långsam övergång (tillfällig fjäder ca 3 s, borttagen), produkt 2, bild 2:**
- Öppning, mitt i: herons bild 2 växer ur heron medan detaljvyn dämpas och skalas. Vid slutet ligger bilden centrerad i contain-rektangeln, med kryss och punkter på den mellersta.
- Stängning, mitt i: bilden krymper mot heron och detaljvyn tonas fram.
- Efter stängning: heron visar bild 2 med punkt 2 aktiv. Stängningen gick alltså till rätt bild.

**Gestarbitrering (helt på UI-tråden, ingen `setOptions`/`runOnJS`):**
- Bibliotekets stängningsgest stängs av per bildruta: lightboxens interpolator returnerar `options.gestureEnabled` från shared value `lightboxGestureLock`. Därför behövdes ingen egen stängningsgest.
- Nyp, pan och dubbeltryck körs samtidigt (`useSimultaneousGestures`).
- Nyp sätter låset redan när andra fingret landar (`onTouchesDown`), så stängningen aldrig får två fingrar.
- Pan har `maxPointers: 1` och `manualActivation`:
  - Inzoomad: pan aktiveras direkt och panorerar, begränsat till ramen.
  - Annars, efter `motion.dismissActivationDistance`: sidled aktiverar bläddring i en egen pager (ersätter ScrollView).
  - Nedåt eller från vänsterkanten: pan avbryts, så att bibliotekets swipe ned och kantswipe tar över.
- Släpp under 1x återställer zoomen och släpper låset. Dubbeltryck sätter eller släpper låset.

**Kräver enhet:** nyp och pan (simulatorn kan inte), att låset hinner före stängningsgesten, bläddring i heron utan att stjäla vertikal scroll och stängning, kantswipe på bild 1 i heron, studsens känsla och glaspillens läsbarhet mot ljusa foton.

**Kända brister:**
- Startar man ett nyp med ett finger som redan rört sig kan stängningsgesten hinna aktiveras först. Det bör vara sällsynt, men är inte provat.
- Kantswipe i heron på bild 2+ kan bläddra i stället för att stänga, beroende på bibliotekets ScrollView-regel.

**Filer:** `components/product/HeroPager.tsx` (ny), `lib/lightboxStore.ts` (ny), `app/lightbox/[id].tsx` (omskriven), `components/lightbox/ZoomableImage.tsx` (borttagen), `app/product/[id].tsx`, `components/product/productTransition.ts`, `theme/motion.ts` (`pageFlickVelocity`), `lib/catalog.ts` (felplacerad doc-kommentar rättad), `docs/design.md`.
