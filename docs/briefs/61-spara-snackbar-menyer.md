# Brief 61 – Spara, snackbar och kontextmenyer

**Fas:** 0. **Mål (ett):** Gör sparandet tydligt och konsekvent. Inventera först `components/Snackbar.tsx` (och dess provider/hook), `context/SavedProductsContext.tsx`, `components/ProductCard.tsx`, `ProductContextMenu.tsx`, `saved/SaveSheet.tsx`, `app/(tabs)/saved.tsx` och alla ställen där texten "Gillade" förekommer (`rg -i gillad`). Rapportera vad som fanns.

## Gör
1. **Namnbyte:** "Gillade produkter" → **"Sparade produkter"** överallt i UI, kod-kommentarer och docs (identifierare i koden får heta som de gör om det blir en stor ändring; rapportera då).
2. **Snabbtryck på spara** (bokmärket på produktkort, i en-kolumn-vyn och i Produktdetalj): sparar produkten och visar snackbar **"{Produktnamn} lades till i sparade produkter"**. Ett nytt snabbtryck tar bort den och visar **"{Produktnamn} togs bort från sparade produkter"** (saknas i dag). Långt tryck öppnar som förut "Spara i samling". När en produkt sparas i en samling: **"{Produktnamn} lades till i {Samlingsnamn}"**.
3. **Snackbar:** alltid **samma bredd** (max-bredden: skärmbredd minus marginaler, aldrig smalare efter innehållet). Produkt- och samlingsnamn i **fetstil**; långa namn kortas med ellipsis så att resten av meningen alltid syns. Behåll nuvarande tid, placering och åtgärdsknapp (Ångra om den finns).
4. **Stjärnan** i betygsraden på produktkort och Produktdetalj ritas **outlined** (inte fylld) så att den linjerar med lövet (`star` utan `filled`).
5. **Kontextmenyer** (produktkort, partner- och profilkort, Sparat): **ikon till vänster** på varje rad, i `Icon`-systemet: Spara = `bookmark`, Spara i samling = `folder-add`, Följ = `user-add` (kvarstår tills egen följ-ikon ritats), Sluta följa = samma, Dela = `share`, Visa liknande = `layers`, Öppna = `chevron-right` (kvar till höger som förut om raden är en navigering). Ikon 20, avstånd till text `spacing.sm`, textfärg som i dag.

## Utanför scope (flagga, bygg inte)
Egen följ-ikon, nya menyalternativ, Ångra-logik om den saknas.

## Verifiering
tsc, Metro, simulator mörkt och ljust: spara och ta bort på kort, i en-kolumn och Produktdetalj; samling; långa produktnamn; menyerna. Rapport `docs/briefs/61-rapport.md`. Uppdatera docs (Sparat-texter, snackbar-regel i designsystem.md). Committa, inkl. briefen, och pusha.
