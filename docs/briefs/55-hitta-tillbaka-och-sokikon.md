# Brief 55 – Hitta: tillbaka-knappen och sökikonen

**Fas:** 0. **Mål (ett):** Fixa två fel i Hitta efter brief 53–54. Rör inget annat. Inventera först `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/find.tsx`, `app/search.tsx`, `app/results.tsx`, `app/category/[id].tsx`, `app/area/[id].tsx`, `components/AskBar.tsx`.

## Gör
1. **Tillbaka hamnar på Hem.** Från Hitta öppnar man en undersida (kategori, område, idé, sökresultat, "Visa fler"-lista) och trycker tillbaka: man ska komma tillbaka till **Hitta**, inte till Hem. Hitta orsaken (troligen hur flikarnas historik eller stackens uppbyggnad är satt, t.ex. `backBehavior` eller att undersidorna ligger utanför fliken) och rätta den så att tillbaka alltid går till skärmen man kom från, även när man bytt flik emellan. Kontrollera alla vägar från Hitta, och att Hem-fältet → sökläge → tillbaka fortfarande går till Hem. Rapportera orsaken.
2. **Fel ikon i sökfältet.** På Sökresultat ska fältet ha **förstoringsglaset**, inte AI-stjärnan. Stjärnan hör bara till Hitta-startsidans fält och till "Fråga om"-valet. Kontrollera även att sökläget (aktivt fält) har förstoringsglaset, enligt skissen.

## Utanför scope
Allt annat. Rapportera om du ser något mer, men ändra inget.

## Verifiering
tsc, Metro. Rapport: `docs/briefs/55-rapport.md` (kort). Committa, inkl. briefen, och pusha.
