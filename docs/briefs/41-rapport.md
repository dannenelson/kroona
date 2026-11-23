# Rapport brief 41: Snabbspar, bokmärke och "Ny samling" som länk

**Byggt:**
1. **Tryck = snabbspar, långt tryck = kortet.** Ny hook `useSaveActions(productId)` i `components/saved/SaveSheet.tsx`, samma på alla ställen:
   - `quickSave` växlar produkten i Gillade produkter och visar "<produkt> sparades i Gillade produkter · Ändra". Ändra öppnar kortet. Vid avgillning visas ingen snackbar.
   - `openSheet` öppnar "Spara i …".

   Produktvyns Spara-knapp: tryck = snabbspar, långt tryck (`motion.longPressMs`, haptik `light` som kontextmenyn) = kortet. Produktkortets meny: **Spara**/**Sparad** (snabbspar) och **Spara i samling** (kortet). Efter att kortet stängts gäller brief 40:s snackbar med Visa.
2. **Bokmärke i stället för hjärta:** Spara-knappen, menyvalet Spara, Gillade produkter-raden i kortet och i Sparat (rader och kort). Ikonen är fylld när produkten ligger i Gillade eller någon samling. Texten "hjärtat" är bytt i tomvyn och kommentarer.
3. **"Ny samling" som länk:**
   - Den sticky "+ Skapa ny"-knappen är borttagen. Länken är högerställd på rubrikraden, mittemot "Spara i …": ny `SheetStep.headerAction`, neutral text 15/600, tryckyta ≥ 44, opacitet 0,55 vid tryck. Den öppnar Skapa samling i samma kort som förut.
   - Kortet har luft och blur nedtill även utan CTA (`SheetContent` i kortläget).
   - Tomt läge: bara Gillade produkter + länken.

**Verifierat i simulatorn** (tillfälliga krokar, borttagna):
- snabbspar → snackbar med Ändra och fyllt bokmärke;
- kortet med länken "Ny samling", bokmärke på Gillade produkter och ingen knapp (även tomt läge);
- länken → Skapa samling i kortet med chevron;
- produktmenyn: Spara · Spara i samling · Följ varumärke · Dela · Visa liknande;
- ljust tema;
- Sparat visar Gillade produkter med bokmärke.

tsc och iOS-export är gröna. **Kräver telefon:** långt tryck på Spara (timing och haptik), att trycka på Ändra i snackbaren, gesterna i kortet och tryckfeedbacken på länken.

**Beslut och flaggor:**
- **"Spara i samling"** i menyn har provisoriskt +-ikonen tills mapp-med-plus finns (utanför scope).
- **Snackbaren och kortet:** öppnas kortet via långt tryck medan snabbspar-snackbaren syns, ligger snackbaren kvar över kortets nederkant tills den försvinner. Via Ändra stängs den direkt.
- **Utanför scope:** Skapa samling från "+" i Sparat som kort, redigera/radera samling.
- Brief 42 ligger stagad men ingår inte i den här committen.

**Spegla i Claude Project:**
- Spara = bokmärke.
- Tryck = snabbspar till Gillade produkter (snackbar "… · Ändra"), långt tryck/"Spara i samling" = kortet.
- "Ny samling" är en textlänk på kortets rubrikrad.
- "Gillade produkter" har bokmärke och är namnet på den generella samlingen.
