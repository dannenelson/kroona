# Brief 04 — Basskomponenter i Apple-ren (steg 1b, omtag)

**Mål:** Bygg om basskomponenterna från brief 03 efter den godkända riktningen "Apple-ren", så att de ser ut som designen och senare skärmar bara sätter ihop dem.

**Läs först:** `CLAUDE.md`, `docs/design.md` **§0 (gäller före §2–§6)**, `docs/produkt.md`, `theme/`, brief 03. Visuell referens: Claude Design "Kroona Looken A" https://claude.ai/artifact/5XbvB5EogW8efQhHAzkxDH (hela setet, mörkt och ljust, plus States och Värden). Presentera en plan i Plan Mode innan du ändrar något.

## Gör
1. **Tema:** lägg in värdena från design.md §0 i `theme/` (färger mörkt/ljust, radier, glas, scrim). **Ta bort accent/guld** (`accent`, `accentText`, `onAccent`) och alla användningar. Vald = inverterad text/yta, nedtryckt = `pressed`-yta + scale ~0,97, inaktiv = 35 % opacitet.
2. **Squircle:** `borderCurve: 'continuous'` på alla rundade former utom cirklar och pillar.
3. **Komponenter** (uppdatera befintliga, inga dubbletter): Glass, IconButton, Pill, TextTabs, ProductCard S/M/L, TopBar. States enligt "States"-tabellen i referensen. TextTabs: vald = text + understrykning i `text`-färg, inte accent.
4. **Spara på kort:** ta bort Spara-knappen på ProductCard. Spara/Följ varumärke/Dela/Visa liknande ligger i en **meny vid långt tryck** (iOS-kontextmeny-känsla: kortet lyfts, bakgrunden blurras, menyn under). Kontrollera först om `expo-router` Link context menu fungerar i Expo Go. Annars egen Modal-lösning med befintliga paket. En Spara-knapp finns bara på Produktdetalj (senare skärm, bygg inte nu). Ikon: bokmärke.
5. **Kantblur** (ny komponent, `EdgeFade`): kort toning + gradvis blur överst (något högre än statusfält/Dynamic Island, ca 68 px) och underst (bakom navigationen, ca 128 px). Tre lager `expo-blur` med mask (20/50/100 %, max 8 px) + gradient. Ersätter nuvarande toning i `CustomTabBar`. Mät prestanda i Expo Go och rapportera. Nav-ikonerna ligger lågt, nära hemindikatorn.
6. **Typografi:** Familjen Grotesk (rubriker) + Google Sans Flex (UI). Ingen ändring av typsnitt.
7. **Hållbarhet neutralt:** ta bort `success`/`warning`/`successSubtle` om de inte används av något annat, annars rapportera var.
8. Uppdatera `app/components.tsx` så den visar alla komponenter med states i båda teman, plus EdgeFade över ett foto, plus långt tryck-menyn.
9. Uppdatera `docs/design.md` §2–§6 så de matchar koden, och ta bort §0:s "ersätter"-text när tabellerna stämmer. Uppdatera `docs/designsystem.md` (TopBar har bokmärke i stället för hjärta, filtrering = TextTabs).
10. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex, fontstorlekar eller spacing-siffror ligger utanför `theme/`, grep att inget accent/guld återstår. Testa mörkt och ljust. Commit (ingen push).

## Gör INTE
- Bygga skärmar (Hem, Produktdetalj, Flöde, Hitta, Sparat) eller datamodell, följa-logik eller sparlogik. Spara i menyn får vara lokalt visuellt state.
- Lägga till paket utan att fråga (Reanimated, `expo-image`, ikonbibliotek).
- Avgöra de öppna designfrågorna: ljust glas över ren yta (använd `surface` + `line` där, `// TODO(design)`), solid scrim i botten i ljust, ikonstil. Implementera nuvarande tokens och rapportera hur det ser ut.
- Röra `CardShowcase`, `ClusterCard` eller teknisk skuld.

## Klart när
- tsc och export utan fel, grep utan träffar, commit finns.
- `app/components.tsx` matchar referensen visuellt i båda teman (squircle, inga accentfärger, kantblur, långt tryck-meny).
- Befintliga flikar fungerar, bortsett från att guld är borta och toningen ersatts av EdgeFade.

## Rapportera kort
Vad som byggdes, **egna beslut och avvikelser från referensen** (Daniel vill se dem), prestanda för kantblur i Expo Go, om kontextmenyn gick med Router-länk eller egen Modal, hur ljust glas och scrim ser ut, och fynd utanför uppgiften.
