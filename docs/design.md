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
- **Vald** = inverterad text/yta för pillar (mörk pill på ljust, ljus pill på mörkt). **IconButton vald** = fylld ikon (outline → fylld, som iOS), yta och färg oförändrade, med kort pop vid markering (2026-11-19). **Nedtryckt** = djupare yta + lätt nedskalning. **Inaktiv** = 35 % opacitet.
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

**Scrim på foto är fast och identisk i båda teman** ✅ (glas på foto följer däremot temat, se §3): scrim enligt `scrimStops` nedan, mjuk och lång utfasning. Hero-rubriker på foto är det enda medvetna AA-undantaget. Knappar, pillar och priser ska alltid klara AA.

| Overlay-token | Värde (båda teman) | Status |
|---|---|---|
| `scrimStops` (hero- och partnerkort, toning till solid botten) | `rgba(14,16,20)` med alfa 0 / .56 / .75 / 1 vid 0 / .4 / .65 / 1 | 🔵 |
| `scrimSoft` (knapp/badge på foto) | `rgba(14,16,20,.6)` | 🔵 |
| `onPhoto` / `onPhotoSecondary` (text på scrim) | `#FFFFFF` / `#C4C4C4` | 🔵 |
| `photoFade` (kantblur över foto, topp) | `rgba(0,0,0,.4)` → 0 | ✅ |

## 3. Glas ✅ (Apple-ren, §0)
Följer temat. Tre toner i `components/Glass.tsx`: `theme` (över innehåll), `photo` (direkt på foto, följer temat sedan 2026-11-18), `plain` (över ren yta).

| Egenskap | Mörkt (`glass`) | Ljust (`glass`) | Foto mörkt (`darkPhotoGlass`) | Foto ljust (`lightPhotoGlass`) |
|---|---|---|---|---|
| Fyllning | `rgba(42,45,51,.28)` | `rgba(255,255,255,.20)` | `rgba(20,22,26,.34)` | `rgba(255,255,255,.20)` |
| Kant (1 px, en linje) | `rgba(255,255,255,.14)` | `rgba(21,23,27,.10)` | `rgba(255,255,255,.24)` | `rgba(255,255,255,.60)` |
| Innehåll | `#F5F6F8` | `#15171B` | `#FFFFFF` | `#15171B` |
| Blur / saturate | 20 / 160 % | 20 / 160 % | 20 / 160 % | 20 / 160 % |
| Tint (expo-blur) | `systemThinMaterialDark` | `systemThinMaterialLight` | `systemThinMaterialDark` | `systemThinMaterialLight` |

**Opacitet (brief 06, Daniels kriterium):** lägsta fyllning som klarar text ≥ 4,5:1 och ikoner ≥ 3:1 mot de ljusaste och mörkaste produktfotona (inte helt svart/vitt), med iOS-materialets tint som extra stöd, golv 0,20 och utan att höja något. Temaglas bär ikoner (ikonkrav), foto-glas bär pillar (textkrav). Mörkt foto-glas står kvar på taket 0,34: fyllningen ensam ger 4,2:1 mot det ljusaste fotot, resten bärs av tinten och bedöms på enhet. 🟡

Vald glaspill är inverterad mot glaset: glasets innehållsfärg som yta, `bg` som text (mörkt tema ljus yta, ljust tema mörk yta, även på foto). IconButton på glas visar i stället fylld ikon.

**Rundning på glas:** blur-lagret, fyllningen och kanten får var sin radie, kanten är ett eget lager, och radien kläms till halva höjden. Annars klipps inte blurren av förälderns runda hörn på iOS (raka kanter). Inaktivt glas tonas inuti glaset, inte på blurrens förälder.

`expo-blur` tar intensitet, inte radie: blur 20 ≈ intensity 50. Saturate saknas (närmast är BlurViews tint). 🟡 Ljust glas över ren yta (`plain` i ljust tema) använder `surface` + `line` utan blur tills frågan är avgjord.

**Kantblur (`EdgeFade`):** max 8 px i tre lager (20 / 50 / 100 %), vart och ett med gradientmask (maskstopp 0–20→55 %, 0–40→80 %, 0–60→100 %), plus toning mot `bg`: topp alfa .80 / .50 / 0, botten .96 / .80 / 0. Höjd topp = safe area + 14 (≈ 68), botten 128. Kräver `@react-native-masked-view/masked-view`.

