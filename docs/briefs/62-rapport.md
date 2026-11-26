# Rapport brief 62 – Produktkortets textblock och betyg i Produktdetalj

## Inventering: vad som redan fanns
- **`ProductCard`, textblocket:**
  - Med `saveButton` låg texten redan i en kolumn till vänster och bokmärket till höger, i en rad med `alignItems: 'flex-start'`.
  - Bokmärkets ikon satt 4 px under textens överkant (`marginTop … + spacing.xs`).
  - Märke, namn, pris och betygsrad hade `gap` 4 (`spacing.xs`) mellan sig.
  - Masonry-korten utan knapp hade samma `gap` 4.
- **`saveButton`** används bara av en-kolumnsvyn i Följer.
- **Produktdetalj** (rapport 60): betyget var raden "Betyg" i faktalistan under "Hållbarhet" ("4,1 av 5 (12 omdömen)"). Produkter utan betyg hade ingen rad.

## Gjort
1. **Produktkort:**
   - Märke, namn och pris ligger i en egen grupp med **2 px** mellan raderna (ny token `productCard.textGap`). Betygsraden följer med 4 som förut.
   - Bokmärket är **överjusterat**: ikonens överkant linjerar med märkesradens överkant (4 px högre än förut). Högerkanten linjerar fortfarande med bildens.
   - Masonry-korten fick samma täta avstånd. Uppskattningen av texthöjden för kortaste kolumn i Följer är uppdaterad.
2. **Produktdetalj:**
   - Raden "Betyg" är borttagen ur faktalistan.
   - Betyget står direkt under namn och pris: `star` (kontur) 12, "4,1" i `caption` `textSecondary` och "(12 omdömen)" i `textTertiary`, samma stil som på kortet.
   - Produkter utan betyg får ingen rad. Betyget är inte tryckbart.

## Beslut jag tog själv
- **Produktdetalj skriver ut "omdömen"** i antalet, som briefen, medan kortet bara har siffran: "(12 omdömen)" mot "(312)".
- **2 px är en egen token** (`productCard.textGap`), eftersom 2 ligger utanför 4-punktsskalan.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge:
  - Följer i masonry och i en kolumn. Vyn byttes med en tillfällig länkparameter, som inte är committad.
  - Produktdetalj med betyg (Double-breasted Blazer: ☆ 4,1 (12 omdömen) under priset, Hållbarhet bara Hållbarhetsindex).
  - Produktdetalj utan betyg (Suede Ankle Boots: ingen rad).
- **Städat:** min Metro är stoppad och den tillfälliga koden återställd. Din server på 8081 är orörd.

## Utanför scope (flaggat, inte byggt)
- Tryckbart betyg och omdömen (Fas 1+).

## Övrigt upptäckt
- Nya otrackade ikonfiler som inte är mina: `company-add`, `company-check`, `user-check`, `history` och `recycle`. De är inte committade, och registret är inte omgenererat.
