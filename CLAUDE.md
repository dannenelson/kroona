# CLAUDE.md — Kroona

Kort kontextfil för Claude Code. Håll den under ~100 rader. Detaljer ligger i `docs/`, inte här.

## Projektet
Kroona är en svensk e-handelsupptäcktsapp (mode + heminredning). Vi bygger **Fas 0**: ett kuraterat demo med 56 dummyprodukter för pilotpartners. Ingen backend, tracking eller provision. Fullständig spec ligger utanför repot — fråga hellre än att anta.

## Läs först (källa till sanning)
- `docs/plan.md` — vad som är aktivt nu, näst och senare. Bygg bara det som står under **Nu/Näst**.
- `docs/produkt.md` — vad Kroona är och vilka beslut som är låsta.
- `docs/design.md` — tokens (färg, typ, spacing, radie, glas, rörelse) och komponentkontrakt. **Alla visuella värden kommer härifrån.**
- `docs/process.md` — hur vi arbetar (flöde, granskning, briefmall).
- `docs/designsystem.md` — komponentkatalog (korttaxonomi, SectionHeader, TopBar, FilterPills). Dess färg-, typsnitts- och spacingavsnitt är ersatta av `design.md`.

## Tech-stack
- React Native + Expo (SDK 58), Expo Router, TypeScript. Node 24 (`.nvmrc`, kör `nvm use` först). Test via Expo Go (`npx expo start`).
- Expo-paket: `npx expo install <paket>`. Övrigt: `npm install <paket> --legacy-peer-deps`.
- Använd skills för Expo, React Native och Supabase när de finns installerade.

## Regler för kod
- **Inga hårdkodade hex, fontstorlekar eller spacing-siffror** i komponenter eller skärmar. Värden kommer från temat enligt `docs/design.md`.
- Layout med `gap`, inte `marginRight`/`marginBottom` på enskilda kort.
- Delad komponent först när den används på 2+ skärmar och har en tydlig roll.
- **Koden har ännu gamla värden** (`#0f0f0e`, Google Sans Flex i `constants/`). Migreringen till `theme/` är ett eget steg i planen. Gör den inte på eget initiativ.

## Navigation och felsökning
- Roten är react-native-screen-transitions `BlankStack`, inte Expo Routers native stack. Nya detaljskärmar behöver egna transition-options (se `components/product/productTransition.ts`). Reanimated 4 är installerat (krävs av biblioteket).
- Tillfällig felsökningskod (autotryck, loggning) får aldrig committas.
- Döda aldrig Daniels Expo-server (ingen `pkill -f 'expo start'`). Kör egna tester på en egen port och stäng bara din egen process.

## Scope — bygg INTE i Fas 0
Backend-databas, riktig tracking/attribution, provisionslogik, återförsäljardashboard, aktiva push-notiser. Hör de till Fas 1+? Flagga och stanna.

## Säkerhet
API-nyckeln (`EXPO_PUBLIC_ANTHROPIC_API_KEY`) ligger i `.env` och är känd teknisk skuld (klient-side). Committa aldrig `.env`.

## Git
Committa efter varje verifierad ändring (tsc/Metro-check godkänd). Pusha bara när Daniel säger till.

## Arbetssätt
- Inventera befintliga filer innan nytt byggarbete. Skriv inte över eller duplicera.
- Plan Mode för icke-triviala ändringar: presentera plan innan kod.
- Fullständig filkod vid leverans, inte utsnitt.
- Kort rapport efter varje runda: vad som gjordes, vilka beslut du tog själv, vad som är oklart.
- Upptäcker du något utanför uppgiften: nämn det sist i svaret, bygg det inte.
