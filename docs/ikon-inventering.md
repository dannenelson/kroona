# Ikoninventering (brief 56)

Läget 2026-11-24 (efter brief 55). Ingen kod är ändrad.

Genomgånget:
- `assets/icons/`: 29 TSX-filer och 12 SVG-filer.
- `assets/svg/icons/`: 1 SVG-fil.
- `components/` och alla skärmar i `app/`.
- Text och data, där jag sökte efter tecken (› → ✕ × ✓ ★ …) och emoji.

**Tre sätt att mäta storlek och linje:**
- **Storlek** är rutan i px, alltså vad `size` blir på plats.
- **Linje** är `strokeWidth` i en viewBox på 24. Den synliga linjen blir *linje × storlek / 24* och står inom parentes där den skiljer sig mycket.
- **Fylld kontur** betyder att ikonen är exporterad från Figma som en fylld form utan stroke. Linjen är då uppmätt i banan.

Alla ikoner har viewBox `0 0 24 24`.

## 1. Tabell, en rad per ikon

**Förklaringar till tabellen:**
- **Färg "prop":** ikonen tar en obligatorisk `color` som anroparen hämtar ur temat (`colors.*`, `overlay.onPhoto` eller `useGlass().content`).
- **Ingen ikon har hårdkodad färg i appkoden.** Hårdkodat `fill="black"` finns bara i SVG-källfilerna, som inte importeras.
- **Aktivt läge "fylld"** betyder en separat `_filled`-fil som byts in vid valt läge.

