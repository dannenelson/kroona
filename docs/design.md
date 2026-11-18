# Kroona — Design

*Grunden för hur Kroona ser ut och byggs visuellt. Levande dokument: justera värden här först, sedan i koden. Senast: 2026-11-18.*

**Designprincip:** så modern och stilren som möjligt, och så Apple-nära som möjligt. Tydlig hierarki, generöst med luft, få färger, fotografin bär designen, native känsla och lugn rörelse. Referenser: Apple HIG, Spotify, Pinterest. I kod stödjer skillen `expo-native-ui` (Apple HIG-styling) detta. I granskning används en HIG-kontroll före demot.

**Status på varje rad:**
✅ **Låst** = beslutat i designarbetet · 🔵 **Grund** = best-practice-värde så att ingenting är tomt, justeras fritt · 🟡 **Öppet** = behöver beslut

Komponenternas former (korttaxonomi, SectionHeader, TopBar, TextTabs) ligger kvar i `designsystem.md` tills de flyttas hit. Det dokumentets färg-, typsnitts- och spacingavsnitt är ersatta av detta.

---

## 0. Riktning: Apple-ren ✅ (godkänd 2026-11-18)
Källa: Claude Design "Kroona Looken A" (hela setet, mörkt och ljust). Implementerat i brief 04; tabellerna i §2–§8 nedan matchar koden.

- **Ingen accentfärg.** Neutral gråskala, fotot är enda färgen. Guld `#B8965A` utgår.
- **Vald** = inverterad text/yta (mörk pill på ljust, ljus pill på mörkt). **Nedtryckt** = djupare yta + lätt nedskalning. **Inaktiv** = 35 % opacitet.
- **Hörn:** squircle (`borderCurve: 'continuous'` i RN) på alla rundningar utom cirklar och pillar.
- **Kanter:** kort toning + gradvis blur överst (bakom statusfält/Dynamic Island, något högre än den) och underst (bakom navigationen). Nav-ikoner låga, nära hemindikatorn. Komponent `EdgeFade`.
- **Spara:** bokmärke, via långt tryck-meny (Spara · Följ varumärke · Dela · Visa liknande) plus en Spara-knapp på Produktdetalj.
- **Typsnitt:** Familjen Grotesk (rubriker) + Google Sans Flex (UI) ✅ (Daniel, 2026-11-18).
- **Delight** ✅ (Daniel, 2026-11-18): appen ska kännas rolig, med små oväntade saker som händer (rörelse, haptik, överraskningar). Följer med genom hela bygget. Lugnt och sansat gäller fortfarande: inget blinkar, inget spelas av sig självt. Idéer samlas i idebanken tills de prioriteras.
- **Glas över foto i ljust tema är ljust** (ändrat 2026-11-18, ersätter "fasta overlayer i båda teman" för glas; scrim är fortsatt fast).

| Token | Mörkt | Ljust |
|---|---|---|
| `bg` | `#15171B` | `#F5F6F8` |
| `surface` | `#1F2227` | `#FFFFFF` |
| `surface2` | `#2A2D33` | `#E9EBEE` |
| `pressed` | `#353840` | `#DCDFE3` |
| `text` | `#F5F6F8` | `#15171B` |
| `mute` | `#9298A2` | `#686E78` |
| `line` | `rgba(255,255,255,.10)` | `rgba(21,23,27,.10)` |
| `sep` | `rgba(255,255,255,.07)` | `rgba(21,23,27,.07)` |
| `placeholder` | `#24272D` | `#E2E5E9` |
| `glass` | `rgba(42,45,51,.72)` | `rgba(255,255,255,.72)` |
| `glassLine` | `rgba(255,255,255,.14)` | `rgba(21,23,27,.10)` |
| `scrim` | `rgba(8,9,11,.40)` | `rgba(21,23,27,.12)` |
| `menu` | `rgba(44,46,52,.80)` | `rgba(255,255,255,.82)` |

Radier: bildkort/lista/meny 14 · samlingskort 16–18 · jämförelse 18 · pill 17 (34 hög) · knapp/glasknapp 22 (44) · sökfält 25 (50) · bubbla 20 (6 nere höger) · varumärke cirkel. Kantblur: 8 px max, tre lager (20 / 50 / 100 %) med mask.

