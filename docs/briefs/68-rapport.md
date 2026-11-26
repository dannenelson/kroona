# Rapport brief 68 – Produktkort: textblock i två kolumner

## Inventering: vad som fanns
- **Alla produktkort med textblock renderas av `ProductCard`**, med textblocket inbyggt i komponenten. Det fanns en implementation men ingen egen komponent för blocket.
  - **Direkt:** Följer masonry (`ProductCard` M), Följer en kolumn (`ProductCard` L med `saveButton`), Liknande på Produktdetalj och Hem-hyllan "Kanske intressant för dig" (`RecommendedProductsRow`).
  - **Via `ProductGrid`:** Sökresultat, dialogens produkthylla, kategori, område, samling (även Sparade produkter och egna samlingar) och partnersidan.
  - Hitta har inga produktkort. Storlek S (bara dev-sidan) har inget textblock.
- **Med knapp:** en rad med `alignItems: 'flex-start'`.
  - Knappen hade en 44 × 44-ruta med negativa marginaler: upp −10 och höger −10.
  - Ikonens överkant hamnade därför efter räkning, inte efter mätning.
  - Textkolumnen hade `flex: 1` men inte `minWidth: 0`.
- **Utan knapp:** en egen stil (`info`), inte samma rad. Avstånd och typografi var ändå desamma (brief 62).

## Gjort
- **Ny `components/ProductCardText.tsx`**, som är det enda textblocket. `ProductCard` använder den med `showSave={saveButton}`, och alla platser ovan får den därmed. Inga anrop behövde ändras.
  - Den inbyggda textkoden, stilarna och mätningen av betygsraden (brief 60) flyttade dit.
  - `ProductCard` sköter bara bild, märke, tryck och meny.
- **Två kolumner, 8 under bilden:**
  - Raden har `flexDirection: 'row'`, `alignItems: 'flex-start'` och 8 mellan kolumnerna.
  - **Vänster:** `flex: 1`, `minWidth: 0`, med märke, namn, pris och betyg.
  - **Höger:** bokmärket i en fast 24-ruta, `alignSelf: 'flex-start'`. Tryckytan är 44 via `hitSlop`, så rutan växer inte och skjuter inte ner ikonen.
  - Utan `showSave` tar vänsterkolumnen hela bredden i samma rad.
- **Namnet** radbryter i vänsterkolumnen, högst två rader, sedan ellipsis. Det går aldrig in under knappen.
- **Avstånden är oförändrade:** `productCard.textGap` 2 och betyg 4. Märkesraden är alltid en rad med fast radhöjd. Rader som saknas tar ingen plats.

## Beslut jag tog själv
- **Optisk linjering med två nya tokens** (befintliga värden är orörda). Båda är uppmätta på skärmdump i 3x.
  - **Överkant, `productCard.saveOffsetY` = 2:** bokmärkets form börjar 2,25 pt ner i sin 24-ruta. Med 2 pt nedåt ligger formens överkant och märkesradens versaler inom ⅓ pt av varandra, i båda teman.
  - **Högerkant, `productCard.saveOffsetX` = 3:** formen har ca 3 pt luft till höger i rutan. Rutan skjuts ut 3 pt, så att den synliga högerkanten linjerar med bildens högerkant (inom ⅓ pt). Tidigare låg den 3,3 pt innanför. Briefen kan också läsas som att det är rutans kant som ska linjera. Säg till i så fall, så tas justeringen bort.
- **Linjeringen gäller versalerna,** alltså den synliga överkanten av "Lindex", inte radboxen, som har ca 4 pt luft över versalerna.
- **Tillgänglighet:** spara-knappen fick `accessibilityHint` "Håll in för att spara i en samling", som Produktdetaljs knapp.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK.
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge. Det långa namnet "Handvävd ullfilt i återvunnen merinoull med långa fransar" sattes tillfälligt på första kortet i Följer; det är inte committat.
  - **Masonry (utan knapp):** det långa namnet bryts på två rader med ellipsis.
  - **En kolumn (med knapp):** samma namn bryts på två rader i vänsterkolumnen och går inte in under bokmärket. Bokmärkets över- och högerkant är mätta enligt ovan.
  - **Kort utan betyg** (Red Runner Sneaker i Sökresultat "skor", Suede Ankle Boots i Följer): bara lövet, ingen lucka.
- **Städat:** min Metro är stoppad och den tillfälliga koden återställd. Din server på 8081 är orörd.

## Utanför scope
Inget flaggat. Inga nya spara-knappar, och typografi, färger, bildformat och betygsvisning är oförändrade.
