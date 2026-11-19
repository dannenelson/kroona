# Brief 12 — Datamodell: Produkt / Återförsäljare / Erbjudande (steg 2)

**Mål:** Lägg in den nya datamodellen så att Produktdetalj (nästa steg) kan byggas ovanpå den. Bara typer, dummydata och urvalsfunktioner. **Inga skärmar, ingen följa- eller sparlogik, ingen backend.** Appen ska se ut och fungera exakt som nu när du är klar.

**Läs först:** `CLAUDE.md`, `docs/produkt.md` (Låsta beslut), `docs/wireframes.md` §1–§3 (Produktdetalj, Samlingsdetalj, Partnerdetalj), `types/product.ts`, `data/` (products, newProducts, catalogTopup, collections). Presentera en plan i Plan Mode först, inklusive hur du håller befintliga komponenter oförändrade (de läser idag `price`, `isNew`, `isUsed`, `brand`, `sustainabilityScore`).

## Modellen (förslag, justera i planen om något inte håller)
- **Produkt:** själva varan, oberoende av var den säljs. Kanonisk bild, märke, namn, kategori/stil/typ, `sustainabilityScore` och fakta (t.ex. material, tillverkad i, certifiering, valfria). Inget pris och ingen nytt/begagnat-flagga längre.
- **Återförsäljare:** den som säljer eller står bakom varumärket. Namn, typ (varumärke, butik, andrahandstjänst), beskrivning, värdegrund, geografisk närvaro (e-handel och/eller butiker och var), logotyp/initial. Detta är också det man följer och det Partnerdetalj visar.
- **Erbjudande:** koppling Produkt ↔ Återförsäljare. Pris, **skick: nytt eller begagnat**, för begagnat även skickbeskrivning och **prisläge** ("Fast pris" eller "Auktion, bud från"), lager, geografi/frakt, länk ut (dummy-URL).
- **Följbara saker** (bara data, ingen logik): Återförsäljare, Samling och **Område** (kategori eller stil med kurerat innehåll, t.ex. Hemmakontor, Skandinavisk stil) har ett stabilt `id` och en `kind` så att de senare kan följas. Skapa en enkel typ `FollowTarget = { kind, id }`. Lägg till några områden som data, och peka ut några som "förvalda följda" i demot (flagga i data, används senare).

## Gör
1. **Typer** i `types/` och **dummydata** i `data/` för de 56 produkterna: varje produkt får 1–3 nya erbjudanden och 0–2 begagnade (ungefär hälften av produkterna ska ha minst ett begagnat). Använd rimliga svenska dummy-återförsäljare (några varumärken, några butiker, några andrahandstjänster) och ge dem tydligt påhittade eller generiska demo-data (inga riktiga priser eller påståenden om riktiga bolag). Priser konsekventa: begagnat lägre än nytt.
2. **Urvalsfunktioner** (rena funktioner, testbara): erbjudanden för en produkt (nya/begagnade, sorterbara på pris, begagnat grupperat per tjänst), lägsta pris, "finns begagnat" (för korten senare), produkter för en återförsäljare, produkter för en samling/ett område, liknande produkter (enkel regel: samma kategori/stil).
3. **Bakåtkompatibilitet:** befintliga komponenter och skärmar ska fungera oförändrade. Härled `price`, `isNew`, `isUsed` osv. från erbjudandena (t.ex. lägsta pris, har nytt/begagnat) via en adapter eller ett härlett fält, så att inga skärmar behöver ändras nu. Redovisa hur.
4. **Samlingar** (`data/collections.ts`) får `id`/`kind` så de är följbara, utan att ändra hur de visas.
5. Uppdatera `docs/produkt.md` (datamodellen konkret) och lägg en kort beskrivning av fält och funktioner i `docs/` (t.ex. avsnitt i `produkt.md`). Verifiera: `npx tsc --noEmit`, iOS-export, att appen startar och flikarna ser likadana ut. Commit (ingen push).

## Gör INTE
- Bygga Produktdetalj, Partnerdetalj, Samlingsdetalj eller ändra några skärmar eller komponenter utseendemässigt.
- Följa-/spara-state, AsyncStorage, backend, Supabase, tracking eller provision (Fas 1+).
- Nya paket. Röra teknisk skuld utöver det som modellen kräver.

## Klart när
- Typer, dummydata och urvalsfunktioner finns, och varje produkt har erbjudanden enligt ovan.
- Appen fungerar och ser ut som förut. tsc och export utan fel.
- Dokumenten är uppdaterade, commit finns.

## Rapportera kort
Hur modellen ser ut (fält, tabell), hur bakåtkompatibiliteten löstes, vilka dummy-återförsäljare och områden som finns, egna beslut och avvikelser, och vad som kan behöva justeras när Produktdetalj byggs.
