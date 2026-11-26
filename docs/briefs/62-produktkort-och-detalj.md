# Brief 62 – Produktkortets textblock och betyg i Produktdetalj

**Fas:** 0. **Mål (ett):** Mer kompakt produktkort och betyget där man väntar sig det. Inventera först `components/ProductCard.tsx` (info-raden, `saveButton`), `app/product/[id].tsx` och rapport 60. Rapportera vad som fanns.

## Gör
1. **Produktkort, textblocket.** Text (märke, namn, pris, betygsrad) ligger ihop i en kolumn **till vänster**, spara-knappen (bokmärke) till **höger**, båda **överjusterade (top-aligned)**. Priset ska ligga närmare namnet: minska avståndet så att märke, namn och pris sitter tätt (≤ 2 px mellan raderna utöver radhöjden). Gäller alla produktkort med spara-knapp (en-kolumn i Följer och motsvarande); i smala masonry-kort utan knapp ändras bara avståndet.
2. **Produktdetalj, betyg.** Visa betyget **direkt under produktnamn och pris**: `star` (outlined) + "4,6" + "(128 omdömen)", samma dämpade stil som på kortet. **Ta bort** raden "Betyg" ur faktalistan (Hållbarhet förblir ren). Produkter utan betyg: ingen rad.

## Utanför scope
Tryckbart betyg/omdömen (Fas 1+), nya fält.

## Verifiering
tsc, Metro, simulator mörkt och ljust: en-kolumn, masonry, Produktdetalj med och utan betyg. Rapport `docs/briefs/62-rapport.md` (kort), uppdatera designsystem.md (produktkortets textblock). Committa, inkl. briefen, och pusha.
