# Brief 59 – Följer: Pinterest-flöde med vyväljare

**Fas:** 0. **Mål (ett):** Bygg om fliken Följer från "bara följda samlingar" till ett blandat flöde i två vyer (masonry och en kolumn), med riktiga filterpillar och ett bra tomläge. Skisser: canvasen "Kroona Hem – kortformat", tavla 12–14. Inventera först `app/(tabs)/feed.tsx`, `components/ProductGrid.tsx`, `ProductCard.tsx`, `FilterPills.tsx`, `SegmentedIcons.tsx`, `app/(tabs)/saved.tsx` (rubrik och vyväljare), `app/(tabs)/index.tsx` (Hems pillar), `context/FollowedCollectionsContext.tsx`, `FollowedPeopleContext.tsx` och var följda varumärken/butiker/områden lagras (brief 54), `SavedProductsContext.tsx`, `lib/catalog.ts`, `lib/search.ts`, `data/areas.ts`. Rapportera vad som fanns.

## Princip
Följer fungerar som Pinterest: det man följer och inspiration baserad på det **blandas jämnt**, inte följt först. Ingen text förklarar varför en produkt visas (inga etiketter, inga källpiller). Sidan ska kännas ny varje gång.

## Gör
1. **Rubrik.** "Följer" får exakt samma stil, storlek och position som rubrikerna på Hitta och Sparat (28/32, Familjen Grotesk). Återanvänd det som finns (token eller delad komponent) i stället för en ny stil.
2. **Vyväljare** till höger på rubrikraden, samma komponent och mått som i Sparat (`SegmentedIcons`): ikonerna `masonry` (förvald) och `one-column-grid`, med `accessibilityLabel` "Masonry" och "En kolumn". Valet hålls under sessionen (lagras inte).
3. **Masonry-vy.** Två kolumner, kolumnbredd som övriga grids, `spacing.gutter` emellan, 20 mellan korten i höjdled. Korten har olika bildhöjd (stående 3:4 och 2:3, 4:5, kvadrat) så att det blir ett riktigt masonry-mönster. Ta bildproportionen från produktbildens egen storlek om den finns, annars en stabil proportion härledd från produktens id (samma produkt får alltid samma proportion). Placera varje nytt kort i den kolumn som för tillfället är kortast. Text under bilden som på produktkortet (märke, namn, pris), bildradie 14. Tryck öppnar Produktdetalj.
4. **En-kolumn-vy.** Kort i full bredd (skärmbredd minus marginaler): bild 4:5, radie 14, under bilden märke, namn och pris till vänster och en spara-knapp (`bookmark`, fylld när sparad, samma mekanism som på `ProductCard`) till höger. 28 mellan korten. Tryck på bilden öppnar Produktdetalj.
5. **Pillar** under rubriken (`FilterPills`): Alla, Kläder, Möbler, Begagnat, därefter de **områden man följer** (en pill per följt område). Pillarna **filtrerar på riktigt**. Lägg logiken i en delad funktion (`lib/productFilters.ts`) så att samma kan användas på Hem senare (Hems pillar rörs inte i denna brief). Begagnat = produkter med begagnat erbjudande; område = områdets urval. Byte av filter behåller vyn (masonry eller en kolumn).
6. **Flödet** (dummylogik, ingen backend): bygg en pool av (a) produkter från **allt man följer**: samlingar, varumärken och butiker (via erbjudanden), områden och personers samlingar, och (b) inspiration: produkter som delar kategori, typ eller stil med det följda men inte kommer från en följd källa. Blanda a och b **jämnt** (ungefär hälften vardera, slumpad ordning, ingen produkt två gånger). Ny blandning (slump) varje gång fliken öppnas från ingenting och vid **pull-to-refresh**. Filtrera poolen med valt filter. Om man inte följer något: se tomläge.
7. **Tomläge** (följer inget): rubrik "Följ något som du gillar", undertext "Här fylls det på med det du följer och sådant som liknar det.", ett 2-kolumnsgrid med fyra områdeskort (samma kort som på Hitta, 169 × 92 radie 16, text på bild vänsterställd) som öppnar Områdesdetalj, och knappen "Se alla områden" (huvudknapp, 52 hög) → Alla områden. Pillar och vyväljare visas inte i tomläget.
8. **Bottenavstånd** så att inget döljs bakom flikfältet (`tabBarSpace`). Ljust och mörkt läge.

## Mått och stil
Följ `theme/` och `docs/designsystem.md`. Använd `Icon` för alla ikoner.

## Utanför scope (flagga, bygg inte)
Riktig rekommendation och "ny för varje besök" från backend (Fas 1+), uppdateringskort (prisfall, nyheter), källetiketter, att göra Hems pillar fungerande, att komma ihåg vyvalet över sessioner, oändlig scroll (visa ett rimligt antal, flagga hur många).

## Verifiering
tsc, Metro, simulator mörkt och ljust: båda vyerna, byte mellan dem, varje pill, ett följt område som pill, pull-to-refresh (ny ordning), tomläge (rensa följda) och Produktdetalj från båda vyerna. Rapport: `docs/briefs/59-rapport.md`. Uppdatera `docs/ia-karta.md` (Följer: ny roll, vyer, tomläge, Fas 0), `docs/produkt.md`, `docs/design.md` och `docs/designsystem.md` (masonry-kort, en-kolumn-kort). Committa, inkl. briefen, och pusha.