| Ikon | Fil eller plats | Används i | Storlekar | Linje | SVG/TSX | Färg | Aktivt läge |
|---|---|---|---|---|---|---|---|
| **Hem** | `assets/icons/HomeIcon.tsx`, `HomeIcon_filled.tsx` | `CustomTabBar` (flik Hem) | 28 (`tabBar.iconSize`) | fylld kontur ca 1,5 (≈1,75 synligt) | TSX | prop (`textPrimary` vald, `textSecondary` annars) | ja, fylld |
| **Följer (flöde)** | `FeedIcon.tsx`, `FeedIcon_filled.tsx` | `CustomTabBar` (flik Följer) | 28 | fylld kontur ca 1,5 | TSX | prop | ja, fylld |
| **Hitta / sök** | `FindIcon.tsx`, `FindIcon_filled.tsx` | se nästa tabell | 28, 20, 18, 16 | fylld kontur 1,5 (ringen 5,25–6,75) | TSX | prop | ja, fylld (bara i flikfältet) |
| **Sparat** | `SavedIcon.tsx`, `SavedIcon_filled.tsx` | `CustomTabBar` (flik Sparat) | 28 | fylld kontur ca 1,5 | TSX | prop | ja, fylld |
| **Spara (bokmärke)** | `BookmarkIcon.tsx`, `BookmarkIcon_filled.tsx` | `ProductCard` (menyn), `product/SaveButton` (Produktdetalj), `saved/SaveSheet` (raden Gillade), `(tabs)/saved.tsx` (Gillade-rutan), dev-sidan | 20, 24, 48 (stor Gillade-ruta: `iconSize.lg * 2`) | fylld kontur ca 1,5 | TSX | prop | ja, fylld |
| **Stjärna (AI)** | `StarIcon.tsx` | `AskBar` (Hem, Hitta), `search.tsx` ("Fråga om"), `results.tsx` (banner och tom-knapp via `Button`), `category/[id].tsx` ("Fråga om …"), `ProductCard` (betyg) | 20, 18, 12 (`typography.caption.fontSize`) | ingen linje: helt fylld stjärna | TSX | prop | nej, är alltid fylld |
| **Mikrofon** | `MicIcon.tsx` | `AskBar` | 24 | 1,7 | TSX | prop (`textSecondary`) | nej |
| **Tillbaka** | `BackIcon.tsx` | `IconButton` via `TopBar`: `results`, `dialog`, `product/[id]`, `partner/[id]`, `profile/[id]`, `collection/[id]`, `ScreenHeader` (category, categories, areas, area, ideas), `Sheet` (två ställen), dev-sidan | 24 | 1,5 | TSX | prop (glasets innehållsfärg) | nej |
| **Stäng (kryss)** | `CloseIcon.tsx` | `Sheet` (IconButton), `lightbox/[id]` (IconButton), `search.tsx` (rensa-knappen) | 24, 12 | 1,7 (≈0,85 synligt vid 12) | TSX | prop (rensa: `colors.bg` på `textSecondary`-cirkel) | nej |
| **Chevron höger** | `ChevronIcon.tsx` | `SectionTitle` ("Visa fler ›"), `results` (bannern), `categories` (rader), `product/OfferRow`, menyraden "Öppna" i `PartnerCard`, `ProfileCard` och `(tabs)/saved.tsx` (fyra ställen) | 16 (standard), 14 (Visa fler), 20 (menyer) | 2 (standard), 2,2 (Visa fler) – prop `strokeWidth` | TSX | prop | nej |
| **Följ** | `FollowIcon.tsx` | menyer: `ProductCard` ("Följ varumärke"), `PartnerCard`, `ProfileCard`, `(tabs)/saved.tsx` ("Sluta följa", fyra ställen) | 20 | 1,7 | TSX | prop | nej (samma ikon för Följ och Sluta följa) |
| **Dela** | `ShareIcon.tsx` | `product/[id]` (TopBar, höger), menyer i `ProductCard`, `PartnerCard`, `(tabs)/saved.tsx` | 24, 20 | 1,7 | TSX | prop | nej |
| **Plus / ny** | `PlusIcon.tsx` | `(tabs)/saved.tsx` (IconButton "Ny samling"), `ProductCard`-menyn ("Spara i samling") | 24, 20 | 1,7 | TSX | prop | nej |
| **Bock** | `CheckIcon.tsx` | `saved/SaveSheet` (vald samling) | 16 (`iconSize.xs + spacing.xs`) | 2,4 (≈1,6 synligt) | TSX | prop | nej |
| **Visa liknande** | `SimilarIcon.tsx` | `ProductCard`-menyn | 20 | 1,7 | TSX | prop | nej |
| **Vy: rader** | `ListIcon.tsx` | `SegmentedIcons` i `(tabs)/saved.tsx` | 18 | 1,7 | TSX | prop (aktiv `textPrimary`, annars `textSecondary`) | nej (aktivt läge = segmentets yta) |
| **Vy: kort** | `GridIcon.tsx` | `SegmentedIcons` i `(tabs)/saved.tsx` | 18 | 1,7 | TSX | prop | nej |
| **Lås (privat)** | `LockIcon.tsx` | undertext i `ListRow` och `saved/UserCollectionCard` (Sparat, privata samlingar) | 12 | 2 (≈1,0 synligt) | TSX | prop (`textSecondary`) | nej |
| **Löv (hållbarhet)** | `LeafIcon.tsx` | `ProductCard` (betygsraden) | 12 (`typography.caption.fontSize`) | 1,5 (≈0,75 synligt) | TSX | prop | nej |
| **Notis (klocka)** | `assets/svg/icons/bell.svg` via `components/NotificationIcon.tsx` | `Header` (Hem-toppen), dev-sidan | 24 (standard `iconSize.lg`), 20 på dev-sidan | 1,5 | **SVG** (react-native-svg-transformer) | `currentColor`, och `color` sätts till temafärg (standard `textPrimary`) | nej |
| **Hjärta (gilla)** | `HeartIcon.tsx`, `HeartIcon_filled.tsx` | bara dev-sidan (`app/components.tsx`) | 24 | 1,7 | TSX | prop | ja, fylld |
| **Meny (hamburgare)** | `MenuIcon.tsx` | bara dev-sidan (TopBar-exempel "Hitta") | 24 | 1,5 | TSX | prop | nej |
| **Arkiv** | `ArchiveIcon.tsx` | bara dev-sidan | 24 | 1,5 | TSX | prop | nej |
| **Ny chatt** | `NewChatIcon.tsx` | bara dev-sidan | 24 | 1,5 | TSX | prop | nej |
| **Pil → (tecken)** | text `→` i `components/DiscoveryPreviewCard.tsx` (rad 18) | **inte använd**: komponenten importeras ingenstans, bara nämnd i en kommentar i `(tabs)/index.tsx` | `typography.title2` | typsnittets | text | `textSecondary` | nej |

