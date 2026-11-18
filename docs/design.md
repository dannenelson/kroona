# Kroona — Design

*Grunden för hur Kroona ser ut och byggs visuellt. Levande dokument: justera värden här först, sedan i koden. Senast: 2026-11-18.*

**Status på varje rad:**
✅ **Låst** = beslutat i designarbetet · 🔵 **Grund** = best-practice-värde så att ingenting är tomt, justeras fritt · 🟡 **Öppet** = behöver beslut

Komponenternas former (korttaxonomi, SectionHeader, TopBar, FilterPills) ligger kvar i `designsystem.md` tills de flyttas hit. Det dokumentets färg-, typsnitts- och spacingavsnitt är ersatta av detta.

---

## 1. Princip: två lager
1. **Grundtokens** är råa värden (`#15171B`, `16`). De används bara inuti temat.
2. **Semantiska tokens** är roller (`bg`, `textPrimary`, `accent`). Komponenter använder bara dessa.

Då byts tema, märkesfärg eller typsnitt på ett ställe. Ingen hex, fontstorlek eller spacing-siffra skrivs i komponenter eller skärmar (undantag: lokala optiska justeringar, med kommentar).

## 2. Färg

| Roll | Mörkt | Ljust | Status |
|---|---|---|---|
| `bg` | `#15171B` | `#F5F6F8` | ✅ |
| `surface` | `#1B1E23` | `#FFFFFF` | 🔵 |
| `surfaceRaised` | `#22262C` | `#FFFFFF` + skugga | 🔵 |
| `border` | `rgba(255,255,255,.08)` | `rgba(20,24,29,.10)` | 🔵 |
| `textPrimary` | `#FFFFFF` | `#14181D` | ✅ |
| `textSecondary` | `#C4C4C4` | `#4B525C` | 🔵 |
| `textTertiary` | `#A0A4AB` | `#5F6672` | 🔵 |
| `accent` (fyllning, ikon) | `#B8965A` | `#B8965A` | ✅ |
| `accentText` (guld som text) | `#B8965A` | `#80602A` | 🔵 |
| `onAccent` | `#15171B` | `#15171B` | 🔵 |
| `cta` / `onCta` | `#F5F6F8` / `#15171B` | `#15171B` / `#F5F6F8` | ✅ |
| `success` (hållbarhet hög) | `#4A9E5C` | `#2F7D43` | 🔵 |
| `warning` (hållbarhet medel) | `#C08A4A` | `#8A5A1C` | 🔵 |
| `successSubtle` (tonad yta bakom hållbarhet/kluster) | `#0C1A0E` | `#E4F1E7` | 🔵 |
| `danger` | — | — | 🟡 behövs först vid fel- och raderingsstate |

**Kontrast kontrollerad (WCAG AA ≥ 4,5 för text):** alla textroller ovan klarar AA (lägst 4,63). Guld `#B8965A` på ljus bakgrund ger bara 2,57, så det får **aldrig** användas som text i ljust tema. Där gäller `accentText`.

**Foto-overlayer är fasta och identiska i båda teman** ✅: scrim `rgba(14,16,20,0→0.65)`, mjuk och lång utfasning. Hero-rubriker på foto är det enda medvetna AA-undantaget. Knappar, pillar och priser ska alltid klara AA.

| Overlay-token | Värde (båda teman) | Status |
|---|---|---|
| `scrimStops` (hero- och partnerkort, toning till solid botten) | `rgba(14,16,20)` med alfa 0 / .56 / .75 / 1 vid 0 / .4 / .65 / 1 | 🔵 |
| `scrimSoft` (knapp/badge på foto) | `rgba(14,16,20,.6)` | 🔵 |
| `onPhoto` / `onPhotoSecondary` (text på scrim) | `#FFFFFF` / `#C4C4C4` | 🔵 |

## 3. Glas (chrome på foto och på ren yta) ✅
Följer temat: mörkt glas i mörkt tema, ljust i ljust.

| Egenskap | Mörkt | Ljust | Status |
|---|---|---|---|
| Fyllning | `rgba(14,16,20,.24)` | `rgba(255,255,255,.28)` | 🟡 alfa 0,20–0,30, justeras mot kod |
| Blur | 10 | 10 | ✅ (8–12) |
| Saturate | 180 % | 180 % | ✅ |
| Kant | 1 px, `rgba(255,255,255,.10)` | 1 px, `rgba(255,255,255,.40)` | 🔵 en linje, aldrig dubbel |
| Innehåll | vit | `#14181D` | ✅ |

Glaset måste hålla både över foto och över ren yta.

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

## 6. Radie
| Token | px | Status |
|---|---|---|
| `tile` | 10 | ✅ täta flerbildsgrid |
| `card` | 20 | ✅ bildcontainrar på kort |
| `control` | 12 | 🔵 knappar, fält |
| `full` | 999 | 🔵 pillar och cirkelknappar (löser den gamla öppna frågan) |

Alla icke-runda radier kombineras med `borderCurve: 'continuous'`. 🔵

## 7. Elevation
Mörkt tema: ingen skugga, djup uttrycks med `surface`-steg och `border`. 🔵
Ljust tema (`boxShadow`-strängar) 🔵: `card` `0 1px 2px rgba(20,24,29,.06)` · `raised` `0 4px 12px rgba(20,24,29,.10)` · `overlay` `0 8px 24px rgba(20,24,29,.18)`.

## 8. Rörelse
*Lugnt och sansat: kontrollerad rörelse, inget som blinkar eller spelar av sig självt.* ✅

| Token | Värde | Status |
|---|---|---|
| `fast` / `base` / `slow` | 150 / 250 / 400 ms | 🔵 |
| Easing | `cubic-bezier(0.2, 0, 0, 1)` | 🔵 |
| Spring (gester, sheets) | damping 20, stiffness 220, mass 1 | 🔵 |
| Tryck-feedback | opacity 0,8 på alla tryckbara | 🔵 |
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

## 🟡 Öppet
0. UI-typsnitt: Google Sans Flex är tillfälligt, byt vid behov
1. `danger`-färg (först när fel/radera behövs)
2. Glasets exakta alfa
3. Ikonbibliotek och ikonvikt (nuvarande SVG-pipeline eller en samlad ikonuppsättning)
4. Ljust temas foto-tonade ytor (hur färgtonad fotografi beter sig i ljust läge)
