# Brief 63 – Hem: ordning, fält, kort

**Fas:** 0. **Mål (ett):** Justera Hem. Inventera först `app/(tabs)/index.tsx`, `components/AskBar.tsx`, `FilterPills.tsx`, `ContinueRow.tsx`, `ContinueDialogRow.tsx`, `EditorialCard.tsx`, `CollectionCard.tsx` och var samlingar visas utan logotyp (`data/logos.ts`, `COLLECTION_LOGOS`). Rapportera vad som fanns.

## Gör
1. **Ordning:** fältet (AskBar) ligger **före** filterpillarna, så att pillarna sitter direkt över innehållet de växlar.
2. **Fältets text:** platshållaren på Hem blir **"Vad är du intresserad av idag?"** (Hitta-fältet har egen text i brief 66). Fältet öppnar sökläget som förut.
3. **"Fortsätt där du var":** varje kort får en **liten ikon som visar typen**, i hörnet eller före titeln: dialog = `stars`, samling = `layers`, sökning = `search`, produkt = `tag`, företag/varumärke = `shield`. Ikon 16, vit på toningen. Kortets text förblir vänsterställd. Om typen inte går att avgöra ur datan: rapportera och använd `layers`.
4. **Samlingar utan logotyp:** titeln ritas med **större typografi** så att den väger lika tungt som en logotyp (rimligt: `typography.title` i stället för korttiteln, och radavståndet justeras), och får **mer avstånd till texten under** (undertext/antal) så att de inte hänger ihop. Samlingar med logotyp rörs inte. Gäller alla korttyper som visar samlingar (stående, små och kollage där titeln visas i bild).

## Utanför scope
Pillarna filtrerar fortfarande inget på Hem (delad filterfunktion finns sedan brief 59, att koppla in är egen brief), hyllströmmen, flera nya hyllor.

## Verifiering
tsc, Metro, simulator mörkt och ljust: Hem uppifrån och ned. Rapport `docs/briefs/63-rapport.md`; uppdatera ia-karta.md (Hems ordning) och designsystem.md. Committa, inkl. briefen, och pusha.