**Hållbarhet visas neutralt** (ingen grön/röd). `success`/`warning`/`successSubtle` finns kvar i temat bara för att Hitta (`warning`), CardShowcase och ClusterCard använder dem. Städas när de filerna tas bort.

**Kvar att avgöra:** ljust glas över ren yta (syns knappt), solid scrim i botten i ljust, Spara-knappens storlek på små kort, ikonstil, om översta toningen i Expo Go är iOS 26 native scroll-edge.

## 1. Princip: två lager
1. **Grundtokens** är råa värden (`#15171B`, `16`). De används bara inuti temat.
2. **Semantiska tokens** är roller (`bg`, `textPrimary`, `pressed`). Komponenter använder bara dessa.

Då byts tema, märkesfärg eller typsnitt på ett ställe. Ingen hex, fontstorlek eller spacing-siffra skrivs i komponenter eller skärmar (undantag: lokala optiska justeringar, med kommentar).

## 2. Färg ✅ (Apple-ren, §0)
Kodens rollnamn behölls i brief 04. Kolumnen "§0" visar vilket §0-namn rollen motsvarar.

| Roll i koden | §0 | Mörkt | Ljust |
|---|---|---|---|
| `bg` | `bg` | `#15171B` | `#F5F6F8` |
| `surface` | `surface` | `#1F2227` | `#FFFFFF` |
| `surfaceRaised` | `surface2` | `#2A2D33` | `#E9EBEE` |
| `pressed` | `pressed` | `#353840` | `#DCDFE3` |
| `textPrimary` | `text` (även yta för vald) | `#F5F6F8` | `#15171B` |
| `textSecondary` | `mute` | `#9298A2` | `#686E78` |
| `textTertiary` | `mute` (§0 har två textnivåer) | `#9298A2` | `#686E78` |
| `border` | `line` | `rgba(255,255,255,.10)` | `rgba(21,23,27,.10)` |
| `sep` | `sep` | `rgba(255,255,255,.07)` | `rgba(21,23,27,.07)` |
| `placeholder` | `placeholder` | `#24272D` | `#E2E5E9` |
| `menu` | `menu` | `rgba(44,46,52,.80)` | `rgba(255,255,255,.82)` |
| `scrim` | `scrim` (bakom lyft meny) | `rgba(8,9,11,.40)` | `rgba(21,23,27,.12)` |
| `success` / `warning` / `successSubtle` | — | `#4A9E5C` / `#C08A4A` / `#0C1A0E` | `#2F7D43` / `#8A5A1C` / `#E4F1E7` |
| `danger` | — | — | — 🟡 först vid fel/radera |

**Ingen accent.** `accent`, `accentText`, `onAccent` och `cta`/`onCta` är borttagna. Vald = `textPrimary` som yta och `bg` som text.

**Kontrast:** `mute` på `bg` ger 6,2 (mörkt) och 4,75 (ljust), båda AA.

**Foto-overlayer är fasta och identiska i båda teman** ✅: scrim enligt `scrimStops` nedan, mjuk och lång utfasning. Hero-rubriker på foto är det enda medvetna AA-undantaget. Knappar, pillar och priser ska alltid klara AA.

| Overlay-token | Värde (båda teman) | Status |
|---|---|---|
| `scrimStops` (hero- och partnerkort, toning till solid botten) | `rgba(14,16,20)` med alfa 0 / .56 / .75 / 1 vid 0 / .4 / .65 / 1 | 🔵 |
| `scrimSoft` (knapp/badge på foto) | `rgba(14,16,20,.6)` | 🔵 |
| `onPhoto` / `onPhotoSecondary` (text på scrim) | `#FFFFFF` / `#C4C4C4` | 🔵 |
| `photoFade` (kantblur över foto, topp) | `rgba(0,0,0,.4)` → 0 | ✅ |

## 3. Glas ✅ (Apple-ren, §0)
Följer temat. Tre toner i `components/Glass.tsx`: `theme` (över innehåll), `photo` (direkt på foto, lika i båda teman), `plain` (över ren yta).

