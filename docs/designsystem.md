# Kroona — Designsystem (levande dokument)

*Startat aug 2026. Fylls på över flera sessioner i takt med att vi resonerar och bestämmer. Markerade som ✅ Bestämt / 🟡 Öppen fråga / 💡 Idé, ej beslutat.*

---

## 1. Korttaxonomi

Grundregel, gäller alla korttyper: **en rad = alltid samma kortform.** Variation kommer från innehållets rikedom, aldrig från att blanda storlekar/former inom en rad. Alla kort har rundade hörn (Pinterest-mönstret).

**Visningskontext:** varje korttyp visas tillsammans med andra kort av samma typ — antingen horisontellt (scroll-rad) eller vertikalt (grid, masonry där relevant). **Undantag: ClusterCard visas alltid ensam**, aldrig i rad/grid med andra ClusterCard — egen sektion. Pinterest väver in motsvarande kort i sina grids, vilket kan bli aktuellt för Kroona senare, men primärt är det en egen sektion på Hem tills vidare.

*Namnkonvention: engelska, `Card`-suffix genomgående, matchar befintlig kodstil. Namnen nedan är bekräftade av dig (aug 2026) med ett undantag noterat inline.*

### ProfileCard — ✅ Form bestämd
Användare, företag/butik eller varumärke som en identitet. **Alltid cirkel.** Länkar alltid till en profilsida. Egen rad, blandas aldrig med andra kortformer.

### ProductCard — ✅ Tre storlekar bestämda, "bara bilden rundas"-mönster tillämpat
- **Small** — bara bild, 3-kolumnsgrid
- **Medium** — bild + metadata under, 2-kolumnsgrid
- **Large** — bild + metadata under, 1-kolumnsgrid

Samma mönster som CollectionCard/PartnerCard/LinkCard Vertical: bara bildcontainern har `Radius.card` + kant, text under ligger utan bakgrund/rundning, flush med bildbredden. I **grid** (Följer/Sparat): masonry, bildhöjd styr korthöjd (medvetet, Pinterest-mönster). I **horisontell rad** (`RecommendedProductsRow`): `fixedHeight`-prop tvingar samma höjd på alla kort — masonry hör bara hemma i grid-kontext, inte i en scroll-rad.

### CollectionCard — ✅ Form bestämd, namn bekräftat aug 2026, implementerad
Board-stil: 1 stor bild + 2 mindre i 2-kolumnsuppdelning. **Bara bild-containern är rundad — metadata under ligger utan bakgrund, ingen rundad yttre kortram.** Litet cirkulärt profilfoto på kuratorn överlagt bilden. Metadata under (antal objekt, ålder/senast uppdaterad). Används i `PopularCollectionsRow` (dummy-data, Fas 0-platshållare tills riktiga användarsamlingar finns).

**Namnkrocken är löst:** den gamla `CollectionCard.tsx` (varumärke/stil-korten) är omdöpt till `PartnerCard.tsx`. `CollectionCard` är nu byggd med sin nya betydelse.

### PartnerCard (tidigare "Samling — företag") — ✅ Form bestämd, implementerad
Rektangulär, liggande. Text/logotyp på kortet. Automatiskt populerad. Täcker både varumärken och återförsäljare. Används i `CollectionsRow` ("Du följer").

### DiscoveryCard — ✅ Alla tre varianter implementerade
- **Simple** — liggande eller stående, rektangulär, text/info på kortet. **Aldrig ensam** — raden kräver minst 3 kort för att visas alls, annars göms hela raden (`DiscoverBrandsRow`s mönster).
- **Mosaic** (`DiscoveryMosaicCard.tsx`) — **alltid ensam**, egen sektion, "Inspiration just nu". Äkta 3-kolumners masonry: varje kolumn = 2 staplade bilder, brytpunkten mellan bilderna skiljer sig per kolumn (t.ex. 55/45, 35/65, 65/35) — INTE ett radjusterat 3×2-rutnät. Egen tajt radie-token (`Radius.tile: 10`, se avsnitt 3) eftersom `Radius.card` (20) ger optisk för-bred gutter-känsla på små ytor.
- **Preview** (`DiscoveryPreviewCard.tsx`) — SectionHeader (preheader ELLER subheader, anroparens val) + pil (→, inte sökikon). Enradig rad med 4 jämnbreda bilder, tajt gutter (`gap:1`, samma "hopsvetsad"-konvention som CollectionCard/MixCards interna bildgrid — inte `Spacing.gutter`), bildhöjd 160 (appens standardhöjd för multibildsblock).

