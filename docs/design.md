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
- **Spara = bokmärke** (brief 41, ersätter hjärtat; namnet "Sparade produkter" sedan brief 61, tidigare "Gillade produkter"): **tryck = snabbspar** till Sparade produkter (snackbar "**<produkt>** lades till i sparade produkter · Ändra", Ändra öppnar kortet; nytt tryck tar bort den: "**<produkt>** togs bort från sparade produkter"), **långt tryck = kortet "Spara i …"** (Sparade produkter överst + egna samlingar; när kortet stängs "**<produkt>** lades till i **<samling>** · Visa"). Samma på produktkortets meny, en-kolumnsflödets bokmärke och Produktdetalj. Bokmärket är fyllt när produkten ligger i Sparade produkter eller i någon samling. "Sparade produkter" är bara namnet på den generella samlingen och har också bokmärke. Långt tryck-meny på produktkort: Spara/Sparad (snabbspar) · Spara i samling (`folder-add`) · Följ varumärke · Dela · Visa liknande.
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

**Kvar att avgöra:** ljust glas över ren yta (syns knappt), solid scrim i botten i ljust, Spara-knappens storlek på små kort, om översta toningen i Expo Go är iOS 26 native scroll-edge.

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

**Kontextmeny (långt tryck):** lager ovanför appen (ingen Modal), gest från kortet med dra-för-att-välja. Bakgrund lätt blur (intensity 30, ca hälften av referensens 18) + `scrim`, lyft kort skala 1,04 med radie 16 och skugga `lift`, meny 250 bred, rader 46, `menu`-yta med blur 40 (intensity 90) och `glassLine`-kant. **Rad (brief 61):** ikon 20 (`iconSize.md`) till **vänster**, `spacing.sm` till texten (`body`, `textPrimary`). Spara `bookmark` (fylld när sparad), Spara i samling `folder-add`, Följ/Sluta följa `user-add` (tills en egen följ-ikon ritats), Dela `share`, Visa liknande `layers`. **Navigeringsrader** (Öppna) har `chevron-right` kvar till **höger** och en tom ikonplats till vänster, så att texten linjerar med de andra raderna (`ContextMenuItem.navigation`). **Gäller även samlings-/varumärkeskort** (`PartnerCard`, brief 30): menyval Följ/Sluta följa (befintlig följ-lagring) · Öppna · Dela (platshållare, snackbar i Fas 0). Kopian är kortets bild med namn/antal och radie `radius.collection` (18, samma som kortet). Följ-knappen (+/✓) på korten är borttagen; ingen synlig följ-indikator på kortet, läget syns i menyn och på detaljsidan.

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

