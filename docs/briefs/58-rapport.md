# Rapport brief 58 – Resterande ikoner till Icon-systemet, gamla borttagna

## Inventering: vad som redan fanns
- **Gamla ikoner från `assets/icons/`:** importerades i 15 filer.
  - **TSX-ikoner som fortfarande användes:** `BookmarkIcon` (+ `_filled`), `StarIcon`, `ChevronIcon`, `CloseIcon`, `FollowIcon`, `ShareIcon`, `PlusIcon`, `CheckIcon`, `SimilarIcon`, `ListIcon`, `GridIcon`, `LockIcon`, `LeafIcon`, `FindIcon` (idékortet), och på dev-sidan `HeartIcon` (+ `_filled`), `MenuIcon`, `ArchiveIcon` och `NewChatIcon`.
  - **Redan oanvända sedan brief 57:** `BackIcon`, `HomeIcon`, `FeedIcon`, `SavedIcon` (alla med `_filled`), `FindIcon_filled` och `MicIcon`.
  - **De 12 SVG-källorna** (`bookmark.svg`, `feed.svg`, `nav.svg` …) importerades inte.
- **`IconButton`:** tog `icon` som ikonnamn eller gammal komponent (brief 57). Den tog också `selectedIcon`, en gammal komponent för valt läge.
- **`TopBar`:** åtgärderna hade samma typ som `IconButton` (`icon`, `selectedIcon`).
- **`SegmentedIcons`:** `icon` per segment som komponent, 18.
- **Andra komponenter som tog ikonkomponenter:** `Button` (`icon`), `ListRow` och `UserCollectionCard` (`subtitleIcon`) och menyraderna (`ContextMenuItem.icon`). Typen `IconProps` fanns i sex lokala kopior.
- **Dev-sidan (`app/components.tsx`):**
  - IconButton-exempel med bokmärke och hjärta (`selectedIcon`).
  - TopBar-exemplet "Hitta · meny + arkiv och ny chatt".
  - Notisikonen i tre storlekar.
- **Menyraden "Spara i samling"** hade plus. Den blev därför `folder-add`.
- **Nytt sedan brief 57:** `assets/svg/icons/notification-filled.svg` (otrackad).
  - Klockan är kontur med en prick uppe till höger. Det är alltså en "har notiser"-variant, inte en fylld klocka.
  - **Pricken har `fill="#111111"`**, och klockans linje har `stroke="black"`.

## Gjort
1. **Alla användningar är bytta enligt tabellen:**
   - `bookmark` (fylld när sparad) och `star` fylld 12 i betyget.
   - `stars`, även tom-knappen "Fråga om ”ord”".
   - `close` (rensa-knappen behåller sin cirkel), `user-add`, `share`, `plus`, `check`, `layers`, `list`/`grid`, `lock` och `leaf`.
   - `folder-add` för "Spara i samling".
   - `search` på idékortet.
   - `chevron-right` i bannern i Sökresultat, raderna i Alla kategorier, `OfferRow` och menyraden "Öppna" i `PartnerCard`, `ProfileCard` och Sparat.
2. **`IconButton` tar `name: IconName`.** Vald läge ger `filled`. `icon` och `selectedIcon` är borttagna, eftersom inget längre använder dem. `TopBar`-åtgärderna tar `name`.
3. **Övriga komponenter tar ikonnamn:**
   - `Button` `icon`, `ListRow`/`UserCollectionCard` `subtitleIcon` och `SegmentedIcons` `icon`.
   - `ContextMenuItem` tar `icon` plus en valfri `filled`, som bokmärket i menyn använder när produkten är sparad.
   - Alla kopior av `IconProps` är borta.
4. **Storlekar och färger är desamma som innan.** Linjen är systemets 1,5 synligt, även i 12.
   - Ny token `iconSize.chevron` = 16. Den gamla `ChevronIcon` ritade 16 som standard, och det fanns inget steg för 16.
5. **Borttaget:** hela `assets/icons/`, alltså 29 TSX-filer och 12 SVG-källor. `rg "assets/icons"` ger noll träffar i koden; bara `docs/` nämner mappen.
6. **Dev-sidan:**
   - Ny sektion **"Ikoner (brief 57–58)"**: alla 85 ikoner i registret med namn, i 24, kontur och fyllt bredvid varandra, i fyra kolumner. Därunder de 7 märkesikonerna.
   - IconButton-exemplen använder `bookmark` och `heart`.
   - TopBar-exemplet med meny, arkiv och ny chatt är ersatt av "Två åtgärder i glaskapsel": `back-arrow` plus `share` och `more-horizontal`.
7. **Notis:** `notification-filled.svg` är med i registret (omgenererat, 85 ikoner), så `Icon name="notification" filled` använder den. **Appen har inget läge för "vald" eller "har notiser"**, eftersom notisknappen inte gör något i Fas 0. `NotificationIcon` och `Header` är därför orörda.
8. **Pilen `→` i `DiscoveryPreviewCard`:** inte rörd. Komponenten används inte.

