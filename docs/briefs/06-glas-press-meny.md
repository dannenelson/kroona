# Brief 06 — Glasets opacitet, press-animation och menyns stängning

**Mål:** Tre rättningar efter besiktning av brief 05. Inga skärmar, inga nya paket.

**Läs först:** `CLAUDE.md`, `docs/design.md` §0 och §3, `theme/glass.ts`, `theme/motion.ts`, `components/Glass.tsx`, `IconButton.tsx`, `Pill.tsx`, `TextTabs.tsx`, `CustomTabBar.tsx`, `ProductCard.tsx`, `ContextMenuHost.tsx`. Presentera en plan i Plan Mode först.

## Gör
1. **Lägre opacitet på glasets fyllning, i båda teman** (alla glastoner: theme, photo, plain där glas används). Gå så långt ner som kontrasten tål:
   - Räkna kontrast för ikon och text mot värsta fall (glaset över helt svart och helt vitt). Krav: text ≥ 4,5:1, ikoner ≥ 3:1. Räkna också på de ljusaste och mörkaste produktfotona.
   - Välj lägsta alfa per ton som klarar kraven, kompensera vid behov med blur/saturate, inte med högre alfa. Behåll kantens synlighet.
   - Redovisa gamla och nya värden och kontrasttalen i en tabell i rapporten. Uppdatera `design.md` §0/§3.
2. **Press ska animeras.** Idag byter tryckt läge direkt. Animera skalning och ytbyte mjukt (in snabbt, ut med lätt fjäder) på IconButton, Pill, TextTabs, nav-ikoner och ProductCard. Använd RN Animated med native driver, värden som tokens i `theme/motion.ts` (`pressIn`, `pressOut`, spring). Respektera reduce motion (då bara färgbyte, ingen skala). Ingen haptik på vanliga tryck.
3. **Menyns stängning: bilden hoppar och syns dubbelt.** Idag syns två bilder en kort stund med olika storlek när kortet går tillbaka. Gör så här:
   - Medan menyn är öppen är originalkortets bild osynlig (opacity 0), bara den lyfta kopian syns.
   - Vid stängning animeras kopian tillbaka till exakt originalets uppmätta position, storlek och hörnradie. Ingen cross-fade av kopian.
   - När animationen är klar byts i **samma frame**: kopian tas bort och originalet blir synligt. Båda får aldrig synas samtidigt, och inget hopp får ske vid bytet.
   - Kopian ska ha samma bildformat, `contentFit`/`resizeMode`, radie och squircle som originalet så att storlek och beskärning är identiska vid skala 1.
   - Mät om originalets position vid stängning om listan kan ha rört sig.
   Rapportera orsaken till hoppet och dubbelbilden.
4. Uppdatera `app/components.tsx` så press och menyn lätt kan jämföras. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Bygga skärmar eller ny logik, lägga till paket, eller ändra typografi och spacing.
- Den vågiga toppkanten (kommer som brief 07).
- Lösa "ljust foto-glas över mörk bild" på annat sätt än via punkt 1. Rapportera hur det ser ut efter sänkningen.

## Klart när
- Glas är märkbart genomskinligare i båda teman, med kontrast som klarar kraven (redovisad).
- Tryck animeras mjukt på alla nämnda komponenter.
- Menyn stängs utan hopp och utan att två bilder syns.
- tsc och export utan fel, commit finns.

## Rapportera kort
Tabell med gamla/nya glasvärden och kontrast, orsaken till bildhoppet, egna beslut och avvikelser, och vad Daniel ska känna efter på enhet.