**Prisformat** ✅: `1 490 kr`, "kr" direkt efter siffran på samma rad och cirka 70 % av prisets storlek. **Betyg** ✅: ikon före värde, `★ 4,8 (312)` och `🍃 4,2`. Raden radbryts aldrig: får den inte plats på ett smalt kort utelämnas antalet omdömen (brief 60). Produkter utan betyg visar bara hållbarhet (stjärnan är kontur, som lövet, brief 61). **Produktdetalj** (brief 62, ersätter raden "Betyg" i faktalistan från brief 60): betyget står direkt under namn och pris, `star` 12 (kontur) + "4,6" (`caption`, `textSecondary`) + "(128 omdömen)" (`textTertiary`), samma dämpade stil som på kortet; ingen rad utan betyg, inte tryckbart. Faktalistan under Hållbarhet har bara hållbarhetsfakta.
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
| `editorialLarge` | 22 | redaktionellt kort, stor stående (brief 43; 24 → 22 i brief 51) |
| `editorialMedium` | 20 | redaktionellt kort, liggande och kollagekort (brief 43) |
| `editorialSmall` | 16 | redaktionellt kort, liten stående och mixkort (brief 43) |
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
| Nedtryckt | `pressed`-yta + skala 0,96 (navigation 0,92). Text-flik: opacitet 0,55. Kort (produkt-, samlings-, varumärkes- och profilkort, en implementation: `hooks/useCardPress`, brief 31): ingen opacitet, bara krympning i pixlar, `1 − pressInsetPx (4) / bredd`, klämt till `pressScaleMin`–`pressScaleMax` (0,975–0,99) | ✅ |
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
Byggd i `app/product/[id].tsx` med delar i `components/product/` (SaveButton, FactList, OfferRow) och den delade `Snackbar` (brief 33, ersatte `Toast`).
- **Topp (brief 15):** en enda `EdgeFade` i temats toning hela vägen (ljus i ljust tema, även över hero; ingen foto-toning). Toningen är safe area + 44 + 2 × 8 + 16 hög och täcker titelraden; blurzonen är kort, safe area + `edgeBlur.topExtra` (≈ 68). Statusfältet följer temat, inget byte vid scroll. Glaset har en ton (`photo`). Titeln tonar in med scroll.
- **Hero** 4:5 full bredd. **Märke** `label`/mute, **namn** `title1`. **Pris** "Från X kr" i `price` med `title2`-storlek, "kr" i `label`. **Spara** (justering efter brief 68): rund glasknapp 44 med bara bokmärket (`IconButton`, samma som toppens tillbaka/dela, tonen `theme`), på namnraden, överjusterad med namnet och mot högermarginalen; namnet radbryter före knappen. Fyllt när sparad någonstans (brief 41), etikett "Spara"/"Sparad". Tryck = snabbspar, långt tryck = kortet "Spara i …". **Textblocket** märke, namn, pris och betyg med `spacing.xs` mellan raderna (knappens överhöjd hänger ned bredvid priset och gör inte raden högre); "Hållbarhet" `spacing.xl` under, övriga sektionsrubriker `spacing.xxl`.
- **Listor:** grupperade (radie `card`, `surface`, `sep`-linjer), faktarader minst 44, erbjudanderader minst 64 med initialcirkel 36, namn `body` 500, detalj `label` 400 mute, pris `body` 600, lager `caption`. Tryck tonar raden till `pressed`.
- **Liknande:** horisontell rad med ProductCard M, 140 bred, bild 176.
- **Snackbar** (ersatte toasten, brief 33): se §8h.
- **Avvikelser från referensen (egna):** sidmarginal 16 (referens 20) · typstorlekar närmast token (märke 13 mot 15, namn 26 mot 25, pris 20 mot 22, rubriker 20 mot 19) · Liknande-korten visar också namn och betyg (ProductCard M) · toppens toning växlar vid en tröskel i stället för kontinuerligt.

## 8c. Rörelse: hierarki ✅ (godkänd på enhet 2026-11-19)
- **Princip:** man tar sig visuellt ner och upp i hierarkin. Går man djupare zoomar bilden från källelementet (kortbilden) till detaljvyn, och informationen under tonas in sist. Tillbaka är samma rörelse baklänges, till exakt det kort man öppnade från. Flikbyten har ingen zoom.
- **Stängning:** swipe ned överst i innehållet följer fingret (hela skärmen, telefonens hörnradie via `radius.screenDynamicIsland`/`screenNotch`) och går att avbryta genom att dra upp. Stänger vid släpp efter ca 20–25 % av skärmhöjden i lugnt tempo (`motion.dismissVelocityImpact` = 1,0; biblioteket stänger när förflyttning + hastighet × impact > 0,5). Kantswipe från vänster i en 24 px remsa (`motion.dismissEdgeWidth`). Högersvep mitt på skärmen stänger inte. Scroll har normal studs; gesten tar bara över överst (`Transition.ScrollView`).
- **Djup:** bara ETT steg bakom syns (föregående skärm, dämpad och skalad). Skärmar med två eller fler ovanför döljs (`withDepthVisibility`, explicit opacitet 0/1 per djup).
- **Rätt kort:** varje ProductCard (och PartnerCard → Samlings-/Partnerdetalj, ProfileCard → Partnerdetalj) har ett unikt boundary-id per instans (`produktId_instansnyckel`; avgränsare `_` eftersom `:` tolkas som grupp:id) som skickas som route-param `b`, så att zoomen går från/till rätt kort även när samma produkt finns på flera ställen. Kort med egen `onPress` har ingen zoom.
- **Teknik:** roten använder react-native-screen-transitions v4.2.0 (BlankStack via Expo Router-adaptern, ren JS, fungerar i Expo Go). Expo Routers `Link.AppleZoom` + egen gest (brief 16–17) övergavs: inkonsekvent överlämning, föregående sida syntes inte, kantswipe försvann. Nya skärmar med hierarkirörelse får sina options från `hierarchyScreenOptions(group)` i `components/product/productTransition.ts` (en egen boundary-grupp per skärmtyp): `product`, `collection` (brief 28) och `partner` (brief 29).
- **Lightbox: fade, inte zoom (brief 22–24).** Produktdetalj → lightbox zoomar inte från heron. Öppning: lightboxen tonas in (opacitet 0 → 1, skala `motion.lightboxFade.fromScale` 0,96 → 1, `lightboxFade.open` 240 ms) över en lätt genomskinlig backdrop (`overlay.lightboxBg` med `motion.lightboxBackdropOpacity` 0,94, enda mörka lagret, man anar bara detaljvyn); detaljvyn bakom ligger still (brief 26). **Kryss och kantswipe** (biblioteket, bara horisontell kantgest) stänger med omvänd fade: `lightboxFade.close` 320 ms ease-out, opacitet 1 − (1 − p)^k där backdropen lämnar sist. **Swipe ned/upp** är lightboxens egen gest, som i Apple Foto: bara den aktiva bilden följer fingret och krymper svagt (`lightboxDismiss.minScale`), bakgrunden tonas med avståndet (borta vid `fadeDistance` 40 % av höjden), kryss, punkter och grannbilder tonas bort vid dragstart. Släpp efter `distance` (12 %) eller med `velocity` (800 px/s): bilden fortsätter ut med släppfarten och tonar bort (`flyOutDuration`), sedan `router.back()` utan synlig lightbox-animation. Annars fjädrar den tillbaka (`motion.spring`). Inzoomad bild: pan, ingen stängning (kantswipen av via `lightboxGestureLock`). Minska rörelse: bara opacitet, ingen skala eller utfart. Kort → detalj är fortfarande zoom.
- **Känd begränsning:** håller man stilla innan släpp krävs ca 50 % drag. Går bara att ändra genom att patcha biblioteket.

