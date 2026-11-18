# Brief 03 — Basskomponenter (steg 1b)

**Mål:** Fem delade komponenter på temat (Glas/IconButton, Pill, TextTabs, ProductCard S/M/L, TopBar), byggda mot komponentsidan och `docs/design.md`, så att senare skärmar bara sätter ihop dem.

**Läs först:** `CLAUDE.md`, `docs/design.md` (särskilt §3 Glas, §9 Komponentkontrakt, §11 Filter och pillar), `docs/designsystem.md` (kortens former), `theme/`. Visuell referens: komponentsidan https://claude.ai/artifact/ApiDk45bXdWccFMUgAw4k5 (du byggde den). Presentera en plan i Plan Mode innan du ändrar något.

## Gör
1. **Inventera** befintliga `FilterPills.tsx`, `ProductCard.tsx`, `Header.tsx`, `CollectionCard.tsx` och var de används. Återanvänd och refaktorera hellre än att skriva nytt bredvid. Ett system, inga dubbletter.
2. **Glas** (`components/Glass.tsx`) och **IconButton** (glas, 44 px, states default/pressed/selected/disabled). Följ glas-tokens i `theme/glass.ts`. Saknar `expo-blur` stöd för saturate: använd närmaste approximation och rapportera.
3. **Pill** (glas och fylld variant, states default/pressed/selected/disabled). Används **inte** för filtrering. Avsedd användning: byter innehåll överst på Hem.
4. **TextTabs** (ny): text-flikar med understrykning, 44 px höga, horisontell scroll vid många, `selected` med `accentText`/understrykning. Ersätter `FilterPills` för filtrering.
5. **ProductCard** S/M/L enligt komponentsidan (S = bara bild, radie `tile`; M och L radie `card`, text under bilden). Spara-knapp (glas) på M och L. Pris och betyg enligt design.md.
6. **TopBar** med varianter Produktdetalj (tillbaka + spara över foto) och Hitta (meny + glaskapsel med arkiv och ny chatt). Över foto: fast mörkt glas och vita ikoner i båda teman.
7. Alla komponenter följer komponentkontraktet (variant, size, states, `style` sist) och använder bara tokens från `theme/`. Pressed = opacity 0,8.
8. **Byt ut** gamla komponenter där de är drop-in (ProductCard, FilterPills → TextTabs). Ändra inte skärmarnas struktur eller innehåll.
9. Lägg en dev-route `app/components.tsx` (utanför flikarna) som visar alla komponenter i aktuellt tema, så Daniel kan besiktiga i Expo Go.
10. Verifiera: `npx tsc --noEmit`, iOS-export, grep att inga hex, fontstorlekar eller spacing-siffror ligger utanför `theme/`. Testa mörkt och ljust (`INITIAL_SCHEME`).
11. Commit (ingen push).

## Gör INTE
- Avgör de två öppna designfrågorna: (a) ljust glas över ren yta, (b) scrimens solida botten i ljust läge. Implementera enligt nuvarande tokens, lägg `// TODO(design)` och rapportera hur det ser ut.
- Bygga Hem-hyllor, Produktdetalj, Flöde eller andra skärmar. Ingen datamodell, inget följa eller spara-logik (spara-knappen får vara visuell med lokalt state).
- Lägga till nya paket (Reanimated, `expo-image`, ikonbibliotek). Ikoner: befintlig SVG-pipeline.
- Införa nya färger, radier eller spacing. Saknas en token: använd närmaste och rapportera.
- Röra `CardShowcase`, `ClusterCard` eller teknisk skuld.

## Klart när
- tsc och iOS-export utan fel, grep utan träffar, commit finns.
- `app/components.tsx` visar alla fem komponenterna med states i båda teman.
- Befintliga flikar fungerar och ser likadana ut, bortsett från TextTabs i stället för FilterPills.

## Rapportera kort
Vad som byggdes och refaktorerades, egna beslut (särskilt avvikelser från komponentsidan), approximationer (glas-saturate), hur ljust glas och scrim ser ut, och fynd utanför uppgiften.
