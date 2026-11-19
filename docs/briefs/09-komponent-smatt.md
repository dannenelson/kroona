# Brief 09 — Smått på komponentsidan (TextTabs, haptik, IconButton selected)

**Mål:** Tre små justeringar efter Daniels besiktning. Inga skärmar.

**Läs först:** `CLAUDE.md`, `docs/design.md` §0 och States, `components/TextTabs.tsx`, `IconButton.tsx`, `Pill.tsx`, `theme/motion.ts`. Presentera en plan i Plan Mode först.

## Gör
1. **TextTabs: snabb och trevlig fade in/out** vid byte av vald flik. Texten tonar mellan `mute` och `textPrimary`, och understrykningen tonar in/ut (opacitet, ev. lätt glidning om det blir enkelt). Varaktighet som token (`motion.duration.fast`-nivå, ca 150–180 ms). Reduce motion: direkt byte.
2. **Haptik på klickbara element:** lätt impact (`expo-haptics`, redan installerat) vid tryck på knappar och IconButton, och `selection`-haptik när en flik byts i TextTabs. Pill: lätt impact. Inte på produktkort (har egen långt tryck-haptik), inte på nav-flikarna (Apple gör inte det). Samla i en liten delad helper (`haptic.light()`, `haptic.selection()`) så den kan stängas av på ett ställe. Ingen haptik när elementet är inaktivt.
3. **IconButton selected = fylld ikon, inte inverterad yta.** Ta bort den inverterade selected-ytan på IconButton. I stället byter ikonen från outline till fylld (default-beteendet i iOS). Ytan och ikonfärgen är oförändrade. API: `icon` och `selectedIcon` (eller motsvarande), `selected`. Finns ingen fylld variant, behåll outline och rapportera. Det gäller i praktiken bokmärket (spara) och en gilla-ikon. Bokmärket har redan en fylld variant. Bygg en fylld variant av gilla/hjärt-ikonen om den saknas (provisorisk, samma stil). Liten delight: en kort fjädrande "pop" (skala 1 → ca 1,15 → 1) när ikonen blir fylld, men inte vid avmarkering. Reduce motion: ingen pop. Pill behåller inverterad selected.
4. Uppdatera `app/components.tsx` (states för IconButton: selected visar fylld ikon) och `docs/design.md` (States: IconButton selected = fylld ikon). Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Haptik på kort, nav eller något utöver det som står. Ändra Pill-selected. Nya paket. Skärmar.

## Klart när
- Flikbyte tonar mjukt med haptik.
- Knappar och IconButton ger lätt haptik, inaktiva inte.
- IconButton selected visar fylld ikon (outline → fylld) utan inverterad yta.
- tsc och export utan fel, commit finns.

## Rapportera kort
Egna beslut och avvikelser, om fylld gilla-ikon byggdes, och vad Daniel ska känna efter på enhet (haptik syns inte i dev-routen).