### EditorialCard (tidigare "Samling — kroona") — ✅ Bekräftad, layoutdetalj tillagd
- **Medium** — liggande rektangulär, ca 40% av skärmbredden
- **Large** — liggande, stor (byggd som "Utvalt"-raden)
Kan visas ensam ELLER flera i rad. **Vid flera i rad: korten görs smalare (ej fullbredd) så en skymt av nästa kort syns** — hintar att det finns fler att scrolla till. `HeroRow` är byggd fullbredd idag, behöver breddjusteras för att stödja detta.

### LinkCard (tidigare "Länk") — ✅ Form bestämd, tredje layoutvariant tillagd
För att länka till senaste chattar (Hitta) eller in till specifika kategorier. Tre layoutvarianter:
- **Horizontal** — liten tumnagel vänster, text vertikalt centrerad höger (Spotify-mönster, högst upp)
- **Vertical** — tumnagel centrerad överst, text/metadata under
- **Grid** — två kolumner, flera rader (Spotifys "Fortsätt"-mönster)
- **List** (tillagd aug 2026) — Horizontal-varianten staplad i en enda kolumn

### ClusterCard — ✅ Implementerad, avgränsad mot DiscoveryCard Mosaic
3 överlappande bokstavsavatarer (guld/sustainGreen/sustainAmber-bakgrund, mörk text — inte fotobaserade cirklar, dummy-nivån matchar CollectionCards kuratoravatar) på färgad platta, titel + relaterad-lista under. Visas alltid ensam, egen sektion. **Byggd men INTE monterad på Hem än** — finns bara i `CardShowcase.tsx`.

### ProfileCard — ✅ Implementerad
76×76 cirkel, initial i mitten, namn under. Används i `DiscoverBrandsRow` ("Fler varumärken i din stil"). Med `partnerId` öppnar den Partnerdetalj (brief 29), med `personId` profilvyn (brief 37) och har då kontextmenyn Följ/Sluta följa · Öppna. **Avatar** (`components/Avatar.tsx`, brief 37): rund initial-avatar i `surfaceRaised`, delad av listrader (48) och profilvyn (96, `profileAvatar`).

### AskBar — ✅ Implementerad, ej i taxonomin ursprungligen
"Fråga Kroona"-textfält, ingen SectionHeader ovanför (medvetet diskret). Riktig navigation: skickar frågan till Hitta som en ny konversation (inte fejkad). Sitter direkt under text-flikarna (TextTabs) på Hem.

### ContinueDialogRow — ✅ Implementerad (använder LinkCard Horizontal)
"Fortsätt din dialog". Dummy-data idag — kräver riktig chatthistorik för äkta villkorad synlighet (dölj om ingen aktiv dialog finns). Se roadmap avsnitt 7/12.

### RecommendedProductsRow — ✅ Implementerad (använder ProductCard)
"Kanske intressant för dig". Enskilda produkter (inte MixRows grupperade mixar — medvetet byte, starkare shoppingmekanik). Samma delade signallogik som MixRow (`lib/personalizationSignals.ts`), `fixedHeight`-prop håller alla kort i raden samma höjd (masonry hör bara hemma i grid-kontext, se ProductCard nedan).

---

## 2. Spacing-skala — ✅ Implementerad (värden justerade under bygget, se nedan)

`constants/spacing.ts`. Slutgiltiga värden skiljer sig något från första förslaget — testade visuellt, inte antagna:

