# Rapport brief 57 – Icon-komponent, nya flikikoner och tillbaka-knapp

## Inventering: vad som redan fanns
- **`assets/ikoner-ny/`:** 91 otrackade SVG-filer, normaliserade enligt briefen.
  - Alla har samma rot: `width/height 24`, `viewBox 0 0 24 24`, `fill="none"`.
  - Alla linjer har `stroke-width="1.5"` (187 st), `stroke="currentColor"` och runda ändar.
  - 7 är SoMe (`some-*`, fyllda).
  - 3 har egen fylld version: `find-filled`, `folders-filled`, `verified-filled`.
  - `image`, `image-add`, `list` och `moon` har små fyllda detaljer.
  - Ingen fil har hårdkodad färg.
- **`assets/svg/icons/`:** bara `bell.svg`, linje 1,5.
- **`assets/icons/`:** 29 gamla TSX-ikoner och 12 SVG-källor från Figma, enligt `docs/ikon-inventering.md`.
- **`.svgrrc`:** `dimensions: false`, svart → `currentColor`, svgo `preset-default` med `removeViewBox` av. **`stroke-width` togs inte bort**, så filernas egna linjer hade vunnit.
- **`CustomTabBar`:** egen tabell med fyra par gamla TSX-ikoner (kontur och fylld), storlek `tabBar.iconSize` 28.
- **`NotificationIcon`:** wrapper runt `bell.svg` med `size` och `color`.
- **`IconButton`:** tog bara en ikonkomponent (`icon`, `selectedIcon`), 24 i en 44-cirkel.
- **`TopBar`:** skickar vidare till `IconButton`.
- **`Header`:** notisknappen 44 × 44.
- **`AskBar`:** stjärna (`'star'`) eller förstoringsglas (`'search'`), samt `MicIcon`.
- **`app/search.tsx`:** gamla `FindIcon`, `StarIcon` och `CloseIcon`.
- **`app/results.tsx`:** `AskBar icon="search"` och bannerns `StarIcon`.
- **`app/(tabs)/find.tsx`:** `AskBar` med standardikonen.
- **`theme/spacing.ts`:** `iconSize` xs/sm/md/lg = 12/18/20/24 och `tabBar.iconSize` 28. Det fanns ingen linjetoken. `sectionLink.chevronStroke` var 2,2.
- **`docs/designsystem.md` §17:** konventionen för SVG-filer och pipelinen från brief 45.
- **Dialogens skicka-knapp:** en **textknapp "Skicka"**.
  - Ytan var `textPrimary` (inverterad) med text i `bg` (`typography.label`).
  - Radie `radius.card`, 40 hög, sidpadding 16.
  - Ingen `accessibilityLabel`, eftersom texten räckte.

## Gjort
1. **Filerna:**
   - 84 ikoner ligger i `assets/svg/icons/` och 7 SoMe-filer i `assets/svg/brands/` (`mv`).
   - `bell.svg` är borttagen (`git rm`), eftersom `NotificationIcon` nu använder `notification`.
   - `assets/ikoner-ny/` är borttagen. Den innehöll bara en `.DS_Store` efter flytten.
2. **`components/Icon.tsx`:**
   - `name` (`IconName`).
   - `size`, standard `iconSize.lg`.
   - `color`, standard `textPrimary`.
   - `filled`.
   - `strokeWidth` (synlig linje i px, standard `icon.stroke`).
   - `style`.
   - Ikonen är dold för skärmläsare.
3. **Register:**
   - `components/iconRegistry.ts` har 84 ikoner och typen `IconName`.
   - `components/brandIconRegistry.ts` har 7 ikoner och typen `BrandIconName`.
   - Båda genereras av `scripts/generate-icon-registry.js`, som läser filnamnen. Kör `node scripts/generate-icon-registry.js` när en ikon läggs till, byter namn eller tas bort. Filerna har en rubrik som säger att de inte ska ändras för hand.