| Egenskap | Mörkt (`glass`) | Ljust (`glass`) | Foto (`photoGlass`) |
|---|---|---|---|
| Fyllning | `rgba(42,45,51,.72)` | `rgba(255,255,255,.72)` | `rgba(20,22,26,.34)` |
| Kant (1 px, en linje) | `rgba(255,255,255,.14)` | `rgba(21,23,27,.10)` | `rgba(255,255,255,.24)` |
| Innehåll | `#F5F6F8` | `#15171B` | `#FFFFFF` |
| Blur / saturate | 20 / 160 % | 20 / 160 % | 20 / 160 % |

`expo-blur` tar intensitet, inte radie: blur 20 ≈ intensity 50. Saturate saknas (närmast är BlurViews tint). 🟡 Ljust glas över ren yta (`plain` i ljust tema) använder `surface` + `line` utan blur tills frågan är avgjord.

**Kantblur (`EdgeFade`):** max 8 px i tre lager (20 / 50 / 100 %), vart och ett med gradientmask (maskstopp 0–20→55 %, 0–40→80 %, 0–60→100 %), plus toning mot `bg`: topp alfa .80 / .50 / 0, botten .96 / .80 / 0. Höjd topp = safe area + 14 (≈ 68), botten 128. Kräver `@react-native-masked-view/masked-view`.

**Kontextmeny (långt tryck):** bakgrund blur 18 (intensity 60) + `scrim`, lyft kort skala 1,04 med radie 16 och skugga `lift`, meny 250 bred, rader 46, `menu`-yta med blur 40 (intensity 90) och `glassLine`-kant.

## 4. Typografi
Familjen Grotesk (display) ✅ + Google Sans Flex (UI) 🔵. Google Sans Flex är en tillfällig grund (beslut 2026-11-17) och kan bytas senare genom att ändra typografitokens, utan att komponenter berörs. Statiska vikter, ett fontfamilj-namn per vikt (inga variabla axlar i RN).

**Regel:** Familjen Grotesk används för rubriker, hero, samlingsnamn och logotyp. Allt annat är Google Sans Flex.

| Stil | Typsnitt | Vikt | Storlek / radhöjd | Status |
|---|---|---|---|---|
| `display` | Familjen Grotesk | 700 | 34 / 38 | 🔵 |
| `title1` | Familjen Grotesk | 600 | 26 / 30 | 🔵 |
| `title2` | Familjen Grotesk | 600 | 20 / 24 | 🔵 |
| `headline` | Google Sans Flex | 600 | 17 / 22 | 🔵 |
| `body` | Google Sans Flex | 400 | 15 / 22 | 🔵 |
| `label` | Google Sans Flex | 500 | 13 / 18 | 🔵 |
| `caption` | Google Sans Flex | 400 | 12 / 16 | 🔵 |
| `micro` (täta kortetiketter, badges, overline) | Google Sans Flex | 500 | 10 / 14 | 🔵 |
| `price` | Google Sans Flex | 600 | enligt kontext | ✅ format |

**Prisformat** ✅: `1 490 kr`, "kr" direkt efter siffran på samma rad och cirka 70 % av prisets storlek. **Betyg** ✅: ikon före värde, `★ 4,8 (312)` och `🍃 4,2`.
Textstorlek skalas med systemets inställning för text, och layouten måste tåla det. 🔵

Referensen "Kroona Looken A" använder några storlekar utan egen stil (pill 14/500, flik och knapp 15/500, kortetikett 13/400, navigation 10,5/500). Koden använder närmaste stil (`label`, `caption`, `micro`) tills de eventuellt läggs till. 🟡

## 5. Spacing (4-punktsskala)
Alla nuvarande värden i appen passar in.

| Token | px | Används till (nu) |
|---|---|---|
| `xs` | 4 | etikett → text |
| `sm` | 8 | `gutter` mellan kort |
| `md` | 12 | rubrik → innehåll |
| `lg` | 16 | `screenMargin` |
| `xl` | 24 | 🔵 |
| `xxl` | 32 | sektionsavstånd |
| `xxxl` | 48 | 🔵 |

Layout sker med `gap`, aldrig `marginRight` eller `marginBottom` på enskilda kort ✅. Minsta tryckyta 44 × 44 🔵. Ikonstorlekar 20 och 24 🔵.