## 8d. Lightbox och PagerDots (brief 19–22)
- **Hero-pager (brief 20):** fler än en bild → heron är en horisontell pager (`components/product/HeroPager.tsx`) med PagerDots nedtill direkt på fotot, utan bakgrund: inaktiva 55 % (`pagerDots.inactiveOpacityOnPhoto`) och mjuk mörk skugga (`photoShadows.pagerDot`), brief 21. En bild: ingen pager. Heron är fortfarande målet för kortets zoom (första bilden). Pagern är en `Transition.ScrollView`, så vertikal scroll, stängning och kantswipe går vidare.
- **Rätt bild tillbaka:** valt index delas via `lib/lightboxStore.ts` (shared values). Heron rör sig inte medan lightboxen är öppen; den hoppar (utan animation, UI-tråden) till bilden man lämnade först när lightboxen börjar stängas (`lightboxHeroIndex`): kryss och kantswipe när progress börjar sjunka, swipe-stängning vid beslutet om utfart (brief 27).
- **Gestarbitrering (brief 20), på UI-tråden:** två fingrar → nyp, och låset `lightboxGestureLock` stänger av stängningsgesten i samma bildruta (interpolatorn returnerar `options.gestureEnabled`). Inzoomad: ett finger panorerar. Inte inzoomad: ett finger i sidled bläddrar (egen pager, `motion.pageFlickVelocity`), upp/ned är lightboxens egen swipe-stängning (§8c), och drag från vänsterkanten lämnas till bibliotekets kantswipe.
- **Lightbox** (`app/lightbox/[id].tsx`): tryck på heron öppnar produktens bilder i helskärm på den bild som visas, i riktig proportion (`contain`), på lätt genomskinlig mörk bakgrund oavsett tema (`overlay.lightboxBg`, `motion.lightboxBackdropOpacity`) med ljust statusfält. Stängs med swipe ned, kantswipe eller kryss (IconButton i glas-ton `dark`). Övergången är en **fade, inte zoom** (se §8c).
- **Zoom:** nyp 1–4x, pan när inzoomad, dubbeltryck 1x ↔ 2,5x, fjädrar tillbaka under 1x (`motion.lightbox*`). Inzoomad bild stänger av paging och swipe ned.
- **Flera bilder:** paging i sidled. `getProductImages()` = `imageUrl` + valfria `images`.
- **PagerDots** (`components/PagerDots.tsx`): 6 px cirklar, aktiv 18 px pill, inaktiva 40 % (`pagerDots` i `theme/spacing.ts`), längd och opacitet följer scroll-positionen. Minska rörelse: byter direkt. Återanvändbar (hero senare).