4. **Konstant linje:**
   - Ny token `icon = { stroke: 1.5, grid: 24 }` i `theme/spacing.ts`.
   - `Icon` sätter `strokeWidth = 1,5 × 24 / size` på SVG-roten: 2,25 vid 16, 1,5 vid 24, ca 1,29 vid 28.
   - **`.svgrrc` har fått svgo `removeAttrs: stroke-width`.** Utan det vinner filernas egna `stroke-width="1.5"`.
   - Kontrollerat:
     - SVGR-utdatan saknar `strokeWidth` på formerna och sprider props sist på `<Svg>`.
     - react-native-svg för `strokeWidth` och `fill` från roten vidare till barnen via sin inre `G`.
     - Logotyperna (`assets/logos`, `assets/dummy/logos`) har inga `stroke-width` och påverkas inte. Kroona-logotypen syns oförändrad på Hem.
   - **Metro måste startas om med `-c`** (även din server på 8081), eftersom `.svgrrc` inte ingår i Metros cache-nyckel.
5. **Fylld variant:** `<namn>-filled` används om filen finns. Annars får roten `fill` i ikonens färg, formerna ärver den och linjen ligger kvar.
6. **Flikfältet:** `home`, `masonry`, `find` och `folders` i 28. Aktiv flik är `filled`, inaktiv kontur. Etikett, avstånd, sidmarginal och färger är orörda.
7. **Tillbaka = `back-arrow` överallt:**
   - Sökresultat, dialog, produkt (två lägen), samling (två), partner (två), profil (två) och `ScreenHeader` (kategori, alla kategorier, områden, område, idéer).
   - **Även Sheetens tillbaka (två ställen) och dev-sidan**, eftersom briefen säger "alla tillbaka-knappar".
   - `IconButton` tar nu `icon` som ett ikonnamn eller en gammal komponent. Med ett namn ger `selected` den fyllda varianten. Formen, 24 i en 44-cirkel, är oförändrad.
8. **Sök och AI:**
   - **`search`:** det aktiva fältet i sökläget, raden "Sök efter", raderna under Förslag och Senaste, och fältet i Sökresultat.
   - **`stars`:** raden "Fråga om …", bannern "Osäker på vad du behöver?", pillen "Fråga om {kategori}" och dialogens startskärm.
   - **Startskärmen** hade ingen ikon tidigare. Nu ligger `stars` 24 i `textPrimary` ovanför "Vad letar du efter?".
   - **`find` (kontur):** fältet "Fråga eller sök" på Hem och Hitta. `AskBar` har nu `icon: 'find' | 'search'`, med `find` som standard.
   - **`microphone`:** i fältet.
9. **Skicka:** dialogens textknapp är ersatt av `send` 24 i `bg` på samma inverterade yta.
   - Den är nu 40 × 40 i stället för 40 hög med text.
   - Den har `accessibilityLabel="Skicka"` och `hitSlop` upp till 44.
   - Den är tonad till 40 % när den är inaktiv, som förut.
10. **Notis:** `NotificationIcon` ritar `Icon name="notification"`. Props `color` och `size` är desamma.
11. **"Visa fler ›":** `chevron-right` 14 med systemets linje. `sectionLink.chevronStroke` (2,2) är borttagen, eftersom linjen nu kommer från `icon.stroke`.
12. **Filter:** `filter` finns i registret, men **ingen plats i appen visar filter i dag**, så ingenting är bytt.

## Beslut jag tog själv
- **`strokeWidth` på `Icon` betyder den synliga linjen** (px), inte ritlinjen i 24-rutan. Den räknas om på samma sätt som standardvärdet.
- **`icon.grid` (24) är en token** bredvid `icon.stroke`, så att omräkningen inte innehåller en lös siffra.
- **Skriptet är vanlig `node`** och ingår inte i `npm`-skripten (`package.json` är orörd).
- **Ikonen på dialogens startskärm** är 24 i `textPrimary`, centrerad i den befintliga stapeln (`gap` 8).
- **Skicka-knappen är kvadratisk (40)** och inte rund. Radien `radius.card` och ytan är kvar.

