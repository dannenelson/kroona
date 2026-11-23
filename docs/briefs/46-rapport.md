# Rapport brief 46 – Hem-toppen och menyns spacing

## Inventering
- **Header:** avatar "D", texten "KROONA" och emoji 🔔.
- **Hem:** TextTabs under Header. AskBar hade egen `marginTop: spacing.sm` och används bara på Hem.
- **Pill:** 34 hög med lätt haptik.
- **CustomTabBar:** `NAV_LOWER = spacing.xl` och `bottomPad = max(insets.bottom − 32, 8)`.
- **`TAB_BAR_HEIGHT` (56 + 8):** användes i Hem, Sparat, Hitta, ProductGrid (Följer) och Snackbar.
- **EdgeFade nedtill:** 128 hög.

## Gjort
### Hem-toppen
- **`data/user.ts`:** `DUMMY_USER { name: 'Daniel', initials: 'DN' }`. Hälsning och avatar läser härifrån.
- **`components/Header.tsx`** (omskriven):
  - Toppraden är 44 hög.
  - Vänster: `Avatar` 32 med "DN".
  - Mitten: `KroonaLogo` 18 hög i ett eget lager (`absoluteFill`, centrerat) över raden. Logotypen står därmed mitt på oavsett sidoelementens bredd.
  - Höger: `NotificationIcon` 24 i en 44 × 44 `Pressable`. Ikonens kant linjerar med skärmmarginalen (negativ högermarginal 10). Trycket gör ingenting.
  - Under raden: hälsningen "God morgon/eftermiddag/kväll, Daniel" (05–11 / 12–17 / övrigt) i nya `typography.greeting` (Familjen Grotesk 600, 28/32).
- **™ i toppen:** `KroonaLogo` har propen `trademark`, som standard på från 40 px höjd (`homeHeader.logoTrademarkMinHeight`).
  - Under 40 px beskärs `viewBox` till ordbilden (1378 × 238 i stället för 1440 × 238). Bredden räknas från den beskurna proportionen, så ™ hamnar utanför ritytan och logotypen centreras på ordbilden.
  - ™ ligger kvar i filen. Bredden 1378 kommer från path-koordinaterna: ordbilden slutar vid ca 1375, ™ börjar vid ca 1399.
- **Klockan** är omritad med linje 1,5 (var 1,8). Bredvid de befintliga ikonerna (ca 1,5) såg 1,8 tyngre ut.
- **`components/FilterPills.tsx`** (ny): Pill i nya storleken `filter`.
  - 36 hög (`homeHeader.filterPillHeight`), 8 mellan, horisontell scroll.
  - Vald är inverterad (befintlig `selected`).
  - Pill fick propen `haptics: 'selection'` för samma haptik som TextTabs.
  - Används bara på Hem. TextTabs ligger kvar på övriga skärmar.
- **Avstånd:**
  - Toppraden → hälsning 8 (`gap` i Header).
  - Hälsning → pillar 16 och pillar → AskBar 16 (`gap: spacing.lg` i en toppcontainer).
  - AskBars egen `marginTop` togs bort för att inte dubblera (den används bara på Hem). Dev-länken är kvar.

### Nedre menyn
- **`NAV_LOWER` borttagen.** Nya tokens `tabBar` i `theme/spacing.ts`: `rowHeight 56`, `iconLabelGap 3`, `homeIndicatorTop 13`, `aboveHomeIndicator 16`, `minBottom 8`.
- **`tabBarBottomPad(insetBottom)`** (exporteras från CustomTabBar) räknar ut flikradens avstånd till skärmkanten.
- **`tabBarSpace(insetBottom)`** = avståndet + 56 + 8. Den ersätter `TAB_BAR_HEIGHT + insets.bottom` i Hem, Sparat, Hitta, ProductGrid (Följer) och Snackbar.
- **Kantblurren** (`EdgeFade` 128, samma stopp) och **ikoner och etiketter** är oförändrade.

## Slutvärden för menyns spacing
| | Med hemindikator (iPhone med Dynamic Island, safe area 34) | Utan safe area (SE, Android med knappar) |
|---|---|---|
| Flikradens underkant över skärmkanten | **21,5** (förut 8) | **8** (`spacing.sm`, oförändrat) |
| Etikettblockets underkant över skärmkanten | **29** (21,5 + 7,5 luft i raden) | **15,5** |
| Etikettblockets underkant över hemindikatorns överkant (ca 13 från kanten) | **16** (förut ca 2,5) | – |
| Flikradens höjd / ikon → etikett | 56 / 3 | 56 / 3 |
| Skärmarnas nedre utrymme (`tabBarSpace`) | 21,5 + 56 + 8 = **85,5** (förut 64 + 34 = 98) | 8 + 56 + 8 = **72** (förut 64) |

- Raden ligger 13,5 högre än förut på iPhone med hemindikator.
- **Uppmätt i skärmdumpen:** etiketttexten slutar ca 31 pt från kanten på iPhone 17 och ca 18 pt med nedre safe area satt till 0.
- **Ikon → etikett 3** fick vara kvar, eftersom det inte såg trångt ut.
- **Hemindikatorns position (13) är ett uppskattat systemmått:** stapeln är ca 5 hög och ca 8 från kanten. Simulatorns skärmdumpar visar inte stapeln, så avståndet bör bedömas på enhet.

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17 (Dynamic Island), mörkt och ljust läge:**
  - Logotypen står mitt på skärmen. Den ligger i ett eget lager, så avatarens bredd påverkar inte placeringen.
  - Hälsningen var "God eftermiddag, Daniel" kl. 15.
  - Pillarna byter vald: i ljust läge startades Hem med "Kläder" vald, och den visas inverterad.
  - Menyn har luft över indikatorns plats, och sista hyllan täcks inte.
- **Utan safe area: delvis verifierat.**
  - iPhone SE (3:e gen) startades och Expo Go installerades. Systemdialogen "Öppna i Expo Go?" gick inte att bekräfta utan Simulator-fönstret, så jag kom inte in i appen. SE-simulatorn är avstängd igen.
  - I stället körde jag menyn på iPhone 17 med tillfällig testkod (`tabBarBottomPad(0)`), som är borttagen. Det gav etiketten ca 18 pt från kanten.
  - Rekommendation: titta på en riktig SE eller Android.
- **Inte separat skärmdumpade:** Sparat, Följer och Hitta.
  - De använder samma `tabBarSpace`, som ger 8 luft ovanför flikraden.
  - Nedre utrymmet är mindre än förut på iPhone med hemindikator (85,5 mot 98), men täcker fortfarande raden.
- Testkoden (startfilter, ljust läge, inset 0) är borttagen. Min Metro är stängd och Daniels server på 8081 är orörd.

## Flaggor
- **Klockan gör ingenting:** notisskärmen finns inte (utanför scope). Märke på klockan saknas också.
- **Filterpillarna filtrerar inget** (som förut).
- **Kantblur upptill på Hem saknas:** innehållet skrollar fortfarande under statusfältet.
- **Hälsningens tidsgränser** (05/12/18) valde jag själv. §10 angav inga gränser.
- **Två storlekar på Pill:** pillarna är 36 på Hem och 34 i övrigt (t.ex. dev-sidan, Profil och Partnerdetalj).
- **Utanför scope:** byte av menyikoner.