### Hitta/sök (`FindIcon`) per plats
| Plats | Storlek | Färg |
|---|---|---|
| `CustomTabBar` flik Hitta | 28 | `textPrimary` eller `textSecondary`, fylld vid vald |
| `AskBar` med `icon="search"` (Sökresultat) | 20 | `textSecondary` |
| `search.tsx`, det aktiva fältet | 20 | `textSecondary` |
| `search.tsx`, handlingsraden "Sök efter" (cirkel 44) | 20 | `textPrimary` |
| `search.tsx`, Förslag och Senaste (`TermRow`) | 18 | `textSecondary` |
| `IdeaCard` före titeln (på foto) | 16 (`findCards.ideaIcon`) | `overlay.onPhoto` |

### Filer som inte är ikoner i appen
- **`assets/icons/*.svg`:** de 12 filerna (bookmark, feed, find, home, saved, nav, alla med `_filled`) är Figma-källor. De har `fill="black"` och importeras inte, eftersom TSX-filerna är konverterade från dem. **`nav.svg` och `nav_filled.svg` saknar TSX** och används inte.
- **`components/EdgeFade.tsx`** använder `react-native-svg` för en gradient, inte för en ikon.
- **`components/KroonaLogo.tsx`** (`assets/logos/kroona.svg`) är en logotyp och räknas inte som ikon.
- **Tecknet `·`** i undertexter ("Publik · 3 produkter") är en avgränsare i text, inte en ikon.
- **Emoji:** `🚧` i titeln på `CardShowcase` (tillfällig dev-komponent). `★`, `🍃`, `+`, `✓` och `♥` förekommer bara i kommentarer och i `docs/design.md`. Det finns inga emoji i appens text eller data.
- **Inline `Svg`/`Path` i skärmar:** finns inte. Alla ikoner kommer från `assets/icons/` eller `bell.svg`.

## 2. Avvikelser

### Tryckyta under 44 px
- **`SegmentedIcons`** (Sparat, Rader/Kort): segmenten är 38 × 30 (`segmented.itemWidth/itemHeight`), utan `hitSlop`.
- **"Fråga om {Kategori}"** (`category/[id].tsx`): pillen är 40 hög (`findCards.askChipHeight`), utan `hitSlop`. Den har text, så etiketten är inget problem.
- **Inga andra under 44.** Dessa är kontrollerade:
  - `IconButton` och flikarna (80 × 56) är 44 eller större.
  - Notisknappen i `Header` är 44 × 44.
  - Rensa i sökläget är 20 + `hitSlop` 12 = 44.
  - "Visa fler ›" har `hitSlop` upp till 44.
  - `SaveButton` har `minHeight` 44.
  - Menyraderna är 46.
  - Handlingsraderna och `TermRow` i sökläget är 44.

### Ikoner utan `accessibilityLabel`
- **Alla tryckbara ikonknappar har etikett.**
  - `IconButton` kräver `accessibilityLabel` i sin typ.
  - `SegmentedIcons` tar `label`.
  - Notis, Rensa, flikarna och SaveButton har egen etikett.
- **Ikoner i rader med text** (menyer, handlingsrader, `ListRow`, bannern i Sökresultat, "Fråga om"-pillen) läses via radens text. De har ingen egen etikett och behöver ingen.
- **Två dekorativa ikoner i läsbar text:**
  - Betygsstjärnan och lövet i `ProductCard` ligger inne i kortets Pressable, som har etiketten "märke namn". Betyget läses därför inte upp alls.
  - Tecknet `→` i `DiscoveryPreviewCard` skulle läsas upp som "pil höger" om komponenten användes. Den används inte.
- **Ikoner som saknar egen dold markering** (`accessible={false}` eller `importantForAccessibility`): ingen ikon har någon, men de är heller inte fokuserbara på egen hand.

### Avvikande linjetjocklek eller ruta
- **Två ritsätt blandas.**
  - Flik- och bokmärkesikonerna (Hem, Följer, Hitta, Sparat, Spara) är fyllda konturer från Figma och kan inte få ny linje genom en prop.
  - Övriga ritas med `stroke`.
