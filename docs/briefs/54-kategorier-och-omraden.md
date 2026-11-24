# Brief 54 – Kategorivy, alla kategorier, Områden-lista och områdesdetalj

**Fas:** 0. **Mål (ett):** Ge Hittas hyllor mål att öppna: kategorivy, lista över alla kategorier, lista över alla områden och områdesdetalj. Skisser: canvasen "Kroona Hem – kortformat", tavla 6 (Kategorivy Möbler) och Hitta-tavlorna. Inventera först `app/(tabs)/find.tsx`, `app/results.tsx`, `app/dialog.tsx`, `components/AreasRow.tsx`, `SectionTitle.tsx`, `FilterPills.tsx`, `ProductGrid.tsx`, `lib/catalog.ts`, `lib/search.ts`, `data/areas.ts`, `app/collection/[id].tsx` (för följ-knapp och rubrikmönster) och hur "Följer" lagras för områden. Återanvänd befintliga mönster i stället för att bygga nya. Rapportera vad som fanns.

## Gör
1. **Kategorivy** (`app/category/[id].tsx`, id: `klader`, `mobler`, `begagnat`). Tillbakaknapp, rubrik (Familjen Grotesk 28), knappen **"Fråga om Möbler"** (stjärnikon, pill 40 hög, `surface2`, kant) och antal produkter till höger, typpillar under (Alla + typerna som finns i kategorin; fungerande filter), därefter `ProductGrid`. Knappen öppnar `dialog` med `scope` = kategorins namn. Kläder: pillar efter kategorins typer eller kön om typ saknas (rapportera vad datan stöder). **Begagnat** är ett skick, inte en produkttyp: visa alla produkter med begagnat erbjudande, och använd samma pillar som Kläder/Möbler (Alla, Kläder, Möbler). Hitta-korten Kläder, Möbler, Begagnat öppnar vyn.
2. **Alla kategorier** (`app/categories.tsx`): lista med en rad per kategori (bild 56 × 56 radie 14 från första produkten, namn, antal produkter, chevron). Under varje kategori inga undernivåer ännu. Tryck öppnar kategorivyn. Aktivera **"Visa fler ›"** på Kategorier-hyllan på Hitta → denna sida.
3. **Alla områden** (`app/areas.tsx`): 2-kolumnsgrid med samma områdeskort som på Hitta (text på bild, vänsterställd, titel + "N produkter"), alla områden. Aktivera "Visa fler ›" på **Områden och stilar** (Hitta) och på **Områden** (Hem) → denna sida.
4. **Områdesdetalj** (`app/area/[id].tsx`): tillbakaknapp, rubrik, beskrivning (`area.description`, dämpad), följ-knapp på samma sätt som övriga följbara detaljvyer (använd befintlig mekanism för `kind: 'area'`), antal produkter och `ProductGrid` med områdets urval (`getProductsForArea`). Områdeskort på **både Hem och Hitta** öppnar den. Ta bort noten om att korten inte öppnar något.
5. **Idéer "Visa fler ›"**: ge hyllan "Idéer för dig" en destination: `app/ideas.tsx`, lista med alla idékort (samma liggande kort 240 × 160 i en kolumn, fulla bredden) som öppnar resultat. Aktivera "Visa fler ›" där.
6. **Sök om ersätter.** När man söker på nytt från Sökresultat (via fältet i resultatet) ska den nya sökningen **ersätta** det gamla resultatet i stacken (`router.replace`), så att tillbaka går till där man var innan första sökningen.
7. **Gamla länkar.** Knappen "Utforska" i Sparat leder nu till Hitta-startsidan; lämna det som det är men rapportera det som ett frågetecken. `ContinueDialogRow` rörs inte.

## Mått och stil
Följ `theme/` och `docs/designsystem.md`. Pillar 36 hög. "Visa fler ›" är redan byggd (brief 53). Ljust och mörkt läge.

## Utanför scope (flagga, bygg inte)
Undernivåer i kategorilistan, Pris- och Stil-filter, notisskärm, mixarnas destination, filtrerande Hem-pillar, hyllström, chatthistorik, röst, namn på AI:n.

## Verifiering
tsc, Metro, simulator mörkt och ljust. **Tryck igenom varje kedja och rapportera den:** Hitta → Möbler → "Fråga om Möbler" → dialog med pill; Hitta → Kategorier "Visa fler" → lista → vy; Områden "Visa fler" (Hem och Hitta) → lista → detalj → följ → syns i Sparat/Följer; Idéer "Visa fler" → lista → resultat; sök om från resultat → tillbaka. Rapport: `docs/briefs/54-rapport.md`. Uppdatera `docs/ia-karta.md` (nya skärmar, fas-taggade), `docs/design.md` och `docs/designsystem.md`. Committa, inkl. briefen, och pusha.
