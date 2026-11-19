# Brief 14 — Enhetlig toppkant på Produktdetalj

**Mål:** Övergången mellan hero-läget (foto) och nedscrollat läge på Produktdetalj ska vara mjuk, inte ett hårt byte. Endast toppen (`EdgeFade`, statusfältet och `TopBar`-glaset) på `app/product/[id].tsx`. Inget annat.

**Läs först:** `CLAUDE.md`, `docs/design.md` §0 (kantblur, glas), `components/EdgeFade.tsx`, `components/Glass.tsx`, `components/TopBar.tsx`, `app/product/[id].tsx`. Presentera en plan i Plan Mode först.

## Problemet (Daniels feedback efter enhetstest)
Toppen blir hackig vid övergången. Orsaken i koden: `scrolled` är ett boolean som slår om vid ett tröskelvärde och byter samtidigt
- `EdgeFade` variant `photo` ↔ `theme` (olika toning och olika höjd),
- `TopBar` tone `photo` ↔ `theme`,
- `StatusBar` style.
Titeln däremot tonar redan mjukt med `scrollY.interpolate`. Allt annat ska följa scrollen på samma sätt.

## Önskat resultat
- **En toppkant**, inte två. Samma `EdgeFade` hela vägen. Det som ändras med scrollen är bara hur mycket toning som syns (mjuk övergång över ungefär samma sträcka som titelns tonande, `spacing.xl`).
- Ingen synlig "pop" vid tröskeln, i varken mörkt eller ljust tema.
- Statusfältets ljusa/mörka läge måste fortfarande vara läsbart över både foto och bakgrund. Det får byta vid en punkt (det går inte att tona), välj punkten där toningen passerat hälften.

## Tekniska begränsningar (lärt tidigare, bryt inte mot dem)
- **Opacitet eller mask på en förälder till en `BlurView` bryter blurren** (UIVisualEffectView). Tona därför bara gradientlagret (`LinearGradient`) med `Animated.Value`/interpolering, aldrig blur-lagren eller deras föräldrar. Blur-lagren ligger kvar konstanta.
- Höjden på `EdgeFade` ska inte animeras per frame (layout). Välj en konstant höjd som funkar i båda lägena, och rapportera vilken.
- Ingen Reanimated (inte installerat). RN `Animated` med `useNativeDriver` där det går.

## Gör
1. Ta bort booleska `scrolled`-växlingen för `EdgeFade` och byt till en gemensam tonad övergång drivs av `scrollY`. Behåll `scrolled` bara om det behövs för statusfältet.
2. **Glaset i `TopBar`:** jämför `photo`- och `theme`-ton efter brief 06 (alfa, fyllning, innehållsfärg). Är skillnaden liten: använd en ton på Produktdetalj och rapportera att de kan slås ihop. Är den stor: föreslå i planen hur knapparna kan övergå mjukt utan opacitet på BlurView (till exempel att tona fyllning och innehållsfärg, inte blurlagret). Ändra inte `Glass`-komponentens utseende för andra skärmar.
3. Kontrollera övergången i **mörkt och ljust** tema, med både en mörk och en ljus produktbild (dev-sidans genvägar).
4. Uppdatera `docs/design.md` med en rad om att toppkanten på detaljvyer är en enda komponent som tonas med scroll. Verifiera: `npx tsc --noEmit`, iOS-export, inga hex/fontstorlekar utanför `theme/`. Commit (ingen push).

## Gör INTE
- Zoom-övergångar, lightbox eller andra navigationsändringar (egna briefar: 15 och 16).
- Ändringar på flikskärmarna eller i `EdgeFade` på ett sätt som ändrar deras utseende.
- Nya paket.

## Rapportera
Vald lösning för glaset (en ton eller tonad), vald höjd på `EdgeFade`, vid vilken scrollpunkt statusfältet byter, och vad som behöver bedömas på enheten.