- **Fem olika linjer:**
  - **1,5:** Tillbaka, Meny, Arkiv, Ny chatt, Löv och klockan, plus Figma-ikonerna.
  - **1,7:** Stäng, Följ, Dela, Plus, Liknande, Mikrofon, Hjärta, Rader och Kort.
  - **2:** Chevron och Lås.
  - **2,2:** Chevron i "Visa fler".
  - **2,4:** Bock.
- **Stjärnan är den enda helt fyllda ikonen** och saknar en kontur-variant. Bredvid förstoringsglaset (kontur) i sökläget och i Sökresultat ser den tyngre ut.
- **Synlig linje på små storlekar:**
  - Lås 12 / 2 → 1,0.
  - Löv 12 / 1,5 → 0,75.
  - Kryss 12 / 1,7 → 0,85.
  - Förstoringsglas 16 / 1,5 → 1,0.
- **Synlig linje på stora storlekar:** flikikonerna 28 / 1,5 → 1,75.
- **Ingen gemensam optisk vikt:** samma ikon ser olika tung ut beroende på storlek.
- **Rutor (storlekar):**
  - **20 och 24** följer `iconSize`.
  - **28 i flikfältet** (`tabBar.iconSize`) är ett eget värde utanför `iconSize`.
  - **16 och 14 i chevron** och **16 i bocken** är egna standarder i filerna.
  - **12** för Lås och via `typography.caption.fontSize` för Stjärna och Löv. Ikonstorleken hämtas där ur ett typsnittsmått.
  - **48** för Gillade-rutan.
- **Standardstorlek i filerna:** 24 i de flesta. Undantagen är Chevron 16, Bock 16, Rader och Kort 18 och Lås 12.
- **Följ och Sluta följa** använder samma ikon. Det finns ingen "följer"-variant (bock eller fylld).
- **Kommentarerna "Provisorisk ikon"** står i 17 filer, med hänvisning till öppen fråga 3 i `docs/design.md`.

## 3. Ikoner som finns eller saknas

| Önskad | Finns som | Status |
|---|---|---|
| **sök** | `FindIcon` | finns |
| **stjärna (AI)** | `StarIcon` | finns (bara fylld) |
| **sök + stjärna (kombinerad)** | – | **saknas** |
| **mikrofon** | `MicIcon` | finns |
| **tillbaka** | `BackIcon` | finns |
| **stäng** | `CloseIcon` | finns |
| **chevron** | `ChevronIcon` | finns, bara åt höger. Nedåt och vänster saknas |
| **följ** | `FollowIcon` | finns, ingen vald-variant |
| **spara** | `BookmarkIcon` + `_filled` | finns |
| **dela** | `ShareIcon` | finns |
| **filter** | – | **saknas** |
| **mer** (… / tre punkter) | – | **saknas**. `MenuIcon` är en hamburgare och används bara på dev-sidan |
| **notis** | `bell.svg` / `NotificationIcon` | finns, ingen vald-variant |
| **hem** | `HomeIcon` + `_filled` | finns |
| **följer** | `FeedIcon` + `_filled` | finns |
| **hitta** | `FindIcon` + `_filled` | finns (samma som sök) |
| **sparat** | `SavedIcon` + `_filled` | finns |
| **skicka** | – | **saknas**. Dialogens skicka-knapp är texten "Skicka" (`app/dialog.tsx`) |
| **check** | `CheckIcon` | finns |
| **plus** | `PlusIcon` | finns |

## 4. Hur ikoner laddas i dag

**De två vägarna:**
- **TSX-komponenter (alla ikoner utom klockan, 29 filer).**
  - Varje ikon är en egen fil i `assets/icons/` med `react-native-svg` och props `{ color: string; size?: number }`.
  - `color` är obligatorisk och skickas av anroparen från temat. Ingen fil läser temat själv, så det finns inget `currentColor` här.
  - Linjen är hårdkodad per fil. Undantaget är Chevron, som har en `strokeWidth`-prop.
  - Fyllda varianter är egna filer (`*_filled.tsx`).
