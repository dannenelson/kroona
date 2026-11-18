# Brief 02 — Uppgradera Expo SDK 54 → 58

**Varför:** Daniels Expo Go på iPhone är SDK 58 och går inte att nedgradera. Projektet ligger på SDK 54, så appen kan inte köras på telefonen.

**Mål:** Appen kör i Expo Go (SDK 58) utan funktionell eller visuell skillnad mot nuläget (commit `8b9c333`). Ingenting annat ändras.

**Läs först:** `CLAUDE.md`, Expos uppgraderingsguide https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/ och changelog för SDK 55–58 (https://expo.dev/changelog). Presentera en plan i Plan Mode innan du ändrar något.

## Gör
1. **Uppgradera direkt till SDK 58** (hoppa inte via 55–57): `npx expo install expo@latest`, sedan `npx expo install --fix`. Använd `--legacy-peer-deps` om npm klagar. Kontrollera att versionen som installeras är den senaste 58.x.
2. Kör `npx expo-doctor` och åtgärda bara det som rör uppgraderingen. Ta inte bort paket som doctor rapporterar som required peer (t.ex. `expo-constants` ska finnas kvar när `expo-router` används).
3. **Bryt-ändringar att kontrollera särskilt:**
   - `@react-navigation/*`-importer (bl.a. `CustomTabBar`, `app/(tabs)/_layout.tsx`): från SDK 56 ska de gå via `expo-router`. Följ Expos migreringsguide/codemod om importerna slutar fungera eller varnar. Ändra inte tab-barens utseende.
   - `react-native-svg`, `expo-linear-gradient`, `expo-blur`, `expo-font`, `@react-native-async-storage/async-storage`: ska fungera på SDK 58. Byt inte ut dem mot "rekommenderade ersättare", flagga bara om något är deprecated.
   - `app.json`: ta bort `newArchEnabled` (default), behåll allt annat.
4. Rensa cache: `npx expo export -p ios --clear`, ta bort `.expo`, `npx expo start -c`.
5. Verifiera: `npx tsc --noEmit` utan fel, Metro bygger (iOS-export), `expo-doctor` utan fel.
6. Commit (ingen push).

## Gör INTE
- Aktivera React Compiler, byt AsyncStorage/gradient-paket, rensa `metro.config.js`/babel eller andra "housekeeping"-förslag. Lista dem i rapporten i stället.
- Lägg till Reanimated, `expo-image` eller andra nya paket.
- Röra temat, komponenter eller data.

## Klart när
- tsc, Metro-export och expo-doctor går igenom, och commit finns.
- Daniel kan öppna appen i Expo Go på telefonen (det testar han själv).

## Rapportera kort
Versioner före/efter (expo, react, react-native, expo-router), vilka kodändringar uppgraderingen krävde och varför, varningar som återstår, och sådant du hittade utanför uppgiften (t.ex. paket som är deprecated, React Compiler-möjlighet).
