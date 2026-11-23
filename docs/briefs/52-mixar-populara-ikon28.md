# Brief 52 – Mixar med en bild, Populära samlingar med text under, menyikon 28

**Fas:** 0. **Mål (ett):** Tre små ändringar efter Daniels granskning av Hem. Rör inget annat. Inventera först `components/MixRow.tsx`, `MixCard.tsx`, `PopularCollectionsRow.tsx`, `CollectionCard.tsx` och `theme/spacing.ts` (`tabBar.iconSize`).

## Gör
1. **Mixar: en bild.** Mixkortet (160 × 160) visar **en omslagsbild** (mixens första produkt) i stället för 2 × 2-mosaiken. Titel och undertitel ligger på bilden med samma toning som övriga kort, men **vänsterställda**. Rankningslogiken och datan rörs inte.
2. **Populära samlingar: text under.** Kollaget (en bred bild över två små) behålls, men titel och "N produkter" flyttas **under bilden**, **vänsterställda**, i samma stil som produktkortens text (titel 14/500, undertext 12 dämpad). Kuratorchipet (avatar + namn) ligger kvar på bilden uppe till vänster. Bildytan 200 × 250 (4:5) med radie 20 och kant som övriga kort; ingen toning behövs längre. Zoomövergången och Samlingsdetalj fungerar som förut.
3. **Menyikon 28:** `tabBar.iconSize` 32 → **28**. Allt annat i menyn orört.

## Regel att skriva i docs
Text ligger på bilden bara när bilden är **ett enda foto**. Flerbildskort (kollage) har texten under.

## Utanför scope (flagga)
Övriga kort, att mixarna får mer innehåll, ikonerna ritas om.

## Verifiering
tsc, Metro, simulator mörkt och ljust. Rapport: `docs/briefs/52-rapport.md`. Uppdatera `docs/design.md` och `docs/designsystem.md` (regeln ovan, mixkort, kollagekort, ikonstorlek). Committa, inkl. briefen, och pusha.
