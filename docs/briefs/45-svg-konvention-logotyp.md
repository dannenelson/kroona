# Brief 45 – SVG-konvention, Kroona-logotyp och notisikon

**Fas:** 0. **Mål (ett):** Riktiga `.svg`-filer ska fungera som ikoner och logotyper i appen, med färg från temat. Första leveransen är Kroona-logotypen och en notisikon. Kör före brief 46. Inventera först `assets/`, `metro.config.js`, `types/svg.d.ts` och `app/components.tsx`.

## Nuläge (verifierat av Claude)
- Metro har redan `react-native-svg-transformer` (svg ligger i sourceExts, inte assetExts) och `types/svg.d.ts` finns. Pipelinen finns alltså, men ingen `.svg`-fil används än.
- Befintliga ikoner är TSX-komponenter i `assets/icons/` (Figma-export med `color` och `size`). **De rörs inte** i den här briefen och migreras först när de ändå ändras.
- `assets/kroona.svg` är en Affinity-export: `width/height="100%"`, viewBox 1440 × 238 (ca 6:1), svart fyllning och ett litet ™ nere till höger. Svart på mörk bakgrund syns inte, så filen måste kunna ritas i temats textfärg.

## Gör
- **Mappar:** `assets/logos/` (Kroona), `assets/svg/icons/` (nya ikoner som filer). Flytta `assets/kroona.svg` till `assets/logos/kroona.svg` (vanlig mv, filerna är ännu inte spårade av git; lägg till dem med git add).
- **Tema-bar färg:** konfigurera transformern (svgr/svgo, t.ex. `replaceAttrValues` svart → `currentColor`, behåll viewBox, ta bort fasta width/height) så att en importerad SVG tar `color`, `width`, `height` som props. Ändra inte logotypens former. Om filen behöver städas för att transformern ska klara den (XML-deklaration, DOCTYPE, `style` på roten), gör bara det och beskriv det i rapporten.
- **`components/KroonaLogo.tsx`:** props `height` (bredden räknas från proportionen) och `color` (default temats textfärg). Den används i Header i brief 46.
- **Notisikon:** `assets/svg/icons/bell.svg`, 24 × 24, linjeikon, linjetjocklek 1,8 (samma som övriga ikoner), `currentColor`. Samma wrapper-mönster: en liten komponent eller importen direkt med `color` och `size`.
- **Konvention** i `docs/designsystem.md`: nya ikoner är `.svg`-filer under `assets/svg/icons/` med `currentColor`, logotyper ligger under `assets/logos/`, och de gamla TSX-ikonerna ersätts när de ändå rörs. Skriv också hur man lägger till en ny ikon (tre rader).
- **Provyta:** visa logotypen (flera storlekar) och notisikonen i mörkt och ljust läge på dev-sidan `app/components.tsx`.

## Utanför scope (flagga)
Migrera befintliga ikoner, byta menyikoner, Hem-toppens layout (brief 46), företags- och samlingslogotyper (brief 47). ™-märket blir oläsligt vid liten höjd (ca 18–20 px i toppen): behåll det i filen och nämn det i rapporten, ta inte bort det utan beslut från Daniel.

## Verifiering
tsc, Metro-check, simulator: logotyp och notisikon syns i både mörkt och ljust läge på dev-sidan, med rätt proportion. Rapport: `docs/briefs/45-rapport.md`. Committa, inkl. briefen, och pusha.
