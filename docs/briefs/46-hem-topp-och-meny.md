# Brief 46 – Hem-toppen och menyns spacing

**Fas:** 0. **Mål (ett):** Ny topp på Hem (avatar, Kroona-logotyp, notisikon, hälsning och piller-flikar) och rätt spacing i nedre menyn. Kör efter brief 45. Inventera först `components/Header.tsx`, `TextTabs.tsx`, `Pill.tsx`, `AskBar.tsx`, `CustomTabBar.tsx`, `EdgeFade.tsx` och `app/(tabs)/index.tsx`.

## Nuläge (verifierat av Claude)
- Header har bokstavsavatar "D", text "KROONA" i spärrad titel och en emoji 🔔. Under den ligger TextTabs (understrukna textflikar), sedan AskBar.
- Menyn: `NAV_LOWER = spacing.xl` sänker flikarna 32 px in i hemindikatorns safe area. På iPhone med 34 px safe area blir marginalen under etiketterna bara ca 8 px (`bottomPad = max(insets.bottom − 32, 8)`). Toningen (`EdgeFade position="bottom"`) har fast höjd 128, oberoende av flikraden.

## Del 1: Hem-toppen (uppifrån och ned)
1. **Toppraden**, 44 hög, skärmmarginal på sidorna:
   - Vänster: avatar 32 med **initialerna "DN"** (bokstavsavatar som idag, två tecken). Lägg användarens dummyuppgifter (namn "Daniel", initialer "DN") på ett ställe, t.ex. `data/people.ts` eller en liten `DUMMY_USER`, så att hälsning och avatar läser samma källa.
   - Mitten: `KroonaLogo` (brief 45), höjd ca 18, **centrerad oberoende av sidoelementens bredd** (absolut centrerad). **Utan ™ i toppen:** ™ blir en oläslig prick vid den höjden. Lägg en prop på `KroonaLogo` (t.ex. `trademark`) som visar ™ från ca 40 px höjd och döljer det under; ™ ligger kvar i filen. Rapportera hur du gjorde det.
   - Höger: notisikon (`bell.svg`) i en 44 × 44 träffyta. Klockan är ritad med linjetjocklek 1,8 medan de befintliga ikonerna ligger på ca 1,5: ser den tyngre ut i toppen, rita om den med 1,5. Ingen emoji. Skärmen finns inte än, så trycket gör ingenting; flagga i rapporten.
2. **Hälsning** under toppraden: "God morgon / God eftermiddag / God kväll, [Namn]" efter klockan (som i `docs/designsystem.md` §10, men med komma och utan utropstecken), Familjen Grotesk 28/32, temats textfärg.
3. **Piller-flikar** (`Pill`) i stället för TextTabs: Allt · Kläder · Möbler · Begagnat. Vald pill inverterad (textfärg som yta, bakgrundsfärg som text), 36 hög, 8 px mellan, horisontell scroll vid behov, samma haptik som TextTabs. Filtrerar fortfarande inget. **Gäller bara Hem**; TextTabs används kvar på övriga skärmar.
4. **AskBar** oförändrad under pillerna. Behåll dev-länken som den är.
5. Avstånd (riktvärden, justera optiskt): toppraden → hälsning 8, hälsning → pillar 16, pillar → AskBar 16.

## Del 2: Nedre menyn
- Ta bort `NAV_LOWER`-sänkningen. Flikraden ska ligga **ovanför** hemindikatorn: sikta på att ikon-etikett-blockets underkant hamnar ca 14–18 px över indikatorns överkant på iPhone med Dynamic Island. På enheter utan safe area (iPhone SE, Android med knappar): minst `spacing.sm`. Justera till det ser rätt ut optiskt och **rapportera slutvärdena**.
- Flikraden behåller höjd 56 och ikon-etikett-avstånd 3 (justera till 4 bara om det ser trångt ut).
- **Toningen får inte bli högre eller starkare**: `EdgeFade` behåller höjd 128 och samma stoppvärden. Räkna om `TAB_BAR_HEIGHT` och skärmarnas `paddingBottom` så att sista innehållet inte täcks av menyn (kontrollera Hem, Följer, Hitta och Sparat).
- Ikoner och etiketter ändras inte.

## Utanför scope (flagga)
Kantblur upptill på Hem (innehållet skrollar fortfarande under statusfältet), notisskärm och märke på klockan, att filterflikarna filtrerar, och byte av menyikoner.

## Verifiering
tsc, Metro, simulator i mörkt och ljust läge på en iPhone med Dynamic Island och en utan safe area: toppen centrerad (kolla att logotypen är mitt på även om avataren byter bredd), hälsning efter tid, pillar scrollar och byter vald, menyn med rätt luft och utan att täcka innehåll. Rapport: `docs/briefs/46-rapport.md`.
Dokument: `docs/design.md` (Hem-topp, pillar på Hem, menyns spacing), `docs/designsystem.md` §10, `docs/ia-karta.md` (Hem). Committa, inkl. briefen, och pusha.
