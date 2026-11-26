# Rapport brief 61 – Spara, snackbar och kontextmenyer

## Inventering: vad som redan fanns
- **`components/Snackbar.tsx`** (`SnackbarProvider`, `useSnackbar().show({ text, thumbUri?, action? })`):
  - En sträng, `numberOfLines={2}`, 15/500.
  - Bredden följde innehållet upp till `snackbar.maxWidth` 350.
  - Ingen fetstil.
  - Tid ca 4 s, svep nedåt döljer, placering ovanför flikfältet eller 40 från botten.
  - Åtgärd som kompakt knapp. Ångra finns inte någonstans.
- **`context/SavedProductsContext.tsx`:** `isSaved` och `toggleSaved`. Namnet "Gillade produkter" finns inte här, utan i `ALL_SAVED_NAME` i `UserCollectionsContext`.
- **`components/saved/SaveSheet.tsx`:** `useSaveActions` gav `quickSave`. Den användes av menyraden Spara på produktkort, en-kolumnsflödets bokmärke och `SaveButton` på Produktdetalj.
  - Vid sparande: "… sparades i Gillade produkter · Ändra".
  - **Vid borttagning: ingen snackbar.**
  - Kortet "Spara i …" gav "… sparades i <samling> · Visa" när det stängdes.
- **`ProductCard`:** stjärnan i betygsraden var **fylld**.
- **Produktdetalj:** har **ingen stjärna**. Betyget är en textrad i faktalistan (brief 60).
- **`ProductContextMenu`:** texten stod till vänster och ikonen till höger på alla rader. Ikonerna var redan rätt sedan brief 58 (`bookmark`, `folder-add`, `user-add`, `share`, `layers` och `chevron-right`).
- **`rg -i gillad`:** träffar i fyra kodfiler (UI-texten via `ALL_SAVED_NAME`, tomtexten "Inga gillade produkter än" och kommentarer) och i sju levande dokument. Identifierarna `liked`, `LikedRow` och `LikedTile` fanns i `useSaveActions`, `ProductCard`, `SaveSheet` och Sparat.

## Gjort
1. **Namnbyte till "Sparade produkter"** i UI (`ALL_SAVED_NAME`, tomtexten "Inga sparade produkter än"), kommentarer och levande docs:
   - Docs: `design.md`, `designsystem.md`, `produkt.md`, `wireframes.md`, `ia-karta.md`, `plan.md` och `ikonlista.md`.
   - Gamla briefer, rapporter och `ikon-inventering.md` är lämnade som historik.
   - **Identifierarna är också bytta**, eftersom ändringen var liten: `liked` → `inSavedProducts`, `LikedRow`/`LikedTile` → `SavedProductsRow`/`SavedProductsTile`, och stilnamnen. `ALL_SAVED_ID`/`ALL_SAVED_NAME` och route-id `saved` behölls.
2. **Snabbtryck på spara** (en gemensam `quickSave` för produktkortets meny, en-kolumnsflödets bokmärke och Produktdetalj):
   - Sparar: "**<produkt>** lades till i sparade produkter · Ändra".
   - Tar bort: "**<produkt>** togs bort från sparade produkter" (ny, utan åtgärd).
   - Kortet "Spara i …" ger när det stängs "**<produkt>** lades till i **<samling>** · Visa", eller "… lades till i N samlingar".
   - Om man i kortet bara bockat i Sparade produkter blir texten densamma som vid snabbspar.
3. **Snackbar:**
   - Alltid max-bredden (`width: 100%`, högst 350), och åtgärden står längst till höger.
   - Nya fält: `subject` (namnet som inleder meningen) och `object` (namnet sist). Båda är i fetstil (600).
   - `subject` står på en egen rad och kortas med ellipsis. Resten av meningen (högst två rader) står under, så den syns alltid.
   - `object` kortas med ellipsis i slutet.
   - Hela meningen läses upp som en etikett.
   - Tid, placering, svep och åtgärd är oförändrade.
   - "<samling> skapades" har också samlingsnamnet i fetstil.
4. **Stjärnan** på produktkortet är kontur, som lövet.
5. **Kontextmenyer** (produktkort, `PartnerCard`, `ProfileCard`, Sparat):
   - Ikon 20 till vänster, `spacing.sm` till texten, textfärgen oförändrad.
   - **Öppna** behåller `chevron-right` till höger (ny flagga `ContextMenuItem.navigation`) och har en tom ikonplats till vänster, så att texten linjerar.

## Beslut jag tog själv
- **Namnet på egen rad:** för att resten av meningen alltid ska synas står produktnamnet på en egen rad överst, i stället för i löptext. Ett kort namn står alltså också ensamt på första raden. Snackbaren blir tre rader när meningen är lång, till exempel "lades till i sparade produkter".
- **Vikten** på resten av meningen sänktes från 500 till 400, så att de feta namnen (600) skiljer sig. 600 är den tyngsta UI-vikten.
- **"sparade produkter"** i meningen är inte fet, eftersom det inte är ett samlingsnamn i briefens mall.
- **Borttagningen** har ingen åtgärd. Ångra finns inte, och det är utanför scope.
- **Öppna-raden** har en tom ikonplats till vänster, så att texten linjerar.
- **Produktdetalj har ingen stjärna** att ändra.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK (2272 moduler).
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge. Tillfällig kod (inte committad) visade snackbarer och öppnade menyerna automatiskt.
  - **Långt namn:** "Handvävd ullfilt i återvu…" på egen rad med resten under, och "… lades till i **Sommarhuset på Gotland – vardagsrum oc…**". Kort namn ("Vas … togs bort"): full bredd.
  - **Produktdetalj:** att spara gav "lades till i sparade produkter · Ändra" med fyllt bokmärke. Att trycka igen gav "togs bort från sparade produkter" med tomt bokmärke.
  - **Menyer:** produktkortet, samlingsraden i Sparat (Öppna med chevron till höger, Dela) och samlingskortet på varumärkessidan (Följ, Öppna, Dela). Ikonerna står till vänster och texten linjerar.
  - **Stjärnan som kontur:** Sökresultat "skor".
- **Inte kontrollerat på skärm:**
  - En-kolumnsflödets bokmärke och menyraden Spara anropar samma `quickSave` som Produktdetalj.
  - Snackbaren för samlingar ritades med samma fält som koden skickar. Själva kortflödet (bocka i en samling och stäng kortet) trycktes inte, eftersom simulatorn inte kan trycka.
  - `ProfileCard`-menyn ritas av samma menyrad.
- **Städat:** min Metro är stoppad och den tillfälliga koden är borttagen (`rg __t61` ger noll träffar). Din server på 8081 är orörd.
  - Mitt skärmdumpsskript la tillbaka testkoden en gång, eftersom dess `wait` väntade på Metro. Jag upptäckte det och tog bort den igen före commit.

## Utanför scope (flaggat, inte byggt)
- Egen följ-ikon (`user-add` kvarstår för varumärken).
- Ångra i snackbaren.
- Nya menyalternativ.

## Övrigt upptäckt
- `assets/svg/icons/history.svg` och `recycle.svg` är otrackade, inte mina och inte med i registret. De är inte committade.
