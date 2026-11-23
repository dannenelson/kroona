# Rapport brief 50 – Menyn: större ikoner och smalare sidomarginal

## Inventering
- **Ikonen:** `CustomTabBar` ritade ikonen med `iconSize.lg` (24) och räknade `TAB_BLOCK = 24 + 3 + 14 = 41`, vilket ger luften under etiketten (56 − 41) / 2 = 7,5.
- **Radens avstånd från kanten** räknas från etiketten (`tabBar.labelBottom` 36 / `labelBottomNoInset` 24) minus den luften, så en större ikon växer uppåt av sig själv.
- **Sidomarginal:** `tabBar.sideInset` 28.
- **Ikonerna** (`assets/icons/*Icon(_filled).tsx`) har alla viewBox 0 0 24 24, både fyllda och konturer, och skalar därför lika.

## Gjort
- **Ny lokal storlek:** `tabBar.iconSize: 32` i `theme/spacing.ts`. Det är **en enda siffra** att ändra för att prova 28 eller 32. `iconSize.lg` (24) är orörd globalt.
- **`CustomTabBar`:** ikonen ritas med `tabBar.iconSize`, och `TAB_BLOCK` räknas från den: 32 + 3 + 14 = **49**. Det ryms i radhöjden 56, som inte behövde växa. Luften under etiketten är nu 3,5.
- **Etikettens läge är oförändrat:** underkanten ligger 36 från kanten med safe area och 24 utan. Radens underkant räknas fram till **32,5** (förut 28,5) respektive **20,5** (förut 16,5), så ikonen växer uppåt.
- **Sidomarginalen 28 → 18.** Flikarna (80 × 56, jämnt fördelade) är oförändrade. På 402 bred skärm blir innerbredden 366, alltså 11,5 luft på var sida om varje flik. Träffytan är 80 × 56, större än 44 × 44.
- **Skärmarnas nedre utrymme** (`tabBarSpace`) följer med automatiskt: 96,5 med safe area (förut 92,5) och 84,5 utan (förut 80,5).
- **`docs/design.md` §8k:** ikonstorlek, sidomarginal och de nya radvärdena.

## Om 28 i stället
Med `tabBar.iconSize: 28` blir `TAB_BLOCK` 45, radens underkant 34,5 med safe area och etiketten fortfarande 36 från kanten. Inget annat behöver ändras. Det största värdet som ryms i radhöjden 56 är 39.

## Verifiering
- `tsc --noEmit` är grönt, och iOS-exporten (Metro-check) är grön.
- **Simulator iPhone 17, mörkt läge, med varje flik vald** (Hem, Följer, Hitta, Sparat):
  - Etiketterna ligger på exakt samma höjd i alla fyra skärmdumparna.
  - Fylld och kontur har samma storlek, och inget hoppar i höjd.
  - Ikonerna syns ungefär lika stora som referensernas (ca 23 synligt).
- **Ljust läge (Hem):** samma läge, rätt färger.
- **Nedre utrymmet räcker:**
  - Hittas inmatningsrad ligger ovanför menyn med luft.
  - Följers grid och Hems sista hylla scrollar under kantblurren och täcks inte i slutläget.
  - Sparat har luft under listan.
- **Testkod borttagen.** Min Metro är stängd, och Daniels server på 8081 är orörd.
- **Utan safe area** är inte körd i simulatorn den här gången. Etiketten ligger kvar på 24 enligt samma formel som i brief 49.

## Flaggor (utanför scope, inte byggt)
- **Ikonerna är ritade för 24.** Vid 32 skalas linjerna upp till ca 2 px, så konturerna ser något tyngre ut än förut. Byte till ikoner ritade för större storlek ingår inte.
- Etikettstorleken, menyns höjd, etikettens avstånd från kanten och kantblurren är oförändrade enligt briefen.