## 6. Radie ✅ (Apple-ren, §0)
| Token | px | Används till |
|---|---|---|
| `tile` | 10 | täta flerbildsgrid (ProductCard S) |
| `control` | 12 | raka knappar och fält |
| `card` | 14 | bildkort, grupperad lista, meny |
| `lifted` | 16 | lyft kort i kontextmeny, flödesbilder |
| `collection` | 18 | samlingskort, jämförelse |
| `bubble` | 20 | chattbubbla (6 nere höger) |
| `full` | 999 | pillar (34 hög) och cirklar (glasknapp 44, sökfält 50, varumärke) |

**Squircle:** alla rundningar utom cirklar och pillar har `borderCurve: 'continuous'`.

## 7. Elevation
Mörkt tema: ingen skugga, djup uttrycks med `surface`-steg och `border`. 🔵 Undantag i båda teman: `lift` (`0 30px 70px`, alfa .55 mörkt / .22 ljust) för lyft kort och `menu` (`0 20px 50px rgba(0,0,0,.25)`).
Ljust tema (`boxShadow`-strängar) 🔵: `card` `0 1px 2px rgba(20,24,29,.06)` · `raised` `0 4px 12px rgba(20,24,29,.10)` · `overlay` `0 8px 24px rgba(20,24,29,.18)`.

## 8. Rörelse
*Lugnt och sansat: kontrollerad rörelse, inget som blinkar eller spelar av sig självt.* ✅

| Token | Värde | Status |
|---|---|---|
| `fast` / `base` / `slow` | 150 / 250 / 400 ms | 🔵 |
| Easing | `cubic-bezier(0.2, 0, 0, 1)` | 🔵 |
| Spring (gester, sheets) | damping 20, stiffness 220, mass 1 | 🔵 |
| Nedtryckt | `pressed`-yta + skala 0,96 (navigation 0,92). Text-flik: opacitet 0,55 | ✅ |
| Inaktiv | opacitet 0,35 | ✅ |
| Långt tryck | 450 ms, lyft skala 1,04 | ✅ |
| Äldre komponenter | opacity 0,8 tills de görs om | 🔵 |
| Reduce motion | respekteras alltid | ✅ krav |

## 9. Komponentkontrakt
Varje delad komponent har uttryckligen: **variant** (visuell avsikt), **size** (`sm`/`md`/`lg`, default `md`), **states** (default, pressed, disabled, loading, selected), och en **`style`-prop som slås ihop sist** (anroparen justerar layout, aldrig identitet). Innehåll går via `children`, inte via fler props.

**När något blir en delad komponent:** det används på två eller fler skärmar, har en nameable roll, och API:et är mindre än implementationen. Annars bor det kvar hos skärmen.

## 10. Hur det byggs i koden
- **En** ingång: `theme/` (ersätter `constants/colors.ts` och `constants/spacing.ts`, inget andra system bredvid).
- Filer: `colors.ts` (mörk + ljus, semantiska roller), `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, `glass.ts`, `index.ts`.
- `useTheme()` ger aktivt tema. Färger används bara inuti komponenter vid render.
- Typsnitt laddas med `expo-font` via `@expo-google-fonts`-paketen (Familjen Grotesk 600/700, Google Sans Flex 400/500/600).
- **Migrering:** nuvarande kod har `#0f0f0e` och bara Google Sans Flex (400/500/700). Färgerna migreras i steg 1a och Familjen Grotesk läggs till för rubriker.

## 11. Filter och pillar ✅
- **Filtrering** görs med **text-flikar med understrykning** (Pinterest-mönstret), 44 px höga. Gäller Hem, Flöde och Samlingsdetalj.
- **Pillar** byter innehåll överst på en skärm (vad skärmen handlar om), som Spotify. Används tills vidare **bara överst på Hem** (t.ex. Allt · Mode · Heminredning). Text-flikar snävar in en lista inom ett innehåll. Känns gränsen otydlig när det är byggt slås de ihop. 🔵

## 🟡 Öppet
0. ~~UI-typsnitt~~ ✅ Google Sans Flex vald 2026-11-18
1. `danger`-färg (först när fel/radera behövs)
2. ~~Glasets exakta alfa~~ ✅ .72 enligt §0 (foto .34)
3. Ikonbibliotek och ikonvikt (nuvarande SVG-pipeline eller en samlad ikonuppsättning)
4. Ljust temas foto-tonade ytor (hur färgtonad fotografi beter sig i ljust läge)
