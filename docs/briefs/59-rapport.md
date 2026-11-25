# Rapport brief 59 – Följer: Pinterest-flöde med vyväljare

## Inventering: vad som redan fanns
- **`app/(tabs)/feed.tsx`:** visade bara produkter från följda **samlingar** (`COLLECTIONS`), i ordning och utan blandning, i `ProductGrid compact`.
  - Rubriken "Följer" var `typography.headline` (17/22) med lokal spärrning.
  - Tomläget var "Inget att visa än / Följ en samling på Hem …".
  - Inga pillar, ingen vyväljare, ingen pull-to-refresh.
  - Bottenavståndet saknade `tabBarSpace`.
- **`ProductGrid`:** två kolumner med varannan produkt i varje (inte kortaste kolumn), `gap` 16 i höjdled.
- **`ProductCard`:**
  - Har redan `aspectRatio` och storlekarna M/L.
  - M och L har bildradie `radius.card` 14 och text under: märke, namn, pris och en betygsrad med löv (och stjärna när betyg finns).
  - Spara finns bara i kontextmenyn (`useSaveActions`: snabbspar till Gillade, "Spara i …").
  - Trycket öppnar Produktdetalj med zoom.
- **`FilterPills`:** Pill `filter` 36, horisontell scroll. Används på Hem, där pillarna inte filtrerar (Allt, Kläder, Möbler, Begagnat).
- **`SegmentedIcons`:** 38 × 30 per segment, i Sparat (rader/kort, sparas i AsyncStorage).
- **Rubriken i Sparat:** rad med titel och "+" (44), `paddingVertical` 12, **`typography.title1` (26/30)**. Hitta har också `title1`. 28/32 (`screenTitle`) används bara i undervyerna (`ScreenHeader`).
- **`FollowedCollectionsContext`:** **en gemensam mängd nycklar** för samlingar, varumärken (via varumärkets filtersamling, `getRetailerFollowKey`, annars återförsäljarens id) och områden (områdets id, brief 54).
  - Standard är alla `COLLECTIONS`, alltså även J.Lindeberg och Filippa K.
  - Lagras i AsyncStorage `@kroona/followedCollectionIds`.
- **`FollowedPeopleContext`:** personer, tomt från start. Personernas samlingar finns i `PEOPLE_COLLECTIONS`.
- **`SavedProductsContext`:** Gillade.
- **`lib/catalog.ts`:** hade `getProductsForCollection`, `getProductsForRetailer` (varumärke via märket, butik och andrahand via erbjudanden), `getProductsForArea` och `hasUsedOffer`. **`lib/search.ts`** behövdes inte.
- **`data/areas.ts`:** sex områden.
- **`data/products.ts`:** **20 produkter, alla med `aspectRatio`**: stående ca 0,67–0,70, kvadrat 1 och liggande 1,5.

## Gjort
1. **Rubrik:** "Följer" i `title1` och samma rad som Sparats rubrik: titel vänster, kontroll höger, 44 + 12 över och under, skärmmarginal. Den hamnar då på samma plats som rubrikerna på Hitta och Sparat.
2. **Vyväljare:** `SegmentedIcons` med `masonry` (förvald) och `one-column-grid`, etiketterna "Masonry" och "En kolumn". Valet ligger i en modulvariabel, så det hålls under sessionen men lagras inte.
3. **Masonry:**
   - Två kolumner med `spacing.gutter` emellan och 20 i höjdled (`followFeed.masonryRowGap`).
   - `ProductCard` M, där bildradien redan är 14.
   - Proportionen tas från produktbildens egen, avrundad till närmaste av 3:4, 2:3, 4:5 och 1:1. Om den saknas härleds den stabilt från id.
   - Varje kort läggs i den kolumn som är kortast (bildhöjd plus en uppskattad texthöjd).
   - Trycket öppnar Produktdetalj med zoom, som förut.
4. **En kolumn:**
   - `ProductCard` L i full bredd, bild 4:5 (`followFeed.singleRatio`), radie 14, 28 mellan korten (`followFeed.singleRowGap`).
   - **Ny prop `saveButton` på `ProductCard`:** bokmärke till höger om texten, fyllt när sparad, 44-yta.
   - Spara-knappen använder samma mekanism som "Spara" i menyn: tryck snabbsparar till Gillade, långt tryck öppnar "Spara i …".
5. **Pillar:**
   - Alla, Kläder, Möbler och Begagnat, sedan en pill per följt område.
   - De filtrerar via den nya **`lib/productFilters.ts`**: `ProductFilter`, `BASE_FILTER_OPTIONS`, `filterOptionsWithAreas`, `matchesFilter` och `filterProducts`.
   - Begagnat = har begagnat erbjudande. Område = områdets urval.
   - Vyn behålls när filtret byts.
   - Slutar man följa det valda området går pillen tillbaka till Alla.
   - Hems pillar är inte rörda.