- **SVG-fil (1 ikon).**
  - `bell.svg` importeras som komponent via `react-native-svg-transformer` (`metro.config.js`).
  - Den använder `stroke="currentColor"` och färgas med `color`.
  - `NotificationIcon` sköter temafärg och storlek.

**Komponenter som tar en ikon:**
- `IconButton`, `Button`, `SegmentedIcons`, `ListRow` (`subtitleIcon`), `UserCollectionCard`, `ProductContextMenu` (`icon` per rad) och sökraderna tar en ikon som `ComponentType<{ color; size? }>`.
- De sätter själva färg och storlek: `IconButton` 24, `Button` 20, menyrader 20, `SegmentedIcons` 18, undertexter 12.
- Valt läge: `IconButton` tar `selectedIcon`, `CustomTabBar` har en egen tabell `ICONS` med `outlined` och `filled`, och `SaveButton` och `ProductCard` väljer fil själva.
- Typen `IconProps` är definierad lokalt i sju filer.

**Tema:** `iconSize = { xs: 12, sm: 18, md: 20, lg: 24 }` och `touchTarget = 44` i `theme/spacing.ts`. Utöver dem finns `tabBar.iconSize` 28, `sectionLink.chevronSize/chevronStroke` och `findCards.ideaIcon`. Det finns inga linjetokens.

### Förslag: en `Icon`-komponent (inte byggt)
1. **Ett API:**
   - `<Icon name="search" size="md" color={…} active? />`, med `name` som en union av ikonnamn.
   - `size` som tokennamn (`xs/sm/md/lg/tab`), eller ett tal som undantag.
   - Färg som standard `textPrimary` via `useTheme`, så att anroparen bara anger färg när den avviker.
2. **Ett register:** en karta `name → { outline, filled? }`. `active` väljer `filled`, och den fyllda varianten faller tillbaka på outline. Det ersätter `ICONS` i flikfältet, `selectedIcon` i `IconButton` och valen i `SaveButton` och `ProductCard`.
3. **En ritteknik:**
   - Rita om eller byt till en uppsättning där alla ikoner är `stroke` i `currentColor`, med samma linje.
   - Figma-konturerna (Hem, Följer, Hitta, Sparat, Spara) måste ritas om som linjer för att få gemensam linje. Annars behålls de som fyllda och linjen kan inte styras.
   - Om SVG-filer via transformern eller TSX ska användas är ett eget beslut. Transformern finns redan och klarar `currentColor`.
4. **Linjen som token:**
   - En `iconStroke` i temat, gärna kompenserad per storlek så att den synliga linjen blir lika (t.ex. högre värde vid 12–16, lägre vid 28).
   - Det tar bort de fem varianterna och Chevrons `strokeWidth`-prop.
5. **Komponenterna tar `name` i stället för en komponent:** `IconButton`, `Button`, `SegmentedIcons`, `ListRow`, `UserCollectionCard`, menyobjekten och sökraderna. Den lokala typen `IconProps` (sju kopior) försvinner.
6. **Storlekar in i `iconSize`:**
   - 28 (flik), 16 (chevron, bock, idé) och 14 (Visa fler) blir namngivna steg eller tas bort.
   - Stjärna och Löv slutar hämta storlek från `typography.caption.fontSize`.
7. **Tillgänglighet i komponenten:** fristående ikoner döljs för skärmläsaren som standard (`accessible={false}`). Etiketten ligger på knappen, som i dag.
8. **Städning i samma steg:**
   - SVG-källorna i `assets/icons/*.svg` och de oanvända `nav*.svg`.
   - Dev-ikonerna Hjärta, Meny, Arkiv och Ny chatt, om de inte ska vara kvar.
   - `DiscoveryPreviewCard` med sitt `→`.
   - Kommentarerna "Provisorisk ikon".
9. **Nya ikoner före bytet:** sök + stjärna, filter, mer, skicka, chevron nedåt och vänster, och eventuellt Följer (vald) och notis (vald).

**Ordning:** välj uppsättning och linje (öppen fråga 3 i `docs/design.md`), bygg `Icon` och registret, och flytta sedan en komponent i taget. `IconButton` och flikfältet täcker flest platser.
