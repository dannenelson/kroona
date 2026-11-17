# Brief 01 — Tema (steg 1a)

**Mål:** Ersätt `constants/colors.ts` och `constants/spacing.ts` med ett tokenbaserat `theme/` enligt `docs/design.md`, med mörkt och ljust tema. Ingen ny funktion och inga nya komponenter.

**Läs först:** `CLAUDE.md`, `docs/design.md`, `docs/plan.md`. Använd skillen `expo-design-system` (och `expo-native-ui` vid behov). Presentera en plan i Plan Mode innan du ändrar något.

## Gör
1. **`theme/`** (en enda ingång, `theme/index.ts`): `colors.ts` (semantiska roller, mörk + ljus, exakt enligt design.md §2), `typography.ts` (§4), `spacing.ts` (§5: xs 4, sm 8, md 12, lg 16, xl 24, xxl 32, xxxl 48), `radius.ts` (§6), `shadows.ts` (§7), `motion.ts` (§8), `glass.ts` (§3, bara tokens).
2. **`ThemeProvider` + `useTheme()`** i `app/_layout.tsx`. Default är mörkt. Stöd för att byta till ljust (ingen UI för det än, men det ska gå att sätta i koden).
3. **Beroenden:** `npx expo install expo-blur`. Lägg till `@expo-google-fonts/familjen-grotesk` (`--legacy-peer-deps`). Google Sans Flex finns redan.
4. **Typsnitt:** ladda Familjen Grotesk 600 och 700 samt Google Sans Flex 400, 500 och 600 (+ 700 om något använder det). Ett fontfamilj-namn per vikt. Familjen Grotesk bara för `display`, `title1`, `title2`.
5. **Migrera** alla användningar av `Colors`, `Spacing`, `Radius` (cirka 20 respektive 23 filer) till temat. Flytta de 4 hex och 13 rgba som ligger i komponenter in i temat som tokens. Gamla nyckelnamn mappas till nya roller. Tvivlar du på en mappning: fråga, gissa inte.
6. **Splash och `app.json`:** mörk splash-bakgrund (`#15171B`), `userInterfaceStyle: "automatic"`.
7. **Tab-bar-sömmen** i `CustomTabBar` ska lösas genom att gradienten använder bakgrundstoken (`bg`) med alfa.
8. Ta bort `constants/colors.ts` och `constants/spacing.ts` när inget längre importerar dem.

## Gör INTE
- Nya komponenter (Glas, Pill, Kort, TopBar kommer i 1b).
- Datamodellen, nya skärmar, Reanimated, gester, `expo-image`.
- Ändra layout eller innehåll. Utseendet ska bara skilja sig genom ny bakgrundsfärg, nya typsnitt och ljust tema.

## Klart när
- `npx tsc --noEmit` utan fel. Metro bygger.
- Ingen hex, rgba, fontstorlek eller spacing-siffra utanför `theme/` (kontrollera med grep och redovisa träffar som är lokala med skäl).
- Appen ser likadan ut som förut, fast med ny bakgrund och nya rubriktypsnitt, i både mörkt och ljust läge.
- Commit efter verifiering. Pusha inte.

## Rapportera kort
Vad du gjorde, vilka beslut du tog själv (särskilt färgmappningar), och sådant du hittade utanför uppgiften.