## Beslut jag tog själv
- **`iconSize.chevron` (16)** som ny token, i stället för att flytta chevronerna till 18 (`sm`) eller 20 (`md`).
- **TopBar-exemplet på dev-sidan** byttes till ikoner som finns i registret.
- **Följ och Sluta följa:** båda använder `user-add`, enligt briefen. Det ser rimligt ut för personer. För varumärken (`PartnerCard`, "Följ varumärke") läser en person-ikon lite fel. Se frågor.

## Verifiering
- `npx tsc --noEmit`: OK. `npx expo export --platform ios`: OK (2270 moduler).
- **Simulatorn,** egen Metro på 8097, mörkt och ljust läge.
- **Kontextmenyn på produktkort:** tillfällig kod (inte committad) öppnade menyn automatiskt.
  - Raderna Spara (`bookmark`), Spara i samling (`folder-add`), Följ varumärke (`user-add`), Dela (`share`) och Visa liknande (`layers`) är rätt i båda teman.
- **Menyerna i Sparat, `PartnerCard` och `ProfileCard`** öppnades **inte** i simulatorn. Den tillfälliga koden öppnade första menyn den hittade, och det var inte den i Sparat. De ritas av samma menyrad som produktkortets meny, och deras ikoner (`chevron-right`, `share`, `user-add`) syns på dev-sidan.
- **Kontrollerat i båda teman:**
  - Produktdetalj: tillbaka, dela, Spara fylld när sparad, Hållbarhet.
  - Sparat i list-läget: Gillade-rutan med `bookmark`, `lock` i undertexterna, vy-växlaren `list`/`grid` och Ny samling `plus`.
  - Sökläget: `search`, `stars`, rensa-knappen med `close`.
  - Sökresultat: bannern med `stars` och `chevron-right`, och betygsraden med `leaf`.
  - Hitta: idékortens `search`.
  - Dev-sidans rutnät i båda teman.
- **Inte kontrollerat:**
  - Kort-läget i Sparat (`grid` ritas, men läget byttes inte, eftersom simulatorn inte kan trycka).
  - SaveSheet med `check`.
  - Tom-knappen i Sökresultat.
  - Betygsstjärnan på ett kort med betyg.

  Samtliga är typkontrollerade och använder samma `Icon`.
- **Städat:** min Metro är stoppad. Den tillfälliga koden i `ProductCard`, `useLongPressMenu`, dev-sidan och `index.tsx` är återställd. Ingen `TEMP-DEBUG` är committad, och din server på 8081 är orörd.

## Ikoner som blir fel fyllda eller ser konstiga ut (inte rättat)
**Används fyllda i appen:** `bookmark`, `star` (betyg), flikarna (`home`, `masonry`, `find`, `folders`) och bokmärket i menyn. **Alla ser rätt ut.**

**På dev-sidan** fungerar kodfyllningen dåligt för följande ikoner. Ingen av dem används fylld i appen.
- **Öppna linjer stängs till kilar eller trianglar:**
  - `chevron-down`, `-left`, `-right` och `-up`;
  - `check`, `back-arrow`, `arrow-up`;
  - `redo`, `undo`, `refresh-1`, `-2` och `-3`;
  - `log-in`, `log-out`, `link`, `maximize`, `trending-*`.
- **Inre detaljer försvinner** i en helfylld form:
  - `clock`, `done`, `error`, `info` och `chat`;
  - `camera`, `image` och `image-add`;
  - `document-1` och `document-2`;
  - `message`, `map-pin`, `ai-chat`, `calendar`, `shopping-bag` och `slash`.
- **`notification-filled`** (egen fil):
  - Pricken är hårdkodad `#111111`, eftersom `.svgrrc` bara byter svart. **I mörkt läge syns den inte**, och klockan ser ut att ha ett hack i kanten.
  - I ljust läge syns den. Den följer inte temat och bör vara `currentColor`.
- **Varken fel eller fyllt:** `close`, `plus`, `filter`, `more-*`, `trend-neutral` och `sorting` består bara av linjer och ser likadana ut fyllda.

## Frågor
- **`user-add` för "Följ varumärke"** och för Följ/Sluta följa i `PartnerCard` och Sparat (varumärken) läser som "lägg till person". Ska varumärken ha en egen ikon, till exempel `plus` eller `verified`? Ska Sluta följa ha en vald variant?
- **`notification-filled.svg`:** ska pricken vara `currentColor` (samma som klockan) eller en accentfärg? Om den ska följa temat behöver filen ändras, eller så får `.svgrrc` en regel för `#111111`.

## Utanför scope (flaggat, inte byggt)
- Nya ikoner i nya funktioner: filter-knapp, redigera, kamera med flera.
- Animation mellan kontur och fylld.
- SoMe-länkar.

## Övrigt upptäckt
- `docs/ikon-inventering.md` beskriver läget före brief 57–58 och nämner `assets/icons/`. Den är lämnad som historik.
- `app/product/[id].tsx` har en oanvänd import av `Image`, som fanns sedan tidigare. Den syns med `--noUnusedLocals` och är inte ändrad.