| Roll | Värde | Not |
|---|---|---|
| Skärmmarginal (`Spacing.screenMargin`) | **16** | Nedjusterat från ursprungliga 20 |
| Kort-mellanrum i rader (`Spacing.gutter`) | **8** | Nedjusterat från ursprungliga 14 (INTE 16 som tidigare föreslaget här — 8 höll bättre i Expo Go) |
| Sektionsavstånd | 32 | Oförändrat |
| Rubrik→innehåll | 12 | Oförändrat, bakat in i `SectionTitle`/`SectionHeader` |
| Etikett→text | 4 | Oförändrat |

**Kända buggar — alla fixade:**
- ✅ Tab bar-utrymme: `CustomTabBar` exporterar nu en beräknad `TAB_BAR_HEIGHT`, används av index.tsx/ProductGrid/find.tsx istället för tre separata gissningar.
- ✅ `saved.tsx` tomt-state: `paddingHorizontal: 40` → `Spacing.screenMargin`.
- ✅ HeroRow post-titel: `marginBottom: 6` → `4`.

## 3. Border-radius — ✅ Implementerad, två tokens

`constants/spacing.ts`. Två radier, inte en — ett litet kort med samma radie som ett stort kort ger optiskt för bred gutter-känsla (upptäckt via DiscoveryMosaicCard-korrigeringen):

- **`Radius.card: 20`** — stora kort (CollectionCard, PartnerCard, MixCard, HeroRow, ProductCard-bilder m.fl.)
- **`Radius.tile: 10`** — små bild-plattor i täta flerbildsgrid (DiscoveryMosaicCard)

🟡 **Kvarstående öppen fråga:** cirkel-knappar (följ/spara) föreslogs bytas till `borderRadius: 999` (robust "alltid cirkel") — inte bekräftat genomfört.

## 4. Färgtokens