**Kontextmeny (långt tryck):** lager ovanför appen (ingen Modal), gest från kortet med dra-för-att-välja. Bakgrund lätt blur (intensity 30, ca hälften av referensens 18) + `scrim`, lyft kort skala 1,04 med radie 16 och skugga `lift`, meny 250 bred, rader 46, `menu`-yta med blur 40 (intensity 90) och `glassLine`-kant.

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
Glasknappar (IconButton på glas, TopBar-kapseln) har subtil skugga `glassButton` på ett yttre lager (Glass klipper): mörkt `0 1px 3px rgba(0,0,0,.18)`, ljust `0 2px 8px rgba(21,23,27,.14)` (brief 15). Ljust tema (`boxShadow`-strängar) 🔵: `card` `0 1px 2px rgba(20,24,29,.06)` · `raised` `0 4px 12px rgba(20,24,29,.10)` · `overlay` `0 8px 24px rgba(20,24,29,.18)`.

## 8. Rörelse
*Lugnt och sansat: kontrollerad rörelse, inget som blinkar eller spelar av sig självt.* ✅

| Token | Värde | Status |
|---|---|---|
| `fast` / `base` / `slow` | 150 / 250 / 400 ms | 🔵 |
| Easing | `cubic-bezier(0.2, 0, 0, 1)` | 🔵 |
| Spring (gester, sheets) | damping 20, stiffness 220, mass 1 | 🔵 |
| Nedtryckt | `pressed`-yta + skala 0,96 (navigation 0,92). Text-flik: opacitet 0,55. Produktkort: i pixlar, `1 − pressInsetPx (7) / bredd`, klämt till 0,96–0,985 | ✅ |
| Inaktiv | opacitet 0,35 | ✅ |
| Långt tryck | 450 ms, lyft skala 1,04 (S och M) och 1,02 (L), alltid större än originalet; ryms den inte flyttas den inåt, krymps aldrig | ✅ |
| Tryck (`pressIn` / `pressOutSpring`) | in 90 ms ease-out, ut fjäder damping 14, stiffness 320, mass 0,6. Skala och ytbyte animeras med native driver. Reduce motion: bara ytbytet. Ingen haptik på vanliga tryck | ✅ |
| Kontextmeny | spring damping 18, stiffness 260, mass 1 (in, ut utan översvängning). Kopian har originalets storlek och radie och lyfts med transform; originalet är dolt medan menyn är öppen och byts tillbaka i samma frame. Menyn växer från 0,6 och glider 12 px från kortet. Bakgrund tonar 150 / 180 ms. Reduce motion: bara toning | ✅ |
| Haptik (meny) | lätt vid öppning, `selection` vid radbyte, `success` vid val | ✅ |
| Haptik (komponenter) | `haptic.light()` vid tryck på IconButton och Pill, `haptic.selection()` vid flikbyte i TextTabs. Inte på kort, nav-flikar eller inaktiva element. Samlad i `utils/haptic.ts` (kan stängas av där) | ✅ |
| Fliktoning (`tabFade`) | 160 ms: text mute → text, understrykning tonar in och växer från 0,6. Reduce motion: direkt byte | ✅ |
| Pop (`popScale`) | IconButton vald: 1 → 1,15 (90 ms) → 1 med fjäder. Bara vid markering, inte med reduce motion | ✅ |
| Äldre komponenter | opacity 0,8 tills de görs om | 🔵 |
| Reduce motion | respekteras alltid | ✅ krav |

