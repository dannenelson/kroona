# Brief 20 — Lightbox 2: bildbläddring i heron, tillförlitlig zoom, rätt bild tillbaka

**Mål:** Rätta det Daniel hittade vid enhetstest av brief 19. Bara lightbox, hero-bildbläddring och deras övergångar.

**Arbetssätt:** Som brief 18/19: självständigt i auto mode utan plan, commit på main, ingen push, stäng inte Daniels Expo-server (ingen `pkill -f "expo start"`). Rapport till `docs/briefs/20-rapport.md` (max 20 rader) och max 5 rader i terminalen. Tillfällig felsökningskod får inte committas.

**Läs först:** `docs/briefs/19-rapport.md`, `CLAUDE.md`, `docs/design.md` §8c, `app/product/[id].tsx`, `app/lightbox/[id].tsx`, `components/lightbox/ZoomableImage.tsx`, `components/PagerDots.tsx`, `components/product/productTransition.ts`, bibliotekets källa i `node_modules/react-native-screen-transitions` (Boundary, group/aktiv id, gestkonfiguration).

## Daniels testresultat (brief 19)
- Öppning: lightboxen "dyker upp" i stället för att växa från heron.
- Stängning: zoomar inte tillbaka till heron, och bilden i heron är inte den man tittade på i lightboxen.
- Pinch-zoom fungerar ibland, man känner att man inte har kontroll, ibland inte alls. Panorera fungerar sporadiskt. Dubbeltryck fungerar.
- Inga punkter i detaljvyn, och man kan inte bläddra mellan bilderna i heron utan att öppna lightboxen. Det vill han.
- Kryss, swipe ned, kantswipe och bläddring + punktanimation i lightboxen fungerar bra.

## Gör
1. **Hero som bildbläddrare:** har produkten fler än en bild (`getProductImages`) blir heron en horisontell pager (paging) med `PagerDots` nedtill (över bilden, inom heron, `spacing`-token, läsbart mot ljusa och mörka foton, t.ex. med mjuk skugga/glas bakom punkterna). En bild: ingen pager, inga punkter, som idag. Heron har kvar 4:5 och är fortsatt zoom-mål från kortet (första bilden). Pagern får inte stjäla den vertikala stängningsgesten eller scrollen i detaljvyn, och kantswipen i vänsterkanten ska fungera.
2. **Tryck på heron öppnar lightbox på den bild som visas** (index skickas med).
3. **Rätt bild tillbaka:** när lightboxen stängs (kryss, swipe ned, kantswipe) ska heron visa samma bild som lightboxen var på (scrolla heron till rätt index utan animation innan eller medan lightboxen stänger), och stängningszoomen ska gå tillbaka till **den** bilden i heron. Lös med en boundary per bildindex (t.ex. `lb_<heroId>_<index>`) och bibliotekets mekanism för aktivt id i gruppen, så att öppning och stängning går till/från rätt sidas bild. Dela valt index mellan skärmarna med en liten store/context, inte via router-params som ger omrendering av hela skärmen.
4. **Öppnings- och stängningszoomen:** lightboxen ska växa från herons bild och gå tillbaka dit. Läs bibliotekets källa för att förstå varför den bara "dök upp" (misstänkt: nästlade Boundary i hero som redan är mål för kortets zoom, eller att målet i lightboxen är fel yta: använd bildens egna contain-rektangel som mål, inte hela vyn). **Verifiera i simulatorn genom att tillfälligt göra övergången mycket långsam** (t.ex. `transitionSpec` med några sekunder, bara under felsökning, återställ efteråt) och ta skärmdumpar mitt i övergången för öppning och stängning. Skriv i rapporten vad du såg.
5. **Pinch/pan måste fungera varje gång (huvudsak):** bygg om `ZoomableImage` och gestarbitreringen så att den avgörs på UI-tråden (shared values), inte via JS-rundturer som `navigation.setOptions` + `runOnJS` (troliga orsaken till sporadiska fel).
   - Två fingrar överallt på bilden → nyp-zoom (1–4x), alltid, och aldrig stängningsgest eller paging (stängningsgesten ska kräva exakt ett finger).
   - Inzoomad (>1x): ett finger panorerar bilden (begränsat så att bilden inte lämnar skärmen), paging och stängningsgest av. Dubbeltryck växlar 1x ↔ 2,5x. Släpp under 1x fjädrar till 1x.
   - Inte inzoomad: ett finger horisontellt bläddrar, vertikalt drar ned/stänger (som idag).
   - Använd Gesture.Simultaneous/Exclusive med Reanimated shared values och `enabled`/`manualActivation` på gesterna. Om bibliotekets egen stängningsgest inte går att stänga av på UI-tråden: gör stängningsgesten i lightboxen själv (translation + bakgrundstoning, släpp över tröskel anropar stäng, `gestureEnabled: false` på lightbox-routen) med samma tröskel/aktiveringsregler som Produktdetalj (`motion.dismiss*`). Beskriv valet i rapporten.
   - Resonera i rapporten kort om hur arbitreringen är tänkt, eftersom simulatorn inte kan testa nyp.
6. Respektera "Minska rörelse" för punkter och toningar som tidigare.

## Gör INTE
Samlingsdetalj, andra skärmar, nya paket (allt som behövs finns), ändra Produktdetaljens övriga innehåll eller kortens zoom/id-logik utöver vad som krävs.

## Avsluta
`npx tsc --noEmit`, iOS-export, grep att inga hex/siffror ligger utanför `theme/`, inga debug-rester (inklusive långsam övergång). Uppdatera `docs/design.md` (lightbox, hero-pager, rätt bild tillbaka). Commit på main, ingen push.

## Rapport
Vad som byggdes, vad skärmdumparna i den långsamma övergången visade, hur gestarbitreringen är löst, vad som kräver enhet, filer, kända brister.