6. **Flödet** (ny **`lib/followFeed.ts`**):
   - **(a) det man följer:** samlingar (även varumärkenas filtersamlingar), varumärken och butiker (`getProductsForRetailer`), områden och personers samlingar.
   - **(b) inspiration:** produkter som inte kommer från en följd källa men delar kategori, typ eller stil med något följt.
   - **Blandning:** båda listorna blandas var för sig med ett frö. Sedan turas de om (slumpad start), utan dubbletter. Det som blir över när den ena tar slut läggs sist.
   - **Nytt frö** varje gång skärmen monteras och vid **pull-to-refresh**.
   - **Högst 40 kort** (`FEED_LIMIT`). Med dagens 20 produkter visas alla.
7. **Tomläge** (följer varken nycklar eller personer):
   - "Följ något som du gillar" (`title2`) och undertexten.
   - `AreaGrid` med fyra områdeskort, som öppnar Områdesdetalj.
   - "Se alla områden" (Button primary) leder till Alla områden.
   - Inga pillar, ingen vyväljare och ingen pull-to-refresh.
8. **Bottenavstånd:** `tabBarSpace(insets.bottom)`.

## Beslut jag tog själv
- **Rubrikstorlek: `title1` (26/30), inte 28/32.** Briefen säger både "exakt samma som Hitta och Sparat" och "28/32", men Hitta och Sparat är 26/30. Jag valde att matcha dem. Ska alla tre bli 28/32 är det ett byte på tre ställen. Se frågor.
- **Liggande produktbilder** (tre produkter med 1,5) blir kvadrater och beskärs, så att masonry bara har stående format och kvadrat, som i briefen.
- **Korten behåller produktkortets betygsrad** (löv, och stjärna när betyg finns) under priset. Jag tolkade "som på produktkortet" som att samma kort återanvänds.
- **En kolumn använder `ProductCard` L** (namnet i `headline`), eftersom kortet är fullbrett.
- **"Se alla områden" är 56 hög**, Button `cta`, inte 52. Designsystemets CTA är minst 56, och det finns ingen 52-storlek. Se frågor.
- **Områdeskorten i tomläget** är samma `AreaGrid` som på Hitta, alltså 175 × 92 på en 390-skärm. Skissens 169 förutsätter marginal 20, som i brief 53.
- **Nya tokens:** `followFeed` (`masonryRowGap` 20, `singleRowGap` 28, `singleRatio` 4:5). 20 och 28 finns inte i spacing-skalan.
- **"Inget här just nu."** visas om ett filter ger noll träffar.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK (2272 moduler).
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge. Tillfällig kod (inte committad) gick igenom en tidslinje: pull-to-refresh, pillarna i tur och ordning, byte till en kolumn och Alla. Den lade också till Vintage som följt område, utan att spara det.
  - **Masonry Alla:** varierade höjder (2:3, 3:4 och kvadrat), kortaste-kolumn-placering. OK.
  - **Pull-to-refresh:** ny ordning. OK.
  - **Kläder, Möbler, Begagnat och Vintage** (följt område som pill) filtrerar rätt. Begagnat visar bara produkter med begagnat erbjudande, och Vintage visar områdets två produkter.
  - **En kolumn:** 4:5, bokmärket till höger. Vyn behölls när pillen byttes till Alla.
  - **Tomläget** (följer inget, tillfälligt): rubrik, undertext, fyra områdeskort och knappen. OK.
- **Inte tryckt:**
  - Produktdetalj från de två vyerna. Korten använder `ProductCard`s vanliga tryck med zoom, så det borde fungera som på andra grids.
  - Bokmärkets tryck i en-kolumnsvyn.
  - Riktig pull-to-refresh med fingret (anropet är detsamma).
  - Att knappen och områdeskorten i tomläget navigerar.
- **Städat:** min Metro är stoppad, den tillfälliga koden är återställd och ingen `TEMP-DEBUG` är committad. Din server på 8081 är orörd.

## Frågor
- **Rubrikstorlek:** ska Följer, Hitta och Sparat alla bli 28/32 (`screenTitle`)? Nu är alla tre 26/30.
- **Knapphöjd:** ska "Se alla områden" vara 52 trots att CTA är 56 i övrigt? Då behövs en ny knappstorlek.
- **Inspirationen** blir med 20 produkter i praktiken "allt annat", eftersom nästan allt delar kategori med något följt. Ska regeln skärpas, till exempel till samma kategori **och** stil eller typ, när katalogen växer?

## Utanför scope (flaggat, inte byggt)
- Riktig rekommendation och "ny för varje besök" från backend (Fas 1+).
- Uppdateringskort (prisfall, nyheter).
- Källetiketter.
- Fungerande pillar på Hem.
- Vyval som sparas mellan sessioner.
- Oändlig scroll: flödet visar högst 40 kort (`FEED_LIMIT`), i dag alla 20.

## Övrigt upptäckt
- **Förvalt följs alla `COLLECTIONS`,** även varumärkenas filtersamlingar. Tomläget syns därför bara om man aktivt slutat följa allt.
- **`ProductGrid` lägger fortfarande varannan produkt i varje kolumn** (inte kortaste). Den används i detaljvyerna och är inte rörd.
