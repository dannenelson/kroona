# Brief 19 — Lightbox för produktbilder

**Mål:** Tryck på hero i Produktdetalj öppnar bilden i helskärm, i sin riktiga proportion (inte beskuren 4:5). Bara den här funktionen.

**Arbetssätt:** Daniel vill slippa klippa-och-klistra. Arbeta självständigt i auto mode utan att vänta på planen, commita på main (ingen push, stäng inte Daniels Expo-server, ingen `pkill -f "expo start"`). **Skriv rapporten till `docs/briefs/19-rapport.md` (max 20 rader) och committa den**, och skriv max 5 rader i terminalen. Tillfällig felsökningskod får inte committas.

**Läs först:** `CLAUDE.md` (särskilt regeln om BlankStack och transition-options), `docs/design.md` §0 och §8c (Rörelse: hierarki), `app/product/[id].tsx`, `components/product/productTransition.ts`, `components/IconButton.tsx`, `types/catalog.ts`, `lib/catalog.ts`, `lib/cardProduct.ts`, `theme/`. Bibliotekets källa i `node_modules/react-native-screen-transitions` vid behov.

## Beteende (Daniels krav, bedöms på enhet)
1. **Öppning:** tryck på hero → bilden växer från heron till helskärm (samma delade zoom som kort → detalj, via `Transition.Boundary` med unikt id för lightboxen). Mörk bakgrund, oavsett tema (token), ljust statusfält.
2. **Bild i riktig proportion:** `resizeMode="contain"`, centrerad, hela bilden syns.
3. **Zoom och pan:** nypzoom (1x till ca 4x), pan när man zoomat in, dubbeltryck växlar mellan 1x och ca 2,5x, och bilden fjädrar tillbaka till 1x om man släpper under 1x. Reanimated + gesture-handler (båda finns).
4. **Stäng:** (a) swipe ned när bilden inte är inzoomad (hela vyn följer fingret, bakgrunden tonar bort, samma tröskel- och aktiveringsregler som Produktdetalj: se `motion.dismiss*` och bibliotekets patch), (b) **tydlig stängknapp (kryss)** uppe till höger i glas (IconButton, `Glass` photo-ton som fungerar mot mörk bakgrund, ljus ikon), (c) kantswipe från vänster som i detaljvyn. Är bilden inzoomad ska drag panorera bilden, inte stänga.
5. **Flera bilder:** swipe sida till sida (paging) mellan bilderna. Är bilden inzoomad panorerar man i stället (paging av).
6. **Sidindikator (punkter) längst ned** (safe area + `spacing`-token), bara om det finns fler än en bild. Punkterna ska följa designskissen (Looken A, pager dots i Produktdetalj): små cirklar, där **den aktiva är längre (pill) och i annan färg** än de övriga. **Storleken och färgen animeras mjukt med swipen** (interpolera mot scroll-positionen, så att den aktiva punkten växer i längd och den föregående krymper medan man drar, inte bara hoppar vid stopp). Måtten och färgerna som tokens (`theme/`): ca 6 px cirkel, aktiv ca 18 px lång, inaktiv dämpad (ca 40 % opacitet), aktiv full ljus. Gör punkterna till en egen återanvändbar komponent (`components/PagerDots.tsx`) som tar `count` och en Reanimated shared value för position, så att den senare kan sitta i heron också. Respektera "Minska rörelse" (då byter punkterna utan animation).
7. **Bakgrunden** (detaljvyn bakom) syns lätt genom bakgrunds-tonen under gesten enligt samma princip som övriga övergångar (inzoomad bakgrund, dämpning som i `motion`-tokens), bara om det inte krockar med den mörka bakgrunden. Rapportera hur du löste det.

## Data
- Datan har idag en bild per produkt (`imageUrl`). Lägg till ett valfritt `images?: string[]` i `CatalogProduct` och en liten selektor `getProductImages(product)` som returnerar `[imageUrl, ...(images ?? [])]`.
- För att Daniel ska kunna testa flera bilder: ge **tre produkter** (de som dev-sidans genvägar öppnar: id 1, 2 och 3) 2–4 extra bilder var, tagna från andra produkters befintliga bilder som stand-ins. Markera tydligt i kod och rapport att det är **dummybilder** (Fas 0). Produkter utan `images` visar lightbox med en bild och inga punkter.

## Navigation
- Ny route för lightbox (t.ex. `app/product/[id]/image.tsx` eller `app/lightbox/[id].tsx`) som läggs ovanpå Produktdetalj i rotens BlankStack med egna transition-options (se regeln i CLAUDE.md). Detaljvyn ska stå kvar bakom (som övriga övergångar: bara ett steg bakom syns, `withDepthVisibility`).
- Tryck på hero: bara själva bildytan öppnar lightbox, inte knapparna (tillbaka/dela) som ligger ovanpå.
- Hero ska fortsatt vara zoom-**mål** från kortet. Lightboxen kräver egen Boundary-id (t.ex. `lb_${boundaryId}`) så att det inte krockar.
- Tillbaka-knappen/kantswipe i lightbox stänger lightboxen, inte detaljvyn.

## Gör INTE
- Swipe mellan bilder direkt i heron på Produktdetalj (bara i lightboxen i den här briefen). Sidindikator i heron (komponenten ska vara återanvändbar, men sätts inte dit nu). Fler skärmar. Nya paket (allt som behövs finns: Reanimated, gesture-handler, bibliotekets Boundary).

## Blockerare (pausa och rapportera endast vid dessa)
Biblioteket klarar inte en andra detaljskärm ovanpå Produktdetalj med delad zoom, eller kräver development build. Då: skriv rapporten med orsaken och stanna.

## Avsluta
`npx tsc --noEmit`, iOS-export, grep att inga hex/siffror ligger utanför `theme/`, inga debug-rester. Uppdatera `docs/design.md` (kort avsnitt om lightbox och PagerDots) och `docs/plan.md` (lightbox ✅, nästa: Samlingsdetalj). Commita på main, ingen push.

## Rapport (`docs/briefs/19-rapport.md`)
Vad som byggdes, vilka kriterier som är verifierade i simulatorn och vilka som kräver enhet (drag, zoom, swipe), val du gjorde (bakgrund, tokens, route), dummydata, filer, kända brister.
