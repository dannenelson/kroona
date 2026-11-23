# Rapport brief 40: "Spara i …" som kort-sheet, en Spara-ingång

**Byggt:**
1. **Kortpresentation i Sheet** (`presentation: 'card'` på första steget, inte en kopia). Helskärm är oförändrad.
   - Kortet har luft runt om (`sheetCard.inset` 8 + safe area), radie `radius.sheetCard` 28 (squircle) och ytan `colors.sheetCard` (`surface` vid 0,96).
   - Det ligger över en mörk overlay, och tryck på overlayen stänger.
   - Rubriken är vänsterställd, ingen X. Senare steg har chevron tillbaka.
   - Kantblur upptill och nedtill finns kvar via `SheetContent`.
2. **Snapp och gest:** lägena 2/3 (öppnas här) och full höjd.
   - En pan-gest på kortet körs samtidigt med listans native-gest (`SheetScrollView`, ny export).
   - Fingret uppåt växer kortet till full höjd, och listan hålls på toppen med `scrollTo`. Därefter skrollar listan.
   - Fingret nedåt med listan på toppen krymper kortet. Under 2/3 stängs det vid släpp efter avstånd (80) eller fart (800 px/s), med fly-out 200 ms. Annars snappar det med `motion.spring`.
   - Allt körs på UI-tråden. Minska rörelse: kortet tonar in och ut, och snapp sker utan fjäder.
   - `swipeToClose`-specialen behövs inte för kortet.
3. **Innehåll** (`components/saved/SaveSheet.tsx`, ersätter `AddToCollectionStep`): rubriken "Spara i …", listan med Gillade produkter alltid överst (hjärta i upphöjd ruta, antal) och sedan egna samlingar (mosaik 48, "Privat/Publik · N produkter") med val-cirkel. Tryck växlar direkt. CTA:n "+ Skapa ny" (primär, enda knappen). Chip, sök, X och Klar är borttagna.
4. **En ingång "Spara":** Produktdetaljens knapp (hjärta + "Spara") och produktmenyns "Spara" öppnar kortet. Hjärtat är fyllt när produkten ligger i Gillade produkter eller någon samling (`useIsSaved`). Bokmärke-plus-knappen, menyvalen Gilla och Spara i samling, `useToggleSaved` och BookmarkPlusIcon är borttagna. Snackbaren vid stängning: "<produkt> sparades i <samling>" / "… i Gillade produkter" / "… i N samlingar" · Visa. Bara borttagningar ger ingen snackbar.
5. **Skapa ny i samma kort:** Skapa samling pushas, och kortet går till full höjd med chevron. Spara skapar samlingen, lägger produkten i den och stänger. Inga specialfall behövdes.
6. **Tokens:** `sheetCard` (spacing), `radius.sheetCard`, `colors.sheetCard` och `colors.sheetCardScrim`, samt `motion.sheetCard`.

**Verifierat i simulatorn** (tillfälliga krokar, borttagna):
- öppning på 2/3, full höjd och tillbaka (höjden sattes via kod);
- att trycka på rader ger bockar;
- Skapa ny i kortet med chevron, och tillbaka;
- stängning ger "Oversized Denim Jacket sparades i 2 samlingar · Visa" och fyllt hjärta på Spara;
- tom lista (bara Gillade produkter + CTA);
- många samlingar med blur bakom CTA:n;
- ljust tema (vitt kort på mörk dimning);
- produktmenyn: Spara · Följ varumärke · Dela · Visa liknande.

tsc och iOS-export är gröna.

**Rättat under testet:** skroll-handlerns worklet fångade kortets gest, så gestens relationslista frös och appen kraschade när listan monterades igen (tillbaka från Skapa samling). Nu fångas bara shared values. Simulatorns testsamlingar rensades.

**Kräver telefon:** hela gestkänslan (växa 2/3 → full via skroll, krympa på toppen, stäng-svep, fart och om listan "hackar" när låset `scrollTo` håller den på toppen), blurens kanter mot kortets rundade hörn och tangentbordet i Skapa samling inuti kortet.

**Beslut och flaggor:**
- **Overlay:** ny token `sheetCardScrim`, mörk i båda teman. Briefen nämnde `sheetScrim`, men den är en ljus slöja i ljust tema, och "mörk overlay" var målet.
- **CTA:n** "+ Skapa ny" är primär, eftersom den är enda knappen.
- **Hjärta + texten "Spara"** kan kännas motsägelsefullt, eftersom hjärta läses som gilla. Alternativet är ett bokmärke. Bör utvärderas.
- **Snabbspar med ett tryck finns inte längre** (tryck = öppna kortet). Instagram har tryck = snabbspar och långt tryck = kortet, så detta är ett designval att utvärdera.
- **Skapa samling från "+" i Sparat** är fortfarande helskärm. Den kan få kortpresentation för enhetlighet, men ligger utanför scope.
- **Utanför scope:** redigera/radera samling och delning.

**Spegla i Claude Project:**
- Spara är en ingång (hjärta), och Gilla/Spara i samling-uppdelningen är borttagen. "Spara i …" är ett kort-sheet med Gillade produkter överst, samlingar och "+ Skapa ny". Snackbaren säger "sparades i …".
- Sheet har två presentationer (helskärm och kort, med snapp 2/3 och full).
- Det finns inget snabbspar längre (att utvärdera).
