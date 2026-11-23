# Brief 49 – Justering: mindre logotyp, mer luft under toppraden, menyn högre och smalare

**Fas:** 0. **Mål (ett):** Fyra mått efter Daniels granskning av brief 46. Rör inget annat. Kan köras före eller efter 47 och 48 (andra filer). Inventera först `components/Header.tsx`, `components/KroonaLogo.tsx`, `app/(tabs)/index.tsx` och `components/CustomTabBar.tsx`.

## Gör
1. **Logotypen i toppen** 18 → **12 px höjd** (ca 2/3). Den ligger kvar absolut centrerad och utan ™ (brief 46). Kontrollera att ordbilden är skarp och inte beskärs vid 12 px.
2. **Mer luft under toppraden:** avståndet toppraden → hälsning 8 → **24**. Övriga avstånd på Hem (hälsning → pillar 16, pillar → AskBar 16) ändras inte. Justera optiskt om 24 känns för stort och rapportera slutvärdet.
3. **Menyn högre:** etikettens underkant ska ligga **36 px från skärmkanten** på iPhone med safe area (Daniels skiss), mot 29 idag. På enheter utan safe area: **24** (idag 15,5). Radhöjd 56, ikon–etikett 3 och toningen (höjd 128, samma stoppvärden) ändras inte. Räkna om `TAB_BAR_HEIGHT` och skärmarnas nedre utrymme så att sista innehållet inte täcks (Hem, Följer, Hitta, Sparat).
4. **Menyn smalare:** flikarna sprider sig för nära skärmkanterna. Öka flikradens sidomarginal från 8 till **ca 28** så att de fyra flikarna samlas, och behåll jämn fördelning. Flikarnas träffyta (80 bred) får inte bli mindre än 44 × 44.

Tolkning att bekräfta i rapporten: "mer marginal på sidorna" har tolkats som **menyns** sidomarginal (punkt 4), inte skärmmarginalen på hela appen. Ändras inte skärmmarginalen (20) någonstans.

## Utanför scope (flagga)
Skärmmarginalen för övrigt innehåll, kantblur upptill, menyikoner, notisskärm.

## Verifiering
tsc, Metro, simulator mörkt och ljust på iPhone med Dynamic Island (och utan safe area om det går): logotypen 12 px, luften under toppraden, etiketten 36 px från kanten, fyra flikar samlade. Rapport: `docs/briefs/49-rapport.md`. Uppdatera `docs/design.md` (menyns mått) och `docs/designsystem.md` §10 (logotyphöjd i toppen). Committa, inkl. briefen, och pusha.