## 8e. Samlingsdetalj (brief 28)
- **Route:** `app/collection/[id].tsx`, nås från samlingskorten på Hem (`CollectionRow` → `PartnerCard`). Samma hierarkirörelse som Produktdetalj (§8c): kortets bild zoomar till covern (grupp `collection`, unikt id per kortinstans), swipe ned överst och kantswipe stänger, ett steg bakom syns.
- **Innehåll uppifrån:** cover 4:5 med namnet överlagt (`typography.display`, Familjen Grotesk, på `overlay.scrimStops`), samma toppkant (EdgeFade + TopBar i glas, tillbaka) och titel som tonar in vid scroll · metadata "N produkter · Kroona · Varumärke/Tema" · Följ/Följer (`Pill`, följ-lagringen i `FollowedCollectionsContext`) · text-flikar (§11) · masonry (`ProductGrid`/`ProductCard`, öppnar Produktdetalj med zoom). Innehållet under covern tonas in i slutet av övergången (`motion.detailRevealFrom`), direkt med Minska rörelse.
- **Flikar** härleds ur datan och visas aldrig tomma: Alla · kategori (om fler än en) · stil (bara varumärkessamlingar med fler än en) · Nytt (om någon är ny).
- Ingen beskrivning: `Collection` har inget sådant fält.

## 8f. Partnerdetalj (brief 29)
- **Route:** `app/partner/[id].tsx` (varumärken), samma uppbyggnad och rörelse som Samlingsdetalj (§8e), grupp `partner`. Nås från varumärkeskort på Hem (PartnerCard med `partnerId`, ProfileCard i "Fler varumärken") och från kuratorraden i Samlingsdetalj.
- **Innehåll:** cover 4:5 med namnet (covern = varumärkessamlingens bild, annars första produktens; `Retailer` har ingen egen bild) · antal produkter + Följ · Om varumärket · Finns (e-handel/butiker, hoppas över om tomt) · Samlingar (hylla med PartnerCard, öppnar Samlingsdetalj med zoom) · Alla produkter (masonry).
- **Samlingsdetalj** fick kuratorraden "Av Kroona" / "Av <varumärke>" (varumärket öppnar Partnerdetalj).

## 8g. Sparat (brief 32)
- **Header** "Sparat" + glasknapp "+" (brief 33, öppnar Sheet: Skapa samling); **segment** Samlingar | Följer som text-flikar (§11).
- **Samlingskort (egna):** kvadratiskt mosaikomslag (`CollectionMosaic`: 1 fyller, 2 sida vid sida, 3 = en stor + två små, 4 = 2 × 2, tunna skarvar; tom = `placeholder`-yta), radie `radius.collection`, namn (`body`) och "N produkter · Privat/Publik" (`micro`). Samma tryckrespons (`useCardPress`) och zoom till Samlingsdetalj. Ingen kontextmeny än (redigera/radera kommer i del 2). "Ny samling"-kortet: samma kvadrat i `surface` med ett +.
- **Följer:** samma PartnerCard som på Hem i 2 kolumner (proportion 150 × 310), kontextmenyns Sluta följa.
- **Ny samling:** Sheet-steget "Skapa samling" (§8h): fält "Namn på samlingen" (autofokus, max 40), raden "Håll samlingen privat" (på som standard) med hjälptext, CTA "Spara". Därefter snackbar "**<namn>** skapades · Visa".
- **Samlingsdetalj för egna och Sparade produkter:** mosaiken som cover (4:5), "Av dig", "N produkter · Privat/Publik", ingen Följ, tom-vy.

## 8i. Sparat ny struktur (brief 35, ersätter §8g:s layout)
- **Header:** "Sparat" (`title1`, Familjen Grotesk) + glasknapp "+" (Sheet: Skapa samling). **Flikar** (text-flikar): Mina samlingar | Följer.
- **Mina samlingar:** verktygsrad med "N samlingar" (bara egna, `label`) och **vy-växlaren** rader | kort (`SegmentedIcons`). Rader: `ListRow` 76 hög, thumb 56 / `radius.card`; "Sparade produkter" med bokmärke i `surfaceRaised`-ruta, avdelare (`sep`), sedan egna samlingar (mosaikthumb, "Privat · N produkter" med lås 12 / "Publik · N produkter"). Kort: 2 kolumner, kvadratiskt omslag `radius.collection`, Sparade produkter först med bokmärke. Tryck = `pressed`-yta på rader, `useCardPress` på kort; zoom till Samlingsdetalj från thumb/omslag.
- **Följer:** sektioner med `title2`-rubrik och "Visa alla" (`label`, bara vid > 3, expanderar på plats). Varumärken: kompakt rad 64, rund avatar 48 med initialer. Samlingar: mosaik 48 / `radius.control`, "Av Kroona/<varumärke>".
- **Tomlägen:** kort text (`body`, `textSecondary`) + `Button` (wrap): "Skapa samling" respektive "Utforska" (→ Hitta).

