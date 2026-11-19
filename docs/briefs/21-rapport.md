# Rapport brief 21: Hero-punkter och zoom in/ut

**Del A:** glaspillen är borttagen. Punkterna ligger direkt på fotot med variant `onPhoto` i `PagerDots`: aktiv vit, inaktiva vita 55 % (`pagerDots.inactiveOpacityOnPhoto`), mjuk mörk skugga (`photoShadows.pagerDot` i `theme/shadows.ts`). Storlek och animation är oförändrade, och lightboxen är orörd. Punkterna syns mot både den vita skjortan och mörkare foton i simulatorn.

**Del B, orsaker (uppmätta).** Jag loggade bibliotekets interna länkstatus (aktivt id i gruppen, källa och mål) i normal hastighet:
1. **Fel mål innan bildstorleken var känd.** `Image.getSize` hade inte svarat när lightboxen mättes, så målet blev hela skärmen (402×874 i stället för 402×321 på produkt 4). Zoomen gick därför mot helskärm. Rättat: storlekarna hämtas i förväg när heron monteras (`prefetchImageSizes`), och lightboxen läser dem synkront.
2. **Flera mål i samma grupp.** Alla lightboxbilder var boundaries. De utanför skärmen underkänns av bibliotekets viewport-kontroll men håller övergången i upp till 20 försök (ca 320 ms). Rättat: bara den aktuella bilden är mål (`enabled`).
3. **Stängning efter bläddring gick mot fel ställe.** Gruppens aktiva id byttes i samma bildruta som indexet, så herons bild mättes innan heron scrollat (x=804, utanför skärmen). Stängningen fick då inget giltigt mål. Rättat:
   - heron scrollas på UI-tråden (`scrollTo` i `useAnimatedReaction`), bara den hero som öppnade lightboxen;
   - zoomens id följer ett eget `lightboxTargetIndex`, som flyttas två bildrutor senare;
   - index skickas också som route-param.
   Efter rättningen mäts källan på x=0 i alla vägar.
4. **Varför simulatorn såg rätt ut i brief 20:** med 3 s fjäder spelar 150–400 ms fel mål liten roll, och bara bild 2 provades. I normal hastighet är öppningen nästan klar innan länken finns, vilket på enheten ser ut som att den "dyker upp".

**Jämförelse med kort → detalj:** där finns en källa och ett mål per id, och målets storlek är fast (4:5). Lightboxens avvikelser var just punkterna ovan.

**Verifierat i simulatorn** med långsam övergång (borttagen) och med loggarna, som nu också är borttagna:
- produkt med en bild;
- bild 1 och bild 2 på produkter med flera bilder;
- öppning på bild 1, bläddring till bild 3, stängning: bilden krymper till heron, som visar bild 3.

Bilden växer ur och krymper tillbaka till rätt rektangel i alla dessa vägar. tsc och iOS-export är gröna.

**Ej verifierat (kräver enhet):**
- Alla vägar har provats med stängning via `router.back()`, vilket motsvarar krysset. Swipe ned och kantswipe använder samma stängning men är inte provade.
- Känslan i normal hastighet.

**Överlägget TEMP-DEBUG-ZOOM är inte byggt.** Samma uppgifter (valt id, käll- och målrektangel, om länken hittades) loggades tillfälligt från bibliotekets interna state och gav orsakerna ovan. Jag bedömer dem som säkra, så inget är committat.

**Flaggas, inte åtgärdat:**
- Stänger man inom ca två bildrutor efter ett byte av bild kan zoomen gå till föregående bild.
- Gruppens aktiva id byts först när stängningen startar (interpolatorn körs bara under animation). De första 1–2 bildrutorna kan därför använda den gamla bildens mål.
- Min test-Metro (`CI=1`) bevakar inte filer, så omstart krävs efter ändringar.

**Filer:** `components/PagerDots.tsx`, `components/product/HeroPager.tsx`, `app/lightbox/[id].tsx`, `app/product/[id].tsx`, `components/product/productTransition.ts`, `lib/lightboxStore.ts`, `theme/shadows.ts`, `theme/spacing.ts`, `theme/index.ts`, `docs/design.md`.