## 8b. Produktdetalj (brief 13)
Byggd i `app/product/[id].tsx` med delar i `components/product/` (SaveButton, FactList, OfferRow) och den delade `Toast`.
- **Topp (brief 15):** en enda `EdgeFade` i temats toning hela vägen (ljus i ljust tema, även över hero; ingen foto-toning). Toningen är safe area + 44 + 2 × 8 + 16 hög och täcker titelraden; blurzonen är kort, safe area + `edgeBlur.topExtra` (≈ 68). Statusfältet följer temat, inget byte vid scroll. Glaset har en ton (`photo`). Titeln tonar in med scroll.
- **Hero** 4:5 full bredd. **Märke** `label`/mute, **namn** `title1`. **Pris** "Från X kr" i `price` med `title2`-storlek, "kr" i `label`. **Spara** 44 hög pill på `surfaceRaised`, fylld ikon + "Sparad" när sparad.
- **Listor:** grupperade (radie `card`, `surface`, `sep`-linjer), faktarader minst 44, erbjudanderader minst 64 med initialcirkel 36, namn `body` 500, detalj `label` 400 mute, pris `body` 600, lager `caption`. Tryck tonar raden till `pressed`.
- **Liknande:** horisontell rad med ProductCard M, 140 bred, bild 176.
- **Toast:** glasruta längst ner, glider in (fjäder) och ut, visas 2,2 s. Reduce motion: direkt.
- **Avvikelser från referensen (egna):** sidmarginal 16 (referens 20) · typstorlekar närmast token (märke 13 mot 15, namn 26 mot 25, pris 20 mot 22, rubriker 20 mot 19) · Liknande-korten visar också namn och betyg (ProductCard M) · toppens toning växlar vid en tröskel i stället för kontinuerligt.

## 8c. Rörelse: hierarki ✅ (godkänd på enhet 2026-11-19)
- **Princip:** man tar sig visuellt ner och upp i hierarkin. Går man djupare zoomar bilden från källelementet (kortbilden) till detaljvyn, och informationen under tonas in sist. Tillbaka är samma rörelse baklänges, till exakt det kort man öppnade från. Flikbyten har ingen zoom.
- **Stängning:** swipe ned överst i innehållet följer fingret (hela skärmen, telefonens hörnradie via `radius.screenDynamicIsland`/`screenNotch`) och går att avbryta genom att dra upp. Stänger vid släpp efter ca 20–25 % av skärmhöjden i lugnt tempo (`motion.dismissVelocityImpact` = 1,0; biblioteket stänger när förflyttning + hastighet × impact > 0,5). Kantswipe från vänster i en 24 px remsa (`motion.dismissEdgeWidth`). Högersvep mitt på skärmen stänger inte. Scroll har normal studs; gesten tar bara över överst (`Transition.ScrollView`).
- **Djup:** bara ETT steg bakom syns (föregående skärm, dämpad och skalad). Skärmar med två eller fler ovanför döljs (`withDepthVisibility`, explicit opacitet 0/1 per djup).
- **Rätt kort:** varje ProductCard har ett unikt boundary-id per instans (`produktId_instansnyckel`; avgränsare `_` eftersom `:` tolkas som grupp:id) som skickas som route-param `b`, så att zoomen går från/till rätt kort även när samma produkt finns på flera ställen. Kort med egen `onPress` har ingen zoom.
- **Teknik:** roten använder react-native-screen-transitions v4.2.0 (BlankStack via Expo Router-adaptern, ren JS, fungerar i Expo Go). Expo Routers `Link.AppleZoom` + egen gest (brief 16–17) övergavs: inkonsekvent överlämning, föregående sida syntes inte, kantswipe försvann. Nya skärmar med hierarkirörelse behöver egna options i `components/product/productTransition.ts` (eller en generell variant).
- **Känd begränsning:** håller man stilla innan släpp krävs ca 50 % drag. Går bara att ändra genom att patcha biblioteket.

## 8d. Lightbox och PagerDots (brief 19)
- **Lightbox** (`app/lightbox/[id].tsx`): tryck på heron öppnar produktens bilder i helskärm, i riktig proportion (`contain`), på mörk bakgrund oavsett tema (`overlay.lightboxBg`) med ljust statusfält. Samma hierarkirörelse som §8c, ett steg djupare: bilden zoomar från heron (egen boundary `lb_<heroId>`, grupp `lightbox`), stängs med swipe ned, kantswipe eller kryss (IconButton i glas-ton `dark`). Detaljvyn bakom dämpas hårdare (`motion.lightboxBackdropOpacity` 0,85).
- **Zoom:** nyp 1–4x, pan när inzoomad, dubbeltryck 1x ↔ 2,5x, fjädrar tillbaka under 1x (`motion.lightbox*`). Inzoomad bild stänger av paging och swipe ned.
- **Flera bilder:** paging i sidled. `getProductImages()` = `imageUrl` + valfria `images`.
- **PagerDots** (`components/PagerDots.tsx`): 6 px cirklar, aktiv 18 px pill, inaktiva 40 % (`pagerDots` i `theme/spacing.ts`), längd och opacitet följer scroll-positionen. Minska rörelse: byter direkt. Återanvändbar (hero senare).

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