## Verifiering
- `npx tsc --noEmit`: OK.
- `npx expo export --platform ios`: OK (2281 moduler).
- **Simulatorn,** egen Metro på 8097 startad med `-c`, mörkt och ljust läge. Alla OK:
  - Hem;
  - alla fyra flikarna aktiva (Hem, Följer, Hitta, Sparat), med de övriga inaktiva;
  - sökläget med "st";
  - Sökresultat "stolar";
  - dialogen (startskärm och skicka);
  - Möbler;
  - produktdetalj.
- **Tillbaka-knappen** syns med `back-arrow` på tre skärmar: Sökresultat, Möbler och produkt (över foto).
- **Linjen:** en tillfällig provsida (`app/icontest.tsx`, borttagen och inte committad) visade 12 ikoner i 16, 24 och 28, i kontur och fyllt. Linjen ser lika tjock ut i alla tre storlekarna.

### Fyllda ikoner (28 och 16, mörkt och ljust)
- **Rätt:** `home`, `masonry` (alla fyra rutorna fylls), `bookmark`, `heart`, `star`, `search` och `send`.
- **Rätt med egen fil:**
  - `find-filled`: ringen kvar och en fylld cirkel inuti.
  - `folders-filled`: den främre mappen fylld, den bakre kontur.
- **Fel (inte rättat):**
  - **`notification`:** kläppen är en öppen båge och fylls till en halvcirkel som smälter ihop med klockan. Glappet mellan klocka och kläpp försvinner, tydligast i 16. Det behövs en egen `notification-filled.svg` om notisen ska få vald-läge.
  - **`back-arrow`** (används inte fyllt): bågen fylls till en kil.
  - **Generellt:** ikoner med öppna linjer passar inte för kodfyllning. Det gäller bland annat `chevron-*`, `filter`, `microphone` (foten) och `find` utan egen fil.

### Städat
- Min Metro på 8097 är stoppad. Din server på 8081 är orörd.
- Ljust tema slogs på med en tillfällig rad i `index.tsx` som är återställd. Ingen `TEMP-DEBUG` är committad.

## Gamla ikoner som nu är oanvända (inte borttagna)
- `BackIcon`.
- `HomeIcon` och `HomeIcon_filled`.
- `FeedIcon` och `FeedIcon_filled`.
- `FindIcon_filled`.
- `SavedIcon` och `SavedIcon_filled`.
- `MicIcon`.

**Kvar i bruk:**
- `FindIcon`: bara idékortets förstoringsglas.
- `StarIcon`: tom-knappen i Sökresultat och betyget på produktkort.
- `ChevronIcon`: bannern, kategorilistan, erbjudanderader och menyer.
- `CloseIcon`, `BookmarkIcon`, `ShareIcon`, `PlusIcon`, `FollowIcon`, `CheckIcon`, `LeafIcon`, `LockIcon`, `ListIcon`, `GridIcon` och `SimilarIcon`.
- Dev-ikonerna `HeartIcon`, `MenuIcon`, `ArchiveIcon` och `NewChatIcon`.

SVG-källorna i `assets/icons/*.svg` används fortfarande inte.

## Utanför scope (flaggat, inte byggt)
- **Knappen "Fråga om ”ord”"** när Sökresultat saknar träffar använder fortfarande den gamla fyllda `StarIcon`, via `Button`, som bara tar komponenter. Den står inte i briefens lista. Ska den bli `stars`?
- **Idékortets förstoringsglas** på Hitta är gamla `FindIcon` (16 på foto). Ska det bli `search`?
- **Chevronen i bannern i Sökresultat** är gamla `ChevronIcon`.
- **`Button`, `ListRow`, `SegmentedIcons` och menyerna** tar bara gamla komponenter. De kan få namn på samma sätt som `IconButton` när ikonerna byts.
- **Gamla TSX-ikoner, SoMe-länkar och animering** mellan kontur och fylld ingår inte.

## Övrigt upptäckt
- **Glaskapseln med två högerknappar i `TopBar`** (`variant="bare"`) fungerar med ikonnamn på samma sätt, men ingen skärm använder den med nya ikoner än.
- **`docs/design.md` ("Ikonstorlekar 20 och 24 🔵")** nämner inte 28 i flikfältet. Det är oförändrat.