Etablerade: `Colors.background` (#0F0F0E), `Colors.textPrimary`, `Colors.textSecondary`, guld-accent (#B8965A).

**Kända läckor** (hex/rgba skrivna för hand istället för tokenreferens): gradient-overlayer i CollectionCard/HeroRow, halvtransparenta knapp-bakgrunder i CollectionCard/ProductCard, tab bar-gradienten. Alla refererar egentligen `Colors.background` i olika alfa-nivåer utan delad "translucent"-hjälpare.

**Öppen fråga:** `#ccc8c0` (ProductCard-pris) saknar motsvarighet i `Colors` — ny token eller konsolidera till `textSecondary`?

## 5. Typografi — ✅ Bestämt

**Google Sans Flex — enda typsnittet i hela appen** (aug 2026, ersatte Cormorant Garamond + DM Sans). Vikter: 400 Regular, 500 Medium, 700 Bold. Variabelt typsnitt, men RN-implementationen använder statiska viktinstanser, inte runtime-axlar.

---

## 6. SectionHeader (delad komponent) — ✅ Bestämt aug 2026

Generalisering av `SectionTitle`. Ligger alltid UTANFÖR kort-wrappern, aldrig inuti. Rad, allt vertikalt centrerat.

- **Rubrik** — alltid närvarande, samma stil överallt
- **Preheader** (valbar, ovanför rubriken) ELLER **Subheader** (valbar, under rubriken) — **aldrig båda samtidigt**
- **Icon** (valbar, höger, länkar vidare) ELLER **CTA-länk** ("Visa fler", höger, länkar vidare) — **aldrig båda samtidigt**
- **"Visa fler ›" är standard** (brief 53): `cta={{ onPress }}` ritar "Visa fler" 13/18 `textSecondary` + chevron 14 (linje 2,2). Stora chevroner i hyllrubriker används inte. Länken visas **bara när hyllan har en destination**. Sedan brief 54: Idéer för dig → Idéer, Kategorier → Alla kategorier, Områden och stilar (Hitta) och Områden (Hem) → Alla områden.

Ersätter `DiscoveryPreviewCard`s egenbyggda rubrikrad (byggdes fristående innan `SectionTitle` hade ikon-stöd) — konsolideras till samma komponent.

## 7. Filtrering = TextTabs — ✅ Uppdaterat 2026-11-18 (brief 04)

**Filtrering görs med text-flikar med understrykning** (`components/TextTabs.tsx`, Pinterest-mönstret, 44 px höga), se `design.md` §11. Komponenten FilterPills är borttagen. Beslutet om glaspillar för filter (aug 2026) är överspelat.

- Ej vald: `textSecondary` (mute). Vald: `textPrimary` och understrykning i `textPrimary`. Ingen accentfärg.
- **Pill** (`components/Pill.tsx`) byter innehåll överst på en skärm (t.ex. Allt · Mode · Heminredning), filtrerar inte. Vald pill är inverterad: textfärg som yta, bakgrundsfärg som text.

Används på Hem, Följer och i samlingsdetalj (andra kategorier beroende på samlingstyp, se wireframes.md avsnitt 2).

## 8. TopBar — delad navigationskomponent (tillagt aug 2026)

Alla detaljvyer (Produktdetalj, CollectionCard-/PartnerCard-/ProfileCard-detalj) och Hitta delar samma toppradsmönster. Byggs som EN delad container med fast struktur, varierande innehåll.

**Fast struktur (styrs globalt):**
- Höjd, padding, ikon-knappstorlek — samma överallt, glasbehandling enligt avsnitt 9
- **Vänster slot:** alltid navigation — tillbaka-pil (detaljvyer) eller meny/tillbaka (tab-rötter). Aldrig kontext-CTA:er.
- **Höger slot:** alltid kontext-specifika åtgärder, 0–2 ikoner. Innehållet varierar per skärm men positionen och stilen gör det inte.

**Exempel på höger-slot-innehåll per skärm:**
- Produktdetalj: Spara (bokmärke, brief 41): tryck = snabbspar, långt tryck = kortet "Spara i …". Menyn vid långt tryck på kort: Spara/Sparad · Spara i samling · Följ varumärke · Dela · Visa liknande; korten har ingen egen knapp.
- Hitta: Arkiv + Ny chatt
- Sparat (tab-rot, inget tillbaka-behov): Ny samling
- CollectionCard-/PartnerCard-/ProfileCard-detalj: Följ/Avfölj (följda) ELLER Dela/redigera (egna samlingar, se wireframes.md avsnitt 2)

**Viktigt undantag att inte upprepa:** en tidig Claude Design-leverans kopierade Följ-knapp + pil-uppåt-ikon till Hem:s hero-yta av misstag — Hem är en tab-rot, inte något man "följer". Följ-knappen hör bara hemma i TopBar på detaljvyer. Se avsnitt 10 (Hem-hero) för vad som faktiskt ska stå där istället.

**Tillbaka-knappen är alltid kontextuell** — returnerar till skärmen man kom från (t.ex. tillbaka från Produktdetalj till Hitta-chatten med bevarad konversation, inte till en fast tab-destination). Kräver att detaljvyer känner till sin ursprungsskärm (navigation-stack), inte en hårdkodad "tillbaka till Hem"-länk.

## 9. Glassystem — chrome ovanpå foto (tillagt aug 2026, framtaget i Claude Design)

> **Värdena nedan är ersatta** av `design.md` §0/§3 (Apple-ren, 2026-11-18). Avsnittet står kvar som historik för principerna (en kant, två kontexter, WCAG-undantaget).

Gäller alla ikon-knappar och pills som sitter direkt på fotografi eller på temats bas-yta (TopBar-innehåll, pillar). Iterativt framtaget — värdena nedan är senast bekräftade, men **alfa-värdet för glasets bakgrundsfyllning är fortfarande inte helt låst** (senast diskuterat runt 0,20–0,30).

**Grundregel:** mörkt tema → mörkt glas. Ljust tema → ljust glas. INTE ett fast glas oavsett tema (testat och förkastat under iterationen).

| Egenskap | Värde |
|---|---|
| Blur-radie | 8–12px (sänkt från ursprungliga 20–24px — för hög blur dolde konturerna helt, såg ut som en solid platta) |
| Saturate | 180% |
| Kant | EN linje — antingen `border` ELLER `inset`, ALDRIG båda staplade (dubbel kant var en bugg i ett mellansteg). Låg opacitet. |
| Innehållsfärg, mörkt tema | Vit |
| Innehållsfärg, ljust tema | Mörk (`#14181D` i senaste körningen) |

**Testat i två kontexter, båda måste hålla:** (1) ovanpå en bakgrundsbild, (2) ovanpå en vanlig yta utan bild — inte alla vyer har foto i toppen.

**Medvetet WCAG-undantag, bara för hero-rubriker (inte interaktiva element):** text som ligger direkt på ett foto (t.ex. en kampanjrubrik) kräver en gradient-scrim (mjuk, lång utfasning — inte en hård kant, något högre opacitet precis vid textens nederkant). Den behöver INTE garantera AA-kontrast i alla tänkbara bakgrundsbilder, eftersom hero-rubriker är sekundär information. Interaktiva element (knappar, pillar, priser) måste däremot alltid hålla kontrastkrav — blanda inte ihop de två.

## 10. Hem — hero-hälsning (tillagt aug 2026)

**Uppdaterat 2026-11-23 (brief 46), ersätter foto-heron nedan:** Hem-toppen är `components/Header.tsx`: toppraden (avatar **40** med initialer i `headline`, träffyta 44 (brief 51), centrerad Kroona-logotyp **12 px hög** utan ™ (18 i brief 46, sänkt i brief 49), notisikon), 24 luft, sedan hälsningen **"God morgon, [Namn]" / "God eftermiddag, [Namn]" / "God kväll, [Namn]"** (komma, inget utropstecken; 05–11 / 12–17 / övrigt) i Familjen Grotesk 28/32. Namn och initialer från `DUMMY_USER` (`data/user.ts`). Under den filterpillar (`FilterPills`) och AskBar. Ingen foto-bakgrund. Se `design.md` §8k.

*Tidigare (aug 2026):* Kort, kompakt hero överst på Hem (INTE en fullskärms-hero) — foto-bakgrund + glassystem (avsnitt 9) på meny/sök-ikonerna. Inget kampanjbudskap, ingen Följ-knapp, ingen pil-uppåt (se avsnitt 8 för varför de INTE hör hemma här). Innehåll: personlig hälsning baserad på tid på dygnet — "Godmorgon [Namn]!" / "God eftermiddag [Namn]!" / "God kväll [Namn]!". Kopplar till Igenkänning-lagret i Kroona_Sammanstallning avsnitt 6.

## 11. Kortinnehåll — pris- och betygsformat (tillagt aug 2026)

**Pris:** `1 490 kr` — valutan direkt efter siffran, samma rad, mindre textstorlek än priset. Gäller överallt pris visas, inklusive minitumnaglar (dessa saknade tidigare "kr" helt).

**Betyg på ProductCard:** både kundbetyg och hållbarhetsbetyg visas med samma mönster — **ikon FÖRE värdet**, inte efter:
- Kundbetyg: `★ 4,8 (312)`
- Hållbarhetsbetyg: löv-ikon + värde, t.ex. `🍃 4,2`

## 12. Button, Sheet och Snackbar (tillagt 2026-11-20, brief 33)
- **Regel:** knappar är aldrig fullbreddsrader (utom rader i listor). CTA är en pill som följer sitt innehåll, centrerad, minst 56 hög, 17/600. Primär = ljus yta, sekundär = tonad yta. Gäller hela appen framöver.
- **Button** (`components/Button.tsx`): `variant` primary/secondary, `size` cta (≥ 56) / compact (36), `disabled`, valfri `icon`. Tryckrespons som korten.
- **Sheet** (`components/Sheet.tsx`): helskärmslager för miniflöden (flera steg med tillbaka), blur + scrim som kontextmenyn. Steg = `{ title, render, swipeToClose? }`.
- **Snackbar** (`components/Snackbar.tsx`): enda bekräftelsekomponenten (ersatte Toast). Text, valfri miniatyr och åtgärd.
- Detaljer och tokens: `design.md` §8h.

## 13. ListRow och vy-växlare (tillagt 2026-11-20, brief 35)
- **ListRow** (`components/ListRow.tsx`): thumb till vänster (bild, mosaik eller avatar), titel 15/500 och undertext `label` med valfri liten ikon (t.ex. lås). Standard 76 hög med 56-thumb, kompakt 64 med 48-thumb (`listRow` i `theme/spacing.ts`). Tryck = `pressed`-yta (rader krymper inte). Valfri zoom från thumben (`boundary`) och kontextmeny vid långt tryck (thumben lyfts).
- **Vy-växlare** (`components/SegmentedIcons.tsx`): segmentkontroll med ikoner (rader/kort), pill-bakgrund `surface`, aktivt segment `surfaceRaised` i text-färg, övriga mute, 38 × 30 per segment (`segmented`). Byter direkt med selection-haptik.
- **Kontextmeny via hook:** `hooks/useLongPressMenu` delas av PartnerCard, samlingskort och listrader (en implementation).

## 15. Kort-sheet (tillagt 2026-11-23, brief 40)
- `presentation: 'card'` på första steget ger Sheet som **kort** (YouTube/Instagram): luft runt om, radie 28, nästan solid yta över mörk overlay, vänsterställd rubrik, ingen X (stängs med svep, overlay-tryck eller skrollgesten). Valfri `headerAction` på steget = högerställd neutral textlänk på rubrikraden (t.ex. "Ny samling", brief 41). Utan CTA har kortet ändå luft och blur nedtill.
- **Snapp-beteende:** två lägen, 2/3 och full höjd, i en kontinuerlig gest på UI-tråden: fingret uppåt växer kortet till full höjd innan listan skrollar; nedåt med listan på toppen krymper kortet, och under 2/3 stängs det vid släpp efter avstånd eller fart (fly-out). Listor i kortet använder `SheetScrollView` (kopplas till kortets gest; i helskärm en vanlig ScrollView).
- Helskärmspresentationen (t.ex. Skapa samling från "+" i Sparat) är oförändrad.

## 16. EditorialCard (tillagt 2026-11-23, brief 43)
- `components/EditorialCard.tsx`: redaktionellt bildkort med **text på bilden** (toning + blur i botten). Varianter `portraitLarge` (240 × 320, r22, titel 20/24, toning + blur; brief 51), `portraitSmall` (150 × 225, r16, bara toning) och `landscape` (320 × 213, r20, toning + blur, valfri `status`-rad). Stående = centrerad text, liggande = vänsterställd. Mått, typ och radier som tokens (`editorialCard`, `typography.editorial*`, `radius.editorial*`), se `design.md` §8j.
- Props: `title`, `subtitle`, `status`, `imageUrl` eller `cover` (t.ex. `CollectionMosaic` eller kollage), `chip` (överst till vänster), `size` (härlett format: mix, kollage), `boundary` (`{ id, group }`, zoom till detaljvy: hela kortet är källan, CollectionCard-mönstret) och `onPress`. Tryckrespons `useCardPress`. Utan `onPress` är kortet inte tryckbart.
- Används av Hems hyllor: `ContinueRow`, `MixCard` (via `MixRow`, en bild och `align="start"`, brief 52), `CollectionsForYouRow`, `AreasRow`. `PopularCollectionsRow` (kollage) använder inte längre EditorialCard: flerbildskort har texten under bilden (brief 52).
- **Regel (brief 52):** text på bilden bara när bilden är ett enda foto; flerbildskort (kollage) har titel (`typography.cardTitle` 14/500) och undertext (`caption` 12, `textSecondary`) under bilden, vänsterställda. `align` (`'center' | 'start'`) styr textens justering när varianten inte räcker. Cirklar i `MoreInYourStyleRow` använder `ProfileCard`.
- **Ligger kvar men monteras inte längre på Hem:** `ContinueDialogRow`, `CollectionRow` ("Du följer"), `DiscoverBrandsRow` (logiken delas via `useDiscoverBrandTiles`), `DiscoveryMosaicCard`, `HeroRow`, `DiscoveryPreviewCard`, `CollectionCard`.

## 17. SVG-filer: ikoner och logotyper (tillagt 2026-11-23, brief 45)
- **Konvention:** nya ikoner är `.svg`-filer under `assets/svg/icons/` (24 × 24, linjeikoner med linjetjocklek 1,5 som övriga ikoner, `stroke`/`fill="currentColor"`). Logotyper ligger under `assets/logos/`. De gamla TSX-ikonerna i `assets/icons/` ersätts först när de ändå ändras.
- **Pipeline:** Metro importerar `.svg` som React-komponent (`react-native-svg-transformer`, `metro.config.js`, typer i `types/svg.d.ts`). `.svgrrc` i roten tar bort fasta `width`/`height` (`dimensions: false`), behåller `viewBox` och byter svart (`#000`, `#000000`, `black`) mot `currentColor`. Komponenten tar då `width`, `height` och `color` (färgen ger `currentColor`). Ändras `.svgrrc` måste Metro startas med `-c`.
- **Wrappers:** `components/KroonaLogo.tsx` (`height`, bredden från proportionen 1440:238, `color` default `textPrimary`, `trademark` default från 40 px höjd: under det beskärs viewBox till ordbilden 1378 bred så att ™ döljs, brief 46) och `components/NotificationIcon.tsx` (`size` default `iconSize.lg`, `color` default `textPrimary`; klockan ritad med linje 1,5 sedan brief 46, som övriga ikoner). Provyta: dev-sidan `app/components.tsx`.
- **Menyikoner:** ritas i `tabBar.iconSize` **28** (brief 52; 32 i brief 50, 24 innan), en lokal storlek i nedre menyn. Övriga ikoner använder `iconSize` (24 som störst).
- **Lägga till en ny ikon:**
  1. Exportera 24 × 24 med linje 1,5 och spara som `assets/svg/icons/<namn>.svg` (svart eller `currentColor`, ingen `style` på roten).
  2. Importera den: `import XSvg from '../assets/svg/icons/<namn>.svg'`.
  3. Rita `<XSvg width={size} height={size} color={colors.textPrimary} />` (eller gör en liten wrapper som `NotificationIcon` när den används på 2+ ställen).

## 18. Logotyper: BrandLogo, logoPlate och samlingslogotyp (tillagt 2026-11-23, brief 47)
- **Tillfälligt demomaterial:** `assets/dummy/logos/retailers/*.svg` och `assets/dummy/logos/collections/*.svg` (90 × 45-ram, transparent). Register i `data/logos.ts`: `RETAILER_LOGOS` (retailer-id → logotyp) och `COLLECTION_LOGOS` (samlings- eller områdes-id → logotyp). Filerna behåller sina egna färger (ingen `currentColor`).
- **`BrandLogo`** (`components/BrandLogo.tsx`, `retailerId`, `size`, `initial`, `shape: 'circle' | 'plate'`): logotypen på en **mörk platta** `overlay.logoPlate` (ink850, samma i båda teman eftersom flera logotyper är vita) med 1 px kant `overlay.logoPlateEdge` (vit 12 %). Logotypen tar `logo.plateShare` (60 %) av bredden, proportionen bevaras. Saknas logotyp: initialavatar (`Avatar`). `hasBrandLogo(id)` för att välja.
- **Var:** cirklar i "Fler i din stil" (`ProfileCard` 76), Partnerdetaljens huvud (cirkel `logo.headerCircle` 64 ovanför namnet), varumärkesrader i Sparat → Följer (48), och `PartnerCard` variant `brand` (platta 2:1 i stället för namnet; namnet blir tillgänglighetsetikett).
- **Samlingslogotyp på kort:** `EditorialCard` tar `logo` (vit). Den ersätter titeln, ovanpå toningen: stående centrerad, liggande vänsterställd, bredd `logo.largeShare` **65 %** (stor/liggande) / `logo.smallShare` **85 %** (liten) men högst `logo.maxHeight` **72** hög, det som binder först (brief 51; tidigare 60 / 75 % och 36). Slutvärden: stort kort 144 × 72, liggande 144 × 72, litet 127,5 × 64. Undertiteln ligger kvar; titeln blir tillgänglighetsetikett. Används i "Samlingar för dig" och "Områden" via `COLLECTION_LOGOS`.

## 19. Hitta: fält, idékort och sökläge (tillagt 2026-11-24, brief 53)
- **AskBar** = tryckbart fält "Fråga eller sök" (56, pill, stjärna vänster, mikrofon höger). Prop `value` visar söktermen (Sökresultat), `inline` tar bort sidomarginalen. Ingen riktig inmatning; sökläget (`app/search.tsx`) har det aktiva fältet.
- **Idékort** = `EditorialCard` `landscape` i formatet 240 × 160 med `titleIcon` (förstoringsglas). Data i `data/ideas.ts` (`id`, `title`, `image`, `filter`; filtret har områdets form plus `newOnly`, `maxPrice`, `material`).
- **Kategorikort** 109 × 150 och **områdeskort** (2-kolumnsgrid, 92 höga) är också `EditorialCard` med härlett format. Text på bild eftersom varje kort är ett enda foto.
- **Sökläge:** handlingsrader "Sök efter" / "Fråga om", sedan förslag eller senaste sökningar. Se design.md §8l.

## 20. Kategorier, områden och ScreenHeader (tillagt 2026-11-24, brief 54)
- **ScreenHeader** (`components/ScreenHeader.tsx`): tillbaka + rubrik 28/32 (`screenTitle`) + valfria rader under. Delas av Kategorivy, Alla kategorier, Alla områden, Områdesdetalj och Idéer.
- **AreaGrid** (`components/AreaGrid.tsx`): områdeskorten i 2-kolumnsgrid (Hitta med `limit` 6, Alla områden utan). Tryck öppnar Områdesdetalj, liksom korten i Hem-hyllan Områden.
- **IdeaCard** (`components/IdeaCard.tsx`): idékortet, 240 × 160 eller `width` (fulla bredden) med samma proportion.
- **Kategorier** i `data/categories.ts`: namn, kortbild, urval och pillar (visas bara om de ger träffar).
- **Följ område:** samma mängd som samlingar och varumärken (`FollowedCollectionsContext`), nyckel = områdets id. Sparat → Följer har sektionen **Områden**.

## 14. Sheet-steg med lista (tillagt 2026-11-20, brief 36)
- Mönster för val i en lista inuti Sheet: valfritt chip överst (bild 40 / `radius.tile`, namn, undertext, hårlinje under), sökfält (56, `radius.card`, `surface`, sökikon i `textTertiary`), lista med `ListRow` (kompakt) och **val-cirkel** till höger (`control.checkSize` 28: tom ring i `textTertiary`, vald = fylld `textPrimary` med bock i `bg`). Tryck växlar direkt utan att stänga. CTA (Button med ikon) centrerad nederst.
- Steget sätter `swipeToClose: false` (listan skrollar) och kan ha `onClose` för en sammanfattande snackbar när lagret stängs.
- **Sheet-footer och blur (brief 39):** `SheetContent` tar `header` (fasta element under titeln), `footer` (CTA) och `edgeToEdge` (barnet är en skrollande lista). Innehållet skrollar bakom header, fasta element och CTA och blurras progressivt där med `EdgeFade` (variant `clear`, bara blur). Listan hämtar marginalerna med `useSheetInsets()`. Två CTA:er i foten ligger alltid på en rad (sekundär vänster, primär höger), centrerade som grupp, `spacing.sm` emellan; knapparnas sidpadding är `control.ctaPaddingX` (28).

## Öppna frågor — sammanfattat

1. `#ccc8c0` (ProductCard-pris) — ny färgtoken eller konsolidera till `textSecondary`?
2. Cirkel-knappars `borderRadius: 999`-konvention — föreslagen, ej bekräftat genomförd
3. ClusterCard — byggd, väntar på en sektion att monteras i (inte del av dagens Hem-ordning)
4. Profilsida — `ProfileCard` länkar dit, sidan finns inte byggd (se ia-karta.md)
5. Glassystemets exakta alfa-värde (avsnitt 9) — inte helt låst, senast runt 0,20–0,30
6. Hela glassystemet (avsnitt 9) och Hem-hero-hälsningen (avsnitt 10) är beslutade i design-iteration men **inte verifierade mot faktisk kod** — se `kroona_projektoversikt.md` avsnitt 4 för kodläge, som är okänt tills en färsk Claude Code-inventering görs
