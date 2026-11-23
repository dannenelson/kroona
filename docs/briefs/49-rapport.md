# Rapport brief 49 – Justering: mindre logotyp, mer luft under toppraden, menyn högre och smalare

## Inventering
- **`Header.tsx`:** avståndet toppraden → hälsning var `gap: spacing.sm` (8).
- **`KroonaLogo`:** höjden kom från `homeHeader.logoHeight` (18), och ™ dolts under 40 px genom beskuren viewBox.
- **`index.tsx`:** hälsning → pillar och pillar → AskBar var 16 (`gap`). Den filen ändrades inte.
- **`CustomTabBar`:** raden räknades från `homeIndicatorTop` 13 + `aboveHomeIndicator` 16 (etiketten 29 från kanten), utan safe area `minBottom` 8 (etiketten 15,5). Sidomarginalen var `spacing.sm` (8).

## Gjort (fyra mått)
1. **Logotypen 18 → 12 px** (`homeHeader.logoHeight`). Den är fortfarande absolut centrerad och utan ™. I simulatorn är ordbilden skarp och "a" beskärs inte, eftersom viewBox 1378 rymmer hela ordbilden.
2. **Toppraden → hälsning 8 → 24** (`spacing.xl`, `gap` i Header). 24 såg rätt ut, så slutvärdet är **24**. Hälsning → pillar och pillar → AskBar är oförändrade (16).
3. **Menyn högre:**
   - `tabBar` har nu `labelBottom: 36` och `labelBottomNoInset: 24` i stället för `homeIndicatorTop`, `aboveHomeIndicator` och `minBottom`.
   - `tabBarBottomPad` blir etikettens avstånd − 7,5 (luften under etiketten i den 56 höga raden). Det ger radens underkant **28,5** från kanten med safe area och **16,5** utan.
   - Skärmarnas nedre utrymme (`tabBarSpace`, som Hem, Följer/ProductGrid, Hitta, Sparat och Snackbar redan använder) räknas om automatiskt: **92,5** med safe area (förut 85,5) och **80,5** utan (förut 72).
   - Radhöjd 56, ikon → etikett 3 och kantblurren (128, samma stopp) är oförändrade.
4. **Menyn smalare:**
   - Flikradens sidomarginal är nu **28** (`tabBar.sideInset`, förut 8), med fortsatt jämn fördelning (`space-around`).
   - På 402 bred skärm blir innerbredden 346 för fyra flikar à 80, alltså 6,5 luft på var sida om varje flik.
   - Träffytan är oförändrad: 80 × 56, större än 44 × 44.

## Tolkning att bekräfta
"Mer marginal på sidorna" tolkades som **menyns** sidomarginal (punkt 4). Skärmmarginalen ändrades inte någonstans.

**Observera:** briefen anger skärmmarginalen som 20, men i koden är `spacing.screenMargin` **16**. Ingenting ändrades. Ska den vara 20 är det en egen ändring (se flaggor).

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17 (Dynamic Island), mörkt och ljust läge:**
  - Logotypen är 12 px och centrerad.
  - Det är 24 luft under toppraden.
  - De fyra flikarna är samlade.
  - Etiketttexten slutar ca 39 pt från kanten i skärmdumpen. Radboxen ligger på 36, och glyfen slutar några pt ovanför boxens underkant.
- **Utan safe area:** testat på iPhone 17 med tillfällig testkod (`tabBarBottomPad(0)`), som nu är borttagen. Etiketten slutar ca 24–26 pt från kanten. Ingen riktig SE-körning, eftersom Expo Go-dialogen inte går att bekräfta utan Simulator-fönstret (som i brief 46).
- **Inte skärmdumpade:** Följer, Hitta och Sparat. De använder samma `tabBarSpace` som Hem.
- Min Metro är stängd, och Daniels server på 8081 är orörd.

## Flaggor (utanför scope, inte byggt)
- **Skärmmarginalen** är 16 i koden, inte 20 som briefen anger. Om 20 är målet berör det hela appen och bör vara en egen brief.
- Kantblur upptill på Hem saknas fortfarande.
- Menyikonerna är inte bytta.
- Notisskärmen saknas, så klockan gör ingenting.
