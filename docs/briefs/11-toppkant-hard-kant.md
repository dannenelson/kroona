# Brief 11 — Vågig toppkant: ta bort den hårda kanten

**Vad Daniel ser (skärmdump från enhet, brief 10):** Vågigt läge ger en **skarp, vågformad kant** där toningen slutar. Den syns tydligt mot fotot (ljus jeansjacka). Det är exakt det han inte vill ha: toningen ska vara en jämn tonövergång utan synlig gräns. Kanten är organisk i form men hård i övergången.

**Trolig orsak (verifiera):** de tre `BlurView`-lagren maskas av den vågiga alfa-masken. iOS `UIVisualEffectView` följer inte en mjuk alfa-mask på ett jämnt sätt, utan klipper blurren med en hård kant där masken passerar en tröskel. Färgtoningen (gradienterna) är mjuk, men blur-materialet är det inte, och det syns som en linje.

**Läs först:** `CLAUDE.md`, `components/EdgeFade.tsx`, `theme/glass.ts`, `app/components.tsx`. Presentera en plan i Plan Mode först.

## Gör
1. **Bekräfta orsaken** (hård kant kommer från blur-lagren under masken, inte från toningen). Rapportera.
2. **Ta bort masken från blur-lagren i vågigt läge.** Blur-lagren använder samma raka, mjuka staplade gradientmasker (20/50/100 %) som Rak, så de har ingen hård kant. Den vågiga formen (de överlappande mjuka ellipserna) appliceras **bara på färgtoningen**, som består av gradienter och därför inte kan få en hård kant.
3. Om blurkanten (rak men mjuk, max 8 px) fortfarande syns som en linje mot fotot: gör den ännu mjukare (fler lager, längre utfasning, lägre max-blur) i stället för att maska den. Prova och rapportera vad som krävs.
4. Titta på toningens styrka: över ljusa foton (som jeansjackan) i mörkt tema blir den mörka toningen en tydlig mörk band. Sänk toningens täthet något så att den inte känns som ett lock, men fortfarande ger läsbar statusfält-text. Värden som tokens, rapportera gamla och nya.
4. Testa i dev-sidan (Rak/Vågig/Blur på/av) över ljust foto, mörkt foto och ren bakgrund i båda teman. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex/fontstorlekar/spacing-siffror ligger utanför `theme/`. Commit (ingen push).

## Gör INTE
- Ändra flikskärmarna, tab-baren eller botten-toningen. Nya paket utan att fråga.

## Klart när
- Vågigt läge har ingen synlig hård kant: ingen linje går att peka ut mot fotot.
- Rak är oförändrad.
- tsc och export utan fel, commit finns.

## Rapportera kort
Orsaken, vad som ändrades (blur utan mask, vågform bara på toningen), nya värden, och vad som bara kan bedömas på enhet.
