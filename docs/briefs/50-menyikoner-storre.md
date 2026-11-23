# Brief 50 – Menyn: större ikoner och smalare sidomarginal

**Fas:** 0. **Mål (ett):** Större flikikoner och mindre sidomarginal i nedre menyn. Rör inget annat. Kör efter brief 49. Inventera först `components/CustomTabBar.tsx` (ikonen ritas idag med `iconSize.lg` = 24, `TAB_BLOCK` räknas från det) och `theme/` (`tabBar`, `iconSize`).

## Nuläge (verifierat av Claude)
Ikonerna ritas i en 24 × 24-ruta men fyller bara ca 73 % av den (huset går t.ex. från x 3,25 till 20,75), så den synliga glyfen är ca 17–18 px. Apples tabbikoner är ca 25 pt synlig storlek och Spotifys ungefär lika eller något större.

## Gör
- Ikonrutan 24 → **32** (synlig glyf ca 23). Daniel vill ha ikonerna något större än de 30 som först föreslogs. Använd en **lokal** storlek i menyn (t.ex. `tabBar.iconSize = 32` eller `TAB_ICON`), ändra inte `iconSize.lg` globalt.
- Räkna om `TAB_BLOCK` och menyns höjd: radhöjd 56 ska räcka (30 + ikon–etikett 3 + etikettens radhöjd). Behöver den växa, rapportera det nya värdet.
- **Behåll** etikettens underkant 36 px från skärmkanten på iPhone med safe area (24 utan), samt etiketten 10, toningen och sidomarginalen 28 (brief 49). Större ikon ska alltså växa uppåt, inte flytta etiketten.
- **Sidomarginalen** (`tabBar.sideInset`, 28 sedan brief 49) minskas till **18** (hälften av ökningen från 8). Behåll jämn fördelning av de fyra flikarna och träffyta minst 44 × 44.
- Kontrollera att vald (filled) och ovald (outlined) flik har samma synliga storlek och inte hoppar i höjd, att träffytan är minst 44 × 44, och att nedre utrymmet i skärmarna fortfarande räcker (Hem, Följer, Hitta, Sparat).
- Gör storleken till **en enda siffra** så att Daniel kan prova 28 och 32.

## Utanför scope (flagga)
Byte av ikoner, etikettstorlek, menyns övriga mått (höjd, etikettens avstånd från kanten, toning).

## Verifiering
tsc, Metro, simulator mörkt och ljust. Rapport: `docs/briefs/50-rapport.md`. Uppdatera `docs/design.md` (menyns ikonstorlek). Committa, inkl. briefen, och pusha.
