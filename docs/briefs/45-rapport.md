# Rapport brief 45 – SVG-konvention, Kroona-logotyp och notisikon

## Inventering
- **Pipeline:** `metro.config.js` har `react-native-svg-transformer` (svg i `sourceExts`). `types/svg.d.ts` finns. Ingen `.svg` importerades i koden.
- **`assets/icons/`:** TSX-ikonerna används. Där ligger också gamla Figma-`.svg` (fyllning `black`, linje ca 1,5) som ingen importerar. Båda rördes inte.
- **`assets/kroona.svg`** (ospårad): en Affinity-export med XML-deklaration, DOCTYPE, `width/height="100%"`, `style` på roten, `affinity:id` och fyllningen `style="fill:rgb(18,18,18)"` på 8 paths.
- **`assets/Temp/`** (ospårad: logotyper, produkter, samlingar) verkar höra till brief 47/48. Den är inte rörd eller committad.

## Gjort
- **Mappar:** `assets/logos/` och `assets/svg/icons/`. Logotypen flyttad med `mv` till `assets/logos/kroona.svg`.
- **Städning av logotypfilen** (formerna orörda):
  - Bort med XML-deklarationen, DOCTYPE, `width/height="100%"`, `version`, `xmlns:xlink`, `xml:space`, `xmlns:affinity` och `affinity:id`.
  - Rotens `style` blev attribut (`fill-rule`, `clip-rule`, `stroke-linejoin`, `stroke-miterlimit`).
  - Fyllningen `style="fill:rgb(18,18,18);fill-rule:nonzero;"` blev `fill="currentColor" fill-rule="nonzero"`. Det är nära svart (18,18,18) och inte exakt svart, så `replaceAttrValues` hade inte fångat den. Därför ändrade jag i filen.
  - Path-data, transformer och ™ är oförändrade.
- **`.svgrrc`** (ny, i roten):
  - `dimensions: false` tar bort fasta width/height.
  - `replaceAttrValues` byter `#000`/`#000000`/`black` mot `currentColor`.
  - svgo `preset-default` med samma overrides som transformerns standard (`removeViewBox: false`, `removeUnknownsAndDefaults: false`, `convertColors: false`, `inlineStyles`), så att viewBox behålls.
  - Kontrollerat med SVGR direkt: båda filerna får `viewBox`, `currentColor` och inga fasta mått.
- **`assets/svg/icons/bell.svg`:** notisklocka 24 × 24, `stroke="currentColor"`, linje 1,8, runda ändar.
- **`components/KroonaLogo.tsx`:** `height` (bredden = höjd × 1440/238) och `color` (default `textPrimary`), med a11y-etiketten "Kroona".
- **`components/NotificationIcon.tsx`:** `size` (default `iconSize.lg` 24) och `color` (default `textPrimary`), samma API som de gamla ikonerna.
- **Provyta** på dev-sidan (`app/components.tsx`): sektionen "SVG · Logotyp och notisikon" med logotypen i 18 / 20 / 28 / 40 px och klockan i 20, 24 och 24 sekundär färg. Temat växlas med sidans egen knapp.
- **Konvention** i `docs/designsystem.md` §17: mappar, pipeline, wrappers och tre steg för att lägga till en ny ikon.

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check, med `--clear`) är grön.
- **Simulatorn** (egen Metro på 8097 med `-c`, dev-sidan):
  - Logotypen ritas i vitt på mörkt och svart på ljust tema.
  - Proportionen är rätt: ca 6:1 uppmätt på skärmdumpen.
  - Klockan följer temat i båda lägena.
  - Ljust läge sattes med tillfällig testkod som är borttagen (bara de befintliga `TEMP-DEBUG-GEST` finns kvar).
- Min Metro är stängd. Daniels server på 8081 är orörd.

## Flaggor
- **Daniels server:** `.svgrrc` läses av transformern, så en redan startad Metro behöver startas om med `-c` för att få den nya konfigurationen och de nya filerna.
- **™-märket** är kvar i filen men blir en oläslig prick vid 18–20 px (syns på provytan). Det behöver ett beslut, till exempel en variant utan ™ för toppen.
- **Klockans linje är 1,8 enligt briefen**, men de befintliga TSX-ikonerna är fyllda konturer med en linje på ca 1,5 (t.ex. FeedIcon). Bredvid de gamla ikonerna kan klockan se något tyngre ut. Bedöm i Header i brief 46.
- **Gamla `.svg`-filer i `assets/icons/`** (bookmark, feed, find …) är oanvända dubbletter av TSX-ikonerna med `fill="black"`. Med `.svgrrc` skulle de fungera direkt som tema-färgade importer om de flyttas till `assets/svg/icons/` vid en migrering.
- **Utanför scope (inte byggt):** migrera befintliga ikoner, byta menyikoner, Hem-toppens layout (brief 46) och företags- och samlingslogotyper (brief 47).
