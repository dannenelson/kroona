# Rapport brief 36: Lägg till i samling och snabbspar

**Byggt:**
- **Snabbspar:** Spara-knappen (det briefen kallar hjärtat, idag bokmärke med "Spara"; ikonen avgörs i designgenomgången) togglar Gillade produkter som förut. Snackbaren "<produkt> sparades i Gillade produkter · Visa" fanns redan sedan brief 33, och vid borttagning visas ingen.
- **Ingångar:**
  - Ny rund sekundärknapp med bokmärke-plus bredvid Spara på Produktdetalj (`AddToCollectionButton`).
  - Nytt menyval "Spara i samling" i produktkortets kontextmeny. Övriga menyval är orörda.

  Båda öppnar samma Sheet via `useOpenAddToCollection`.
- **Sheet "Lägg till i samling"** (`components/saved/AddToCollectionStep.tsx`, enligt skissens SheetLaggTill):
  - produktchip (bild 40, namn, varumärke) och sökfält "Sök samlingar";
  - egna samlingar som rader (mosaik 48/r12, "N produkter · redan tillagd") med val-cirkel (tom ring / bock). Tryck växlar direkt och lagret står kvar;
  - CTA "+ Skapa ny samling" pushar Skapa samling, och Spara där skapar samlingen, lägger produkten i den och stänger;
  - `swipeToClose: false`;
  - tomt läge "Du har inga samlingar än." + CTA;
  - vid stängning: "<produkt> sparades i <samling> · Visa" (→ samlingen), "… i N samlingar · Visa" (→ Sparat), eller ingen snackbar om bara borttagningar gjordes.
- **Kompletterat i befintligt:**
  - `SheetStep.onClose` (anropas när lagret stängs);
  - `makeCreateCollectionStep(onSaved)`;
  - `removeProductFromCollection`;
  - `ListRow.trailing`/`accessibilityState`;
  - ikonerna BookmarkPlus och Check;
  - token `control.checkSize`.

  Inga nya paket.

**Verifierat i simulatorn** (tillfällig testkod, borttagen), på produkt 1:
- lagret visar Vinterlook som "redan tillagd" och Hemmabio som tom;
- att växla Hemmabio ger bock och "1 produkt", och lagret står kvar;
- stängning ger "Slim Merino Crewneck sparades i Hemmabio · Visa";
- Skapa ny samling "Kontor" ger "… sparades i Kontor".

tsc och iOS-export är gröna. **Kräver telefon:** tryck på rader och val-cirklar, sök med tangentbord, menyvalet från långt tryck och snackbarens Visa.

**Beslut:**
- Snackbaren räknar bara samlingar som lades till under det öppna lagret (inte där produkten redan fanns).
- Swipe ned är av för steget. X stänger, och chevron går tillbaka från Skapa samling.
- Val-cirkelns ring är 1,5 (lokalt värde enligt skissen).

**Flaggas (utanför scope):**
- redigera/döp om/radera samling;
- ta bort produkt via samlingsvyn;
- delning;
- Dela, Följ varumärke och Visa liknande i produktmenyn (gör fortfarande ingenting).

Brief 37 ligger stagad men är inte en del av den här committen.

**Spegla i Claude Project-dokumenten:**
- Spara-knappen = snabbspar till Gillade produkter; samling är valfritt.
- "Spara i samling" finns bredvid Spara och i produktmenyn, och öppnar Sheet "Lägg till i samling" (sök, växla direkt, Skapa ny samling lägger till produkten).
- Snackbarreglerna vid stängning.