## 8j. Korttyper och Hem (brief 43)
- **Två sorters bildkort.** **Redaktionella kort** (samlingar, mixar, områden, fortsätt-kort, `components/EditorialCard.tsx`): **text på bilden**, med mörk toning (#0E1014, 0 → 56 % → 78 %) över nedre 58 % och **äkta blur** (ca 12 px, fyra maskade BlurView-lager à 25 % så att den byggs upp gradvis) över nedre 48 %. Små kort (liten stående, mix, kollage) har bara toning (0 → 50 → 76 % över 56 %). **Produktkort är oförändrade:** text under bilden, `radius.card` 14, pris och betyg aldrig på foto.
- **Regel (brief 52): text ligger på bilden bara när bilden är ett enda foto.** Flerbildskort (kollage) har texten **under** bilden.
- **Textregel:** stående kort har **centrerad** text, liggande **vänsterställd** (undantag: mixkorten är vänsterställda, brief 52) (valfri statusrad ovanför titeln). Titel max 2 rader med ellipsis; undertitel 1 rad, vit 76 % (`overlay.onPhotoMuted`).
- **Format** (`editorialCard` i `theme/spacing.ts`): stor stående **240 × 320** (3:4), radie **22**, titel **20/24** (brief 51; tidigare 280 × 373, 24, 22/26, ca 1,5 kort syns); liten stående 150 × 225 (2:3), radie 16, titel 16/20, undertitel 12; liggande 320 × 213 (3:2), radie 20, titel 18/22, undertitel 13. Härledda: **mix** 160 × 160, radie 16, **en** omslagsbild (mixens första produkt) med vänsterställd titel och undertitel på bilden och toning (brief 52; tidigare 2 × 2-mosaik); **kollage** (Populära samlingar) bildyta 200 × 250 (4:5, en bred bild över två små), radie 20, 1 px inre kant, glaschip med kurator överst till vänster, **ingen toning**, titel `typography.cardTitle` 14/500 och antal `caption` 12 dämpat **under bilden**, vänsterställda (brief 52; tidigare 200 × 267 med text på bilden). **Radien skalar med storleken**, squircle.
- **Kant:** en 1 px inre linje ovanpå bilden (`colors.imageEdge`: vit 12 % mörkt, mörk 10 % ljust), aldrig dubbel kant. Utan bild: `placeholder`-yta, texten ligger kvar på toningen.
- **Cirkel = identitet:** varumärken och personer (76 px, namn under). Aldrig cirklar för samlingar eller innehåll.
- **Hem, ordning** (32 px mellan hyllorna, rubrik `SectionTitle`): Fortsätt där du var (liggande) · Skapat för dig (mix) · Samlingar för dig (stor stående) · Fler i din stil (cirklar) · Områden (liten stående) · Populära samlingar (kollage) · Kanske intressant för dig (produktkort). En hylla utan innehåll döljs, aldrig tom rubrik.

## 8k. Hem-topp och nedre menyn (brief 46, justerad i brief 49)
- **Toppraden** 44 hög (`homeHeader`), skärmmarginal: avatar **40** (brief 51, förut 32) med initialer i `headline` och träffyta 44 (hitSlop) (`DUMMY_USER` i `data/user.ts`) till vänster, **Kroona-logotypen 12 hög absolut centrerad** (18 i brief 46) (eget lager över raden, oberoende av sidoelementens bredd, ™ visas först från 40 px), notisikon 24 i en 44 × 44 träffyta till höger (ikonens kant linjerar med marginalen).
- **Hälsning** under raden: "God morgon / God eftermiddag / God kväll, Daniel" (05–11 / 12–17 / övrigt), `typography.greeting` (Familjen Grotesk 600, 28/32), `textPrimary`.
- **Avstånd:** toppraden → hälsning 24 (8 i brief 46), hälsning → pillar 16, pillar → AskBar 16 (`gap`).
- **Nedre menyn (brief 49, 50):** flikraden 56 hög (`tabBar.rowHeight`), **ikon 28** (`tabBar.iconSize`, en lokal siffra, synlig glyf ca 20; 32 i brief 50, 24 innan, `iconSize.lg` oförändrad), ikon → etikett 3, sidomarginal **18** (`tabBar.sideInset`; 28 i brief 49, 8 innan) så att de fyra flikarna (80 breda, jämnt fördelade) samlas. Etikettblockets underkant **36 från skärmkanten** med safe area nedtill (`tabBar.labelBottom`), **24** utan safe area (`tabBar.labelBottomNoInset`). Raden räknas från etiketten, så en större ikon växer uppåt: med ikon 28 ligger radens underkant 34,5 (22,5 utan safe area). Kantblurren nedtill är oförändrad (128, samma stopp). Skärmarnas nedre utrymme: `tabBarSpace(insets.bottom)` = radens avstånd + 56 + 8 (98,5 resp. 86,5 med ikon 28).

## 8l. Hitta, sök och dialog (brief 53)
- **Fältet "Fråga eller sök"** (`AskBar`, Hem, Hitta och Sökresultat): tryckbart fält, inte en inmatning. 56 högt (`control.fieldHeight`), pill (`radius.full`), `surfaceRaised`, `find` (förstoringsglas + stjärna) 20 till vänster, `microphone` 24 till höger (brief 57) (bara ikon i Fas 0), platshållare `body` i `textSecondary`. Tryck öppnar sökläget.
- **Sökläget:** samma fält aktivt (förstoringsglas, markör, rensa-knapp 20 rund `textSecondary` med kryss), "Avbryt" till höger. Två handlingsrader (cirkel 44 `surface` med ikon, titel `headline`, undertext `caption`): "Sök efter ”ord”" / "Visa träffar direkt" och "Fråga om ”ord”" (stjärna) / "Få hjälp att välja". Därunder "Förslag" (max 4) eller "Senaste sökningar" (max 5), rader 44 höga med litet förstoringsglas. Tonar in (`motion.searchFade`), ingen förflyttning.
- **Sökresultat och Dialog** glider in från höger (`pushScreenOptions`) och stängs med tillbaka eller kantswipe. Bannern i Sökresultat: `surface`, `radius.card`, stjärna i cirkel 44, titel `label`, undertext `caption`, chevron.
- **Idékort** (Hitta, Idéer för dig): liggande redaktionellt kort **240 × 160**, radie 20, text vänsterställd på bilden med förstoringsglas 16 före titeln (`EditorialCard` `titleIcon`). Tryck öppnar Sökresultat direkt.
- **Kategorikort:** stående **109 × 150**, radie 16, centrerad titel på bilden. **Områdeskort:** 2-kolumnsgrid, **92 höga**, bredden räknas fram (två kolumner inom skärmmarginalen, gap 8; 169 i skissen med marginal 20), radie 16, titel + "N produkter" vänsterställda på bilden. Mått i `findCards` (`theme/spacing.ts`).
- **List- och filtervyer utan bild (brief 54):** Kategorivy, Alla kategorier, Alla områden, Områdesdetalj och Idéer delar toppen `ScreenHeader`: TopBar med tillbaka, rubrik `typography.screenTitle` (Familjen Grotesk 600, 28/32), därunder rader med `gap` 12. Glider in från höger (`pushScreenOptions`).
- **Kategorivy:** "Fråga om …" är en pill **40 hög** (`findCards.askChipHeight`), `surfaceRaised` (surface2) med hårlinjekant, stjärna 18 + `label`; antal produkter `caption` dämpat till höger. Pillar 36 (`FilterPills`) under, sedan produktgrid.
- **Alla kategorier:** `ListRow` (76 hög) med bild 56 × 56 radie 14, namn, antal, chevron. **Områdesdetalj:** beskrivning `body` dämpad, antal + Följ-pill (som Samlingsdetalj). **Idéer:** idékorten i en kolumn, fulla bredden, samma proportion som 240 × 160.
- **"Visa fler ›"** i hyllrubriker (`SectionTitle` `cta`): `label` 13/18 i `textSecondary` + chevron 14 med linje 2,2 (`sectionLink`), till höger i rubrikraden. Ersätter stora chevroner. **Visas bara när hyllan har en destination.**

## 8m. Följer (brief 59)
- **Rubrik** "Följer" i samma stil och läge som Hitta och Sparat (`title1`, Familjen Grotesk, rad 44 + 12 över/under som Sparats rubrikrad). **Vyväljare** `SegmentedIcons` till höger: `masonry` (förvald) / `one-column-grid`, etiketter "Masonry" / "En kolumn", valet hålls under sessionen.
- **Pillar** (`FilterPills`) under rubriken, 16 till flödet: Alla, Kläder, Möbler, Begagnat, sedan en pill per följt område. Filtrerar på riktigt (`lib/productFilters.ts`); vyn behålls vid byte.
- **Masonry:** två kolumner, `spacing.gutter` emellan, **20** mellan korten i höjdled (`followFeed.masonryRowGap`). `ProductCard` M, bildradie 14; proportion från produktbildens egen, avrundad till närmaste av 3:4, 2:3, 4:5 och 1:1 (liggande bilder blir kvadrat), annars stabil från id. Varje kort läggs i den kortaste kolumnen.
- **En kolumn:** `ProductCard` L i full bredd, bild **4:5**, radie 14, text under till vänster och **bokmärke** till höger (`saveButton`, fyllt när sparad, tryck = snabbspar, långt tryck = "Spara i …"); **28** mellan korten (`followFeed.singleRowGap`).
- **Pull-to-refresh** ger ny blandning. Inget tomt utrymme bakom flikfältet (`tabBarSpace`).
- **Tomläge:** "Följ något som du gillar" (`title2`), undertext (`body`, `textSecondary`), fyra områdeskort (`AreaGrid`), "Se alla områden" (Button primary, `cta`). Inga pillar eller vyväljare.

## 8h. Sheet, Button och Snackbar (brief 33, godkänt 2026-11-20)
- **Knappar är aldrig fullbreddsrader** (utom i listor). CTA = `Button` (`components/Button.tsx`): pill som följer sitt innehåll, centrerad, minst `control.ctaHeight` 56 hög, `headline` (17/600), sidmarginal `control.ctaPaddingX` 28 (sänkt från 44 i brief 39 så att två CTA:er ryms på en rad). **primary** = ljus yta (`textPrimary`, text i `bg`), **secondary** = tonad yta (`pressed`). Kompakt storlek (`control.compactHeight` 36) för t.ex. snackbarens åtgärd. Tryckrespons som korten (`useCardPress`), lätt haptik, inaktiv = `disabledOpacity`.
- **Sheet** (`components/Sheet.tsx`, `useSheet()`): helskärmslager på rotnivå, ingen RN Modal. Blur (`edgeBlur.menuBackdropIntensity`) + `sheetScrim` (kraftigare än kontextmenyns `scrim`, brief 34: skärmen under ska bara anas; ljust tema = ljus slöja). Mini-stack `open/push/pop/close`; header med glasknappar 44: **X alltid till höger** (stänger hela flödet), **tillbaka-chevron till vänster** i senare steg, centrerad titel (`headline`) med lika breda sidor så att den står still mellan stegen. Innehåll via `<SheetContent footer={<Button/>}>`: CTA centrerad nederst (40 px eller safe area) och ovanför tangentbordet. Öppna/stäng: tonar och stiger `motion.sheet.rise` (`open` 280 / `close` 220 ms); stegbyte tonar och glider `stepShift` (220 ms); Minska rörelse: bara tonning. Stängs med X, Androids bakåt och swipe nedåt (`motion.sheet.dismissDistance`); steg med skrollande lista sätter `swipeToClose: false`.
- **Fält** i sheets: placeholder i `textTertiary` (t.ex. "Min samling"), `control.fieldHeight` 56, `radius.card`, `surface`, kant 1,5 i `border` (fokus: `textSecondary`), etikett `label` ovanför. **Toggle-rad:** `surface`, `radius.card`, titel 15/500 + hjälptext `label`, systemets Switch (spår `textPrimary` på, `pressed` av).
- **Snackbar** (`components/Snackbar.tsx`, `useSnackbar().show({ subject?, text, object?, thumbUri?, action? })`): ersätter toasts och bekräftelseskärmar. Radie `radius.bubble` (20), blur i `menu`-ton med glaskant och skugga `menu`, **alltid samma bredd** (brief 61): skärmbredd minus marginaler, högst `snackbar.maxWidth` 350, aldrig smalare efter innehållet; åtgärden står längst till höger. Miniatyr 40 (`radius.tile`), åtgärd som kompakt secondary-Button. **Text** (brief 61): meningen i `body` 15/400; **namn i fetstil** (600): `subject` (produkt- eller samlingsnamnet som inleder meningen) står på en egen rad och kortas med ellipsis, och resten av meningen (högst två rader) följer under, så att den alltid syns; `object` (samlingsnamn sist i meningen) kortas med ellipsis i slutet. Centrerad, ovanför flikfältet när det syns, annars `snackbar.bottomOffset` 40 från botten. En i taget, ca 4 s (`motion.snackbar.duration`), svep nedåt döljer, haptik `success`. Glider in med fjäder; Minska rörelse: tonning. `accessibilityRole="alert"` + live region.
- **Kort-sheet** (brief 40, `presentation: 'card'`, YouTube/Instagram-stil): kort med luft runt om (`sheetCard.inset` 8 + safe area), radie `radius.sheetCard` 28 (squircle), yta `colors.sheetCard` (`surface` vid 0,96) över mörk overlay `colors.sheetCardScrim` (tryck stänger), vänsterställd rubrik (`headline`), ingen X. Snapp 2/3 (`sheetCard.midRatio`) och full höjd: fingret uppåt växer kortet först, sedan skrollar listan; nedåt på listans topp krymper det och under 2/3 stängs det vid släpp (`motion.sheetCard`: avstånd 80, fart 800 px/s, utfart 200 ms). Snapp med `motion.spring`. Kantblur upptill och nedtill som i övriga sheets. Minska rörelse: kortet tonar in/ut, snapp utan fjäder. Senare steg (Skapa samling) får full höjd med chevron tillbaka.
- **Spara i …** (brief 40–41, ersätter Lägg till i samling från brief 36–39): kort-sheet med rubrik + högerställd textlänk "Ny samling" (neutral, 600, ≥ 44), Sparade produkter överst + egna samlingar, ingen CTA nedtill (blur kvar); tidigare: Sheet-steg med lista, se `designsystem.md` §14 och `wireframes.md` §8b. **Sheet-layout** (brief 38–39, gäller `SheetContent` generellt): headern ligger ovanpå stegets innehåll, och innehållet fyller lagret. Fasta element (`header`, t.ex. produktchip + sök) och CTA-ytan (`footer`) ligger fast; innehållet skrollar bakom dem och blurras progressivt med kantblurren (`EdgeFade` variant `clear`: samma maskade blurlager som skärmarnas kanter och flikfältet, utan färgtoning eftersom slöjan är genomskinlig), suddigt närmast kanten och skarpt längre in. Skrollande listor (`edgeToEdge`) lägger `useSheetInsets()` som marginaler, så att första raden börjar under de fasta elementen och sista raden kan skrollas fri från CTA:n. I Lägg till i samling: **Skapa ny** (sekundär, +) och **Klar** (primär) alltid på en rad, centrerade som grupp med `spacing.sm` mellan; utan samlingar bara "Skapa ny samling", primär.
- **Används för:** snabbspar ("**<produkt>** lades till i sparade produkter · Ändra" / "**<produkt>** togs bort från sparade produkter", brief 41, 61), spara i kortet (när det stängs: "**<produkt>** lades till i **<samling>** · Visa" eller "… i N samlingar", brief 40, 61), skapa samling, Dela-platshållare, erbjudanderadens "Du skulle nu gå till …".

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
- **Filtrering** görs med **text-flikar med understrykning** (Pinterest-mönstret), 44 px höga. Gäller Följer och Samlingsdetalj. **Undantag Hem (brief 46):** filterpillar (`FilterPills`, Pill i storleken `filter`, 36 hög, 8 mellan, vald inverterad, selection-haptik, horisontell scroll).
- **Pillar** byter innehåll överst på en skärm (vad skärmen handlar om), som Spotify. Används tills vidare **bara överst på Hem** (t.ex. Allt · Mode · Heminredning). Text-flikar snävar in en lista inom ett innehåll. Känns gränsen otydlig när det är byggt slås de ihop. 🔵

## 🟡 Öppet
0. ~~UI-typsnitt~~ ✅ Google Sans Flex vald 2026-11-18
1. `danger`-färg (först när fel/radera behövs)
2. ~~Glasets exakta alfa~~ ✅ .72 enligt §0 (foto .34)
3. ~~Ikonbibliotek och ikonvikt~~ ✅ 2026-11-25 (brief 57): egen samlad uppsättning, SVG-filer i `assets/svg/icons/` (24 × 24, linje 1,5, runda ändar, `currentColor`) via `Icon`-komponenten. Synlig linje 1,5 i alla storlekar (`icon.stroke`). Se designsystem.md §17.
4. Ljust temas foto-tonade ytor (hur färgtonad fotografi beter sig i ljust läge)
